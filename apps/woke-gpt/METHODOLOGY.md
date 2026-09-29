# Woke GPT Energy & Cost Methodology (v0)

**methodology_version:** `2026-09-28.v0`  
**status:** estimates, not meters  
**audience:** staff engineers shipping the harness + usage visuals  
**product framing:** sell = local OSS harness + honest energy/cost visuals + tips; optional API-key connectors later
**repo path:** `apps/woke-gpt/METHODOLOGY.md`

This document defines how Woke GPT turns **token counts + hardware profile + grid region** into **estimated Wh, $, and gCO2e**. Every number is an **estimate with disclosed assumptions**. We never invent meter-like precision.

**Harness wiring (paths in this app):**

| Piece | Path |
|-------|------|
| Local formulas | `src/estimate-local.ts` |
| API-key connector stub (no live keys) | `src/estimate-api.ts`, `src/connectors.ts` |
| Connector contract | `API_KEY_ESTIMATES_SPEC.md` |
| Panel strings and tips | `UI_COPY.md`, `src/copy.ts` |
| eGRID2023 subregion table | `src/grids.ts` |
| Usage UI | `public/index.html` (links here as `/methodology`) |

---

## A. Core formulas (estimates)

### A.1 Energy (local inference)

```text
Energy_Wh ≈ tokens × Wh_per_token(hardware_profile)
```

Equivalent form (often clearer for implementers):

```text
Energy_J  ≈ tokens × (P_active_W / tokens_per_sec)     # joules ≈ watts × seconds
Energy_Wh ≈ Energy_J / 3600
```

| Term | Meaning | Label |
|------|---------|-------|
| `tokens` | Prompt + completion tokens for the session (or request) | **Measured** by the harness tokenizer / provider usage object |
| `Wh_per_token(hardware_profile)` | Estimated watt-hours per token for a named hardware profile | **Estimate / assumption** — range, not a point meter |
| `P_active_W` | Incremental power draw attributable to inference (active − idle), or total active if idle unknown | **Estimate** — see §B idle caveats |
| `tokens_per_sec` | Sustained generation throughput for that profile/model | **Estimate or measured** on the user’s machine |

**Uncertainty rule:** Prefer reporting `Energy_Wh` as a **range** (`low`–`high`) or with a `~` prefix. Do not display more significant digits than the weaker of: hardware factor uncertainty or grid intensity precision.

### A.2 Cost

**Local electricity cost (always available when energy is estimated):**

```text
Cost_$ ≈ Energy_Wh × (grid_kWh_price_USD / 1000)
```

| Term | Meaning | Label |
|------|---------|-------|
| `grid_kWh_price_USD` | User-entered rate, or regional default from EIA / utility | **Assumption** if defaulted |

