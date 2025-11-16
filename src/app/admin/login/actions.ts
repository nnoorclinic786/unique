
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// In a real application, these should be stored securely in a database and passwords should be hashed.
const ADMIN_USERS = [
    { email: "uniquemedicare786@gmail.com", password: "uniquemedicare@6686#", role: "Super Admin", name: "Super Admin", permissions: ['dashboard', 'orders', 'drugs', 'buyers', 'manage_admins'] },
    { email: "admin@medicare.com", password: "password", role: "Admin", name: "Admin User", permissions: ['dashboard', 'orders'] }
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
        name: user.name,
        permissions: user.permissions
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

export async function getAdmins() {
    // In a real app, this would fetch from a database.
    // We filter out the super admin so they can't edit their own permissions.
    return ADMIN_USERS.filter(u => u.role !== 'Super Admin');
}

export async function updateAdminPermissions(email: string, permissions: string[]) {
    // This is a mock function. In a real app, you would update the database.
    console.log(`Updating permissions for ${email}:`, permissions);
    const user = ADMIN_USERS.find(u => u.email === email);
    if (user) {
        user.permissions = permissions;
    }
    return { success: true, message: `Permissions for ${email} updated.` };
}
