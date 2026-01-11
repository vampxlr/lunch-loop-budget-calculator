import { formatCurrency, formatTime } from "./utils";
import { getContactPhone } from "./config";

interface EmailTemplateData {
  answers_json: {
    employees_count: number;
    days_per_week: number;
    delivery_time: string;
    budget_per_person: number;
    free_tasting_interest: boolean;
    promo_opt_in?: boolean;
  };
  computed_costs: {
    cost_per_person: number;
    daily_cost: number;
    weekly_cost: number;
    monthly_cost: number;
    delivery_modifier: number;
  };
}

export function generateResultsEmail(data: EmailTemplateData): string {
  const { answers_json, computed_costs } = data;
  const contactPhone = getContactPhone();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Lunch Loop Estimate</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f7;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .header p {
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #f0f0f0;
    }
    .cost-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }
    .cost-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .cost-label {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .cost-value {
      font-size: 24px;
      font-weight: 700;
      color: #8B5CF6;
    }
    .cost-primary {
      grid-column: span 2;
      background: linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%);
      border-color: #8B5CF6;
    }
    .info-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    .info-item:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 500;
      color: #6b7280;
    }
    .info-value {
      font-weight: 600;
      color: #1a1a1a;
    }
    .highlight-box {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .highlight-box p {
      margin: 0;
      color: #92400e;
      font-size: 14px;
    }
    .success-box {
      background: #d1fae5;
      border-left: 4px solid #10b981;
      padding: 16px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .success-box p {
      margin: 0;
      color: #065f46;
      font-size: 14px;
    }
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-contact {
      font-size: 16px;
      color: #1a1a1a;
      margin-bottom: 12px;
    }
    .footer-contact strong {
      color: #8B5CF6;
    }
    .footer-disclaimer {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 12px;
    }
    @media only screen and (max-width: 600px) {
      .cost-grid {
        grid-template-columns: 1fr;
      }
      .cost-primary {
        grid-column: span 1;
      }
      .info-item {
        flex-direction: column;
        gap: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🍱 Lunch Loop</h1>
      <p>Your Office Lunch Estimate</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Cost Breakdown -->
      <div class="section">
        <h2 class="section-title">Cost Breakdown</h2>
        <div class="cost-grid">
          <div class="cost-card cost-primary">
            <div class="cost-label">Monthly Cost</div>
            <div class="cost-value">${formatCurrency(computed_costs.monthly_cost)}</div>
          </div>
          <div class="cost-card">
            <div class="cost-label">Per Person</div>
            <div class="cost-value">${formatCurrency(computed_costs.cost_per_person)}</div>
          </div>
          <div class="cost-card">
            <div class="cost-label">Daily</div>
            <div class="cost-value">${formatCurrency(computed_costs.daily_cost)}</div>
          </div>
          <div class="cost-card">
            <div class="cost-label">Weekly</div>
            <div class="cost-value">${formatCurrency(computed_costs.weekly_cost)}</div>
          </div>
        </div>
        ${
          computed_costs.delivery_modifier > 0
            ? `<div class="highlight-box">
                <p><strong>Off-Peak Discount Applied:</strong> +${formatCurrency(computed_costs.delivery_modifier)} per person (delivery outside peak hours)</p>
              </div>`
            : ""
        }
      </div>

      <!-- Your Selections -->
      <div class="section">
        <h2 class="section-title">Your Selections</h2>
        <ul class="info-list">
          <li class="info-item">
            <span class="info-label">Number of Employees</span>
            <span class="info-value">${answers_json.employees_count}</span>
          </li>
          <li class="info-item">
            <span class="info-label">Days per Week</span>
            <span class="info-value">${answers_json.days_per_week}</span>
          </li>
          <li class="info-item">
            <span class="info-label">Delivery Time</span>
            <span class="info-value">${formatTime(answers_json.delivery_time)}</span>
          </li>
          <li class="info-item">
            <span class="info-label">Budget per Person</span>
            <span class="info-value">${formatCurrency(answers_json.budget_per_person)}</span>
          </li>
        </ul>
      </div>

      <!-- Additional Info -->
      ${
        answers_json.free_tasting_interest
          ? `<div class="success-box">
              <p><strong>✓ Free Tasting Requested</strong><br>
              You expressed interest in a free tasting lunch. Our team will contact you to arrange this!</p>
            </div>`
          : ""
      }
      ${
        answers_json.promo_opt_in
          ? `<div class="success-box">
              <p><strong>✓ Promotional Offers</strong><br>
              You've opted in to receive exclusive discounts and promotional offers.</p>
            </div>`
          : ""
      }
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-contact">
        <strong>Questions?</strong> Call us at <strong>${contactPhone}</strong>
      </p>
      <p class="footer-disclaimer">
        * Estimates are based on the information you provided and may vary. Final pricing will be confirmed upon order.
      </p>
    </div>
  </div>
</body>
</html>
`;
}
