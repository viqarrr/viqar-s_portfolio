import type { APIRoute } from 'astro';
import { createAstroServerClient, checkAdminUser } from '../../../lib/supabase-server';
import { SiteSettingsSchema } from '../../../lib/schemas';
import { getSettings } from '../../../lib/content';

export const prerender = false;

const SINGLETON_ID = '00000000-0000-0000-0000-000000000001';

export const GET: APIRoute = async (context) => {
  const client = createAstroServerClient(context);
  const { user, isAdmin } = await checkAdminUser(client);

  if (!user || !isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { data, error } = await client
      .from('site_settings')
      .select('*')
      .eq('id', SINGLETON_ID)
      .maybeSingle();

    if (error || !data) {
      const fallback = await getSettings();
      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
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

export const PUT: APIRoute = async (context) => {
  const client = createAstroServerClient(context);
  const { user, isAdmin } = await checkAdminUser(client);

  if (!user || !isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const rawBody = await context.request.json().catch(() => null);
    if (!rawBody) {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const validationResult = SiteSettingsSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          issues: validationResult.error.format(),
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const validData = validationResult.data;

    // Separate site_settings columns from contact/social links
    // which are managed separately in the contact_links table.
    const {
      email,
      github_url,
      linkedin_url,
      instagram_url,
      contact_url,
      ...dbSettings
    } = validData;

    const { error: upsertError } = await client.from('site_settings').upsert({
      id: SINGLETON_ID,
      ...dbSettings,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      return new Response(JSON.stringify({ error: upsertError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Settings updated successfully', settings: validData }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = PUT;
