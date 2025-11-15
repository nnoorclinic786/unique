
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { ShoppingCart } from 'lucide-react';
import { UserNav } from './user-nav';

interface HeaderProps {
  isAdminLoggedIn: boolean;
}

export function Header({ isAdminLoggedIn }: HeaderProps) {
  const user = null; // Placeholder for auth state

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
          <Link href="/medicines" className="transition-colors hover:text-primary">
            Medicines
          </Link>
          {user && (
            <Link href="/account" className="transition-colors hover:text-primary">
                My Account
            </Link>
          )}
          {isAdminLoggedIn && (
            <Link href="/admin/dashboard" className="transition-colors hover:text-primary">
              Admin
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          {user || isAdminLoggedIn ? (
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
