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
    if (!body || !body.collection || !Array.isArray(body.items)) {
      return new Response(JSON.stringify({ error: 'Invalid payload: collection and items are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { collection, items } = body;

    if (!ALLOWED_COLLECTIONS.includes(collection as AllowedCollection)) {
      return new Response(JSON.stringify({ error: `Disallowed collection: ${collection}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Execute updates in parallel or sequence
    const updatePromises = items.map((item: { id: string; sort_order: number }) => {
      return client
        .from(collection)
        .update({ sort_order: item.sort_order })
        .eq('id', item.id);
    });

    const results = await Promise.all(updatePromises);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      const firstErr = results.find((r) => r.error)?.error;
      return new Response(JSON.stringify({ error: firstErr?.message || 'Failed to update some items' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, updatedCount: items.length }), {
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
