/**
 * Hardware profiles from METHODOLOGY.md §B.
 * Power bands marked here are EXAMPLE envelopes, not Woke GPT measurements.
 * Wh/token stays uncalibrated until throughput is measured on the machine.
 */

export type PowerBand = {
  lowW: number;
  highW: number;
  /** Shown next to the band so the UI cannot treat it as a meter. */
  note: string;
};

export type HardwareProfile = {
  id: string;
  label: string;
  /** Null when the pack does not give a usable low–high active-power band. */
  powerBand: PowerBand | null;
  calibration: "example_envelope" | "needs_measurement";
};

export const HARDWARE_PROFILES: readonly HardwareProfile[] = [
  {
    id: "laptop_cpu",
    label: "Laptop CPU",
    calibration: "example_envelope",
    powerBand: {
      lowW: 15,
      highW: 45,
      note: "EXAMPLE envelope ~15–45 W package during load (methodology §B). Not a measurement of this machine.",
    },
  },
  {
    id: "apple_silicon",
    label: "Apple Silicon",
    calibration: "example_envelope",
    powerBand: {
      lowW: 8,
      highW: 30,
      note: "EXAMPLE SoC band ~8–30 W under LLM load. The pack marks the top as 30+ W, and wall draw is higher. Not a measurement of this machine.",
    },
  },
  {
    id: "discrete_gpu_consumer",
    label: "Discrete consumer GPU",
    calibration: "needs_measurement",
    powerBand: null,
  },
  {
    id: "small_server",
    label: "Small server",
    calibration: "needs_measurement",
    powerBand: null,
  },
];

export function findHardware(id: string): HardwareProfile | undefined {
  return HARDWARE_PROFILES.find((profile) => profile.id === id);
}

/**
 * Worked example from methodology §B.1.
 * Illustrative only. Do not use as a session meter or as a profile default.
 */
export const WORKED_EXAMPLE = {
  label: "EXAMPLE only — not a meter reading",
  activeW: 250,
  tokensPerSec: 50,
  tokens: 2000,
} as const;
