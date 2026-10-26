import type { APIRoute } from 'astro';
import { createAstroServerClient, checkAdminUser } from '../../../lib/supabase-server';

export const prerender = false;

const ALLOWED_COLLECTIONS = [
  'projects',
  'skills',
  'credentials',
  'experiences',
  'contact_links',
] as const;

type AllowedCollection = (typeof ALLOWED_COLLECTIONS)[number];

export const POST: APIRoute = async (context) => {
  const client = createAstroServerClient(context);
  const { user, isAdmin } = await checkAdminUser(client);

  if (!user || !isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await context.request.json().catch(() => null);
    if (!body || !body.collection || !body.id || !body.status) {
      return new Response(JSON.stringify({ error: 'Missing collection, id, or status' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { collection, id, status } = body;

    if (!ALLOWED_COLLECTIONS.includes(collection as AllowedCollection)) {
      return new Response(JSON.stringify({ error: `Disallowed collection: ${collection}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (status !== 'draft' && status !== 'published') {
      return new Response(JSON.stringify({ error: "Status must be 'draft' or 'published'" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { error } = await client
      .from(collection)
      .update({ status })
      .eq('id', id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, id, status }), {
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
