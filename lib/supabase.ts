import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getAppConfig, isSupabaseConfigured } from "./config";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (supabaseClient) {
    return supabaseClient;
  }

  try {
    const config = getAppConfig();
    supabaseClient = createClient(
      config.supabase.url!,
      config.supabase.anonKey!
    );
    return supabaseClient;
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return null;
  }
}

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const config = getAppConfig();
    if (!config.supabase.serviceRoleKey) {
      console.warn("Service role key not configured, using anon key");
      return getSupabaseClient();
    }

    return createClient(
      config.supabase.url!,
      config.supabase.serviceRoleKey
    );
  } catch (error) {
    console.error("Failed to create Supabase admin client:", error);
    return null;
  }
}
