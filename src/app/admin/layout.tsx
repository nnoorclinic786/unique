
import React from 'react';
import { cookies } from 'next/headers';
import { AdminSearchProvider } from '@/context/admin-search-context';
import AdminClientLayout from './client-layout';

// This is the root layout for the /admin section.
// It handles both authenticated and public views.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = cookies().get('admin_session');
  
  // If a session exists, the user is logged in. Render the full admin dashboard.
  // The middleware ensures that only authenticated users can reach this point for private routes.
  if (sessionCookie) {
    try {
        const session = JSON.parse(sessionCookie.value);
        
        if (session.isLoggedIn) {
            return (
                <AdminSearchProvider>
                <AdminClientLayout permissions={session.permissions}>
                    {children}
                </AdminClientLayout>
                </AdminSearchProvider>
            );
        }
    } catch(e) {
        // If cookie is malformed, treat as logged out.
    }
  }

  // If no session cookie, or cookie is invalid, we're on a public page (like /admin/login).
  // Just render the page content without the admin layout.
  // The route group layout `(public)/layout.tsx` will handle this.
  return <>{children}</>;
}
