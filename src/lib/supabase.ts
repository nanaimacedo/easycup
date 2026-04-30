import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Client-side: usado apenas para operações públicas (inscrição)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Server-side: usado nos API routes com service role (acesso total)
export function getServerSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  return createClient(url, serviceKey);
}

export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co';
}
