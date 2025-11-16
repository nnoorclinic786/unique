
import React from 'react';
import { AdminSearchProvider } from '@/context/admin-search-context';

// This is the root layout for the /admin section.
// It applies to both public (login, signup) and private (dashboard, etc.) pages.
// Authentication is handled by the middleware.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminSearchProvider>
        {children}
    </AdminSearchProvider>
  );
}
