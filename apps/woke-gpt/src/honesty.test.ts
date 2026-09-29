import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

import { BANNED_PHRASES, COPY } from "./copy.ts";

describe("disclosure copy", () => {
  it("ships the pack strings and refuses greenwashing phrases", () => {
    const blob = [
      COPY.banner,
      COPY.bannerAria,
      COPY.compareFooter,
      COPY.cloudEnergyNull,
      COPY.energyEmpty,
      ...COPY.tips.map((tip) => `${tip.title} ${tip.body}`),
    ]
      .join("\n")
      .toLowerCase();

    assert.match(COPY.compareFooter, /isn’t always lower/);
    assert.equal(COPY.tips.length, 8);
    for (const phrase of BANNED_PHRASES) {
      assert.equal(blob.includes(phrase), false, phrase);
    }
  });

  it("puts the same strings on the usage page", async () => {
    const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
    const required = [
      COPY.bannerAria,
      "Estimates, not meters — approximate energy, cost, and CO₂e.",
      COPY.sessionTitle,
      COPY.energyLabel,
      COPY.energyEmpty,
      COPY.electricityLabel,
      COPY.apiCostLabel,
      COPY.apiCostNote,
      COPY.co2Label,
      COPY.compareSection,
      COPY.compareFooter,
      COPY.compareCta,
      COPY.cloudEnergyNull,
      COPY.offlineIntensity,
      COPY.profileTbd,
      COPY.noTokens,
      COPY.footerChip,
      COPY.hardwareHelp,
      COPY.regionHelp,
      COPY.priceHelp,
      ...COPY.tips.map((tip) => tip.title),
    ];
    for (const snippet of required) {
      assert.equal(html.includes(snippet), true, snippet);
    }
    const lowered = html.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      assert.equal(lowered.includes(phrase), false, phrase);
    }
  });
});
