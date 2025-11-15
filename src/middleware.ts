import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies.has('admin_session');
  const isLoggedIn = hasSessionCookie && request.cookies.get('admin_session')?.value === 'true';

  const isAdminPath = pathname.startsWith('/admin');
  const isAdminLoginPage = pathname === '/admin/login';

  if (!isAdminPath) {
    return NextResponse.next();
  }

  // If user is logged in
  if (isLoggedIn) {
    // If they try to access the login page, redirect to the dashboard
    if (isAdminLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // Otherwise, they can access the requested admin page
    return NextResponse.next();
  }
  
  // If user is not logged in
  // And they are not trying to access the login page, redirect them to it
  if (!isAdminLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  // If they are trying to access the login page, let them
  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};