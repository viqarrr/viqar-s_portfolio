import type { APIRoute } from 'astro';
import { createAstroServerClient } from '../../../lib/supabase-server';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const client = createAstroServerClient(context);
  await client.auth.signOut();
  return context.redirect('/admin/login', 302);
};

export const GET: APIRoute = async (context) => {
  const client = createAstroServerClient(context);
  await client.auth.signOut();
  return context.redirect('/admin/login', 302);
};
