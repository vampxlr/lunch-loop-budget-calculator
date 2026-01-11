import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Read from server-only environment variables
    const authEnabled = process.env.ADMIN_AUTH_ENABLED === "true";
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";

    // If auth is disabled, still set cookie to allow access
    if (!authEnabled) {
      const response = NextResponse.json({ ok: true, message: "Auth disabled" });
      response.cookies.set("admin_auth", "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
      return response;
    }

    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
      const response = NextResponse.json({ ok: true, message: "Login successful" });
      response.cookies.set("admin_auth", "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
      return response;
    }

    // Invalid credentials
    return NextResponse.json(
      { ok: false, message: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("[ADMIN] Login error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
