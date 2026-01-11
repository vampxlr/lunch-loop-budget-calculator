import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a valid UUID v4
 * This is needed for Supabase compatibility
 */
export function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function formatCurrency(amount: number): string {
  return `৳${amount.toFixed(2)}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Convert 24h time to 12h format with AM/PM
export function time24to12(time24: string): { hour: number; minute: number; period: "AM" | "PM" } {
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const period: "AM" | "PM" = hour >= 12 ? "PM" : "AM";
  
  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour = hour - 12;
  }
  
  return { hour, minute, period };
}

// Convert 12h time to 24h format
export function time12to24(hour: number, minute: number, period: "AM" | "PM"): string {
  let hour24 = hour;
  
  if (period === "AM" && hour === 12) {
    hour24 = 0;
  } else if (period === "PM" && hour !== 12) {
    hour24 = hour + 12;
  }
  
  return `${hour24.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

// Format time for display
export function formatTime(time24: string): string {
  const { hour, minute, period } = time24to12(time24);
  return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
}
