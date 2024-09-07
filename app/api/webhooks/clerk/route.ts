import { NextApiRequest, NextApiResponse } from 'next';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get the headers
    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: 'Error occurred -- no svix headers' });
    }

    // Get the body
    const payload = await Buffer.from(req.body).toString();

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return res.status(400).json({ error: 'Error occurred' });
    }

    // Handle the webhook
    const eventType = evt.type;
    if (eventType === 'user.created' || eventType === 'user.updated') {
        await convex.mutation('users:syncUser', {
            clerkId: evt.data.id,
            email: evt.data.email_addresses[0].email_address,
            name: `${evt.data.first_name} ${evt.data.last_name}`,
            role: evt.data.public_metadata.role || 'customer', // Default to 'customer' if no role is set
        });
    } else if (eventType === 'user.deleted') {
        await convex.mutation('users:deleteUser', { clerkId: evt.data.id });
    } else if (eventType === 'organization.created' || eventType === 'organization.updated') {
        await convex.mutation('organizations:syncOrganization', {
            clerkOrgId: evt.data.id,
            name: evt.data.name,
        });
    } else if (eventType === 'organization.deleted') {
        await convex.mutation('organizations:deleteOrganization', { clerkOrgId: evt.data.id });
    } else if (eventType === 'organizationMembership.created' || eventType === 'organizationMembership.updated') {
        await convex.mutation('users:updateUserOrganization', {
            clerkUserId: evt.data.public_user_data.user_id,
            clerkOrgId: evt.data.organization.id,
            role: evt.data.role,
        });
    } else if (eventType === 'organizationMembership.deleted') {
        await convex.mutation('users:removeUserFromOrganization', {
            clerkUserId: evt.data.public_user_data.user_id,
            clerkOrgId: evt.data.organization.id,
        });
    }

    return res.status(200).json({ message: 'Webhook received' });
}