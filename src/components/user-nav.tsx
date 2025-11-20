
'use client';

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
import { logout } from '@/app/admin/(public)/login/actions';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface AdminSession {
  name: string;
  email: string;
  role: string;
  permissions: string[];
  isLoggedIn: boolean;
}

export function UserNav() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const adminCookie = Cookies.get('admin_session');
    if (adminCookie) {
      try {
        const sessionData = JSON.parse(adminCookie);
        if (sessionData.isLoggedIn) {
          setSession(sessionData);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        setSession(null);
      }
    }

    if (localStorage.getItem('userLoggedIn') === 'true') {
        setUserName(localStorage.getItem('userName'));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    const isAdmin = !!session?.isLoggedIn;
    
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');

    // This will clear the cookie and redirect to the login page for admins.
    await logout();
    
    // For regular users, we manually redirect and refresh.
    if(!isAdmin){
        router.push('/');
        router.refresh();
    }
  };

  const getInitials = (name: string = "") => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';
  }

  if (isLoading) {
      return <Skeleton className="h-8 w-8 rounded-full" />;
  }
  
  if (session?.isLoggedIn) {
     return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="@user" />
                <AvatarFallback>{getInitials(session.name)}</AvatarFallback>
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
                <DropdownMenuItem asChild><Link href="/admin/profile"><User className="mr-2 h-4 w-4" /><span>My Profile</span></Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/admin/dashboard">Dashboard</Link></DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    );
  }

  if (userName) {
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
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
     )
  }

  return null;
}
