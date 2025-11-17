
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { admins } from "@/lib/data"; // Note: this is now just the initial seed data.

// This is a stand-in for a database call. In a real app, this would be more complex.
// For this mock environment, we assume the client-side context is the source of truth
// and server actions just facilitate communication.
const getAdminsFromStorage = () => {
    // In a real server action, we might fetch this from a DB.
    // For this mock setup, we'll have to rely on the fact that this array is
    // mutated by other "server actions" in the same process. This is NOT a good
    // real-world practice but necessary for this mocked environment.
    return admins;
}

export async function login(formData: FormData, allAdmins: any[]): Promise<{ error?: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = allAdmins.find(u => u.email === email && u.password === password);

  if (!user) {
    return { error: "Invalid email or password." };
  }
  
  if (user.status !== 'Approved') {
      return { error: `Your account is currently ${user.status}. Please contact the Super Admin.` };
  }

  const cookieStore = cookies();
  const sessionData = {
      isLoggedIn: true,
      email: user.email,
      role: user.role,
      name: user.name,
      permissions: user.role === 'Super Admin' ? ['dashboard', 'orders', 'drugs', 'buyers', 'manage_admins', 'settings'] : user.permissions
  };

  cookieStore.set("admin_session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
  
  redirect("/admin/dashboard");
}

export async function logout() {
  cookies().delete("admin_session");
  redirect("/admin/login");
}
