
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type AdminPermission = 'dashboard' | 'orders' | 'drugs' | 'buyers' | 'manage_admins';

interface AdminSession {
  isLoggedIn: boolean;
  permissions: AdminPermission[];
  name: string;
  email: string;
  role: string;
}

// Map pathnames to required permissions
const permissionMap: Record<string, AdminPermission> = {
  '/admin/dashboard': 'dashboard',
  '/admin/orders': 'orders',
  '/admin/drugs': 'drugs',
  '/admin/drugs/new': 'drugs',
  '/admin/buyers': 'buyers',
  '/admin/manage-admins': 'manage_admins',
  '/admin/settings': 'manage_admins', // Only super admins can change settings
};

// Function to check permission for a given path
const hasPermissionForPath = (pathname: string, session: AdminSession): boolean => {
    // Super Admins have access to everything. This must be the very first check.
    if (session.role === 'Super Admin') {
        return true;
    }

    const userPermissions = session.permissions || [];

    // Allow access to buyer detail pages if they have 'buyers' permission
    if (/^\/admin\/buyers\/[^/]+$/.test(pathname)) {
        return userPermissions.includes('buyers');
    }
    
    // Allow access to order detail pages if they have 'orders' permission
    if (/^\/admin\/orders\/[^/]+$/.test(pathname)) {
        return userPermissions.includes('orders');
    }

    // Check against the permission map for exact matches
    const requiredPermission = permissionMap[pathname];

    // If a specific permission is required for this path
    if (requiredPermission) {
        // Check if the user has that permission
        return userPermissions.includes(requiredPermission);
    }

    // If the path is not in the map, allow access by default (e.g., /admin root)
    // More specific deny rules can be added here if needed.
    return true; 
};


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicAdminPaths = ['/admin/login', '/admin/signup'];
  const isAdminRoot = pathname === '/admin';

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

  // Handle all /admin routing logic here
  if (pathname.startsWith('/admin')) {
    // If logged in...
    if (isLoggedIn && session) {
      // and trying to access a public admin page (login/signup), redirect to dashboard.
      if (publicAdminPaths.includes(pathname)) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      
      // or trying to access the admin root, redirect to dashboard.
      if (isAdminRoot) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      // and trying to access a protected page, check for permissions.
      if (!hasPermissionForPath(pathname, session)) {
        // If they don't have permission, redirect them to the dashboard.
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    } 
    // If NOT logged in...
    else {
      // and trying to access any admin page that is NOT public, redirect to login.
      if (!publicAdminPaths.includes(pathname) && pathname.startsWith('/admin/')) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Ensure we are not matching paths for public assets
  // and only matching page routes.
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
