
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// In a real application, these should be stored securely in a database and passwords should be hashed.
const ADMIN_USERS = [
    { email: "uniquemedicare786@gmail.com", password: "uniquemedicare@6686#", role: "Super Admin", name: "Super Admin", permissions: ['dashboard', 'orders', 'drugs', 'buyers', 'manage_admins'], status: 'Approved' },
    { email: "admin@medicare.com", password: "password", role: "Admin", name: "Admin User", permissions: ['dashboard', 'orders'], status: 'Approved' }
];


export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = ADMIN_USERS.find(u => u.email === email && u.password === password);

  if (user) {
    if (user.status !== 'Approved') {
        return { success: false, error: `Your account is currently ${user.status}. Please contact the Super Admin.` };
    }

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

export async function addPendingAdmin(data: {name: string, email: string, password: string}) {
    // In a real app, this would check for existing users and save to a database.
    const existingUser = ADMIN_USERS.find(u => u.email === data.email);
    if (existingUser) {
        return { success: false, error: "An admin with this email already exists." };
    }

    const newAdmin = {
        email: data.email,
        password: data.password,
        role: "Admin",
        name: data.name,
        permissions: [], // No permissions by default
        status: 'Pending' as const,
    };
    ADMIN_USERS.push(newAdmin);
    return { success: true };
}


export async function getAdmins() {
    // In a real app, this would fetch from a database.
    return ADMIN_USERS;
}

export async function updateAdminPermissions(email: string, permissions: string[]) {
    // This is a mock function. In a real app, you would update the database.
    console.log(`Updating permissions for ${email}:`, permissions);
    const user = ADMIN_USERS.find(u => u.email === email);
    if (user && user.role !== 'Super Admin') {
        user.permissions = permissions;
    }
    return { success: true, message: `Permissions for ${email} updated.` };
}

export async function approveAdmin(email: string) {
    const user = ADMIN_USERS.find(u => u.email === email);
    if (user && user.status === 'Pending') {
        user.status = 'Approved';
        // Assign default permissions upon approval
        user.permissions = ['dashboard']; 
        return { success: true, message: `${user.name} has been approved.` };
    }
    return { success: false, error: 'User not found or not pending.' };
}

export async function toggleAdminStatus(email: string, currentStatus: 'Approved' | 'Disabled') {
    const user = ADMIN_USERS.find(u => u.email === email);
    if (user && user.role !== 'Super Admin') {
        user.status = currentStatus === 'Approved' ? 'Disabled' : 'Approved';
        return { success: true, message: `${user.name}'s account has been ${user.status.toLowerCase()}.` };
    }
    return { success: false, error: 'User not found or is a Super Admin.' };
}
