
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// In a real application, these should be stored securely in environment variables
const ADMIN_EMAIL = "admin@medicare.com";
const ADMIN_PASSWORD = "password";

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const cookieStore = cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    redirect("/admin/dashboard");
  }

  return { success: false, error: "Invalid email or password." };
}

export async function logout() {
  cookies().delete("admin_session");
  redirect("/admin/login");
}
