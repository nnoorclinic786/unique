
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('admin_session');
  let isLoggedIn = false;

  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value);
      if (session.isLoggedIn) {
        isLoggedIn = true;
      }
    } catch (e) {
      // Malformed cookie, treat as logged out
      isLoggedIn = false;
    }
  }
  
  const isAdminPath = pathname.startsWith('/admin');
  const isApiAuthPath = pathname.startsWith('/api/auth');
  const isAdminLoginPage = pathname === '/admin/login';
  
  if (isApiAuthPath) {
    return NextResponse.next();
  }

  // If accessing an admin path
  if (isAdminPath) {
    // If logged in and trying to access login page, redirect to dashboard
    if (isLoggedIn && isAdminLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // If not logged in and trying to access a protected admin page, redirect to login
    if (!isLoggedIn && !isAdminLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
