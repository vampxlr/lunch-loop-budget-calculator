import { PlannerSchema } from "@/types/schema";
import { Submission, Event, SubmissionAnswers } from "@/types/submission";
import { defaultPlannerSchema } from "@/config/plannerSchema";
import { getSupabaseClient, getSupabaseAdminClient } from "./supabase";
import { resolveSchemaSource, resolvePersistenceMode } from "./config";
import { generateId } from "./utils";

// Schema storage
export async function loadSchema(): Promise<PlannerSchema> {
  const source = resolveSchemaSource();

  if (source === "db") {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const { data, error } = await supabase
        .from("planner_schema")
        .select("schema_json")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      if (data?.schema_json) {
        return data.schema_json as PlannerSchema;
      }
    } catch (error) {
      console.error("Failed to load schema from DB, falling back to file:", error);
    }
  }

  // Fall back to file (with localStorage overrides)
  if (typeof window !== "undefined") {
    const override = localStorage.getItem("planner_schema_override");
    if (override) {
      try {
        return JSON.parse(override) as PlannerSchema;
      } catch (error) {
        console.error("Failed to parse localStorage schema override:", error);
      }
    }
  }

  return defaultPlannerSchema;
}

export async function saveSchema(schema: PlannerSchema): Promise<void> {
  const source = resolveSchemaSource();

  if (source === "db") {
    try {
      const supabase = getSupabaseAdminClient();
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const { error } = await supabase
        .from("planner_schema")
        .insert({
          schema_json: schema
        });

      if (error) throw error;
      return;
    } catch (error) {
      console.error("Failed to save schema to DB, falling back to localStorage:", error);
    }
  }

  // Fall back to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("planner_schema_override", JSON.stringify(schema));
  }
}

// Submission storage
export async function saveSubmission(
  answers: SubmissionAnswers,
  costs: { cost_per_person: number; daily_cost: number; weekly_cost: number; monthly_cost: number }
): Promise<string> {
  const mode = resolvePersistenceMode();
  const id = generateId();

  console.log(`[SUBMISSION] Creating new submission: ${id}, mode: ${mode}, email: ${answers.email}`);

  const submission: Submission = {
    id,
    created_at: new Date().toISOString(),
    email: answers.email,
    phone: answers.phone,
    company_name: answers.company_name,
    answers_json: answers,
    cost_per_person: costs.cost_per_person,
    daily_cost: costs.daily_cost,
    weekly_cost: costs.weekly_cost,
    monthly_cost: costs.monthly_cost,
    free_tasting_interest: answers.free_tasting_interest,
    promo_opt_in: answers.promo_opt_in
  };

  if (mode === "db") {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      console.log(`[SUBMISSION] Saving to Supabase:`, { id, email: submission.email, phone: submission.phone });
      const { error } = await supabase
        .from("submissions")
        .insert(submission);

      if (error) {
        console.error(`[SUBMISSION] Database insert error:`, {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw error;
      }
      
      console.log(`[SUBMISSION] Successfully saved to DB: ${id}`);
      return id;
    } catch (error) {
      console.error("Failed to save submission to DB, falling back to localStorage:", error);
    }
  }

  // Fall back to localStorage
  console.log(`[SUBMISSION] Falling back to localStorage for ID: ${id}`);
  if (typeof window !== "undefined") {
    const submissions = getLocalSubmissions();
    submissions.push(submission);
    localStorage.setItem("submissions", JSON.stringify(submissions));
    console.log(`[SUBMISSION] Saved to localStorage, total submissions: ${submissions.length}`);
  }

  return id;
}

export async function getSubmission(id: string, retries = 3): Promise<Submission | null> {
  const mode = resolvePersistenceMode();
  
  console.log(`[SUBMISSION] Getting submission: ${id}, mode: ${mode}, retries left: ${retries}`);

  if (mode === "db") {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      console.log(`[SUBMISSION] Querying Supabase for submission: ${id}`);
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(`[SUBMISSION] Database error for ID ${id}:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // If row not found and we have retries left, wait and retry
        if (error.code === 'PGRST116' && retries > 0) {
          const waitTime = 1000; // Wait 1 second before retry
          console.log(`[SUBMISSION] Submission not found yet, retrying in ${waitTime}ms... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return getSubmission(id, retries - 1);
        }
        
        throw error;
      }
      
      console.log(`[SUBMISSION] Successfully retrieved from DB:`, { id, email: data?.email });
      return data as Submission;
    } catch (error) {
      console.error("Failed to get submission from DB, falling back to localStorage:", error);
    }
  }

  // Fall back to localStorage
  if (typeof window !== "undefined") {
    console.log(`[SUBMISSION] Falling back to localStorage, searching for ID: ${id}`);
    const submissions = getLocalSubmissions();
    const found = submissions.find(s => s.id === id);
    console.log(`[SUBMISSION] localStorage search result:`, { found: !!found, totalSubmissions: submissions.length });
    return found || null;
  }

  return null;
}

