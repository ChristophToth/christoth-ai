import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { unimplementedConnector } from "./connectors.ts";
import { cloudListPriceBand, estimateApiUsage } from "./estimate-api.ts";
import { looksLikeFakeMeter } from "./format.ts";

describe("API connector stub", () => {
  it("leaves cloud watt-hours null when the provider did not publish energy", () => {
    const result = estimateApiUsage({
      provider: "anthropic",
      model_id: "claude-haiku-4-5",
      prompt_tokens: 1_000_000,
      completion_tokens: 1_000_000,
    });
    assert.equal(result.estimated_Wh, null);
    assert.equal(result.estimated_Wh_range, null);
    assert.equal(result.estimated_Wh_reason, "provider_energy_unknown");
    assert.equal(result.estimated_gCO2e, null);
    assert.equal(result.estimated_usd, 6);
    assert.equal(result.estimated_usd_display, "~$6");
    assert.equal(looksLikeFakeMeter(result.estimated_usd_display ?? ""), false);
    assert.ok(result.disclosure_flags.includes("estimate_not_meter"));
    assert.ok(result.disclosure_flags.includes("provider_energy_unknown"));
    assert.ok(result.disclosure_flags.includes("provider_intensity_unknown"));
    assert.ok(result.disclosure_flags.includes("operational_energy_only"));
    assert.equal(result.sources.energy, "unknown");
    assert.equal(result.sources.price, "provider_list");
    assert.equal(result.methodology_version, "2026-09-28.v0");
  });

  it("lets a user price override win and still does not invent watt-hours", () => {
    const result = estimateApiUsage({
      provider: "other",
      model_id: "custom",
      prompt_tokens: 1_000_000,
      completion_tokens: 1_000_000,
      user_price_per_1m: { prompt_usd: 3, completion_usd: 9 },
    });
    assert.equal(result.estimated_Wh, null);
    assert.equal(result.estimated_usd, 12);
    assert.equal(result.sources.price, "user_override");
    assert.ok(result.disclosure_flags.includes("price_user_override"));
  });

  it("keeps cloud watt-hours null even if a caller passes a published figure or the opt-in flag", () => {
    const result = estimateApiUsage({
      provider: "openai",
      model_id: "gpt-4.1-nano",
      prompt_tokens: 1000,
      completion_tokens: 1000,
      region: "CAMX",
      enable_third_party_energy_model: true,
    });
    assert.equal(result.estimated_Wh, null);
    assert.equal(result.estimated_Wh_range, null);
    assert.equal(result.estimated_Wh_reason, "provider_energy_unknown");
    assert.equal(result.estimated_gCO2e, null);
    assert.equal(result.sources.energy, "unknown");
    assert.equal(result.disclosure_flags.includes("third_party_energy_model"), false);
    assert.ok(result.disclosure_flags.includes("provider_energy_unknown"));
  });

  it("omits cloud CO2e when provider intensity is unknown", () => {
    const result = estimateApiUsage({
      provider: "openai",
      model_id: "gpt-4.1",
      prompt_tokens: 10,
      completion_tokens: 10,
    });
    assert.equal(result.estimated_Wh, null);
    assert.equal(result.estimated_gCO2e, null);
    assert.ok(result.disclosure_flags.includes("provider_intensity_unknown"));
  });

  it("reports the list-price sample as a band, not a single average", () => {
    const band = cloudListPriceBand(1_000_000, 1_000_000);
    assert.ok(band);
    assert.equal(band?.lowUsd, 0.5);
    assert.equal(band?.highUsd, 30);
    assert.ok((band?.modelCount ?? 0) >= 2);
  });

  it("forces the unimplemented connector to drop any published energy figure", () => {
    const connector = unimplementedConnector("anthropic");
    assert.equal(connector.implemented, false);
    const result = connector.estimate({
      provider: "anthropic",
      model_id: "claude-opus-5",
      prompt_tokens: 500,
      completion_tokens: 500,
      enable_third_party_energy_model: true,
    });
    assert.equal(result.estimated_Wh, null);
    assert.equal(result.estimated_Wh_reason, "provider_energy_unknown");
  });
});
