import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { OrganizationMembership, User } from "@clerk/nextjs/server";
import { GenericMutationCtx, GenericTableInfo } from "convex/server";

// Define a type for the user data
interface UserData {
  clerkId: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  password: string;
}

// Define the users table
const usersTable = 'users';
// Helper function to get a user by clerk ID
async function getUserByUserId(
  ctx: { db: { query: (table: string) => { withIndex: (index: string, query: (q: { eq: (k: string, v: string) => any }) => any }, } },
  clerkId: string,
): Promise<User | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", q => q.eq("clerkId", clerkId))
    .first<User>();
}
/**
 * Get an organization by clerk org ID.
 *
 * @param ctx - The Convex context.
 * @param clerkOrgId - The Clerk organization ID.
 * @returns The organization if found, null otherwise.
 */
async function getOrganizationByClerkOrgId(
  ctx: { db: { query: (table: string) => { withIndex: (index: string, query: (q: { eq: (k: string, v: string) => any }) => any }, } },
  organizationId: string,
): Promise<OrganizationMembership | null> {
  try {
    const query = ctx.db.query("organizations");
    const organizationQuery = query.withIndex("by_clerk_org_id", (q) => q.eq("organizationId", organizationId));
    return await organizationQuery.first<OrganizationMembership>();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// deleteUser mutation
export const deleteUser = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }: { clerkId: string }) => {
    const user = await getUserByClerkId(ctx, clerkId);
    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

// updateUserOrganization mutation
export const updateUserOrganization = mutation({
  args: {
    clerkUserId: v.string(),
    clerkOrgId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, { clerkUserId, clerkOrgId, role }: { clerkUserId: string; clerkOrgId: string; role: string }) => {
    const user = await getUserByClerkId(ctx, clerkUserId);
    if (!user) {
      throw new Error("User not found");
    }

    async function getOrganizationId(
      ctx: GenericMutationCtx<{ usersOrganizations: GenericTableInfo & { document: { _id: string; }; }; }>,
      clerkOrgId: string,
    ): Promise<OrganizationMembership | null> {
      const organization = await getOrganizationByClerkOrgId(ctx, clerkOrgId);
      if (!organization) {
        throw new Error("Organization not found");
      }
      return organization;
    }

    const organization = await getOrganizationId(ctx, clerkOrgId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    await ctx.db.patch(user._id, {
      organizationId: organization.clerkOrgId,
      role,
    });
  },
});

// removeUserFromOrganization mutation
export const removeUserFromOrganization = mutation({
  args: {
    clerkUserId: v.string(),
    clerkOrgId: v.string(),
  },
  handler: async (ctx, { clerkUserId, clerkOrgId }: { clerkUserId: string; clerkOrgId: string }) => {
    const user = await getUserByUserId(ctx, clerkUserId);
    if (!user) {
      throw new Error("User not found");
    }

    const organization = await getOrganizationId(ctx, getOrganizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    if (user.organizationId === organization.id) {
      await ctx.db.patch(user._id, {
        organizationId: undefined,
        role: 'customer', // Reset to default role
      });
    }
  },
});

// getUserByClerkId query
export const getUserId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args: { clerkId: string }) => {
    const user = await getUserByUserId(ctx, args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
});
