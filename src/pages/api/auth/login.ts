import type { APIRoute } from 'astro';
import { createAstroServerClient, checkAdminUser } from '../../../lib/supabase-server';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json().catch(() => null);
    if (!body || !body.email || !body.password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = createAstroServerClient(context);
    const { data, error } = await client.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error || !data.user) {
      return new Response(JSON.stringify({ error: error?.message || 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { isAdmin } = await checkAdminUser(client);
    if (!isAdmin) {
      await client.auth.signOut();
      return new Response(
        JSON.stringify({ error: 'Access denied: Account is not in admin_users whitelist' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, redirect: '/admin' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
