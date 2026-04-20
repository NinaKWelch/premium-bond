import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isGuest = req.cookies.get('pb_guest')?.value === 'true';
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/premium-bonds') && !isLoggedIn && !isGuest) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
  }

  if (pathname === '/profile' && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
  }

  if ((pathname === '/login' || pathname === '/register') && isLoggedIn) {
    return NextResponse.redirect(new URL('/premium-bonds/interest-tracker', req.nextUrl.origin));
  }
});

export const config = {
  matcher: ['/premium-bonds/:path*', '/profile', '/login', '/register'],
};
