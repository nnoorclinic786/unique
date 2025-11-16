import Link from "next/link";
import React from "react";
import { cookies } from 'next/headers';
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  PanelLeft,
  Search,
  ShieldCheck
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/icons";
import { UserNav } from "@/components/user-nav";
import { AdminSearchProvider, useAdminSearch } from "@/context/admin-search-context";

interface AdminSession {
  isLoggedIn: boolean;
  permissions: string[];
}

// This new component contains the client-side logic for the header.
function AdminHeader() {
    'use client';
    const { query, setQuery } = useAdminSearch();

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Logo className="h-6 w-6 transition-all group-hover:scale-110" />
                  <span className="sr-only">Unique Medicare</span>
                </Link>
                <Link href="/admin/dashboard" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><Home className="h-5 w-5" />Dashboard</Link>
                <Link href="/admin/orders" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><ShoppingCart className="h-5 w-5" />Orders</Link>
                <Link href="/admin/drugs" className="flex items-center gap-4 px-2.5 text-foreground"><Package className="h-5 w-5" />Medicines</Link>
                <Link href="/admin/buyers" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><Users className="h-5 w-5" />Customers</Link>
                <Link href="/admin/manage-admins" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><ShieldCheck className="h-5 w-5" />Manage Admins</Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[320px]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <UserNav />
        </header>
    )
}

// This new component contains all the client-side providers and layout structure.
function AdminClientLayout({ children, permissions }: { children: React.ReactNode, permissions: string[] }) {
  'use client';
  const hasPermission = (p: string) => permissions.includes(p);
  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-muted/40">
          <SidebarHeader>
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <Logo className="h-10 w-10 text-primary" />
              <span className="font-headline">Unique Medicare Admin</span>
          </Link>
          </SidebarHeader>
          <SidebarContent>
          <SidebarMenu>
              {hasPermission('dashboard') && <SidebarMenuItem><Link href="/admin/dashboard" passHref><SidebarMenuButton tooltip="Dashboard"><Home /><span>Dashboard</span></SidebarMenuButton></Link></SidebarMenuItem>}
              {hasPermission('orders') && <SidebarMenuItem><Link href="/admin/orders" passHref><SidebarMenuButton tooltip="Orders"><ShoppingCart /><span>Orders</span></SidebarMenuButton></Link></SidebarMenuItem>}
              {hasPermission('drugs') && <SidebarMenuItem><Link href="/admin/drugs" passHref><SidebarMenuButton tooltip="Medicines"><Package /><span>Medicines</span></SidebarMenuButton></Link></SidebarMenuItem>}
              {hasPermission('buyers') && <SidebarMenuItem><Link href="/admin/buyers" passHref><SidebarMenuButton tooltip="Customers"><Users /><span>Buyers</span></SidebarMenuButton></Link></SidebarMenuItem>}
              {hasPermission('manage_admins') && <SidebarMenuItem><Link href="/admin/manage-admins" passHref><SidebarMenuButton tooltip="Manage Admins"><ShieldCheck /><span>Manage Admins</span></SidebarMenuButton></Link></SidebarMenuItem>}
          </SidebarMenu>
          </SidebarContent>
      </Sidebar>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <AdminHeader />
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
          </main>
      </div>
    </SidebarProvider>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');
  let session: AdminSession | null = null;
  
  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch {
      session = null;
    }
  }

  // The middleware redirects unauthenticated users for most admin pages.
  // We check for the session here. If it doesn't exist, it means we are on the login/signup page.
  if (!session?.isLoggedIn) {
    // For login/signup, we just need the search provider, not the full admin UI.
    return <AdminSearchProvider>{children}</AdminSearchProvider>;
  }

  const permissions = session.permissions || [];

  return (
    <AdminSearchProvider>
      <AdminClientLayout permissions={permissions}>
        {children}
      </AdminClientLayout>
    </AdminSearchProvider>
  );
}
