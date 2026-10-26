import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from './database.types';
import type { AstroCookies } from 'astro';

export interface AstroContextLike {
  cookies: AstroCookies;
  request?: Request;
}

export function createAstroServerClient(context: AstroContextLike): SupabaseClient<Database> {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '';

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.request?.headers.get('cookie') ?? '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((c) => {
          context.cookies.set(c.name, c.value, c.options as any);
        });
      },
    },
  });
}

export async function checkAdminUser(
  client: SupabaseClient<Database>
): Promise<{ user: User | null; isAdmin: boolean }> {
  try {
    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser();

    if (userError || !user) {
      return { user: null, isAdmin: false };
    }

    const { data: adminRecord, error: adminError } = await client
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (adminError || !adminRecord) {
      return { user, isAdmin: false };
    }

    return { user, isAdmin: true };
  } catch {
    return { user: null, isAdmin: false };
  }
}
