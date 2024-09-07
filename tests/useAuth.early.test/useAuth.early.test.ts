// Unit tests for: useAuth

import { useOrganization, useUser } from "@clerk/nextjs";

import { useMutation, useQuery } from "convex/react";

import { api } from "convex_generatedapi";

import { useAuth } from "../../hooks/useAuth";

// Mocking dependencies
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  useOrganization: jest.fn(),
}));

jest.mock("convex/react", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

describe("useAuth() useAuth method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy path tests
  describe("Happy Path", () => {
    it("should return user and tenant when signed in and data is available", async () => {
      // Arrange
      const mockUser = {
        id: "user123",
        primaryEmailAddress: { emailAddress: "user@example.com" },
        firstName: "John",
        lastName: "Doe",
      };
      const mockOrganization = {
        id: "org123",
        name: "OrgName",
        slug: "org-slug",
      };
      (useUser as jest.Mock).mockReturnValue({
        user: mockUser,
        isSignedIn: true,
        isLoaded: true,
      });
      (useOrganization as jest.Mock).mockReturnValue({
        organization: mockOrganization,
      });
      (useQuery as jest.Mock).mockImplementation((query) => {
        if (query === api.users.getUser) return { id: "user123" };
        if (query === api.tenants.getTenant) return { id: "tenant123" };
      });
      (useMutation as jest.Mock).mockReturnValue(jest.fn());

      // Act
      const { result } = renderHook(() => useAuth());

      // Assert
      expect(result.current.user).toEqual({ id: "user123" });
      expect(result.current.tenant).toEqual({ id: "tenant123" });
      expect(result.current.isSignedIn).toBe(true);
      expect(result.current.isLoaded).toBe(true);
    });

    it("should call createUser and createTenant when user and tenant do not exist", async () => {
      // Arrange
      const mockUser = {
        id: "user123",
        primaryEmailAddress: { emailAddress: "user@example.com" },
        firstName: "John",
        lastName: "Doe",
      };
      const mockOrganization = {
        id: "org123",
        name: "OrgName",
        slug: "org-slug",
      };
      const createUserMock = jest.fn();
      const createTenantMock = jest.fn();
      (useUser as jest.Mock).mockReturnValue({
        user: mockUser,
        isSignedIn: true,
        isLoaded: true,
      });
      (useOrganization as jest.Mock).mockReturnValue({
        organization: mockOrganization,
      });
      (useQuery as jest.Mock).mockReturnValue(null);
      (useMutation as jest.Mock).mockImplementation((mutation) => {
        if (mutation === api.users.createUser) return createUserMock;
        if (mutation === api.tenants.createTenant) return createTenantMock;
      });

      // Act
      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.initializeUserAndTenant();
      });

      // Assert
      expect(createUserMock).toHaveBeenCalledWith({
        clerkId: "user123",
        email: "user@example.com",
        name: "John Doe",
      });
      expect(createTenantMock).toHaveBeenCalledWith({
        name: "OrgName",
        slug: "org-slug",
        clerkOrgId: "org123",
      });
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should handle case when user is not signed in", () => {
      // Arrange
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isSignedIn: false,
        isLoaded: true,
      });
      (useOrganization as jest.Mock).mockReturnValue({ organization: null });
      (useQuery as jest.Mock).mockReturnValue(null);
      (useMutation as jest.Mock).mockReturnValue(jest.fn());

      // Act
      const { result } = renderHook(() => useAuth());

      // Assert
      expect(result.current.user).toBeNull();
      expect(result.current.tenant).toBeNull();
      expect(result.current.isSignedIn).toBe(false);
      expect(result.current.isLoaded).toBe(true);
    });

    it("should handle case when organization is not available", () => {
      // Arrange
      const mockUser = {
        id: "user123",
        primaryEmailAddress: { emailAddress: "user@example.com" },
        firstName: "John",
        lastName: "Doe",
      };
      (useUser as jest.Mock).mockReturnValue({
        user: mockUser,
        isSignedIn: true,
        isLoaded: true,
      });
      (useOrganization as jest.Mock).mockReturnValue({ organization: null });
      (useQuery as jest.Mock).mockReturnValue(null);
      (useMutation as jest.Mock).mockReturnValue(jest.fn());

      // Act
      const { result } = renderHook(() => useAuth());

      // Assert
      expect(result.current.user).toBeNull();
      expect(result.current.tenant).toBeNull();
      expect(result.current.isSignedIn).toBe(true);
      expect(result.current.isLoaded).toBe(true);
    });
  });
});

// End of unit tests for: useAuth
