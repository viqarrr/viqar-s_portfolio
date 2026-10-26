import type { APIRoute } from 'astro';
import { createAstroServerClient, checkAdminUser } from '../../../lib/supabase-server';

export const prerender = false;

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
    const deployHookUrl = process.env.DEPLOY_HOOK_URL || (import.meta.env ? import.meta.env.DEPLOY_HOOK_URL : '');

    if (deployHookUrl) {
      const response = await fetch(deployHookUrl, {
        method: 'POST',
      });

      if (!response.ok) {
        const text = await response.text();
        return new Response(
          JSON.stringify({
            error: `Deploy hook returned HTTP ${response.status}`,
            details: text,
          }),
          {
            status: 502,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          timestamp: new Date().toISOString(),
          message: 'Deploy hook triggered successfully',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Local development mode / mock trigger
    return new Response(
      JSON.stringify({
        success: true,
        mocked: true,
        timestamp: new Date().toISOString(),
        message: 'Deploy hook triggered (mocked in local environment - no DEPLOY_HOOK_URL set)',
      }),
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
