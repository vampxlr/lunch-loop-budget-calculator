export type StepType = 
  | "contact" 
  | "employees_count" 
  | "days_per_week" 
  | "delivery_time" 
  | "budget_per_person" 
  | "free_tasting_interest"
  | "promo_offers_opt_in"
  | "contact_to_send_results";

export type FieldType = "text" | "email" | "phone" | "slider" | "chips" | "time" | "preset_budget" | "yes_no" | "checkbox";

export interface StepField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  default?: any;
  options?: Array<{ value: string | number; label: string }>;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface StepConfig {
  id: StepType;
  title: string;
  description?: string;
  enabled: boolean;
  fields: StepField[];
  autoAdvance?: boolean; // Only for single-select steps
}

export interface PricingConfig {
  basic_budget: number;
  standard_budget: number;
  premium_budget: number;
  peak_start: string; // 24h format "HH:MM"
  peak_end: string; // 24h format "HH:MM"
  offpeak_modifier: number;
}

export interface PlannerSchema {
  version: string;
  steps: StepConfig[];
  pricing: PricingConfig;
}

export type SchemaSource = "file" | "db";
export type ConfigSource = "dummy" | "env" | "db";
export type PersistenceMode = "local" | "db";
