import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { estimateLocal, roughTokenCount, workedExampleEnergyWh } from "./estimate-local.ts";
import { findHardware, WORKED_EXAMPLE } from "./hardware.ts";
import { looksLikeFakeMeter } from "./format.ts";

const base = {
  promptTokens: 600,
  completionTokens: 3000,
  tokenSource: "runtime_measured" as const,
  completionTokensPerSec: 10,
  throughputSource: "runtime_measured" as const,
  hardwareProfileId: "laptop_cpu",
  measuredActivePowerW: null,
  regionId: "US",
  priceUsdPerKwh: null,
  includeIdle: false,
  idlePowerW: null,
  idleMinutes: null,
};

describe("local estimate", () => {
  it("returns a watt-hour range from the power envelope and measured tokens/sec", () => {
    const estimate = estimateLocal(base);
    assert.deepEqual(estimate.energyWh, { low: 1.5, high: 4.5 });
    assert.equal(estimate.display.energy, "~1.5–4.5 Wh");
    assert.equal(looksLikeFakeMeter(estimate.display.energy), false);
    assert.equal(estimate.assumptions.powerSource, "profile_envelope");
    assert.equal(estimate.assumptions.intensityGPerKwh, 350);
    assert.equal(estimate.assumptions.priceSource, "default_eia_us_residential");
    assert.ok(estimate.costUsd);
    assert.ok(Math.abs((estimate.costUsd?.low ?? 0) - (1.5 * 0.17) / 1000) < 1e-12);
    assert.ok(Math.abs((estimate.costUsd?.high ?? 0) - (4.5 * 0.18) / 1000) < 1e-12);
    assert.equal(estimate.display.gco2e, "~0.53–1.6 g CO₂e");
  });

  it("hides energy when throughput was not measured and the profile is uncalibrated", () => {
    const estimate = estimateLocal({
      ...base,
      completionTokensPerSec: null,
      throughputSource: "unavailable",
    });
    assert.equal(estimate.energyWh, null);
    assert.equal(estimate.energyReason, "hardware_profile_not_calibrated");
    assert.equal(estimate.gco2e, null);
    assert.equal(estimate.costUsd, null);
  });

  it("does not invent a watt band for an uncalibrated discrete GPU", () => {
    assert.equal(findHardware("discrete_gpu_consumer")?.powerBand, null);
    const estimate = estimateLocal({
      ...base,
      hardwareProfileId: "discrete_gpu_consumer",
    });
    assert.equal(estimate.energyWh, null);
    assert.equal(estimate.energyReason, "hardware_profile_not_calibrated");
  });

  it("uses measured watts when the user supplies them", () => {
    const estimate = estimateLocal({
      ...base,
      hardwareProfileId: "discrete_gpu_consumer",
      measuredActivePowerW: { low: 100, high: 100 },
      completionTokensPerSec: 50,
      promptTokens: 0,
      completionTokens: 2000,
    });
    assert.equal(estimate.assumptions.powerSource, "user_reported");
    assert.ok(estimate.energyWh);
    assert.ok(Math.abs((estimate.energyWh?.low ?? 0) - workedExampleEnergyWh() * (100 / 250)) < 1e-12);
  });

  it("keeps the worked example out of profile defaults", () => {
    assert.equal(workedExampleEnergyWh(), (WORKED_EXAMPLE.tokens * (250 / 50)) / 3600);
    assert.ok(Math.abs(workedExampleEnergyWh() - 2.7777777777777777) < 1e-12);
    assert.notEqual(findHardware("discrete_gpu_consumer")?.powerBand?.lowW, 250);
  });

  it("does not count idle as generation energy in v0", () => {
    assert.equal(roughTokenCount("abcd"), 1);
    const estimate = estimateLocal({
      ...base,
      includeIdle: true,
      idlePowerW: 10,
      idleMinutes: 60,
    });
    assert.equal(estimate.idleWh, null);
    assert.equal(estimate.sessionEnergyWh, null);
    assert.equal(estimate.assumptions.includesIdle, false);
    assert.equal(estimate.assumptions.idlePolicy, "excluded_v0");
    assert.deepEqual(estimate.energyWh, { low: 1.5, high: 4.5 });
    assert.equal(estimate.assumptions.egridYear, 2023);
    assert.equal(estimate.assumptions.intensityCadence, "annual");
    assert.equal(estimate.assumptions.priceEditLabel, "Default ~17–18¢/kWh — edit for your rate");
  });
});
