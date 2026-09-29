import { METHODOLOGY_VERSION } from "./version.ts";

/**
 * Panel strings from UI_COPY.md. Keep these sentences aligned with that file.
 */
export const COPY = {
  methodologyVersion: METHODOLOGY_VERSION,
  banner:
    "Estimates, not meters — approximate energy, cost, and CO₂e. Methodology",
  bannerAria:
    "Energy and cost figures are estimates based on tokens, hardware assumptions, and published grid data. They are not measured from a utility meter.",
  sessionTitle: "This session (estimated)",
  energyLabel: "Energy estimate",
  energyEmpty: "Energy estimate unavailable — hardware profile not calibrated",
  energySubtext:
    "Based on ~{tokens} tokens × Wh/token for {hardware_profile_label}",
  electricityLabel: "Electricity cost estimate",
  electricityMissing: "Add your $/kWh for a cost estimate",
  electricitySubtext: "At {price_cents}/kWh ({price_source_label})",
  apiCostLabel: "API cost estimate",
  apiCostSubtext: "From token usage × $/1M rates — not electricity",
  apiCostNote: "Shown separately from local electricity cost",
  co2Label: "CO₂e estimate",
  co2Subtext:
    "Grid: {region_label} · {intensity_g_per_kwh} g/kWh ({intensity_source})",
  co2MissingRegion: "Pick your grid region for a CO₂e estimate",
  compareSection: "Same workload — local vs cloud",
  compareCloudUnknown:
    "Cloud ({provider}/{model}): energy unknown from provider · showing range / model estimate if available",
  compareIntensityUnknown:
    "Provider grid intensity unknown — CO₂e shown as a range or omitted",
  compareFooter:
    "Local isn’t always lower. Dirty local grid + hungry hardware can beat a clean, efficient cloud run — and the reverse.",
  compareCta: "Compare uses the same token counts on both sides.",
  methodologyLink: "Methodology",
  tooltip:
    "Tokens × estimated Wh/token for your hardware, then grid intensity and $/kWh (or API prices). Open methodology for sources and formulas.",
  footerChip: `methodology ${METHODOLOGY_VERSION}`,
  hardwareHelp: "Your machine (affects Wh/token)",
  regionHelp: "Where your power comes from (US: eGRID subregion)",
  priceHelp: "Your utility rate (optional)",
  noTokens: "Run a prompt to see usage estimates.",
  profileTbd:
    "This hardware profile needs a measured Wh/token — showing range only / hidden until calibrated.",
  cloudEnergyNull:
    "Provider doesn’t publish energy for this model. We won’t invent a precise Wh.",
  offlineIntensity:
    "Using annual grid factors (e.g. EPA eGRID). Not live carbon intensity.",
  staleMethodology: `Estimates use methodology ${METHODOLOGY_VERSION}.`,
  tips: [
    {
      title: "Use a smaller model when it’s good enough",
      body: "Fewer parameters and lighter runtimes usually mean less energy per reply. Try the smallest local model that still does the job.",
    },
    {
      title: "Cut tokens you don’t need",
      body: "Shorter prompts and shorter max replies reduce work. Drop boilerplate, repeated paste, and “just in case” context.",
    },
    {
      title: "Watch context bloat",
      body: "Long chat history and huge pasted docs get re-processed. Summarize or start a fresh thread when the thread gets fat.",
    },
    {
      title: "Quantize for local runs",
      body: "Lower-bit weights (when quality holds) often raise tokens/sec at similar or lower power — better Wh/token on the same box.",
    },
    {
      title: "Batch when you’re offline-processing",
      body: "One batched job on a GPU is usually more efficient than many tiny one-off calls with the model thrashing cold.",
    },
    {
      title: "Match place to hardware",
      body: "Clean local grid + efficient laptop/Apple Silicon → local can look good. Hot discrete GPU on a carbon-heavy grid, or a box left loaded 24/7 for rare chats → cloud (or sleep/unload) may win. Compare; don’t assume.",
    },
    {
      title: "Unload when idle",
      body: "A model sitting in VRAM still draws power. Quit or unload between sessions if you’re not chatting continuously.",
    },
    {
      title: "Prefer task-specific tools over a giant general model",
      body: "Classification/summarize-with-a-small-model often beats asking a large general LLM the same narrow question (see inference-energy literature in Methodology).",
    },
  ],
} as const;

export const BANNED_PHRASES = [
  "carbon neutral",
  "green ai",
  "zero impact",
  "planet-friendly",
  "always greener",
  "carbon free",
  "carbon-free",
] as const;
