import { describe, it, expect, vi, beforeEach } from 'vitest';
import middlewareDefault from './middleware';
import type { NextRequest } from 'next/server';

type ReqOptions = { isLoggedIn?: boolean; isGuest?: boolean };

const mockRedirect = vi.fn();

// Make auth(callback) a no-op wrapper — just returns the callback so we can call it directly
vi.mock('./auth', () => ({
  auth: (cb: (req: unknown) => unknown) => cb,
}));

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: (url: URL) => {
      mockRedirect(url.pathname);

      return { type: 'redirect', url };
    },
  },
}));

describe('middleware', () => {
  // The mock strips the auth() wrapper, leaving the inner callback directly.
  // Cast once so call sites don't need individual suppressions.
  const middleware = middlewareDefault as unknown as (req: NextRequest) => void;
  const makeReq = (pathname: string, { isLoggedIn = false, isGuest = false }: ReqOptions = {}) =>
    ({
      auth: isLoggedIn ? { user: { email: 'user@example.com' } } : null,
      cookies: {
        get: (name: string) => (name === 'pb_guest' && isGuest ? { value: 'true' } : undefined),
      },
      nextUrl: { pathname, origin: 'http://localhost:3000' },
    }) as unknown as NextRequest;

  beforeEach(() => mockRedirect.mockClear());

  describe('/dashboard', () => {
    it('redirects to /login when unauthenticated and not a guest', () => {
      middleware(makeReq('/dashboard'));

      expect(mockRedirect).toHaveBeenCalledWith('/login');
    });

    it('redirects to /login for a nested dashboard path when unauthenticated and not a guest', () => {
      middleware(makeReq('/dashboard/settings'));

      expect(mockRedirect).toHaveBeenCalledWith('/login');
    });

    it('allows access for a logged-in user', () => {
      middleware(makeReq('/dashboard', { isLoggedIn: true }));

      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('allows access for a guest (pb_guest cookie)', () => {
      middleware(makeReq('/dashboard', { isGuest: true }));

      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe('/login', () => {
    it('redirects to /dashboard when already logged in', () => {
      middleware(makeReq('/login', { isLoggedIn: true }));

      expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
    });

    it('allows access when not logged in', () => {
      middleware(makeReq('/login'));

      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('allows access for a guest (guest can still log in)', () => {
      middleware(makeReq('/login', { isGuest: true }));

      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe('/register', () => {
    it('redirects to /dashboard when already logged in', () => {
      middleware(makeReq('/register', { isLoggedIn: true }));

      expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
    });

    it('allows access when not logged in', () => {
      middleware(makeReq('/register'));

      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });
});
