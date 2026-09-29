/**
 * Frozen public list-price sample for the cloud dollar band.
 * Not a market average, not an invoice, and not electricity.
 * Prices change. The compare panel labels the snapshot date.
 *
 * OpenAI figures are from OpenAI's own posts (GPT-4.1 family and GPT-4o mini).
 * Anthropic figures are base input / output rates from the Claude API pricing
 * table retrieved 2026-09-29 (cache writes excluded).
 */

export type ListPrice = {
  provider: "openai" | "anthropic";
  modelId: string;
  label: string;
  promptUsdPer1M: number;
  completionUsdPer1M: number;
  sourceUrl: string;
  asOf: string;
};

export const LIST_PRICE_SNAPSHOT: readonly ListPrice[] = [
  {
    provider: "openai",
    modelId: "gpt-4.1-nano",
    label: "OpenAI GPT-4.1 nano",
    promptUsdPer1M: 0.1,
    completionUsdPer1M: 0.4,
    sourceUrl: "https://openai.com/index/gpt-4-1/",
    asOf: "2025-04-14",
  },
  {
    provider: "openai",
    modelId: "gpt-4o-mini",
    label: "OpenAI GPT-4o mini",
    promptUsdPer1M: 0.15,
    completionUsdPer1M: 0.6,
    sourceUrl: "https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/",
    asOf: "2024-07-18",
  },
  {
    provider: "openai",
    modelId: "gpt-4.1",
    label: "OpenAI GPT-4.1",
    promptUsdPer1M: 2,
    completionUsdPer1M: 8,
    sourceUrl: "https://openai.com/index/gpt-4-1/",
    asOf: "2025-04-14",
  },
  {
    provider: "anthropic",
    modelId: "claude-haiku-4-5",
    label: "Anthropic Claude Haiku 4.5",
    promptUsdPer1M: 1,
    completionUsdPer1M: 5,
    sourceUrl: "https://docs.anthropic.com/en/docs/about-claude/pricing",
    asOf: "2026-09-29",
  },
  {
    provider: "anthropic",
    modelId: "claude-sonnet-5",
    label: "Anthropic Claude Sonnet 5",
    promptUsdPer1M: 2,
    completionUsdPer1M: 10,
    sourceUrl: "https://docs.anthropic.com/en/docs/about-claude/pricing",
    asOf: "2026-09-29",
  },
  {
    provider: "anthropic",
    modelId: "claude-opus-5",
    label: "Anthropic Claude Opus 5",
    promptUsdPer1M: 5,
    completionUsdPer1M: 25,
    sourceUrl: "https://docs.anthropic.com/en/docs/about-claude/pricing",
    asOf: "2026-09-29",
  },
];

export const LIST_PRICE_NOTE =
  "Frozen list-price sample, not a market average and not your invoice. Cache, batch, and regional multipliers are excluded.";

export function findListPrice(
  provider: string,
  modelId: string,
): ListPrice | undefined {
  const providerKey = provider.trim().toLowerCase();
  const modelKey = modelId.trim().toLowerCase();
  return LIST_PRICE_SNAPSHOT.find(
    (row) => row.provider === providerKey && row.modelId === modelKey,
  );
}

export function apiCostUsd(
  promptTokens: number,
  completionTokens: number,
  promptUsdPer1M: number,
  completionUsdPer1M: number,
): number {
  return (
    (promptTokens / 1_000_000) * promptUsdPer1M +
    (completionTokens / 1_000_000) * completionUsdPer1M
  );
}
