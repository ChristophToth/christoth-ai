# Woke GPT Energy/Cost Pack — TLDR (Casey / Christopher)

**Pack date:** 2026-09-28 PT · **methodology_version:** `2026-09-28.v0`  
**Drop path:** `apps/woke-gpt/METHODOLOGY.md`. This summary sits beside it as `PACK_SUMMARY.md`.

---

## What we ship

| File | Role |
|------|------|
| `METHODOLOGY.md` | Staff-engineer brief: formulas, hardware profiles, eGRID/EM intensity, local vs cloud, disclosure, uncertainty |
| `UI_COPY.md` | Paste-ready usage panel strings + 8 practical efficiency tips |
| `API_KEY_ESTIMATES_SPEC.md` | Later connector I/O only; non-goals (no billing scrape, no fake Wh) |
| `SUMMARY.md` | This page |

**Product frame:** Sell harness + free local OSS + honest visuals + tips. Optional API key overlays later.

---

## Core math (one screen)

```text
Energy_Wh ≈ tokens × Wh_per_token(hardware_profile)     # ESTIMATE
Cost_$    ≈ Energy_Wh × ($/kWh / 1000)                  # and/or separate API $
gCO2e     ≈ (Energy_Wh/1000) × intensity_gCO2e_per_kWh
```

Wh/token from **measured** W ÷ tok/s, or **ranged** profiles — never fake meter digits. Idle residency called out separately.

---

## Grid sources (cite these)

- **US:** [EPA eGRID](https://www.epa.gov/egrid) — subregion **total output CO2e lb/MWh** → ×0.453592 → g/kWh. eGRID2023 US avg **770.9 lb CO2e/MWh ≈ ~350 g/kWh**. Power Profiler for ZIP→subregion.
- **Broader / live:** [Electricity Maps methodology](https://www.electricitymaps.com/data/methodology) — `carbonIntensity` gCO2eq/kWh, prefer flow-traced consumption-based.

---

## Honesty rules baked in

- Estimates ≠ meters; ranges / `~`; version the methodology date  
- No “local always greener”; no greenwashing slogans  
- Unsourced numbers → **TBD — needs measurement** or **EXAMPLE**  
- Cloud Wh null unless provider-published or explicitly labeled third-party model (EcoLogits-class)

---

## Gaps needing Christopher / Casey decision

1. **Calibrate local Wh/token** — ship TBD profiles vs run a short measurement pass (laptop CPU, Apple Silicon, one discrete GPU) before UI defaults.  
2. **Default $/kWh** — require user entry vs EIA US residential default (~17–18¢) with loud labeling.  
3. **eGRID vintage** — pin eGRID2023 now; process for swapping when EPA publishes 2024+.  
4. **Live Electricity Maps** — v0 annual factors only vs optional API (cost/key/privacy).  
5. **Idle in session totals** — off by default vs opt-in “include residency.”  
6. **Cloud overlay v0** — null Wh only vs allow EcoLogits-style ranges behind a flag.  
7. **Repo path** — `METHODOLOGY.md` at `apps/woke-gpt/` root vs `docs/`; align with Staff Eng PR layout on re-diff.

---

## Primary sources used

- EPA eGRID portal, detailed data, summary tables, Power Profiler, technical guide  
- Electricity Maps methodology + API carbon-intensity docs  
- Luccioni et al., *Power Hungry Processing* (FAccT 2024 / arXiv:2311.16863); BLOOM carbon footprint (JMLR)  
- EcoLogits methodology + LLM inference (JOSS 2025)  
- CodeCarbon / MLCO2 methodology  
- NVIDIA GeForce RTX 4090 public TDP (450 W) as hardware envelope reference  
- EIA Electric Power Monthly (residential ¢/kWh context)
