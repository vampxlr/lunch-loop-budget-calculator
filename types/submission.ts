export interface SubmissionAnswers {
  email: string;
  phone?: string;
  company_name?: string;
  employees_count: number;
  days_per_week: number;
  delivery_time: string; // 24h format "HH:MM"
  budget_per_person: number;
  budget_type?: "basic" | "standard" | "premium" | "custom";
  free_tasting_interest: boolean;
  promo_opt_in?: boolean;
  promo_opt_in_email?: boolean;
  promo_opt_in_sms?: boolean;
  [key: string]: any;
}

export interface ComputedCosts {
  cost_per_person: number;
  daily_cost: number;
  weekly_cost: number;
  monthly_cost: number;
  delivery_modifier: number;
}

export interface Submission {
  id: string;
  created_at: string;
  email: string;
  phone?: string;
  company_name?: string;
  answers_json: SubmissionAnswers;
  cost_per_person: number;
  daily_cost: number;
  weekly_cost: number;
  monthly_cost: number;
  free_tasting_interest: boolean;
  promo_opt_in?: boolean;
  promo_opt_in_email?: boolean;
  promo_opt_in_sms?: boolean;
}

export interface Event {
  id: string;
  created_at: string;
  submission_id: string;
  event_type: string;
  source: string;
  status: "success" | "failed" | "skipped";
  message?: string;
  payload_json?: any;
}