**EXAMPLE default (US residential, not a meter):**  
US residential averages have been on the order of **~17–18 ¢/kWh** in recent EIA Electric Power Monthly tables ([EIA Electric Power Monthly Table 5.3](https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_3); [EIA prices explained](https://www.eia.gov/energyexplained/electricity/prices-and-factors-affecting-prices.php)). Prefer **user-entered $/kWh**. Mark any default as `price_source: default_eia_us_residential` and show `~`.

**Cloud / API dollar cost (separate ledger — do not mix into Wh×price without labeling):**

```text
API_Cost_$ ≈ (prompt_tokens / 1e6) × $/1M_prompt
           + (completion_tokens / 1e6) × $/1M_completion
```

Use provider-published list prices **or** user-reported `$/1M` overrides. Label as **API bill estimate**, not electricity.

### A.3 Session CO2e

```text
gCO2e ≈ Energy_kWh × intensity_gCO2e_per_kWh
      = (Energy_Wh / 1000) × intensity_gCO2e_per_kWh
```

| Term | Meaning | Label |
|------|---------|-------|
| `intensity_gCO2e_per_kWh` | Grid carbon intensity for the chosen region | **External dataset** — cite EPA eGRID or Electricity Maps–class source (§C) |

---

## B. Hardware factors (local inference profiles)

Wh_per_token is **derived**, not invented as fake precision:

```text
Wh_per_token ≈ (P_active_W / tokens_per_sec) / 3600
```

Prefer **measured** `(P_active_W, tokens_per_sec)` on the user’s device when available (RAPL / `nvidia-smi` / macOS `powermetrics` / wall meter). Fall back to **profile ranges** below.

### B.1 Profile table (ranges — illustrative until calibrated)

> **Honesty:** Cells marked **EXAMPLE** are order-of-magnitude starting points for UI scaffolding, derived from published TDP/power envelopes and literature throughput bands — **not** Woke GPT measurements. Prefer replacing with on-device measurement. Cells marked **TBD** must not be shown as precise defaults until measured.

| Profile ID | Typical hardware | Active power band (W) | Throughput band (tok/s) | Implied Wh/token band | Status |
|------------|------------------|----------------------|-------------------------|-----------------------|--------|
| `laptop_cpu` | Modern laptop CPU-only (no discrete GPU) | ~15–45 W package during load | highly model-dependent | **TBD — needs measurement** | Derive from RAPL/TDP × measured tok/s |
| `apple_silicon` | Apple Silicon unified memory (M-series) | SoC often ~8–30+ W under LLM load (wall higher) | model/quant dependent | **TBD — needs measurement**; literature discusses J/token on Apple Silicon — see [ML.ENERGY Mac profiling](https://ml.energy/blog/energy/measurement/profiling-llm-energy-consumption-on-macs/), [GreenBench arXiv](https://arxiv.org/abs/2608.28667) | Prefer wall or `powermetrics` |
| `discrete_gpu_consumer` | e.g. GeForce RTX 40-class | Board TDP up to **450 W** for RTX 4090 ([NVIDIA GeForce RTX 4090](https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/)); inference often below TDP | model/quant/batch dependent | **TBD — needs measurement** using `(active_W / tok/s)/3600` | Use `nvidia-smi` power + tok/s |
| `small_server` | 1–2× datacenter/consumer GPUs in a tower/1U | GPU TDP × count + CPU/RAM; PUE≈1 for on-prem (no DC overhead) unless user overrides | batching can dominate | **TBD — needs measurement** | Disclose if PUE applied |

**Worked EXAMPLE (clearly illustrative — do not ship as a meter reading):**

Assume discrete GPU at **~250 W** incremental draw and **~50 tok/s** sustained:

```text
Wh_per_token ≈ (250 / 50) / 3600 ≈ 0.0014 Wh/token
→ 2,000 tokens ≈ ~2.8 Wh   (EXAMPLE only)
```

### B.2 How to calibrate Wh_per_token

1. Measure wall or component power during a representative generation run (`P_run`).
2. Measure idle/baseline with the model loaded but not generating (`P_idle`) when possible.
3. Prefer `P_active = P_run − P_idle` for **incremental** session energy; if idle unknown, use `P_run` and disclose `includes_idle_share: true`.
4. Divide by measured `tokens_per_sec` (completion tokens / wall generation seconds).
5. Store `Wh_per_token_low/mid/high` from repeated runs or ± uncertainty band (e.g. ±30–50% if only TDP-based).

### B.3 Idle vs active caveats (must disclose in UI)

- Keeping a large model **resident in VRAM/RAM** draws power even with zero queries. Luccioni et al. (BLOOM API deployment) observed a large share of instance energy with near-zero requests ([JMLR BLOOM carbon footprint](https://www.jmlr.org/papers/volume24/23-0069/23-0069.pdf); related arXiv [2211.02001](https://arxiv.org/abs/2211.02001)).
- Session estimates that only multiply tokens × Wh/token **under-count** always-on residency. Optional UI: show “generation estimate” vs “session including idle.”
- CodeCarbon documents machine vs process attribution and RAPL/`powermetrics`/`nvidia-ml` paths ([CodeCarbon methodology](https://docs.codecarbon.io/latest/explanation/methodology/)).

### B.4 Literature anchors (cite; do not over-fit)

| Source | What it measured | Use in Woke GPT |
|--------|------------------|-----------------|
| Luccioni, Jernite, Strubell — *Power Hungry Processing* (FAccT 2024) | Energy per **1,000 inferences** across tasks on A100; text generation mean ~**0.047 kWh / 1k queries**; BLOOMz-7B ~**1.0×10⁻⁴ kWh/query** | Shows **orders-of-magnitude** task/model variance; **not** a local laptop Wh/token table. [arXiv:2311.16863](https://arxiv.org/abs/2311.16863) · [ACM](https://dl.acm.org/doi/10.1145/3630106.3658542) |
| EcoLogits (JOSS 2025) | Bottom-up cloud LLM inference energy (GPU + server × PUE); Wh/output-token regression on ML.ENERGY H100 data | Prefer for **cloud/API overlays** when provider energy unknown. [Methodology](https://ecologits.ai/latest/methodology/) · [LLM inference](https://ecologits.ai/latest/methodology/llm_inference/) · [JOSS](https://doi.org/10.21105/joss.07471) |
| CodeCarbon / MLCO2 | Local energy × regional intensity | Local measurement path. [docs](https://docs.codecarbon.io/latest/explanation/methodology/) · [GitHub](https://github.com/mlco2/codecarbon) |

If a number cannot be sourced for a profile: write **`TBD — needs measurement`** and show UI ranges or hide the energy figure until calibrated.

---

## C. Regional grid intensity

### C.1 United States — EPA eGRID (primary)

**Official home:** [https://www.epa.gov/egrid](https://www.epa.gov/egrid)  
**Detailed data (eGRID2023 as of this pack):** [https://www.epa.gov/egrid/detailed-data](https://www.epa.gov/egrid/detailed-data)  
**Summary tables:** [https://www.epa.gov/egrid/summary-data](https://www.epa.gov/egrid/summary-data)  
**Power Profiler (ZIP → subregion):** [https://www.epa.gov/egrid/power-profiler](https://www.epa.gov/egrid/power-profiler)  
**Technical guide:** [eGRID2023 Technical Guide (PDF)](https://www.epa.gov/system/files/documents/2025-01/egrid2023_technical_guide.pdf)  
**Summary tables PDF (rev2):** [summary_tables_rev2.pdf](https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.pdf)

**Field to use (annual total output):**

- Sheet/table: **Subregion Output Emission Rates** → **Total output emission rates**
- Column: **CO2e** in **lb/MWh** (preferred for CO2-equivalent), or CO2 if CO2e unavailable — disclose which
- Key by **eGRID subregion acronym** (e.g. `CAMX`, `ERCT`, `NYUP`, `NWPP`)

**Conversion to gCO2e/kWh:**

```text
intensity_gCO2e_per_kWh = (lb_CO2e_per_MWh) × (453.59237 g/lb) / 1000
                        = (lb_CO2e_per_MWh) × 0.45359237
```

**EXAMPLE (sourced):** eGRID2023 U.S. average total output **CO2e = 770.9 lb/MWh**  
→ `770.9 × 0.45359237 ≈ 350 gCO2e/kWh` (round to **~350**; do not fake 349.623…).  
Subregions span a wide range (e.g. NYUP ~243 lb/MWh CO2e vs coal-heavy subregions >1,000 lb/MWh) — always prefer **subregion** over US average when known. Source: EPA summary tables linked above.

**Note on vintage:** As of pack date (2026-09-28), official EPA portal lists **eGRID with 2023 data** (released 2025; rev2 Jun 2025). eGRID2024 may appear later — pin `egrid_year` in methodology metadata and bump `methodology_version` when swapping datasets.

### C.2 Broader / realtime regional — Electricity Maps–class

**Methodology:** [https://www.electricitymaps.com/data/methodology](https://www.electricitymaps.com/data/methodology)  
**API reference (carbon intensity, gCO₂eq/kWh):** [https://app.electricitymaps.com/api/docs/reference](https://app.electricitymaps.com/api/docs/reference)  
**Whitepaper:** [Methodology for the electricity mix and derived signals](https://www.electricitymaps.com/resources/publications/whitepaper-methodology-for-the-electricity-mix-and-derived-signals)

**Field to use:**

- `carbonIntensity` in **gCO2eq/kWh**
- Prefer **consumption-based / flow-traced** when available (`flowTraced: true`)
- Disclose `emissionFactorType`: `lifecycle` (default in API docs) vs `direct`
- Disclose if `isEstimated: true`

Electricity Maps notes US regional factors can incorporate **EPA eGRID** plant-level data (see their methodology page) — complementary, not contradictory, to §C.1 annual factors.

**v0 policy:** Annual eGRID subregion is fine for US defaults without an API key. Optional later: live Electricity Maps (or equivalent) with user consent / API key.

### C.3 How the UI picks region

Priority order (disclose which path was used):

1. **Manual** — user picks eGRID subregion or Electricity Maps zone  
2. **ZIP / Power Profiler** — map US ZIP → eGRID subregion via EPA Power Profiler guidance  
3. **Locale heuristic** — country/region from OS locale → national or default zone (**lower confidence**; label `region_source: locale_guess`)  
4. **Fallback** — US → eGRID US average; non-US → Electricity Maps country zone or CodeCarbon/Our World in Data national average ([CodeCarbon methodology](https://docs.codecarbon.io/latest/explanation/methodology/) cites OWID / world default **475 gCO2eq/kWh** when unknown)

Never silently assume “green power” or RECs unless the user explicitly opts into a documented market-based method (out of scope for v0 location-based estimates).

### C.4 Session CO2e formula (paste-ready)

```text
Energy_kWh = Energy_Wh / 1000
gCO2e ≈ Energy_kWh × intensity_gCO2e_per_kWh
```

Disclose: `intensity_source`, `intensity_year_or_timestamp`, `region_id`, `methodology_version`.

---

## D. Local vs cloud comparison method

Compare **the same workload** (same prompt+completion token counts).

| Side | Energy | Intensity | Cost |
|------|--------|-----------|------|
| **Local** | `tokens × Wh_per_token(user_hardware_profile)` (+ optional idle) | User region (eGRID / Electricity Maps) | Local $/kWh |
| **Cloud** | Provider-published energy/token **if available**; else **EcoLogits-class model** or **null** | Provider DC region intensity if known; else regional fallback; else **range + “provider intensity unknown”** | API $/1M tokens (separate from electricity) |

### D.1 Rules of honesty

- **Never claim “local is always greener.”** Local on a high-TDP GPU in a coal-heavy eGRID subregion can exceed cloud inference on efficient accelerators in a cleaner grid (especially when cloud batches many users). Show both estimates side by side.
- If cloud Wh is unknown: output `estimated_Wh: null`, `reason: "provider_energy_unknown"`, and optionally an **EcoLogits-style range** clearly labeled as third-party model, not provider meter ([EcoLogits LLM inference](https://ecologits.ai/latest/methodology/llm_inference/)).
- Cloud comparisons should note **PUE** and possible **embodied** impacts if using EcoLogits; v0 usage panel may show **operational energy only** and link here for scope.
- Idle residency on local machines can flip the comparison for “always-on” local servers — disclose.

### D.2 When local might *not* be greener (UI education, not scare copy)

- Inefficient local hardware (high watts / low tok/s) on a dirty grid  
- Large model kept loaded 24/7 for rare queries  
- Cloud provider with high utilization, efficient accelerators, and cleaner regional mix  

When local *might* be better: small quantized models, high tok/s per watt, clean local grid, no always-on idle waste.

---

## E. Disclosure language

### E.1 For METHODOLOGY.md / README (short)

> Woke GPT reports **science-based estimates**, not utility meters or certified carbon audits. Energy is inferred from token counts and hardware power/throughput assumptions (or on-device measurements when available). CO₂e uses published grid intensity factors (EPA eGRID for US subregions; Electricity Maps–class sources elsewhere). Dollar costs use your electricity rate and/or API list prices. Figures are shown as ranges or with “~”. See this methodology (`methodology_version`) for formulas and sources. We do not claim carbon neutrality, “green AI,” or that local is always better.

### E.2 For UI (banner / tooltip — paste-ready)

**Banner:**  
`Estimates, not meters — energy, cost, and CO₂e are approximate. Methodology →`

**Tooltip:**  
`We multiply tokens by an estimated Wh/token for your hardware profile, then apply your grid’s published carbon intensity and your $/kWh (or API prices). Not a utility bill or certified footprint.`

---

## F. Uncertainty & honesty rules

1. Show **ranges** or **`~`**; never fake meter precision (no “12.347 Wh”).  
2. Significant digits ≤ what sources support (e.g. eGRID lb/MWh → round gCO2e/kWh to whole grams or tens).  
3. Every numeric claim needs a **source URL**, **EXAMPLE** label, or **TBD — needs measurement**.  
4. Version this doc: bump `methodology_version` (date + semver) when formulas, default intensities, or profile tables change.  
5. No greenwashing: no “carbon free / green LLM” claims; no RECs/offsets as silent intensity reductions in v0.  
6. Open methodology: this file ships in the public repo.

---

## Changelog

| Version | Date (PT) | Notes |
|---------|-----------|-------|
| `2026-09-28.v0` | 2026-09-28 | Initial pack for Woke GPT |

