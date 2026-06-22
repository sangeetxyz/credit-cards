import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const GATE_COOKIE_NAME = "card-vault-gate";
const GATE_MAX_AGE_MS = 10 * 60 * 1000;

function gateSecret(): string {
  return process.env.GATE_SECRET ?? "card-vault-dev-gate-secret";
}

export function createGateToken(): string {
  const payload = String(Date.now());
  const signature = createHmac("sha256", gateSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${signature}`;
}

export function isGateTokenValid(token: string | undefined): boolean {
  if (!token) return false;

  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;

  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const issuedAt = Number(payload);

  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > GATE_MAX_AGE_MS) return false;

  const expected = createHmac("sha256", gateSecret())
    .update(payload)
    .digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

export async function isGateUnlocked(): Promise<boolean> {
  const store = await cookies();
  return isGateTokenValid(store.get(GATE_COOKIE_NAME)?.value);
}

export async function unlockGateSession(): Promise<void> {
  const store = await cookies();
  store.set(GATE_COOKIE_NAME, createGateToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GATE_MAX_AGE_MS / 1000,
  });
}

export async function assertGateUnlocked(): Promise<Response | null> {
  if (await isGateUnlocked()) return null;
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
