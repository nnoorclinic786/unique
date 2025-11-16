"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// In a real application, these should be stored securely in a database and passwords should be hashed.
const ADMIN_USERS = [
    { email: "uniquemedicare786@gmail.com", password: "u#niquemedicare@6686#", role: "Super Admin", name: "Super Admin" },
    { email: "admin@medicare.com", password: "password", role: "Admin", name: "Admin User" }
];


export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = ADMIN_USERS.find(u => u.email === email && u.password === password);

  if (user) {
    const cookieStore = cookies();
    const sessionData = {
        isLoggedIn: true,
        email: user.email,
        role: user.role,
        name: user.name
    };

    cookieStore.set("admin_session", JSON.stringify(sessionData), {
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
  redirect("/");
}
