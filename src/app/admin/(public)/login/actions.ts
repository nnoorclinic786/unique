
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  redirect("/");
}
