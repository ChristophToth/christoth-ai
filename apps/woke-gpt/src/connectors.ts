/**
 * v0 API-key connector surface.
 *
 * Interfaces and a pure estimator only. This module does not read keys,
 * call providers, or scrape billing. See API_KEY_ESTIMATES_SPEC.md.
 *
 * A later connector should:
 * 1. Keep the key in the harness secret store (never in this file).
 * 2. Map the provider usage object onto ApiEstimateInput.
 * 3. Call estimateApiUsage.
 * 4. Leave estimated_Wh null unless that provider published energy for the call.
 */

import { estimateApiUsage, type ApiEstimateInput, type ApiEstimateOutput } from "./estimate-api.ts";

export {
  API_PROVIDERS,
  DISCLOSURE_FLAGS,
  cloudListPriceBand,
  estimateApiUsage,
} from "./estimate-api.ts";

export type {
  ApiEstimateInput,
  ApiEstimateOutput,
  ApiProvider,
  DisclosureFlag,
} from "./estimate-api.ts";

/** Marker type so a future connector has one place to implement. */
export type ApiConnector = {
  readonly id: string;
  readonly implemented: false;
  estimate(input: ApiEstimateInput): ApiEstimateOutput;
};

export function unimplementedConnector(id: string): ApiConnector {
  return {
    id,
    implemented: false,
    estimate(input) {
      return estimateApiUsage({ ...input, published_energy_wh: null });
    },
  };
}
