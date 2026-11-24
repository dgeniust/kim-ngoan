import { SignJWT, jwtVerify } from "jose";
import { authEnv } from "@/lib/env";

export const SESSION_COOKIE = "kn_session";
export type Role = "ADMIN" | "EDITOR" | "USER";
export type Session = { sub: string; role: Role };

function secret() {
  return new TextEncoder().encode(authEnv().AUTH_SECRET);
}

export async function signSession(session: Session) {
  return new SignJWT({ role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifySession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || typeof payload.role !== "string") return null;
    return { sub: payload.sub, role: payload.role as Role };
  } catch {
    return null;
  }
}
