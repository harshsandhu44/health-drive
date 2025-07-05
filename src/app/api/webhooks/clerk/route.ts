import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js"; // Use direct client for webhooks
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
  // Use direct Supabase client without Clerk auth for webhooks
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side ops
  );

  try {
    switch (type) {
      case "organization.updated": {
        const { id, public_metadata } = data;
        const { plan, plan_expires_at, plan_status } = public_metadata;

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
}
