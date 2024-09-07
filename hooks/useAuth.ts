import { useUser, useOrganization } from "@clerk/nextjs";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";
import { hasPermission } from "../lib/auth";

export function useAuth() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { organization } = useOrganization();
  const [convexUser, setConvexUser] = useState(null);
  const [convexOrganization, setConvexOrganization] = useState(null);

  const getUser = useQuery(api.users.getUserByClerkId, isSignedIn ? { clerkId: user?.id } : "skip");
  const getOrganization = useQuery(api.organizations.getOrganizationByClerkId, organization ? { clerkOrgId: organization.id } : "skip");
  const syncUser = useMutation(api.users.syncUser);
  const syncOrganization = useMutation(api.organizations.syncOrganization);
  const syncUserProfile = useAction(api.users.syncUserProfile);

  useEffect(() => {
    if (isSignedIn && user && getUser === null) {
      syncUser({ 
        clerkId: user.id, 
        email: user.primaryEmailAddress?.emailAddress || "",
        name: `${user.firstName} ${user.lastName}`,
        role: user.publicMetadata.role as string || 'customer',
      }).then(() => {
        // Refetch user after sync
        api.users.getUserByClerkId({ clerkId: user.id });
      });
    }
  }, [isSignedIn, user, getUser]);

  useEffect(() => {
    if (organization && getOrganization === null) {
      syncOrganization({ 
        clerkOrgId: organization.id, 
        name: organization.name,
      }).then(() => {
        // Refetch organization after sync
        api.organizations.getOrganizationByClerkId({ clerkOrgId: organization.id });
      });
    }
  }, [organization, getOrganization]);

  useEffect(() => {
    if (getUser) {
      setConvexUser(getUser);
    }
  }, [getUser]);

  useEffect(() => {
    if (getOrganization) {
      setConvexOrganization(getOrganization);
    }
  }, [getOrganization]);

  // Function to check if the user has a specific permission
  const checkPermission = async (requiredRole: 'admin' | 'staff' | 'customer') => {
    if (!isSignedIn || !user) return false;
    return hasPermission(api, user.id, requiredRole);
  };

  // Function to handle real-time profile updates
  const handleProfileUpdate = async () => {
    if (isSignedIn && user) {
      await syncUserProfile({ clerkId: user.id });
    }
  };

  return {
    user: convexUser,
    organization: convexOrganization,
    isSignedIn,
    isLoaded,
    checkPermission,
    handleProfileUpdate,
  };
}