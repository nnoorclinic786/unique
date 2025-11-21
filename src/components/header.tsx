
'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { ShoppingCart } from 'lucide-react';
import { UserNav } from './user-nav';
import { useAppContext } from '@/context/app-context';
import { Badge } from './ui/badge';

interface AdminSession {
  isLoggedIn: boolean;
}

export function Header() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { cartCount } = useAppContext();

  useEffect(() => {
    setIsClient(true);
    // This listener will react to login/logout events for regular users
    const checkUserLoginStatus = () => {
      if (typeof window !== 'undefined' && localStorage.getItem('userLoggedIn') === 'true') {
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    };
    checkUserLoginStatus();
    window.addEventListener('storage', checkUserLoginStatus);


    // Fetch admin status from the session API
    async function fetchAdminStatus() {
        try {
            const res = await fetch('/api/session');
            const data: AdminSession = await res.json();
            setIsAdminLoggedIn(data.isLoggedIn);
        } catch (error) {
            setIsAdminLoggedIn(false);
        }
    }
    fetchAdminStatus();

    return () => {
      window.removeEventListener('storage', checkUserLoginStatus);
    };

  }, []);

  if (!isClient) {
    // Render a placeholder or null during SSR to avoid hydration mismatch
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
                 <Link href="/" className="mr-6 flex items-center gap-2">
                    <Logo className="h-10 w-10 text-primary" />
                    <span className="font-headline text-lg font-semibold text-foreground">
                        Unique Medicare
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/about" className="transition-colors hover:text-primary">
                        About Us
                    </Link>
                </nav>
                <div className="ml-auto flex items-center gap-2">
                     <div className="hidden sm:flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Logo className="h-10 w-10 text-primary" />
          <span className="font-headline text-lg font-semibold text-foreground">
            Unique Medicare
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {isUserLoggedIn && (
            <>
              <Link href="/medicines" className="transition-colors hover:text-primary">
                  Medicines
              </Link>
              <Link href="/account" className="transition-colors hover:text-primary">
                  My Account
              </Link>
            </>
          )}
          {!(isUserLoggedIn || isAdminLoggedIn) && (
            <Link href="/about" className="transition-colors hover:text-primary">
              About Us
            </Link>
          )}
          {isAdminLoggedIn && (
            <Link href="/admin/dashboard" className="transition-colors hover:text-primary">
              Admin Dashboard
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          {isUserLoggedIn && (
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                   <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{cartCount}</Badge>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Link>
            </Button>
          )}
          {isUserLoggedIn || isAdminLoggedIn ? (
            <UserNav />
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
