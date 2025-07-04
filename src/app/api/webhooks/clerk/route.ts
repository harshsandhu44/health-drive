import { Webhook } from "svix";
import { createServerClient } from "@/lib/db/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
  const webhook = new Webhook(webhookSecret);

  // Verify webhook signature
  let payload;
  try {
    payload = await req.json();
    webhook.verify(JSON.stringify(payload), {
      "svix-id": req.headers.get("svix-id")!,
      "svix-timestamp": req.headers.get("svix-timestamp")!,
      "svix-signature": req.headers.get("svix-signature")!,
    });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const { type, data } = payload;
  const supabase = await createServerClient();

  try {
    switch (type) {
      case "organization.created": {
        const { id, name, public_metadata, created_by } = data;
        const { phone } = public_metadata;

        // Create admin profile for the organization creator
        if (created_by) {
          await supabase.from("staff_profiles").insert({
            user_id: created_by,
            name: name || "Admin User",
            phone: phone || "",
            role: "admin",
            organization_id: id,
          });
        }

        break;
      }

      case "organization.updated": {
        const { id, public_metadata } = data;
        const { plan, plan_expires_at, plan_status } = public_metadata;

        // Update billing_logs if plan changed
        if (plan && plan_expires_at && plan_status) {
          const { data: existingLog } = await supabase
            .from("billing_logs")
            .select("id")
            .eq("organization_id", id)
            .eq("plan", plan)
            .order("created_at", { ascending: false })
            .limit(1);

          if (!existingLog?.length) {
            await supabase.from("billing_logs").insert({
              organization_id: id,
              plan,
              amount: 0, // Placeholder; update via Paytm
              paytm_transaction_id: "",
              status: plan_status === "active" ? "pending" : "inactive",
            });
          }
        }

        break;
      }

      case "organization.deleted": {
        const { id } = data;
        // ON DELETE CASCADE handles related records
        await supabase
          .from("staff_profiles")
          .delete()
          .eq("organization_id", id);
        await supabase.from("departments").delete().eq("organization_id", id);
        await supabase.from("patients").delete().eq("organization_id", id);
        await supabase.from("appointments").delete().eq("organization_id", id);
        await supabase.from("message_logs").delete().eq("organization_id", id);
        await supabase.from("billing_logs").delete().eq("organization_id", id);

        break;
      }

      case "user.created": {
        const {
          id: userId,
          first_name,
          last_name,
          phone_numbers,
          organization_memberships,
        } = data;
        const name =
          `${first_name || ""} ${last_name || ""}`.trim() || "Unnamed User";
        const phone = phone_numbers[0]?.phone_number || "";
        const organizationId = organization_memberships?.[0]?.organization.id;

        if (organizationId) {
          await supabase.from("staff_profiles").insert({
            user_id: userId,
            name,
            phone,
            role: "staff",
            organization_id: organizationId,
          });
        }

        break;
      }

      default:
        console.log(`Unhandled webhook event: ${type}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
};
