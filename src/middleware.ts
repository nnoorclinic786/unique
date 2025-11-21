
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is the shape of the data we'll store in the cookie.
// We only need isLoggedIn and the UID to fetch details on the server.
interface AdminSession {
  isLoggedIn: boolean;
  uid: string;
  email: string;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Publicly accessible admin paths that do not require a login session.
  const publicAdminPaths = ['/admin/login', '/admin/signup', '/admin/forgot-password'];
  
  // Check if the current path is a protected admin path.
  const isProtectedAdminPath = pathname.startsWith('/admin') && !publicAdminPaths.includes(pathname);

  const sessionCookie = request.cookies.get('admin_session');
  let session: AdminSession | null = null;

  if (sessionCookie?.value) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (e) {
      console.error('Invalid session cookie:', e);
      session = null;
    }
  }
  
  const isLoggedIn = !!session?.isLoggedIn;

  // Scenario 1: User is logged in.
  if (isLoggedIn) {
    // If they try to access a public page like login/signup, redirect to the dashboard.
    if (publicAdminPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    
    // For protected paths, the server component layout (`/admin/(protected)/layout.tsx`)
    // will now be responsible for fetching permissions and enforcing route access.
    // The middleware's job is just to ensure a valid session exists.
    // This simplifies the middleware and centralizes permission logic on the server.

  } 
  // Scenario 2: User is NOT logged in.
  else {
    // If they try to access any protected admin page, they are redirected to the login page.
    if (isProtectedAdminPath) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If none of the above conditions are met, allow the request to proceed.
  return NextResponse.next();
}

export const config = {
  // This matcher ensures the middleware runs on all paths except for Next.js internal
  // paths and static assets, which improves performance.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
