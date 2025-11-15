import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('admin_session')
  const { pathname } = request.nextUrl
 
  // If the user is trying to access the login page, and is not logged in, let them through.
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  // If the user has a valid session cookie and is trying to access a non-login admin page, let them through.
  if (cookie && cookie.value === 'true') {
     // But if they are logged in and try to go to /admin/login, redirect to dashboard
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // If there's no valid cookie, redirect to login page.
  if (!pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/admin/:path*'],
}
