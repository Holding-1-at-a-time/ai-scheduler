import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTenant = mutation({
  args: { name: v.string(), slug: v.string(), clerkOrgId: v.string() },
  handler: async (ctx, args) => {
    const tenantId = await ctx.db.insert("tenants", {
      name: args.name,
      slug: args.slug,
      clerkOrgId: args.clerkOrgId,
    });
    return tenantId;
  },
});

export const getTenant = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const updateTenant = mutation({
  args: { id: v.id("tenants"), name: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name });
  },
});
