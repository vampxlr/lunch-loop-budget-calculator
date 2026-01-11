import { NextRequest, NextResponse } from "next/server";
import { getSubmission } from "@/lib/storage";
import { sendWebhook } from "@/lib/webhook";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submission_id } = body;

    if (!submission_id) {
      return NextResponse.json(
        { status: "error", message: "Missing submission_id" },
        { status: 400 }
      );
    }

    // Get the submission data
    const submission = await getSubmission(submission_id);

    if (!submission) {
      return NextResponse.json(
        { status: "error", message: "Submission not found" },
        { status: 404 }
      );
    }

    // Send the webhook
    await sendWebhook(submission);

    return NextResponse.json({
      status: "sent",
      message: "Webhook sent successfully"
    });
  } catch (error) {
    console.error("Webhook API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Failed to send webhook"
      },
      { status: 500 }
    );
  }
}
