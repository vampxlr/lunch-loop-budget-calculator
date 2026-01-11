import { getAppConfig } from "./config";
import { Submission } from "@/types/submission";
import { logEvent } from "./storage";

export async function sendWebhook(submission: Submission): Promise<void> {
  const config = getAppConfig();
  const webhookUrl = config.n8n.webhookUrl;

  if (!webhookUrl) {
    await logEvent(
      submission.id,
      "n8n.webhook.sent",
      "webhook",
      "skipped",
      "No webhook URL configured"
    );
    return;
  }

  try {
    const payload = {
      submission_id: submission.id,
      email: submission.email,
      phone: submission.phone,
      company_name: submission.company_name,
      answers_json: submission.answers_json,
      cost_per_person: submission.cost_per_person,
      daily_cost: submission.daily_cost,
      weekly_cost: submission.weekly_cost,
      monthly_cost: submission.monthly_cost,
      free_tasting_interest: submission.free_tasting_interest,
      timestamp: submission.created_at
    };

    const headers: HeadersInit = {
      "Content-Type": "application/json"
    };

    if (config.n8n.sharedSecret) {
      headers["x-shared-secret"] = config.n8n.sharedSecret;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }

    await logEvent(
      submission.id,
      "n8n.webhook.sent",
      "webhook",
      "success",
      "Webhook sent successfully",
      { status: response.status }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await logEvent(
      submission.id,
      "n8n.webhook.sent",
      "webhook",
      "failed",
      message,
      { error: message }
    );
    console.error("Failed to send webhook:", error);
  }
}

export async function resendWebhook(submission: Submission): Promise<void> {
  const config = getAppConfig();
  const webhookUrl = config.n8n.webhookUrl;

  if (!webhookUrl) {
    await logEvent(
      submission.id,
      "n8n.webhook.rerun",
      "dashboard",
      "skipped",
      "No webhook URL configured"
    );
    return;
  }

  try {
    const payload = {
      submission_id: submission.id,
      email: submission.email,
      phone: submission.phone,
      company_name: submission.company_name,
      answers_json: submission.answers_json,
      cost_per_person: submission.cost_per_person,
      daily_cost: submission.daily_cost,
      weekly_cost: submission.weekly_cost,
      monthly_cost: submission.monthly_cost,
      free_tasting_interest: submission.free_tasting_interest,
      timestamp: new Date().toISOString(),
      rerun: true
    };

    const headers: HeadersInit = {
      "Content-Type": "application/json"
    };

    if (config.n8n.sharedSecret) {
      headers["x-shared-secret"] = config.n8n.sharedSecret;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }

    await logEvent(
      submission.id,
      "n8n.webhook.rerun",
      "dashboard",
      "success",
      "Webhook resent successfully",
      { status: response.status }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await logEvent(
      submission.id,
      "n8n.webhook.rerun",
      "dashboard",
      "failed",
      message,
      { error: message }
    );
    throw error;
  }
}
