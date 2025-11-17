import React from 'react';

// This layout is for all /admin routes.
// By exporting 'force-dynamic', we are telling Next.js to always render these routes
// dynamically. This prevents client-side router cache issues that can occur in
// environments like Firebase Studio, where session state might not be correctly
// recognized on client-side navigations, causing redirects to the login page.
export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