export async function getAllSubmissions(): Promise<Submission[]> {
  const mode = resolvePersistenceMode();

  if (mode === "db") {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as Submission[]) || [];
    } catch (error) {
      console.error("Failed to get submissions from DB, falling back to localStorage:", error);
    }
  }

  // Fall back to localStorage
  return getLocalSubmissions();
}

export async function updateSubmission(id: string, updates: Partial<Submission>): Promise<void> {
  const mode = resolvePersistenceMode();

  if (mode === "db") {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const { error } = await supabase
        .from("submissions")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      return;
    } catch (error) {
      console.error("Failed to update submission in DB, falling back to localStorage:", error);
    }
  }

  // Fall back to localStorage
  if (typeof window !== "undefined") {
    const submissions = getLocalSubmissions();
    const index = submissions.findIndex(s => s.id === id);
    if (index !== -1) {
      submissions[index] = { ...submissions[index], ...updates };
      localStorage.setItem("submissions", JSON.stringify(submissions));
    }
  }
}

function getLocalSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem("submissions");
    if (!stored) return [];
    
    const submissions = JSON.parse(stored) as Submission[];
    
    // Filter out submissions with invalid UUID format (old IDs like "1768147959639-ukwr1j56z")
    const validSubmissions = submissions.filter(sub => {
      // Valid UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(sub.id)) {
        console.warn(`[SUBMISSION] Filtering out invalid ID format from localStorage: ${sub.id}`);
        return false;
      }
      return true;
    });
    
    // If we filtered any out, save the cleaned list
    if (validSubmissions.length < submissions.length) {
      console.log(`[SUBMISSION] Cleaned localStorage: removed ${submissions.length - validSubmissions.length} invalid submissions`);
      localStorage.setItem("submissions", JSON.stringify(validSubmissions));
    }
    
    return validSubmissions;
  } catch (error) {
    console.error("Failed to parse localStorage submissions:", error);
    return [];
  }
}

// Event logging
export async function logEvent(
  submissionId: string,
  eventType: string,
  source: string,
  status: "success" | "failed" | "skipped",
  message?: string,
  payload?: any
): Promise<void> {
  const mode = resolvePersistenceMode();
  const event: Event = {
    id: generateId(),
    created_at: new Date().toISOString(),
    submission_id: submissionId,
    event_type: eventType,
    source,
    status,
    message,
    payload_json: payload
  };

  if (mode === "db") {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const { error } = await supabase
        .from("events")
        .insert(event);

      if (error) throw error;
      return;
    } catch (error) {
      console.error("Failed to log event to DB, falling back to localStorage:", error);
    }
  }

  // Fall back to localStorage
  if (typeof window !== "undefined") {
    const events = getLocalEvents();
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));
  }
}

export async function getEventsForSubmission(submissionId: string): Promise<Event[]> {
  const mode = resolvePersistenceMode();

  if (mode === "db") {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error("Supabase not configured");
      }

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("submission_id", submissionId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as Event[]) || [];
    } catch (error) {
      console.error("Failed to get events from DB, falling back to localStorage:", error);
    }
  }

  // Fall back to localStorage
  const events = getLocalEvents();
  return events.filter(e => e.submission_id === submissionId);
}

function getLocalEvents(): Event[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem("events");
    if (!stored) return [];
    
    const events = JSON.parse(stored) as Event[];
    
    // Filter out events with invalid submission_id format
    const validEvents = events.filter(event => {
      // Valid UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (event.submission_id && !uuidRegex.test(event.submission_id)) {
        console.warn(`[SUBMISSION] Filtering out event with invalid submission_id: ${event.submission_id}`);
        return false;
      }
      return true;
    });
    
    // If we filtered any out, save the cleaned list
    if (validEvents.length < events.length) {
      console.log(`[SUBMISSION] Cleaned events: removed ${events.length - validEvents.length} invalid events`);
      localStorage.setItem("events", JSON.stringify(validEvents));
    }
    
    return validEvents;
  } catch (error) {
    console.error("Failed to parse localStorage events:", error);
    return [];
  }
}
