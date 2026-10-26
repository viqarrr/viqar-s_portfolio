import { defineMiddleware } from 'astro:middleware';
import { createAstroServerClient, checkAdminUser } from './lib/supabase-server';

function applySecurityHeaders(headers: Headers) {
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';"
  );
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;

  if (url.pathname.startsWith('/admin')) {
    const isLoginPage = url.pathname === '/admin/login';
    const client = createAstroServerClient(context);
    const { user, isAdmin } = await checkAdminUser(client);

    if (isLoginPage) {
      if (user && isAdmin) {
        return context.redirect('/admin', 302);
      }
      const response = await next();
      applySecurityHeaders(response.headers);
      return response;
    }

    // Protected /admin/** route
    if (!user || !isAdmin) {
      return context.redirect('/admin/login', 302);
    }

    const response = await next();
    applySecurityHeaders(response.headers);
    return response;
  }

  return next();
});
