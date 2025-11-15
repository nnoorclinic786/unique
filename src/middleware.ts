import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('admin_session')
  const { pathname } = request.nextUrl
 
  // If the user is trying to access the login page, let them through.
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  if (!cookie || cookie.value !== 'true') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/admin/:path*'],
}
