import { defineMiddleware } from 'astro:middleware';
import { createAstroServerClient, checkAdminUser } from './lib/supabase-server';

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
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    }

    // Protected /admin/** route
    if (!user || !isAdmin) {
      return context.redirect('/admin/login', 302);
    }

    const response = await next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return next();
});
