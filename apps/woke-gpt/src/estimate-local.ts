import { findHardware, WORKED_EXAMPLE, type PowerBand } from "./hardware.ts";
import { findRegion } from "./grids.ts";
import { formatRange, formatUsdRange } from "./format.ts";
import { METHODOLOGY_VERSION } from "./version.ts";

/**
 * EIA Electric Power Monthly context from methodology §A.2:
 * US residential averages on the order of ~17–18 ¢/kWh.
 * https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_3
 */
export const EIA_RESIDENTIAL_USD_PER_KWH = { low: 0.17, high: 0.18 } as const;

export type NumberRange = { low: number; high: number };

export type ThroughputSource = "runtime_measured" | "user_reported" | "unavailable";

export type TokenSource = "runtime_measured" | "rough_char_estimate" | "user_entered";

export type LocalEstimateInput = {
  promptTokens: number;
  completionTokens: number;
  tokenSource: TokenSource;
  completionTokensPerSec: number | null;
  throughputSource: ThroughputSource;
  hardwareProfileId: string;
  /** User-measured active watts. Overrides the profile envelope when both ends are set. */
  measuredActivePowerW: NumberRange | null;
  regionId: string;
  /** Null uses the labeled EIA residential default band. */
  priceUsdPerKwh: number | null;
  includeIdle: boolean;
  idlePowerW: number | null;
  idleMinutes: number | null;
};

export type LocalEstimate = {
  methodologyVersion: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
    source: TokenSource;
  };
  energyWh: NumberRange | null;
  whPerToken: NumberRange | null;
  energyReason: string | null;
  costUsd: NumberRange | null;
  costReason: string | null;
  gco2e: NumberRange | null;
  gco2eReason: string | null;
  idleWh: number | null;
  sessionEnergyWh: NumberRange | null;
  display: {
    energy: string;
    cost: string;
    gco2e: string;
    idle: string | null;
  };
  assumptions: {
    hardwareProfileId: string;
    hardwareProfileLabel: string;
    powerSource: "user_reported" | "profile_envelope" | "unavailable";
    powerBandW: NumberRange | null;
    powerNote: string;
    throughputSource: ThroughputSource;
    completionTokensPerSec: number | null;
    formula: string;
    regionId: string;
    regionLabel: string;
    regionKind: string;
    intensityGPerKwh: number | null;
    intensitySource: string;
    intensityConfidence: string;
    priceSource: "user_entered" | "default_eia_us_residential" | "unavailable";
    priceUsdPerKwh: NumberRange | null;
    includesIdle: boolean;
    tokenNote: string | null;
    annualFactorNote: string;
  };
};

function scaleRange(range: NumberRange, factor: number): NumberRange {
  const low = range.low * factor;
  const high = range.high * factor;
  return low <= high ? { low, high } : { low: high, high: low };
}

