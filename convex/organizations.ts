import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOrganization = mutation({
    args: {
        name: v.string(),
        clerkOrgId: v.string(),
        slug: v.string(),
        userId: v.id('users'),
        tenantId: v.id('tenants'),
        address: v.string(),
        phoneNumber: v.string(),
    },
    handler: async (ctx, args) => {
        const organizationId = await ctx.db.insert("organizations", {
            name: args.name,
            clerkOrgId: args.clerkOrgId,
            slug: args.slug,
            userId: args.userId,
            tenantId: args.tenantId,
            address: args.address,
            phoneNumber: args.phoneNumber,
        });
        return organizationId;
    },
});

export const getOrganization = query({
    args: { clerkOrgId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("organizations")
            .withIndex("by_clerk_org_id", q => q.eq("clerkOrgId", args.clerkOrgId))
            .first();
    },
});

export const updateOrganization = mutation({
    args: { id: v.id("organizations"), name: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { name: args.name });
    },
});