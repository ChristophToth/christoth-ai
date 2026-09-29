# Woke GPT Energy/Cost Pack — TLDR (Casey / Christopher)

**Pack date:** 2026-09-28 PT · **methodology_version:** `2026-09-28.v0`  
**Drop path for Staff Eng:** `apps/woke-gpt/METHODOLOGY.md` (or `apps/woke-gpt/docs/METHODOLOGY.md`) — re-diff when their PR opens.  
**CloudAgent (context only):** cursor.com/agents/… targeting `ChristophToth/christoth-ai` `apps/woke-gpt/` — this pack is the science source of truth; do not wait on their code.

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
- Cloud Wh is null in v0; an EcoLogits-class range is optional only behind an explicit flag and must be labeled

---

## v0 locks (Casey)

These seven decisions are locked for v0 and folded into `METHODOLOGY.md`:

1. **Local Wh/token:** Ship TBD local Wh/token profiles with clearly labeled **EXAMPLE** ranges; the measurement pass is **v0.1**, after the draft UI.
2. **Default $/kWh:** Use the EIA US residential context of **~17–18¢/kWh**, with a loud **“Edit for your rate”** label; user-entered rates take precedence.
3. **eGRID vintage:** Pin **eGRID2023**. When EPA publishes newer data, update the intensity table, bump `methodology_version`, and add a changelog note.
4. **Electricity Maps:** v0 uses annual factors only; **no live Electricity Maps API** yet.
5. **Idle:** Idle/residency is off by default; opt in later.
6. **Cloud overlay:** Cloud `Wh` is null in v0; EcoLogits ranges are allowed only behind an explicit enable flag, if easy, and must be labeled as third-party model output.
7. **Repo path:** Prefer `apps/woke-gpt/METHODOLOGY.md` at root; re-diff the Staff Eng PR when it opens.

**Christopher first-draft package:** Wait for the harness PR and this pack together; do not treat either as complete alone.

---

## Primary sources used

- EPA eGRID portal, detailed data, summary tables, Power Profiler, technical guide  
- Electricity Maps methodology + API carbon-intensity docs  
- Luccioni et al., *Power Hungry Processing* (FAccT 2024 / arXiv:2311.16863); BLOOM carbon footprint (JMLR)  
- EcoLogits methodology + LLM inference (JOSS 2025)  
- CodeCarbon / MLCO2 methodology  
- NVIDIA GeForce RTX 4090 public TDP (450 W) as hardware envelope reference  
- EIA Electric Power Monthly (residential ¢/kWh context)
