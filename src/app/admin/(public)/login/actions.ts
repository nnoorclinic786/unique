
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { initializeApp, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { AdminUser } from "@/lib/types";

// Initialize Firebase Admin SDK if it hasn't been already.
function getFirebaseAdminApp(): App {
    if (getApps().length) {
        return getApps()[0];
    }
    return initializeApp();
}

const app = getFirebaseAdminApp();
const adminDb = getFirestore(app);

// Special email for the super admin
const SUPER_ADMIN_EMAIL = 'uniquemedicare786@gmail.com';

export async function login(formData: FormData): Promise<{ error?: string }> {
  const email = formData.get("email") as string;
  const uid = formData.get("uid") as string;

  if (!uid || !email) {
    return { error: "Authentication details are missing." };
  }

  let user: { name: string; email: string; status: string; role: string; } | null = null;
  
  // Check if the user is the Super Admin
  if (email === SUPER_ADMIN_EMAIL) {
      user = {
          name: 'Unique Medicare',
          email: email,
          status: 'Approved',
          role: 'Super Admin',
      };
  } else {
      // Fetch regular admin user data from Firestore using the UID
      const adminDocRef = adminDb.collection('admins').doc(uid);
      const adminDoc = await adminDocRef.get();

      if (!adminDoc.exists) {
        // This case should be rare if signup is the only entry point, but good to handle.
        return { error: "Admin record not found in the database. Please contact support." };
      }
      
      const adminData = adminDoc.data() as AdminUser;
      user = {
          name: adminData.name,
          email: adminData.email,
          status: adminData.status,
          role: adminData.role || 'Admin',
      };
  }
  
  // Check user status
  if (user.status !== 'Approved') {
      return { error: `Your account is currently ${user.status}. Please contact the Super Admin for approval.` };
  }

  // Create session data
  const sessionData = {
      isLoggedIn: true,
      email: user.email,
      name: user.name,
      uid: uid,
      role: user.role, // Add role to session for middleware
  };

  // Set the cookie
  cookies().set("admin_session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
  
  // Redirect to dashboard on successful login
  redirect("/admin/dashboard");
}

export async function logout() {
  cookies().delete("admin_session");
  redirect("/");
}
