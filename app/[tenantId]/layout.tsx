import React { useState } from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useAuth } from '@/hooks/useAuth';
import { ConvexReactClient } from "convex/react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CalendarIcon, CarIcon, HomeIcon } from 'lucide-react';
import ConvexClerkProvider from '../../ConvexClerkProvider';

const inter = Inter({ subsets: ['latin'] });
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function TenantLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { tenant: string };
}>) {
  return (
    <ConvexClerkProvider>
        <TenantLayoutContent params={params}>
          {children}
        </TenantLayoutContent>
    </ConvexClerkProvider>
  );
}

function TenantLayoutContent({ children, params }: { children: React.ReactNode, params: { tenant: string } }) {
  const { user, organization, isSignedIn, isLoaded, checkPermission, handleProfileUpdate } = useAuth();
  const [canAccessDashboard, setCanAccessDashboard] = useState(false);
  const [canAccessAnalytics, setCanAccessAnalytics] =useState(false);
  const [canAccessInventory, setCanAccessInventory] = useState(false);
  const { user, tenant, isSignedIn, isLoaded, initializeUserAndTenant } = useAuth();

  React.useEffect(() => {
    if (isLoaded && isSignedIn) {
      initializeUserAndTenant();
    }
  }, [isLoaded, isSignedIn, initializeUserAndTenant]);

  const primaryColor = tenant?.primaryColor || '#0AE980';
  const secondaryColor = tenant?.secondaryColor || '#707070';

  return (
    <div
      className={`min-h-screen bg-background font-sans antialiased ${inter.className}`}
      style={{
        '--primary': primaryColor,
        '--secondary': secondaryColor,
      } as React.CSSProperties}
    >
      <AnimatedBackground />
      <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/60">
        <div className="container flex h-14 items-center">
          <Link href={`/${params.tenant}`} className="mr-6 flex items-center space-x-2">
            <CarIcon className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              {tenant?.name || `${params.tenant.charAt(0).toUpperCase() + params.tenant.slice(1)} AutoDetailAI`}
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href={`/${params.tenant}`} className="transition-colors hover:text-primary">
              <HomeIcon className="h-4 w-4 mr-1 inline-block" />
              Home
            </Link>
            <Link href={`/${params.tenant}/schedule`} className="transition-colors hover:text-primary">
              <CalendarIcon className="h-4 w-4 mr-1 inline-block" />
              Schedule
            </Link>
            <Link href={`/${params.tenant}/services`} className="transition-colors hover:text-primary">
              <CarIcon className="h-4 w-4 mr-1 inline-block" />
              Services
            </Link>
            <SignedIn>
              <Link href={`/${params.tenant}/dashboard`} className="transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link href={`/${params.tenant}/adminDashboard`} className="transition-colors hover:text-primary">
                Admin Dashboard
              </Link>
            </SignedIn>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <SignedIn>
              <UserButton afterSignOutUrl={`/${params.tenant}`} />
            </SignedIn>
            <SignedOut>
              <Button
                variant="outline"
                asChild
                className="border-primary text-primary hover:bg-primary hover:text-secondary"
              >
                <Link href={`/${params.tenant}/sign-in`}>Sign In</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}