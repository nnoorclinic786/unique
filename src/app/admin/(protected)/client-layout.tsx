
'use client';

import Link from "next/link";
import React from "react";
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  PanelLeft,
  ShieldCheck,
  LogOut,
  Search,
  Settings
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { UserNav } from "@/components/user-nav";
import { logout } from "../(public)/login/actions";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useAdminSearch } from "@/context/admin-search-context";

function AdminHeader() {
    const { setQuery } = useAdminSearch();
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
                  href="/admin/dashboard"
                  passHref
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Logo className="h-6 w-6 transition-all group-hover:scale-110" />
                  <span className="sr-only">Unique Medicare</span>
                </Link>
                <a href="/admin/dashboard" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><Home className="h-5 w-5" />Dashboard</a>
                <a href="/admin/orders" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><ShoppingCart className="h-5 w-5" />Orders</a>
                <a href="/admin/drugs" className="flex items-center gap-4 px-2.5 text-foreground"><Package className="h-5 w-5" />Medicines</a>
                <a href="/admin/buyers" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><Users className="h-5 w-5" />Customers</a>
                <a href="/admin/manage-admins" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><ShieldCheck className="h-5 w-5" />Manage Admins</a>
                <a href="/admin/settings" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"><Settings className="h-5 w-5" />Settings</a>
              </nav>
            </SheetContent>
          </Sheet>
           <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                onChange={(e) => setQuery(e.target.value)}
                />
            </div>
          <div className="ml-auto flex items-center gap-4 md:grow-0">
            <UserNav />
          </div>
        </header>
    )
}

export default function AdminClientLayout({ children, permissions }: { children: React.ReactNode, permissions: string[] }) {
  const hasPermission = (p: string) => permissions.includes(p);
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-muted/40">
        <Sidebar className="border-r bg-background">
            <SidebarHeader>
            <a href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                <Logo className="h-10 w-10 text-primary" />
                <span className="font-headline">Unique Medicare Admin</span>
            </a>
            </SidebarHeader>
            <SidebarContent>
            <SidebarMenu>
                {hasPermission('dashboard') && <SidebarMenuItem><a href="/admin/dashboard"><SidebarMenuButton tooltip="Dashboard"><Home /><span>Dashboard</span></SidebarMenuButton></a></SidebarMenuItem>}
                {hasPermission('orders') && <SidebarMenuItem><a href="/admin/orders"><SidebarMenuButton tooltip="Orders"><ShoppingCart /><span>Orders</span></SidebarMenuButton></a></SidebarMenuItem>}
                {hasPermission('drugs') && <SidebarMenuItem><a href="/admin/drugs"><SidebarMenuButton tooltip="Medicines"><Package /><span>Medicines</span></SidebarMenuButton></a></SidebarMenuItem>}
                {hasPermission('buyers') && <SidebarMenuItem><a href="/admin/buyers"><SidebarMenuButton tooltip="Customers"><Users /><span>Buyers</span></SidebarMenuButton></a></SidebarMenuItem>}
                {hasPermission('manage_admins') && <SidebarMenuItem><a href="/admin/manage-admins"><SidebarMenuButton tooltip="Manage Admins"><ShieldCheck /><span>Manage Admins</span></SidebarMenuButton></a></SidebarMenuItem>}
            </SidebarMenu>
            </SidebarContent>
             <SidebarFooter>
                <SidebarMenu>
                    {hasPermission('settings') && <SidebarMenuItem>
                        <a href="/admin/settings"><SidebarMenuButton tooltip="Settings"><Settings /><span>Settings</span></SidebarMenuButton></a>
                    </SidebarMenuItem>}
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} tooltip="Log Out">
                            <LogOut /><span>Log Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1">
            <AdminHeader />
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              {children}
            </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
