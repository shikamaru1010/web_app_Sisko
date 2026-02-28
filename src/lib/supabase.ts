import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Browser client — uses anon key, for real-time subscriptions on /kuhinja and /porudzbina */
export function createBrowserSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Supabase env vars not configured");
  }
  return createClient(url, anonKey);
}

/** Server client — uses service role key, for API routes (insert, update) */
export function createServerSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase env vars not configured");
  }
  return createClient(url, serviceRoleKey);
}
