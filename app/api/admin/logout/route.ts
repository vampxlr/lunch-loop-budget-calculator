import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ ok: true, message: "Logged out" });
    response.cookies.delete("admin_auth");
    return response;
  } catch (error) {
    console.error("[ADMIN] Logout error:", error);
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}
