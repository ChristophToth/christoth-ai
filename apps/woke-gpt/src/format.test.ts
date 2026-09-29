import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatApprox, formatRange, formatUsdRange, looksLikeFakeMeter, significantDigits } from "./format.ts";

describe("display rounding", () => {
  it("rounds away meter-like precision", () => {
    assert.equal(significantDigits(12.347), "12");
    assert.equal(formatApprox(12.347, "Wh"), "~12 Wh");
    assert.equal(looksLikeFakeMeter("12.347 Wh"), true);
    assert.equal(looksLikeFakeMeter("~12 Wh"), false);
    assert.equal(looksLikeFakeMeter("~1.5–4.5 Wh"), false);
  });

  it("keeps a range when the ends differ at two significant figures", () => {
    assert.equal(formatRange(1.5, 4.5, "Wh"), "~1.5–4.5 Wh");
  });

  it("collapses a range that rounds to the same figure", () => {
    assert.equal(formatRange(1.51, 1.54, "Wh"), "~1.5 Wh");
  });

  it("formats dollars with a tilde and no long fraction", () => {
    assert.equal(formatUsdRange(0.000255, 0.00081), "~$0.00026–$0.00081");
    assert.equal(looksLikeFakeMeter(formatUsdRange(0.000255, 0.00081)), false);
  });

  it("writes tiny ranges as decimals, not scientific notation", () => {
    const display = formatUsdRange(4.25e-7, 0.00000135);
    assert.equal(display.includes("e"), false);
    assert.equal(display, "~$0.00000043–$0.0000014");
  });
});
