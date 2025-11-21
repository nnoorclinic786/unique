
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { initializeApp, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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

  let user = {
      name: '',
      email: email,
      status: ''
  };
  
  // Check if the user is the Super Admin
  if (email === SUPER_ADMIN_EMAIL) {
      user.name = 'Unique Medicare';
      user.status = 'Approved';
  } else {
      // Fetch regular admin user data from Firestore using the UID
      const adminDocRef = adminDb.collection('admins').doc(uid);
      const adminDoc = await adminDocRef.get();

      if (!adminDoc.exists) {
        return { error: "Admin record not found in database." };
      }
      
      const adminData = adminDoc.data();
      if (!adminData) {
        return { error: "Failed to retrieve admin data."};
      }
      user.name = adminData.name;
      user.status = adminData.status;
  }
  
  // Check user status
  if (user.status !== 'Approved') {
      return { error: `Your account is currently ${user.status}. Please contact the Super Admin.` };
  }

  // Create session data
  const sessionData = {
      isLoggedIn: true,
      email: user.email,
      name: user.name,
      uid: uid,
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
