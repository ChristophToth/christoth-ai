import { findRegion } from "./grids.ts";
import { apiCostUsd, findListPrice, LIST_PRICE_SNAPSHOT } from "./list-prices.ts";
import { formatUsd } from "./format.ts";
import { METHODOLOGY_VERSION } from "./version.ts";

/**
 * Cloud / API estimate. Spec: API_KEY_ESTIMATES_SPEC.md.
 * No network. No API keys. Wh stays null unless the caller already has a
 * provider-published figure (in-process only; the HTTP stub refuses it).
 */

export const API_PROVIDERS = ["openai", "anthropic", "google", "mistral", "other"] as const;

export type ApiProvider = (typeof API_PROVIDERS)[number];

export const DISCLOSURE_FLAGS = [
  "estimate_not_meter",
  "provider_energy_unknown",
  "provider_intensity_unknown",
  "third_party_energy_model",
  "price_user_override",
  "price_list_assumed",
  "region_fallback",
  "operational_energy_only",
] as const;

export type DisclosureFlag = (typeof DISCLOSURE_FLAGS)[number];

export type ApiEstimateInput = {
  provider: string;
  model_id: string;
  prompt_tokens: number;
  completion_tokens: number;
  region?: string | null;
  user_price_per_1m?: {
    prompt_usd?: number | null;
    completion_usd?: number | null;
  };
  request_id?: string | null;
  locale_grid_hint?: string | null;
  /**
   * Provider-published watt-hours for this request, if a future connector
   * already has that publication. v0 never looks one up.
   */
  published_energy_wh?: number | null;
};

export type ApiEstimateOutput = {
  estimated_Wh: number | null;
  estimated_Wh_range: { low: number; high: number } | null;
  estimated_Wh_reason: string | null;
  estimated_usd: number | null;
  estimated_usd_display: string | null;
  estimated_usd_electricity: number | null;
  estimated_gCO2e: number | null;
  estimated_gCO2e_range: { low: number; high: number } | null;
  disclosure_flags: DisclosureFlag[];
  methodology_version: string;
  sources: {
    energy: "provider_published" | "ecologits_model" | "unknown";
    intensity: string | null;
    price: "user_override" | "provider_list" | "unknown";
  };
};

function assertTokens(name: string, value: number): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be an integer ≥ 0`);
  }
}

function finiteOrNull(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  return value;
}

export function estimateApiUsage(input: ApiEstimateInput): ApiEstimateOutput {
  assertTokens("prompt_tokens", input.prompt_tokens);
  assertTokens("completion_tokens", input.completion_tokens);

  const flags = new Set<DisclosureFlag>(["estimate_not_meter", "operational_energy_only"]);

  const published = finiteOrNull(input.published_energy_wh);
  let estimatedWh: number | null = null;
  let energySource: ApiEstimateOutput["sources"]["energy"] = "unknown";
  let energyReason: string | null = null;

  if (published !== null && published >= 0) {
    estimatedWh = published;
    energySource = "provider_published";
  } else {
    estimatedWh = null;
    energyReason = "provider_energy_unknown";
    flags.add("provider_energy_unknown");
  }

  // v0 does not ship an EcoLogits coefficient table. Range stays null.
  const estimatedWhRange = null;

  const overridePrompt = finiteOrNull(input.user_price_per_1m?.prompt_usd);
  const overrideCompletion = finiteOrNull(input.user_price_per_1m?.completion_usd);
  const list = findListPrice(input.provider, input.model_id);

  let estimatedUsd: number | null = null;
  let priceSource: ApiEstimateOutput["sources"]["price"] = "unknown";

  if (overridePrompt !== null && overrideCompletion !== null && overridePrompt >= 0 && overrideCompletion >= 0) {
    estimatedUsd = apiCostUsd(
      input.prompt_tokens,
      input.completion_tokens,
      overridePrompt,
      overrideCompletion,
    );
    priceSource = "user_override";
    flags.add("price_user_override");
  } else if (list) {
    estimatedUsd = apiCostUsd(
      input.prompt_tokens,
      input.completion_tokens,
      list.promptUsdPer1M,
      list.completionUsdPer1M,
    );
    priceSource = "provider_list";
    flags.add("price_list_assumed");
  }

  const regionId = input.region ?? input.locale_grid_hint ?? null;
  const region = regionId ? findRegion(regionId) : undefined;
  let intensitySource: string | null = null;
  let estimatedGco2e: number | null = null;

  if (!region) {
    flags.add("provider_intensity_unknown");
    if (regionId) {
      flags.add("region_fallback");
    }
  } else {
    intensitySource =
      region.kind === "egrid_subregion" || region.kind === "egrid_us_average"
        ? `egrid_${region.kind === "egrid_us_average" ? "2023_US" : `2023_${region.id}`}`
        : "world_default_475";
    if (input.region == null && input.locale_grid_hint) {
      flags.add("region_fallback");
    }
    if (estimatedWh !== null) {
      estimatedGco2e = (estimatedWh / 1000) * region.intensityGPerKwh;
    }
  }

  return {
    estimated_Wh: estimatedWh,
    estimated_Wh_range: estimatedWhRange,
    estimated_Wh_reason: energyReason,
    estimated_usd: estimatedUsd,
    estimated_usd_display: estimatedUsd === null ? null : formatUsd(estimatedUsd),
    estimated_usd_electricity: null,
    estimated_gCO2e: estimatedGco2e,
    estimated_gCO2e_range: null,
    disclosure_flags: DISCLOSURE_FLAGS.filter((flag) => flags.has(flag)),
    methodology_version: METHODOLOGY_VERSION,
    sources: {
      energy: energySource,
      intensity: intensitySource,
      price: priceSource,
    },
  };
}

export type CloudSampleBand = {
  lowUsd: number;
  highUsd: number;
  modelCount: number;
  note: string;
};

export function cloudListPriceBand(
  promptTokens: number,
  completionTokens: number,
): CloudSampleBand | null {
  const prices = LIST_PRICE_SNAPSHOT.map(
    (row) =>
      estimateApiUsage({
        provider: row.provider,
        model_id: row.modelId,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
      }).estimated_usd,
  ).filter((value): value is number => value !== null);

  if (prices.length === 0) {
    return null;
  }
  return {
    lowUsd: Math.min(...prices),
    highUsd: Math.max(...prices),
    modelCount: prices.length,
    note: "Min–max of the frozen list-price sample for these token counts. Not an average provider and not electricity.",
  };
}
