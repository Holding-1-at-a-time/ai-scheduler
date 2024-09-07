import { clerkMiddleware, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default clerkMiddleware({
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)", "/api(.*)"],
  async afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      const tenant = req.nextUrl.pathname.split("/")[1];
      return NextResponse.redirect(new URL(`/${tenant}/sign-in`, req.url));
    }

    if (auth.userId) {
      const user = await clerkClient.users.getUser(auth.userId);
      const tenant = req.nextUrl.pathname.split("/")[1];
      const userTenants = await clerkClient.users.getOrganizationMembershipList(
        { userId: auth.userId }
      );
      const isMemberOfTenant = userTenants.some(
        (membership) => membership.organization.slug === tenant
      );

      if (!isMemberOfTenant) {
        return NextResponse.redirect(new URL(`/`, req.url));
      }
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
