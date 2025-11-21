
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// This is a new API route to securely get session data on the client-side.
export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');

  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value);
      if (session.isLoggedIn) {
        return NextResponse.json(session);
      }
    } catch (e) {
      // Invalid cookie format
      return NextResponse.json({ isLoggedIn: false }, { status: 400 });
    }
  }

  // No session found or not logged in
  return NextResponse.json({ isLoggedIn: false });
}
