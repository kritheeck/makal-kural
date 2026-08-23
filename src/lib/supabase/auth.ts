import { supabase, isSupabaseConfigured } from './client';
import { UserRole } from '@/types/database';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export async function signUpWithPassword(
  email: string,
  password: string,
  name?: string
): Promise<{ data: AuthUser | null; error: Error | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase is not configured.') };
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) return { data: null, error: error || new Error('Sign up failed') };
  const authUser: AuthUser = {
    id: data.user.id,
    name: name || email.split('@')[0],
    email,
    role: 'USER',
  };
  await supabase.from('profiles').upsert({ id: authUser.id, email, role: 'USER' });
  return { data: authUser, error: null };
}

export async function signInWithPassword(
  email: string,
  password: string
): Promise<{ data: AuthUser | null; error: Error | null }> {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase is not configured.') };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { data: null, error: error || new Error('Login failed') };
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
  const authUser: AuthUser = {
    id: data.user.id,
    name: data.user.email?.split('@')[0] || email.split('@')[0],
    email,
    role: (profile?.role as UserRole) || 'USER',
  };
  return { data: authUser, error: null };
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.auth.signOut();
}
