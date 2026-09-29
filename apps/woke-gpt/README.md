# Woke GPT harness (v0)

Local open-source model harness. v0 is the install path, a working Ollama scaffold, and honest usage visuals: tokens, estimated watt-hours, estimated electricity cost, and estimated CO₂e. Cloud API keys are interfaces only.

Figures are **estimates, not meters**. Ranges use a `~`. The formulas, grid table, and citations live in [METHODOLOGY.md](METHODOLOGY.md) (`methodology_version` `2026-09-28.v0`).

License: [MIT](LICENSE).

## Install and run

Requires Node.js 22.6 or newer.

```bash
cd apps/woke-gpt
npm install
npm test
npm run dev
```

Open http://127.0.0.1:4173.

`npm install` is only needed for `npm run typecheck` (TypeScript). `npm test`, `npm run dev`, and `npm run smoke` run on Node’s built-in type stripping and do not need the dev dependencies.

### Local model (optional, recommended)

1. Install [Ollama](https://ollama.com).
2. Pull a small open model: `ollama pull llama3.2`
3. Start it: `ollama serve` (the desktop app does this for you).
4. In the harness, run a prompt. The default model name is `llama3.2`.

The server talks to `http://127.0.0.1:11434` (`OLLAMA_HOST` overrides it). A successful reply includes measured prompt and completion tokens plus generation tokens/sec from Ollama’s `eval_count` and `eval_duration`.

If Ollama is not running, the page still accepts a prompt, labels a rough character-based token count, and leaves watt-hours blank until you enter a measured tokens/sec (and, for GPU profiles, measured watts).

### Checks

```bash
npm test
npm run smoke
npm run typecheck   # after npm install
```

## What you are looking at

- **Tokens** — measured by the local runtime, or a labeled rough estimate (~4 characters per token).
- **Energy** — `tokens × (active watts / tokens per second) / 3600`, as a range. Laptop CPU and Apple Silicon start from the methodology’s example power envelopes. Discrete GPU and small-server profiles stay **TBD** until you enter measured watts. This is not a wall meter.
- **Electricity $** — watt-hours × your $/kWh, or the labeled EIA US residential default of about 17–18¢/kWh.
- **CO₂e** — watt-hours × an annual grid factor. US regions are EPA eGRID2023 total-output CO₂e. The unknown-grid row is the CodeCarbon / OWID world default (475 g/kWh), marked low confidence. Not live Electricity Maps data.
- **Cloud compare** — same token counts. Provider watt-hours stay **null** (energy unknown). The dollar side is a frozen list-price sample, separate from electricity, shown as a band. Local is not always lower.

Change the hardware profile, eGRID subregion, $/kWh, or a measured tokens/sec and the latest reply recalculates. Assumptions stay on the panel. Idle/residency is off unless you opt in, and it is kept separate from the generation estimate.

## v0 scope

In scope:

- This app, the methodology, and the estimator tests
- Ollama as the local open-model runtime
- Usage visuals and the efficiency tips
- Connector **interfaces** for a later API-key path (`src/connectors.ts`, [API_KEY_ESTIMATES_SPEC.md](API_KEY_ESTIMATES_SPEC.md))

Out of scope:

- Live API-key connectors, billing scrapes, and paid cloud inference
- Inventing provider watt-hours (including an unlabeled EcoLogits number)
- Pixel, Label, or trading
- Claiming carbon neutrality, “green AI,” or that local is always greener
- ZIP geocoding and live Electricity Maps (use [EPA Power Profiler](https://www.epa.gov/egrid/power-profiler), then pick the subregion)

## Layout

```
apps/woke-gpt/
├── METHODOLOGY.md              # formulas and sources
├── UI_COPY.md                  # panel strings
├── API_KEY_ESTIMATES_SPEC.md   # later connector contract
├── src/estimate-local.ts       # Wh, $, gCO2e
├── src/estimate-api.ts         # stub cloud estimate
├── src/connectors.ts           # interfaces only
├── src/grids.ts                # eGRID2023
├── src/server.ts               # local HTTP server
└── public/                     # usage UI
```

Panel copy is in [UI_COPY.md](UI_COPY.md). Pack notes are in [PACK_SUMMARY.md](PACK_SUMMARY.md).
