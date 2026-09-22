import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'makkal_kural_admin_2026';

export function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export function requireAdminAuth(req: NextRequest): { authorized: boolean; response?: NextResponse } {
  const expectedKey = ADMIN_SECRET_KEY;
  const defaultKey = 'makkal_kural_admin_2026';

  const authHeader = req.headers.get('authorization');
  const xAdminKey = req.headers.get('x-admin-key');
  const cookieKey = req.cookies.get('mk_admin_key')?.value;
  const providedKey = authHeader?.replace('Bearer ', '').trim() || xAdminKey?.trim() || cookieKey?.trim();

  // Allow if provided key matches expected or default dev key
  if (!providedKey || (providedKey !== expectedKey && providedKey !== defaultKey)) {
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

export function getAdminHeaders(): Record<string, string> {
  // Client side: read from localStorage (set during admin login flow)
  // Server side: read from environment (ADMIN_SECRET_KEY is a server-only var)
  // NOTE: Never use NEXT_PUBLIC_ prefix for admin keys — that would expose them in client bundles.
  const key = typeof window !== 'undefined'
    ? (localStorage.getItem('mk_admin_key') || 'makkal_kural_admin_2026')
    : (process.env.ADMIN_SECRET_KEY || 'makkal_kural_admin_2026');
  return {
    'Authorization': `Bearer ${key}`,
    'x-admin-key': key,
  };
}
