import { PricingConfig } from "@/types/schema";
import { SubmissionAnswers, ComputedCosts } from "@/types/submission";

function isTimeBetween(time: string, start: string, end: string): boolean {
  const [timeHour, timeMin] = time.split(":").map(Number);
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  const timeMinutes = timeHour * 60 + timeMin;
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

export function calculateCosts(
  answers: SubmissionAnswers,
  pricingConfig: PricingConfig
): ComputedCosts {
  const { employees_count, days_per_week, delivery_time, budget_per_person } = answers;

  // Calculate delivery modifier
  const isOffPeak = !isTimeBetween(
    delivery_time,
    pricingConfig.peak_start,
    pricingConfig.peak_end
  );
  const delivery_modifier = isOffPeak ? pricingConfig.offpeak_modifier : 0;

  // Calculate costs
  const cost_per_person = budget_per_person + delivery_modifier;
  const daily_cost = cost_per_person * employees_count;
  const weekly_cost = daily_cost * days_per_week;
  const monthly_cost = weekly_cost * 4.33; // Average weeks per month

  return {
    cost_per_person,
    daily_cost,
    weekly_cost,
    monthly_cost,
    delivery_modifier
  };
}
