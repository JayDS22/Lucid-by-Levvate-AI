import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  authenticated?: boolean;
  loginAt?: string;
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_PASSWORD ||
    "fallback-dev-password-change-in-production-32chars",
  cookieName: "lucid-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24h
  },
};

export async function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
