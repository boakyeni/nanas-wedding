import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.SECRET); // same secret used in Flask

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // --- existing dashboard auth ---
  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch (err) {
      console.error('JWT verification failed:', err);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // check home, protect dashboard
};
