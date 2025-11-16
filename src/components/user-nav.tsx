
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { logout } from '@/app/admin/login/actions';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface AdminSession {
  name: string;
  email: string;
  role: string;
  permissions: string[];
  isLoggedIn: boolean;
}

export function UserNav() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const sessionCookie = Cookies.get('admin_session');
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(sessionCookie);
        setSession(sessionData);
      } catch (e) {
        setSession(null);
      }
    }
  }, []);

  const handleLogout = async () => {
    // Clear the userLoggedIn state for regular users if it exists
    if(typeof window !== 'undefined'){
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userName');
    }
    await logout();
    // Redirect handled by the server action
  };

  const getInitials = (name: string = "") => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
  }

  if (!isClient) {
      return null;
  }
  
  const userLoggedIn = isClient && localStorage.getItem('userLoggedIn') === 'true';
  const userName = isClient ? localStorage.getItem('userName') : null;


  if (userLoggedIn && userName) {
     return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild><Link href="/account">My Account</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/cart">My Orders</Link></DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
     )
  }

  if (session?.isLoggedIn) {
     return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="@user" />
                <AvatarFallback>{session ? getInitials(session.name) : 'A'}</AvatarFallback>
            </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                    {session.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground pt-1 font-semibold">
                    ({session.role})
                </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {session.permissions.includes('dashboard') && <DropdownMenuItem asChild><Link href="/admin/dashboard">Dashboard</Link></DropdownMenuItem>}
                {session.permissions.includes('drugs') && <DropdownMenuItem asChild><Link href="/admin/drugs">Medicines</Link></DropdownMenuItem>}
                {session.permissions.includes('buyers') && <DropdownMenuItem asChild><Link href="/admin/buyers">Buyers</Link></DropdownMenuItem>}
                {session.permissions.includes('manage_admins') && <DropdownMenuItem asChild><Link href="/admin/manage-admins">Manage Admins</Link></DropdownMenuItem>}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
            Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    );
  }

  return null;
}
