import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const expected = process.env.DEMO_PASSWORD || "lucid2026";

  if (password !== expected) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const session = await getSession();
  session.authenticated = true;
  session.loginAt = new Date().toISOString();
  await session.save();

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await getSession();
  return NextResponse.json({
    authenticated: !!session.authenticated,
    loginAt: session.loginAt,
  });
}
