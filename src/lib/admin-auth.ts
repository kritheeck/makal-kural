import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

export function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export function requireAdminAuth(req: NextRequest): { authorized: boolean; response?: NextResponse } {
  if (!ADMIN_SECRET_KEY) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Admin authentication not configured' }, { status: 500 }),
    };
  }

  const authHeader = req.headers.get('authorization');
  const providedKey = authHeader?.replace('Bearer ', '').trim();

  if (!providedKey || providedKey !== ADMIN_SECRET_KEY) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 }),
    };
  }

  return { authorized: true };
}

export function withAdminAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const auth = requireAdminAuth(req);
    if (!auth.authorized) {
      return auth.response!;
    }
    return handler(req);
  };
}
