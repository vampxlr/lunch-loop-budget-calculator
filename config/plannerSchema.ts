import { PlannerSchema } from "@/types/schema";

export const defaultPlannerSchema: PlannerSchema = {
  version: "1.0.0",
  steps: [
    {
      id: "employees_count",
      title: "Team Size",
      description: "How many employees will be ordering lunch?",
      enabled: true,
      fields: [
        {
          name: "employees_count",
          label: "Number of Employees",
          type: "slider",
          required: true,
          min: 5,
          max: 500,
          step: 1,
          default: 30
        }
      ],
      autoAdvance: false
    },
    {
      id: "days_per_week",
      title: "Frequency",
      description: "How many days per week do you need lunch?",
      enabled: true,
      fields: [
        {
          name: "days_per_week",
          label: "Days per Week",
          type: "chips",
          required: true,
          default: 5,
          options: [
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
            { value: 6, label: "6" },
            { value: 7, label: "7" }
          ]
        }
      ],
      autoAdvance: true
    },
    {
      id: "delivery_time",
      title: "Delivery Time",
      description: "When would you like lunch delivered?",
      enabled: true,
      fields: [
        {
          name: "delivery_time",
          label: "Preferred Time",
          type: "time",
          required: true,
          default: "12:30" // 24h format, will be shown as 12:30 PM
        }
      ],
      autoAdvance: false
    },
    {
      id: "budget_per_person",
      title: "Budget per Person",
      description: "Choose a plan or set a custom budget",
      enabled: true,
      fields: [
        {
          name: "budget_per_person",
          label: "Budget",
          type: "preset_budget",
          required: true,
          default: 280,
          options: [
            { value: 220, label: "Basic" },
            { value: 280, label: "Standard" },
            { value: 350, label: "Premium" }
          ]
        }
      ],
      autoAdvance: true
    },
    {
      id: "free_tasting_interest",
      title: "Free Tasting",
      description: "Would you be interested in a free tasting session?",
      enabled: true,
      fields: [
        {
          name: "free_tasting_interest",
          label: "Interest in Free Tasting",
          type: "yes_no",
          required: true,
          default: false
        }
      ],
      autoAdvance: true
    },
    {
      id: "promo_offers_opt_in",
      title: "Special Offers",
      description: "Do you want discounts and promotional offers?",
      enabled: true,
      fields: [
        {
          name: "promo_opt_in",
          label: "Do you want discounts and promotional offers?",
          type: "yes_no",
          required: true,
          default: false
        }
      ],
      autoAdvance: true
    },
    {
      id: "contact_to_send_results",
      title: "Send Your Results",
      description: "Enter your email and we'll send the full estimate to you instantly",
      enabled: true,
      fields: [
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
          placeholder: "your.email@company.com",
          validation: {
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            message: "Please enter a valid email address"
          }
        },
        {
          name: "phone",
          label: "Phone Number (Optional)",
          type: "phone",
          required: false,
          placeholder: "+880 1700-000000"
        }
      ],
      autoAdvance: false
    }
  ],
  pricing: {
    basic_budget: 220,
    standard_budget: 280,
    premium_budget: 350,
    peak_start: "11:00",
    peak_end: "13:30",
    offpeak_modifier: 10
  }
};
