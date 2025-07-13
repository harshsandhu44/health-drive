import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

import { createSupabaseServiceClient } from "@/lib/supabase";

// Clerk webhook events
type WebhookEvent = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  object: string;
  timestamp: number;
};

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Get Supabase service client (bypasses RLS for webhook operations)
  const supabase = createSupabaseServiceClient();

  try {
    switch (evt.type) {
      case "organization.created": {
        const { id, name } = evt.data;

        // Insert organization into Supabase
        const { error } = await supabase.from("organizations").insert({
          id: id, // Clerk organization ID (text)
          name: name,
          billing_status: "inactive", // Default status
        });

        if (error) {
          console.error("Error creating organization:", error);
          return new Response("Error creating organization", { status: 500 });
        }

        console.info("Organization created:", id);
        break;
      }

      case "organization.updated": {
        const { id, name } = evt.data;

        // Update organization in Supabase
        const { error } = await supabase
          .from("organizations")
          .update({
            name: name,
          })
          .eq("id", id);

        if (error) {
          console.error("Error updating organization:", error);
          return new Response("Error updating organization", { status: 500 });
        }

        console.info("Organization updated:", id);
        break;
      }

      case "organization.deleted": {
        const { id } = evt.data;

        // Delete organization from Supabase (cascade will handle related records)
        const { error } = await supabase
          .from("organizations")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error deleting organization:", error);
          return new Response("Error deleting organization", { status: 500 });
        }

        console.info("Organization deleted:", id);
        break;
      }

      case "user.created": {
        const { id, email_addresses } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;

        // Get user's organization memberships
        const organizationMemberships = evt.data.organization_memberships || [];

        for (const membership of organizationMemberships) {
          const organizationId = membership.organization?.id;
          const role = membership.role; // admin, basic_member, etc.

          if (organizationId) {
            // Insert user into Supabase
            const { error } = await supabase.from("users").insert({
              id: id, // Clerk user ID (text)
              organization_id: organizationId,
              email: primaryEmail || "",
              role: role === "org:admin" ? "admin" : "staff", // Map Clerk roles to our roles
            });

            if (error) {
              console.error("Error creating user:", error);
              return new Response("Error creating user", { status: 500 });
            }

            console.info(
              "User created:",
              id,
              "in organization:",
              organizationId
            );
          }
        }
        break;
      }

      case "user.updated": {
        const { id, email_addresses } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;

        // Update user in Supabase
        const { error } = await supabase
          .from("users")
          .update({
            email: primaryEmail || "",
          })
          .eq("id", id);

        if (error) {
          console.error("Error updating user:", error);
          return new Response("Error updating user", { status: 500 });
        }

        console.info("User updated:", id);
        break;
      }

      case "user.deleted": {
        const { id } = evt.data;

        // Delete user from Supabase
        const { error } = await supabase.from("users").delete().eq("id", id);

        if (error) {
          console.error("Error deleting user:", error);
          return new Response("Error deleting user", { status: 500 });
        }

        console.info("User deleted:", id);
        break;
      }

      case "organizationMembership.created": {
        const { organization, public_user_data, role } = evt.data;
        const userId = public_user_data?.user_id;
        const organizationId = organization?.id;

        if (userId && organizationId) {
          // Insert user into organization
          const { error } = await supabase.from("users").insert({
            id: userId,
            organization_id: organizationId,
            email: public_user_data?.email_addresses?.[0]?.email_address || "",
            role: role === "org:admin" ? "admin" : "staff",
          });

          if (error) {
            console.error("Error creating organization membership:", error);
            return new Response("Error creating organization membership", {
              status: 500,
            });
          }

          console.info(
            "Organization membership created:",
            userId,
            organizationId
          );
        }
        break;
      }

      case "organizationMembership.deleted": {
        const { organization, public_user_data } = evt.data;
        const userId = public_user_data?.user_id;
        const organizationId = organization?.id;

        if (userId && organizationId) {
          // Remove user from organization
          const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", userId)
            .eq("organization_id", organizationId);

          if (error) {
            console.error("Error deleting organization membership:", error);
            return new Response("Error deleting organization membership", {
              status: 500,
            });
          }

          console.info(
            "Organization membership deleted:",
            userId,
            organizationId
          );
        }
        break;
      }

      default:
        console.info("Unhandled webhook event:", evt.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}
