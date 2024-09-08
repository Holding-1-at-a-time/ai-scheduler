import { GenericId, v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import handler from "@/app/api/ollama/route";
import { User } from "@clerk/nextjs/server";
import { UserProfile } from "@clerk/nextjs";

export const syncUser = mutation({
  args: { 
    clerkId: v.id('users'),
    email: v.string(),
    name: v.string(),
    role: v.string(),
    organizationId: v.id('organizations'),
    clerkOrgId: v.string(),
    userId: v.id('users'),
    tenantId: v.id('tenants'),
    organizationName: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        role: args.role,
        organizationId: args.organizationId,
        clerkOrgId: args.clerkOrgId,
        userId: args.userId,
        tenantId: args.tenantId,
        organizationName: args.organizationName
      });
    } else {
      return await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        role: args.role,
        organizationId: args.organizationId,
        clerkOrgId: "",
        userId: args.userId,
        tenantId: args.tenantId,
        organizationName: args.organizationName,
        password: ""
      });
    }
  },
});

export const deleteUser = mutation({
  args: { clerkId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
      .first();
    if (user) {
      await ctx.db.delete(user._id);
      return "successful"
    }
  },
});

export const updateUserOrganization = mutation({
  args: { 
    clerkId: v.id('users'),
    clerkOrgId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const organization = await ctx.db
      .query("organizations")
      .withIndex("by_clerk_org_id", q => q.eq("clerkOrgId", args.clerkOrgId))
      .first();

    if (!organization) {
      throw new Error("Organization not found");
    }

    return await ctx.db.patch(user._id, {
      organizationId: organization._id,
      role: args.role,
    });
  },
});

export const removeUserFromOrganization = mutation({
  args: { 
    clerkId: v.id('users'),
    clerkOrgId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const organization = await ctx.db
      .query("organizations")
      .withIndex("by_clerk_org_id", q => q.eq("clerkOrgId", args.clerkOrgId))
      .first();

    if (!organization) {
      throw new Error("Organization not found");
    }

    if (user.organizationId === organization._id) {
      return await ctx.db.patch(user._id, {
        organizationId: undefined,
        role: 'customer', // Reset to default role
      });
    }
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const handleProfileUpdate = mutation({
  args: { clerkId: v.id('users'), firstName: v.string(), imageUrl: v.string(), phone: v.string(), address: v.string(), organizationName: v.string()},
  handler: async (ctx, args) =>{
    const identity = await ctx.auth.getUserIdentity();
    const { tokenIdentifier, name, email,  } = identity!;
    // Check if the user is authenticated
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    // Update the user profile
    return await ctx.db
      .query("users")
      .collect();
  },
});

