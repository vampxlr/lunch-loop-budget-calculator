import { NextRequest, NextResponse } from "next/server";
import { generateResultsEmail } from "@/lib/email-template";

// Email sending function
async function sendEmail(data: {
  to_email: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; message?: string }> {
  // Check if SMTP is configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    return {
      success: false,
      message: "SMTP not configured (missing environment variables)",
    };
  }

  try {
    // Import nodemailer dynamically to avoid bundling if not needed
    const nodemailer = require("nodemailer");

    // Create transporter
    const smtpSecure = process.env.SMTP_SECURE === "true";
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send email
    await transporter.sendMail({
      from: smtpFrom,
      to: data.to_email,
      subject: data.subject,
      html: data.html,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Email send error:", error);
    return {
      success: false,
      message: error.message || "Failed to send email",
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      submission_id,
      to_email,
      to_phone_optional,
      answers_json,
      computed_costs,
      promo_opt_in,
      free_tasting_interest,
      timestamp,
    } = body;

    // Validate required fields
    if (!submission_id || !to_email || !answers_json || !computed_costs) {
      return NextResponse.json(
        {
          status: "failed",
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Generate email HTML
    const emailHtml = generateResultsEmail({
      answers_json: {
        ...answers_json,
        free_tasting_interest,
        promo_opt_in,
      },
      computed_costs,
    });

    // Send email
    const result = await sendEmail({
      to_email,
      subject: "Your Lunch Loop Office Lunch Estimate",
      html: emailHtml,
    });

    if (!result.success) {
      // Check if it's a config issue vs send failure
      if (result.message?.includes("not configured")) {
        return NextResponse.json({
          status: "skipped",
          message: result.message,
        });
      }

      return NextResponse.json({
        status: "failed",
        message: result.message || "Failed to send email",
      });
    }

    return NextResponse.json({
      status: "sent",
      message: "Email sent successfully",
    });
  } catch (error: any) {
    console.error("Email API error:", error);
    return NextResponse.json(
      {
        status: "failed",
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
