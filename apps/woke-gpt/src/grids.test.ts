import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { findRegion, intensityFromLbPerMwh } from "./grids.ts";

describe("eGRID intensity", () => {
  it("rounds the US average 770.9 lb/MWh to ~350 g/kWh", () => {
    assert.equal(intensityFromLbPerMwh(770.9), 350);
    assert.equal(findRegion("US")?.intensityGPerKwh, 350);
  });

  it("rounds NYUP and a coal-heavy subregion to whole grams", () => {
    assert.equal(findRegion("NYUP")?.intensityGPerKwh, 110);
    assert.equal(findRegion("SRMW")?.intensityGPerKwh, 566);
    assert.equal(findRegion("CAMX")?.intensityGPerKwh, 195);
  });
});
