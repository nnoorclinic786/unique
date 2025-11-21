
import React from 'react';
import { cookies } from 'next/headers';
import AdminClientLayout from './client-layout';
import { AdminSearchProvider } from '@/context/admin-search-context';
import { redirect } from 'next/navigation';
import { initializeApp, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { AdminUser } from '@/lib/types';

// Initialize Firebase Admin SDK if it hasn't been already.
function getFirebaseAdminApp(): App {
    if (getApps().length) {
        return getApps()[0];
    }
    // This should be configured with service account credentials in a real environment
    return initializeApp();
}

const app = getFirebaseAdminApp();
const db = getFirestore(app);

const SUPER_ADMIN_EMAIL = 'uniquemedicare786@gmail.com';
const ALL_PERMISSIONS = ['dashboard', 'orders', 'drugs', 'buyers', 'manage_admins', 'settings'];

async function getAdminPermissions(email: string): Promise<string[]> {
    if (email === SUPER_ADMIN_EMAIL) {
        return ALL_PERMISSIONS;
    }

    try {
        // Use a query to find the admin by their email address
        const adminsRef = db.collection('admins');
        const q = adminsRef.where('email', '==', email).limit(1);
        const querySnapshot = await q.get();

        if (!querySnapshot.empty) {
            const adminDoc = querySnapshot.docs[0];
            const adminData = adminDoc.data() as AdminUser;
            // Ensure the user is approved and return their permissions
            if (adminData.status === 'Approved') {
                return adminData.permissions || [];
            }
        }
    } catch (error) {
        console.error("Error fetching admin permissions:", error);
    }
    
    // Default to no permissions if user not found, not approved, or on error
    return [];
}


// This is now a correctly implemented async Server Component
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');

  // Although middleware should protect this, we add a server-side check as a safeguard.
  if (!sessionCookie) {
    redirect('/admin/login');
  }

  // We can now safely parse the session.
  const session = JSON.parse(sessionCookie.value);

  // If for any reason the session is invalid, redirect.
  if (!session?.isLoggedIn || !session.uid || !session.email) {
     redirect('/admin/login');
  }
  
  // Fetch the user's permissions on the server using their email
  const permissions = await getAdminPermissions(session.email);

  // If the user has no permissions, they shouldn't access any protected route.
  // We can redirect them to a specific page or just the login page.
  if (permissions.length === 0) {
      console.warn(`Admin ${session.email} has no permissions. Logging out.`);
      // Optional: Clear the cookie before redirecting
      // cookies().delete('admin_session');
      redirect('/admin/login?error=access_denied');
  }

  return (
    <AdminSearchProvider>
      {/* We pass the fetched permissions down to the client layout */}
      <AdminClientLayout permissions={permissions}>
        {children}
      </AdminClientLayout>
    </AdminSearchProvider>
  );
}
