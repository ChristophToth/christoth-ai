/**
 * Display helpers. Estimates only: a tilde or a range, at most two significant figures.
 * Never emit meter-like strings such as "12.347 Wh".
 */

const TILDE = "~";

function roundToTwoSignificant(abs: number): number {
  const exponent = Math.floor(Math.log10(abs));
  const power = 10 ** (1 - exponent);
  // Values such as 1.5 * 0.35 become 0.5249999999999999. Nudge by a tiny
  // fraction of the last place so the decimal 0.525 still rounds to 0.53.
  return Math.round(abs * power + 1e-8) / power;
}

export function significantDigits(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }
  const negative = value < 0;
  const abs = Math.abs(value);
  if (abs === 0) {
    return "0";
  }
  const rounded = abs >= 10 ? Math.round(abs) : roundToTwoSignificant(abs);
  const body = plainDecimal(rounded);
  return negative ? `-${body}` : body;
}

function plainDecimal(rounded: number): string {
  const text = Number(rounded.toPrecision(12)).toString();
  if (!text.includes("e") && !text.includes("E")) {
    return text;
  }
  const decimals = Math.min(12, 1 - Math.floor(Math.log10(rounded)));
  return rounded.toFixed(decimals).replace(/0+$/, "").replace(/\.$/, "");
}

export function formatApprox(value: number, unit: string): string {
  const number = significantDigits(value);
  return unit.length === 0 ? `${TILDE}${number}` : `${TILDE}${number} ${unit}`;
}

export function formatRange(low: number, high: number, unit: string): string {
  const left = significantDigits(low);
  const right = significantDigits(high);
  if (left === right) {
    return formatApprox(low, unit);
  }
  const suffix = unit.length === 0 ? "" : ` ${unit}`;
  return `${TILDE}${left}–${right}${suffix}`;
}

export function formatUsd(value: number): string {
  return formatApprox(value, "").replace(TILDE, `${TILDE}$`);
}

export function formatUsdRange(low: number, high: number): string {
  const left = significantDigits(low);
  const right = significantDigits(high);
  if (left === right) {
    return `${TILDE}$${left}`;
  }
  return `${TILDE}$${left}–$${right}`;
}

/**
 * Flags meter-like precision on numbers that are at least 1 (for example "12.347").
 * Small values may need several decimal places to hold two significant figures ("0.00026").
 */
export function looksLikeFakeMeter(display: string): boolean {
  const numbers = display.match(/\d+\.\d+/g) ?? [];
  return numbers.some((token) => {
    const value = Number(token);
    const fraction = token.split(".")[1] ?? "";
    if (value >= 10) {
      return true;
    }
    return value >= 1 && fraction.length >= 3;
  });
}

export function sumRanges(ranges: readonly { low: number; high: number }[]): { low: number; high: number } | null {
  if (ranges.length === 0) {
    return null;
  }
  return ranges.reduce(
    (total, range) => ({ low: total.low + range.low, high: total.high + range.high }),
    { low: 0, high: 0 },
  );
}
