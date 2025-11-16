
import React from 'react';

// This layout is for public-facing admin pages like login and signup.
// It does NOT include the admin sidebar or header.
export default function PublicAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
