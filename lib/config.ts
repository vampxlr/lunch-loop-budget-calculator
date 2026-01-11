import { SchemaSource, ConfigSource, PersistenceMode } from "@/types/schema";

export interface AppConfig {
  schemaSource: SchemaSource;
  configSource: ConfigSource;
  persistenceMode: PersistenceMode;
  supabase: {
    url?: string;
    anonKey?: string;
    serviceRoleKey?: string;
  };
  contactPhone: string;
  n8n: {
    webhookUrl?: string;
    sharedSecret?: string;
  };
  admin: {
    authEnabled: boolean;
    username: string;
    password: string;
  };
}

const DUMMY_CONFIG: AppConfig = {
  schemaSource: "file",
  configSource: "dummy",
  persistenceMode: "local",
  supabase: {},
  contactPhone: "+8801700000000",
  n8n: {},
  admin: {
    authEnabled: false,
    username: "admin",
    password: "admin"
  }
};

export function getAppConfig(): AppConfig {
  // Start with dummy config
  const config: AppConfig = { ...DUMMY_CONFIG };

  // Try to read from environment variables
  try {
    // Read NEXT_PUBLIC_ versions first (available on client), fallback to server-only versions
    config.schemaSource = (
      process.env.NEXT_PUBLIC_SCHEMA_SOURCE ?? process.env.SCHEMA_SOURCE
    ) as SchemaSource || "file";
    
    config.configSource = (process.env.CONFIG_SOURCE as ConfigSource) || "dummy";
    
    config.persistenceMode = (
      process.env.NEXT_PUBLIC_PERSISTENCE_MODE ?? process.env.PERSISTENCE_MODE
    ) as PersistenceMode || "local";

    config.supabase.url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    config.supabase.anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    config.supabase.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    config.contactPhone = (process.env.NEXT_PUBLIC_CONTACT_PHONE ?? process.env.CONTACT_PHONE) || "+8801700000000";

    config.n8n.webhookUrl = process.env.N8N_WEBHOOK_URL;
    config.n8n.sharedSecret = process.env.N8N_SHARED_SECRET;

    // Read authEnabled from NEXT_PUBLIC_ first (for consistency between server/client)
    // Keep username/password server-only (never expose to client)
    const adminAuthEnabled = process.env.NEXT_PUBLIC_ADMIN_AUTH_ENABLED ?? process.env.ADMIN_AUTH_ENABLED;
    config.admin.authEnabled = adminAuthEnabled === "true";
    config.admin.username = process.env.ADMIN_USERNAME || "admin";
    config.admin.password = process.env.ADMIN_PASSWORD || "admin";
  } catch (error) {
    console.warn("Error reading environment variables, falling back to dummy config:", error);
  }

  return config;
}

export function isSupabaseConfigured(): boolean {
  const config = getAppConfig();
  return !!(config.supabase.url && config.supabase.anonKey);
}

export function resolveSchemaSource(): SchemaSource {
  const config = getAppConfig();
  
  // If db is configured but Supabase is not available, fall back to file
  if (config.schemaSource === "db" && !isSupabaseConfigured()) {
    console.warn("Schema source set to 'db' but Supabase not configured, falling back to 'file'");
    return "file";
  }
  
  return config.schemaSource;
}

export function resolveConfigSource(): ConfigSource {
  const config = getAppConfig();
  
  // If db is configured but Supabase is not available, fall back to env then dummy
  if (config.configSource === "db" && !isSupabaseConfigured()) {
    console.warn("Config source set to 'db' but Supabase not configured, falling back to 'env'");
    return "env";
  }
  
  return config.configSource;
}

export function resolvePersistenceMode(): PersistenceMode {
  const config = getAppConfig();
  
  // If db is configured but Supabase is not available, fall back to local
  if (config.persistenceMode === "db" && !isSupabaseConfigured()) {
    console.warn("Persistence mode set to 'db' but Supabase not configured, falling back to 'local'");
    return "local";
  }
  
  return config.persistenceMode;
}

export function getContactPhone(): string {
  const config = getAppConfig();
  // TODO: Could also fetch from DB if configSource is "db"
  return config.contactPhone;
}
