"use server";

import { deriveGatePassword } from "@/lib/gate-password";
import { isGateUnlocked, unlockGateSession } from "@/lib/gate-session";

export type GateVerifyResult =
  | { ok: true }
  | { ok: false; error: "invalid" | "locked" };

export async function getGateStatus(): Promise<{ unlocked: boolean }> {
  return { unlocked: await isGateUnlocked() };
}

export async function verifyGatePassword(
  pin: string,
  timeZone: string,
): Promise<GateVerifyResult> {
  const normalized = pin.replace(/\D/g, "");
  if (normalized.length !== 4) {
    return { ok: false, error: "invalid" };
  }

  const trimmedZone = timeZone.trim();
  if (!trimmedZone) {
    return { ok: false, error: "invalid" };
  }

  let expected: string;
  try {
    expected = deriveGatePassword(new Date(), trimmedZone);
  } catch {
    return { ok: false, error: "invalid" };
  }

  if (normalized !== expected) {
    return { ok: false, error: "invalid" };
  }

  await unlockGateSession();
  return { ok: true };
}
