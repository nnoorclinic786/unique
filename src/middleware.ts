
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
      isLoggedIn = false;
    }
  }
  
  const isAdminPath = pathname.startsWith('/admin');
  const isApiAuthPath = pathname.startsWith('/api/auth');
  const isAdminLoginPage = pathname === '/admin/login';
  
  if (isApiAuthPath) {
    return NextResponse.next();
  }

  if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (isAdminPath) {
    if (isLoggedIn && isAdminLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    if (!isLoggedIn && !isAdminLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
