
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type AdminPermission = 'dashboard' | 'orders' | 'drugs' | 'buyers' | 'manage_admins';

interface AdminSession {
  isLoggedIn: boolean;
  permissions: AdminPermission[];
}

// Map pathnames to required permissions
const permissionMap: Record<string, AdminPermission> = {
  '/admin/dashboard': 'dashboard',
  '/admin/orders': 'orders',
  '/admin/drugs': 'drugs',
  '/admin/drugs/new': 'drugs',
  '/admin/buyers': 'buyers',
  '/admin/manage-admins': 'manage_admins',
};

// Function to check permission for a given path
const hasPermissionForPath = (pathname: string, userPermissions: AdminPermission[]): boolean => {
    // Allow access to buyer detail pages if they have 'buyers' permission
    if (/^\/admin\/buyers\/[^/]+$/.test(pathname)) {
        return userPermissions.includes('buyers');
    }

    const requiredPermission = Object.entries(permissionMap).find(([path]) => pathname.startsWith(path));

    if (!requiredPermission) {
        return true; // No specific permission required for this path, e.g., /admin itself
    }
    return userPermissions.includes(requiredPermission[1]);
};


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get('admin_session');
  let session: AdminSession | null = null;

  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (e) {
      session = null;
    }
  }
  
  const isLoggedIn = session?.isLoggedIn || false;
  const isAdminPath = pathname.startsWith('/admin');
  const isApiAuthPath = pathname.startsWith('/api/auth');
  const isAdminLoginPage = pathname === '/admin/login';
  const isAdminSignupPage = pathname === '/admin/signup';
  
  if (isApiAuthPath) {
    return NextResponse.next();
  }

  if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (isAdminPath) {
    // If logged in, they shouldn't be on the login or signup page. Redirect to dashboard.
    if (isLoggedIn && (isAdminLoginPage || isAdminSignupPage)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // If not logged in, they can only be on the login or signup page. Redirect unauthenticated users from other admin pages.
    if (!isLoggedIn && !isAdminLoginPage && !isAdminSignupPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
     // If logged in, check permissions for non-login/signup pages
    if (isLoggedIn && !isAdminLoginPage && !isAdminSignupPage && session) {
      if (!hasPermissionForPath(pathname, session.permissions)) {
        // Redirect to a default page if they don't have access
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
