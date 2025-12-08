import { NextRequest, NextResponse } from 'next/server';
import { createToken, setAuthCookie, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const isValid = verifyPassword(password);

    if (!isValid) {
      // Delay response to prevent timing attacks
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create JWT token and set httpOnly cookie
    const token = await createToken();
    await setAuthCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

