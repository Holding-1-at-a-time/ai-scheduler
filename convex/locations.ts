import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createLocation = mutation({
    args: {
        organizationId: v.id("organizations"),
        name: v.string(),
        address: v.string(),
        tenantId: v.id("tenants"), // Add this line
    },
    handler: async (ctx, args) => {
        const locationId = await ctx.db.insert("locations", {
            organizationId: args.organizationId,
            name: args.name,
            address: args.address,
            tenantId: args.tenantId, // Add this line
        });
        return locationId;
    },
});

export const getLocations = query({
    args: { organizationId: v.id("organizations") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("locations")
            .withIndex("by_organization", q => q.eq("organizationId", args.organizationId))
            .collect();
    },
});

export const updateLocation = mutation({
    args: { id: v.id("locations"), name: v.string(), address: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { name: args.name, address: args.address });
    }
})