function assertTokens(name: string, value: number): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be an integer ≥ 0`);
  }
}

function resolvePower(
  input: LocalEstimateInput,
  profileBand: PowerBand | null,
): {
  band: NumberRange | null;
  source: "user_reported" | "profile_envelope" | "unavailable";
  note: string;
} {
  const measured = input.measuredActivePowerW;
  if (
    measured &&
    Number.isFinite(measured.low) &&
    Number.isFinite(measured.high) &&
    measured.low > 0 &&
    measured.high > 0
  ) {
    const low = Math.min(measured.low, measured.high);
    const high = Math.max(measured.low, measured.high);
    return {
      band: { low, high },
      source: "user_reported",
      note: "Active power is a range you entered. It is still an estimate unless it came from a meter on this run.",
    };
  }
  if (profileBand) {
    return {
      band: { low: profileBand.lowW, high: profileBand.highW },
      source: "profile_envelope",
      note: profileBand.note,
    };
  }
  return {
    band: null,
    source: "unavailable",
    note: "No calibrated Wh/token and no active-power band for this profile. Enter measured watts and tokens/sec, or pick a profile that has an envelope.",
  };
}

export function estimateLocal(input: LocalEstimateInput): LocalEstimate {
  assertTokens("promptTokens", input.promptTokens);
  assertTokens("completionTokens", input.completionTokens);

  const profile = findHardware(input.hardwareProfileId);
  if (!profile) {
    throw new Error(`Unknown hardware profile: ${input.hardwareProfileId}`);
  }
  const region = findRegion(input.regionId);
  if (!region) {
    throw new Error(`Unknown grid region: ${input.regionId}`);
  }

  const total = input.promptTokens + input.completionTokens;
  const power = resolvePower(input, profile.powerBand);
  const tps = input.completionTokensPerSec;
  const throughputOk =
    typeof tps === "number" && Number.isFinite(tps) && tps > 0 && input.throughputSource !== "unavailable";

  let whPerToken: NumberRange | null = null;
  let energyWh: NumberRange | null = null;
  let energyReason: string | null = null;

  if (total === 0) {
    energyReason = "no_tokens";
  } else if (!throughputOk) {
    energyReason = "hardware_profile_not_calibrated";
  } else if (!power.band) {
    energyReason = "hardware_profile_not_calibrated";
  } else {
    // Energy_Wh ≈ tokens × (P_active_W / tokens_per_sec) / 3600
    whPerToken = scaleRange(power.band, 1 / tps / 3600);
    energyWh = scaleRange(whPerToken, total);
  }

  let priceUsdPerKwh: NumberRange | null = null;
  let priceSource: LocalEstimate["assumptions"]["priceSource"] = "unavailable";
  if (typeof input.priceUsdPerKwh === "number" && Number.isFinite(input.priceUsdPerKwh) && input.priceUsdPerKwh >= 0) {
    priceUsdPerKwh = { low: input.priceUsdPerKwh, high: input.priceUsdPerKwh };
    priceSource = "user_entered";
  } else if (input.priceUsdPerKwh === null) {
    priceUsdPerKwh = { low: EIA_RESIDENTIAL_USD_PER_KWH.low, high: EIA_RESIDENTIAL_USD_PER_KWH.high };
    priceSource = "default_eia_us_residential";
  }

  let costUsd: NumberRange | null = null;
  let costReason: string | null = null;
  if (!energyWh) {
    costReason = energyReason;
  } else if (!priceUsdPerKwh) {
    costReason = "price_missing";
  } else {
    // Cost_$ ≈ Energy_Wh × ($/kWh / 1000). Cross the bands so the range stays honest.
    const candidates = [
      (energyWh.low * priceUsdPerKwh.low) / 1000,
      (energyWh.low * priceUsdPerKwh.high) / 1000,
      (energyWh.high * priceUsdPerKwh.low) / 1000,
      (energyWh.high * priceUsdPerKwh.high) / 1000,
    ];
    costUsd = { low: Math.min(...candidates), high: Math.max(...candidates) };
  }

  let gco2e: NumberRange | null = null;
  let gco2eReason: string | null = null;
  if (!energyWh) {
    gco2eReason = energyReason;
  } else {
    const factor = region.intensityGPerKwh / 1000;
    gco2e = scaleRange(energyWh, factor);
  }

  let idleWh: number | null = null;
  if (input.includeIdle) {
    if (
      typeof input.idlePowerW === "number" &&
      input.idlePowerW >= 0 &&
      typeof input.idleMinutes === "number" &&
      input.idleMinutes >= 0
    ) {
      idleWh = input.idlePowerW * (input.idleMinutes / 60);
    }
  }

  let sessionEnergyWh: NumberRange | null = null;
  if (input.includeIdle && idleWh !== null && energyWh) {
    sessionEnergyWh = { low: energyWh.low + idleWh, high: energyWh.high + idleWh };
  } else if (input.includeIdle && idleWh !== null && !energyWh) {
    sessionEnergyWh = { low: idleWh, high: idleWh };
  }

  const tokenNote =
    input.tokenSource === "rough_char_estimate"
      ? "Token count is a rough estimate (about 4 characters per token), not a model tokenizer."
      : null;

  return {
    methodologyVersion: METHODOLOGY_VERSION,
    tokens: {
      prompt: input.promptTokens,
      completion: input.completionTokens,
      total,
      source: input.tokenSource,
    },
    energyWh,
    whPerToken,
    energyReason,
    costUsd,
    costReason,
    gco2e,
    gco2eReason,
    idleWh,
    sessionEnergyWh,
    display: {
      energy: energyWh ? formatRange(energyWh.low, energyWh.high, "Wh") : "",
      cost: costUsd ? formatUsdRange(costUsd.low, costUsd.high) : "",
      gco2e: gco2e ? formatRange(gco2e.low, gco2e.high, "g CO₂e") : "",
      idle: idleWh === null ? null : formatRange(idleWh, idleWh, "Wh"),
    },
    assumptions: {
      hardwareProfileId: profile.id,
      hardwareProfileLabel: profile.label,
      powerSource: power.source,
      powerBandW: power.band,
      powerNote: power.note,
      throughputSource: throughputOk ? input.throughputSource : "unavailable",
      completionTokensPerSec: throughputOk ? tps : null,
      formula: "Energy_Wh ≈ tokens × (P_active_W / tokens_per_sec) / 3600",
      regionId: region.id,
      regionLabel: region.label,
      regionKind: region.kind,
      intensityGPerKwh: region.intensityGPerKwh,
      intensitySource: region.intensitySource,
      intensityConfidence: region.confidence,
      priceSource,
      priceUsdPerKwh,
      includesIdle: input.includeIdle && idleWh !== null,
      tokenNote,
      annualFactorNote:
        "Using annual grid factors (e.g. EPA eGRID). Not live carbon intensity.",
    },
  };
}

/** Rough token estimate when no tokenizer is available. Labeled, never called measured. */
export function roughTokenCount(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return 0;
  }
  return Math.max(1, Math.ceil(trimmed.length / 4));
}

export function workedExampleEnergyWh(): number {
  const { activeW, tokensPerSec, tokens } = WORKED_EXAMPLE;
  return tokens * (activeW / tokensPerSec) / 3600;
}
