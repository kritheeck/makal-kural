import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const hasValidServiceKey = Boolean(
  serviceRoleKey && 
  !serviceRoleKey.includes('your-service-role')
);

// Admin / server client: uses service role key when available to bypass RLS and manage buckets
export const supabaseAdmin = isSupabaseConfigured
  ? createClient(supabaseUrl, hasValidServiceKey ? serviceRoleKey : supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
