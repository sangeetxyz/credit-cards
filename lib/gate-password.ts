/**
 * Gate PIN = each digit of local 12-hour time (HHMM, zero-padded) plus 1 (mod 10).
 *
 * Examples:
 * | Local time | HHMM | PIN  |
 * |------------|------|------|
 * | 1:21 PM    | 0121 | 1232 |
 * | 10:05 AM   | 1005 | 2116 |
 * | 12:00 PM   | 1200 | 2311 |
 * | 9:30 AM    | 0930 | 1041 |
 * | 11:59 PM   | 1159 | 2260 |
 * | 12:59 AM   | 1259 | 2360 |
 */

export function formatGateTimeDigits(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const hour = Number.parseInt(
    parts.find((part) => part.type === "hour")?.value ?? "12",
    10,
  );
  const minute = Number.parseInt(
    parts.find((part) => part.type === "minute")?.value ?? "0",
    10,
  );

  const hourPadded = hour.toString().padStart(2, "0");
  const minutePadded = minute.toString().padStart(2, "0");

  return `${hourPadded}${minutePadded}`;
}

export function deriveGatePassword(date: Date, timeZone: string): string {
  return formatGateTimeDigits(date, timeZone)
    .split("")
    .map((digit) => String((Number.parseInt(digit, 10) + 1) % 10))
    .join("");
}
