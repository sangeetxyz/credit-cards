import { randomBytes } from "node:crypto";

export function createRandomColorSeed(): string {
  return randomBytes(32).toString("hex");
}
