import React from 'react';

// The root layout for /admin is now just a pass-through.
// Route groups will handle whether to show a public or protected layout.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
