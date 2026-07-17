import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { syncUser, deleteUser } from "@/services/user.service";
import { mapClerkUser } from "@/lib/clerk/map-clerk-user";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("CLERK_WEBHOOK_SECRET is missing");

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;
  console.log("Webhook event type:", type);

  switch (type) {
    case "user.created":
    case "user.updated": {
      const mapped = mapClerkUser(data);
      if (!mapped) {
        return new Response("No email found", { status: 400 });
      }

      try {
        await syncUser(mapped);
        console.log(`✅ User synced: ${mapped.clerkId}`);
      } catch (err) {
        console.error(`Failed to sync user:`, err);
        return new Response("Sync failed", { status: 500 });
      }
      break;
    }

    case "user.deleted": {
      if (data.id) {
        try {
          await deleteUser(data.id);
          console.log(`✅ User deleted: ${data.id}`);
        } catch (err) {
          console.error(`Failed to delete user:`, err);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled webhook type: ${type}`);
  }

  return new Response("OK", { status: 200 });
}