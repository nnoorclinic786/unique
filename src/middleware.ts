
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type AdminPermission = 'dashboard' | 'orders' | 'drugs' | 'buyers' | 'manage_admins' | 'settings';

interface AdminSession {
  isLoggedIn: boolean;
  permissions: AdminPermission[];
  name: string;
  email: string;
  role: string;
}

// Function to check permission for a given path
const hasPermissionForPath = (pathname: string, session: AdminSession): boolean => {
    // Super Admins have access to everything.
    if (session.role === 'Super Admin') {
        return true;
    }

    const userPermissions = session.permissions || [];
    
    // Map pathnames to required permissions
    const permissionMap: Record<string, AdminPermission> = {
      '/admin/dashboard': 'dashboard',
      '/admin/orders': 'orders',
      '/admin/drugs': 'drugs',
      '/admin/drugs/new': 'drugs',
      '/admin/buyers': 'buyers',
      '/admin/manage-admins': 'manage_admins',
      '/admin/settings': 'settings',
    };

    // Allow access to dynamic detail pages if they have the base permission
    if (/^\/admin\/buyers\/[^/]+$/.test(pathname)) {
        return userPermissions.includes('buyers');
    }
    if (/^\/admin\/orders\/[^/]+$/.test(pathname)) {
        return userPermissions.includes('orders');
    }
     if (/^\/admin\/drugs\/[^/]+$/.test(pathname) && !pathname.endsWith('/new')) {
        return userPermissions.includes('drugs');
    }

    // Check against the permission map for exact matches
    const requiredPermission = permissionMap[pathname];

    // If a specific permission is required for this path, check if the user has it
    if (requiredPermission) {
        return userPermissions.includes(requiredPermission);
    }

    // Default to allow for paths not explicitly in the map (like /admin)
    return true; 
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicAdminPaths = ['/admin/login', '/admin/signup'];
  
  // Checks if the current path is a protected admin path
  const isProtectedAdminPath = pathname.startsWith('/admin') && !publicAdminPaths.includes(pathname);

  const sessionCookie = request.cookies.get('admin_session');
  let session: AdminSession | null = null;

  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (e) {
      session = null;
    }
  }
  
  const isLoggedIn = !!session?.isLoggedIn;

  // Scenario 1: User is logged in
  if (isLoggedIn && session) {
    // If they try to access login/signup, redirect to dashboard
    if (publicAdminPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // If they access a protected path, check for permissions
    if (isProtectedAdminPath && !hasPermissionForPath(pathname, session)) {
      // If no permission, and they are not already on the dashboard, redirect to dashboard.
      if (pathname !== '/admin/dashboard') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  } 
  // Scenario 2: User is NOT logged in
  else {
    // If they try to access any protected admin page, redirect to login
    if (isProtectedAdminPath) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If none of the above, continue as normal
  return NextResponse.next();
}

export const config = {
  // Match all paths except for API routes, static files, and image optimization files.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
