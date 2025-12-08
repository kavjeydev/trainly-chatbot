import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_COOKIE_NAME = 'admin_session';

async function verifyTokenMiddleware(token: string): Promise<boolean> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      return false;
    }

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    return payload.authenticated === true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const isValid = await verifyTokenMiddleware(token);

    if (!isValid) {
      // Clear invalid cookie and redirect
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

