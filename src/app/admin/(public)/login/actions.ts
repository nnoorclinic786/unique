
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { firebaseConfig } from "@/firebase/config";

// Initialize Firebase Admin SDK if it hasn't been already.
if (!getApps().length) {
  initializeApp({
    // You might need to provide service account credentials here in a real production environment
    // For now, it might work in some environments if default credentials are set up.
  });
}

// Get auth and firestore instances from the server-side admin SDK
const adminAuth = getAuth();
const adminDb = getFirestore();

export async function login(formData: FormData): Promise<{ error?: string }> {
  // This is a server action, so we can use the Firebase Admin SDK.
  // The client-side 'login' function will now just be a simple form submit action.
  
  // NOTE: This server action approach is a placeholder for a more robust
  // session management strategy using the Admin SDK, which is the correct
  // way to handle this on the server.
  
  // For the purpose of this fix, we will continue using a simple cookie,
  // but acknowledge this would be improved.

  const email = formData.get("email") as string;
  const password = formData.get("password") as string; // NEVER use the password directly like this in production
  
  // The client will handle the actual Firebase signInWithEmailAndPassword call.
  // This server action's primary role is now to set the secure, httpOnly cookie
  // after the client confirms a successful login. We need the UID from the client.
  const uid = formData.get("uid") as string;

  if (!uid || !email) {
    return { error: "Authentication details are missing." };
  }

  // Fetch admin user data from Firestore using the UID
  const adminDocRef = adminDb.collection('admins').doc(uid);
  const adminDoc = await adminDocRef.get();

  if (!adminDoc.exists) {
    // Also check the initial static super admin, matching by email.
    if (email === 'uniquemedicare786@gmail.com') {
      // This is the static Super Admin.
      const sessionData = {
          isLoggedIn: true,
          email: 'uniquemedicare786@gmail.com',
          name: 'Unique Medicare',
          uid: 'super-admin-uid-placeholder' // In a real app, super admin should also be in Auth
      };
       cookies().set("admin_session", JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });
      redirect("/admin/dashboard");
    }
    return { error: "Admin record not found in database." };
  }
  
  const user = adminDoc.data();

  if (user?.status !== 'Approved') {
      return { error: `Your account is currently ${user?.status}. Please contact the Super Admin.` };
  }

  const sessionData = {
      isLoggedIn: true,
      email: user.email,
      name: user.name,
      uid: uid,
  };

  cookies().set("admin_session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
  
  redirect("/admin/dashboard");
}

export async function logout() {
  cookies().delete("admin_session");
  redirect("/");
}
