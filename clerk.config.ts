import { clerkClient } from "@clerk/nextjs";

export async function createTenant(name: string) {
  const tenant = await clerkClient.organizations.createOrganization({
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
  });
  return tenant;
}

export async function addUserToTenant(userId: string, tenantId: string) {
  await clerkClient.organizations.createOrganizationMembership({
    organizationId: tenantId,
    userId,
    role: "basic_member",
  });
}

export async function getUserTenants(userId: string) {
  const memberships = await clerkClient.users.getOrganizationMembershipList({
    userId,
  });
  return memberships.map((membership) => membership.organization);
}

export async function setUserRole(
  userId: string,
  tenantId: string,
  role: string
) {
  await clerkClient.organizations.updateOrganizationMembership({
    organizationId: tenantId,
    userId,
    role,
  });
}
