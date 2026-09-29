import { LB_PER_MWH_TO_G_PER_KWH } from "./version.ts";

/**
 * EPA eGRID2023 total output CO2e (lb/MWh), annual.
 * Source: eGRID2023 summary tables rev2, Table 1 (produced 2025-03-27).
 * https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.pdf
 * https://www.epa.gov/egrid/summary-data
 *
 * Display intensity is whole g/kWh (methodology §C.1). Do not show the unrounded product.
 */
export const EGRID_YEAR = 2023;

export type GridRegion = {
  id: string;
  label: string;
  kind: "egrid_subregion" | "egrid_us_average" | "world_default";
  /** Total output CO2e, lb/MWh. Null for the non-eGRID world default. */
  lbCo2ePerMwh: number | null;
  /** Whole grams CO2e per kWh after the documented rounding. */
  intensityGPerKwh: number;
  intensitySource: string;
  confidence: "annual_factor" | "low";
};

type EgridRow = {
  id: string;
  label: string;
  lbCo2ePerMwh: number;
  kind: "egrid_subregion" | "egrid_us_average";
};

const EGRID_ROWS: readonly EgridRow[] = [
  { id: "AKGD", label: "ASCC Alaska Grid", lbCo2ePerMwh: 905.1, kind: "egrid_subregion" },
  { id: "AKMS", label: "ASCC Miscellaneous", lbCo2ePerMwh: 522.4, kind: "egrid_subregion" },
  { id: "AZNM", label: "WECC Southwest", lbCo2ePerMwh: 706.2, kind: "egrid_subregion" },
  { id: "CAMX", label: "WECC California", lbCo2ePerMwh: 430.0, kind: "egrid_subregion" },
  { id: "ERCT", label: "ERCOT All", lbCo2ePerMwh: 736.6, kind: "egrid_subregion" },
  { id: "FRCC", label: "FRCC All", lbCo2ePerMwh: 784.8, kind: "egrid_subregion" },
  { id: "HIMS", label: "HICC Miscellaneous", lbCo2ePerMwh: 1133.3, kind: "egrid_subregion" },
  { id: "HIOA", label: "HICC Oahu", lbCo2ePerMwh: 1498.9, kind: "egrid_subregion" },
  { id: "MROE", label: "MRO East", lbCo2ePerMwh: 1405.0, kind: "egrid_subregion" },
  { id: "MROW", label: "MRO West", lbCo2ePerMwh: 926.6, kind: "egrid_subregion" },
  { id: "NEWE", label: "NPCC New England", lbCo2ePerMwh: 543.2, kind: "egrid_subregion" },
  { id: "NWPP", label: "WECC Northwest", lbCo2ePerMwh: 635.3, kind: "egrid_subregion" },
  { id: "NYCW", label: "NPCC NYC/Westchester", lbCo2ePerMwh: 865.7, kind: "egrid_subregion" },
  { id: "NYLI", label: "NPCC Long Island", lbCo2ePerMwh: 1189.3, kind: "egrid_subregion" },
  { id: "NYUP", label: "NPCC Upstate NY", lbCo2ePerMwh: 242.8, kind: "egrid_subregion" },
  { id: "PRMS", label: "Puerto Rico Miscellaneous", lbCo2ePerMwh: 1548.5, kind: "egrid_subregion" },
  { id: "RFCE", label: "RFC East", lbCo2ePerMwh: 599.2, kind: "egrid_subregion" },
  { id: "RFCM", label: "RFC Michigan", lbCo2ePerMwh: 976.0, kind: "egrid_subregion" },
  { id: "RFCW", label: "RFC West", lbCo2ePerMwh: 916.1, kind: "egrid_subregion" },
  { id: "RMPA", label: "WECC Rockies", lbCo2ePerMwh: 1042.5, kind: "egrid_subregion" },
  { id: "SPNO", label: "SPP North", lbCo2ePerMwh: 867.7, kind: "egrid_subregion" },
  { id: "SPSO", label: "SPP South", lbCo2ePerMwh: 875.6, kind: "egrid_subregion" },
  { id: "SRMV", label: "SERC Mississippi Valley", lbCo2ePerMwh: 741.7, kind: "egrid_subregion" },
  { id: "SRMW", label: "SERC Midwest", lbCo2ePerMwh: 1248.6, kind: "egrid_subregion" },
  { id: "SRSO", label: "SERC South", lbCo2ePerMwh: 846.0, kind: "egrid_subregion" },
  { id: "SRTV", label: "SERC Tennessee Valley", lbCo2ePerMwh: 903.3, kind: "egrid_subregion" },
  { id: "SRVC", label: "SERC Virginia/Carolina", lbCo2ePerMwh: 596.3, kind: "egrid_subregion" },
  { id: "US", label: "U.S. average", lbCo2ePerMwh: 770.9, kind: "egrid_us_average" },
];

const EGRID_SOURCE =
  "EPA eGRID2023 total output CO2e, annual (egrid_year: 2023). v0 has no live Electricity Maps intensity.";

export function intensityFromLbPerMwh(lbCo2ePerMwh: number): number {
  return Math.round(lbCo2ePerMwh * LB_PER_MWH_TO_G_PER_KWH);
}

function toRegion(row: EgridRow): GridRegion {
  return {
    id: row.id,
    label: `${row.id} — ${row.label}`,
    kind: row.kind,
    lbCo2ePerMwh: row.lbCo2ePerMwh,
    intensityGPerKwh: intensityFromLbPerMwh(row.lbCo2ePerMwh),
    intensitySource: EGRID_SOURCE,
    confidence: "annual_factor",
  };
}

/**
 * CodeCarbon documents a world default of 475 gCO2eq/kWh when the region is unknown.
 * https://docs.codecarbon.io/latest/explanation/methodology/
 * Low confidence. Not a substitute for an eGRID subregion.
 */
const WORLD_DEFAULT: GridRegion = {
  id: "unknown_world",
  label: "Unknown grid (world default)",
  kind: "world_default",
  lbCo2ePerMwh: null,
  intensityGPerKwh: 475,
  intensitySource:
    "CodeCarbon / Our World in Data annual world default, 475 gCO2eq/kWh, used only when the region is unknown. Not a live Electricity Maps factor.",
  confidence: "low",
};

export const GRID_REGIONS: readonly GridRegion[] = [
  ...EGRID_ROWS.map(toRegion),
  WORLD_DEFAULT,
];

export const DEFAULT_REGION_ID = "US";

export function findRegion(id: string): GridRegion | undefined {
  return GRID_REGIONS.find((region) => region.id === id);
}
