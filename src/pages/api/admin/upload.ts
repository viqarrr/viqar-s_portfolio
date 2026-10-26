import type { APIRoute } from 'astro';
import { createAstroServerClient, checkAdminUser } from '../../../lib/supabase-server';
import { validateMediaFile, sanitizeFilename } from '../../../lib/storage';
import { sanitizeSvg } from '../../../lib/sanitize-svg';

export const prerender = false;

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
    const url = new URL(context.request.url);
    const folder = url.searchParams.get('folder') || '';

    const { data, error } = await client.storage.from('media').list(folder, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const objectsWithUrls = (data || []).map((file) => {
      const filePath = folder ? `${folder}/${file.name}` : file.name;
      const { data: urlData } = client.storage.from('media').getPublicUrl(filePath);
      return {
        ...file,
        path: filePath,
        publicUrl: urlData.publicUrl,
      };
    });

    return new Response(JSON.stringify({ success: true, files: objectsWithUrls }), {
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
    const formData = await context.request.formData().catch(() => null);
    if (!formData) {
      return new Response(JSON.stringify({ error: 'Missing form data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string | null) || 'uploads';

    if (!file || typeof file.arrayBuffer !== 'function') {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const validation = validateMediaFile({ type: file.type, size: file.size });
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let buffer: Buffer;
    let contentType = file.type;

    if (file.type === 'image/svg+xml') {
      const rawText = await file.text();
      const sanitized = sanitizeSvg(rawText);
      buffer = Buffer.from(sanitized, 'utf-8');
    } else {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    const sanitizedBase = sanitizeFilename(file.name);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const filePath = folder ? `${folder}/${uniqueSuffix}-${sanitizedBase}` : `${uniqueSuffix}-${sanitizedBase}`;

    const { error: uploadError } = await client.storage
      .from('media')
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: urlData } = client.storage.from('media').getPublicUrl(filePath);

    return new Response(
      JSON.stringify({
        success: true,
        url: urlData.publicUrl,
        path: filePath,
        size: file.size,
        mimeType: contentType,
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

export const DELETE: APIRoute = async (context) => {
  const client = createAstroServerClient(context);
  const { user, isAdmin } = await checkAdminUser(client);

  if (!user || !isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(context.request.url);
    const path = url.searchParams.get('path');

    if (!path) {
      return new Response(JSON.stringify({ error: 'Missing path parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { error } = await client.storage.from('media').remove([path]);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, path }), {
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
