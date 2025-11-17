
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
  if (sessionCookie) {
    const session = JSON.parse(sessionCookie.value);
    
    // This check is a safeguard, middleware should prevent unauthenticated sessions.
    if (!session.isLoggedIn) {
        return <>{children}</>;
    }
      
    return (
        <AdminSearchProvider>
          <AdminClientLayout permissions={session.permissions}>
            {children}
          </AdminClientLayout>
        </AdminSearchProvider>
    );
  }

  // If no session cookie, the user is on a public page (like /admin/login).
  // Just render the page content without the admin layout.
  return <>{children}</>;
}
