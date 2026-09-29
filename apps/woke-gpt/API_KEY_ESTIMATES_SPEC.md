# API Key Estimates Spec (v0) — Inputs / Outputs Only

**methodology_version:** `2026-09-28.v0`  
**purpose:** Contract for *later* optional API-key connector overlays (OpenAI, Anthropic, etc.)  
**status:** Spec only — not a live billing scraper  
**pairs with:** `apps/woke-gpt/METHODOLOGY.md` §A–D, `apps/woke-gpt/UI_COPY.md` cloud lines  
**implemented by:** `src/connectors.ts` and `src/estimate-api.ts` (interfaces and pure estimate only — no network, no key storage)

This document defines **inputs and outputs** for estimating energy / $ / gCO2e when the harness routes work through a cloud provider. Implementers map provider responses → this schema. No scraping of billing dashboards without explicit user consent (see Non-goals).

---

## 1. Inputs

```jsonc
{
  "provider": "openai" | "anthropic" | "google" | "mistral" | "other",
  "model_id": "string",              // provider model slug
  "prompt_tokens": 0,                // integer ≥ 0
  "completion_tokens": 0,            // integer ≥ 0
  "region": null,                    // optional: provider region / DC hint, or user grid for fallback intensity
  "user_price_per_1m": {             // optional overrides; else use provider list or null
    "prompt_usd": null,
    "completion_usd": null
  },
  "request_id": null,                // optional correlation
  "locale_grid_hint": null           // optional: eGRID subregion / EM zone if comparing to local
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `provider` | yes | Enum or free string normalized by connector |
| `model_id` | yes | As returned by API |
| `prompt_tokens` | yes | From usage object |
| `completion_tokens` | yes | From usage object |
| `region` | no | Improves intensity; if absent → fallback / unknown flags |
| `user_price_per_1m` | no | User-reported $/1M; wins over list price when set |
| `request_id` | no | Logging only |
| `locale_grid_hint` | no | For side-by-side local compare only |

**Token rule:** Same token accounting as the harness uses for local (prompt + completion). Do not invent tokens.

---

## 2. Outputs

```jsonc
{
  "estimated_Wh": null,              // number | null
  "estimated_Wh_range": null,        // { "low": number, "high": number } | null
  "estimated_Wh_reason": null,       // string when Wh is null or modeled
  "estimated_usd": null,             // API $ estimate (not electricity)
  "estimated_usd_electricity": null, // only if Wh known × some $/kWh — usually null for pure API path
  "estimated_gCO2e": null,           // number | null
  "estimated_gCO2e_range": null,     // { "low": number, "high": number } | null
  "disclosure_flags": [],            // string[] — see below
  "methodology_version": "2026-09-28.v0",
  "sources": {
    "energy": null,                  // e.g. "provider_published" | "ecologits_model" | "unknown"
    "intensity": null,               // e.g. "egrid_2023_CAMX" | "electricity_maps" | "unknown"
    "price": null                    // e.g. "user_override" | "provider_list" | "unknown"
  }
}
```

### 2.1 Field semantics

| Output | Rule |
|--------|------|
| `estimated_Wh` | Set only if provider publishes energy **or** a documented model (e.g. EcoLogits-class) is explicitly enabled and labeled. Else **`null`**. |
| `estimated_Wh_range` | Prefer ranges when using third-party models; still set `disclosure_flags` accordingly. |
| `estimated_Wh_reason` | Required when `estimated_Wh` is null, e.g. `"provider_energy_unknown"`. |
| `estimated_usd` | `(prompt_tokens/1e6)*prompt_rate + (completion_tokens/1e6)*completion_rate`. Null if no rates. |
| `estimated_gCO2e` | `(estimated_Wh/1000) * intensity_g_per_kWh` when both known; else null or range only. |
| `methodology_version` | Always echo pack version used for the calc. |

### 2.2 `disclosure_flags` (extensible)

| Flag | Meaning |
|------|---------|
| `estimate_not_meter` | Always include for v0 overlays |
| `provider_energy_unknown` | No published Wh; `estimated_Wh` null |
| `provider_intensity_unknown` | DC/grid intensity not known; CO₂e omitted or ranged |
| `third_party_energy_model` | Wh from EcoLogits / similar — not provider telemetry |
| `price_user_override` | $/1M from user |
| `price_list_assumed` | $/1M from public list; may differ from invoice |
| `region_fallback` | Intensity from user locale / national default, not provider DC |
| `operational_energy_only` | Embodied impacts excluded |

---

## 3. Decision table (energy)

| Provider energy data | Intensity | Output |
|----------------------|-----------|--------|
| Published Wh or J/token | Known | `estimated_Wh`, `estimated_gCO2e` |
| Published Wh | Unknown | `estimated_Wh`; `estimated_gCO2e` null + `provider_intensity_unknown` |
| Unknown | Known or unknown | `estimated_Wh: null`, reason `provider_energy_unknown`; optional **labeled** model range |
| User disables models | — | Never invent Wh |

---

## 4. Explicit non-goals (v0)

1. **No live billing scrape** of provider invoices/dashboards without explicit, separate user consent and a dedicated feature. Usage tokens from the API response the user already authorized for chat are OK; pulling billing HTML/cookies is not.
2. **No fake provider energy** — if the provider does not publish energy, do not present a single precise Wh as if they did.
3. **No silent REC / “100% renewable” intensity** without a documented market-based method (out of scope).
4. **No training-emissions allocation** into per-chat v0 numbers.
5. **No claiming local≪cloud** from this overlay alone — comparison UI must follow `METHODOLOGY.md` §D.
6. **No storing API keys in methodology docs** — keys stay in the harness secret store; this spec is data-shaped only.

---

## 5. Minimal TypeScript-shaped sketch (non-normative)

```ts
type ApiEstimateInput = {
  provider: string;
  model_id: string;
  prompt_tokens: number;
  completion_tokens: number;
  region?: string | null;
  user_price_per_1m?: { prompt_usd?: number | null; completion_usd?: number | null };
};

type ApiEstimateOutput = {
  estimated_Wh: number | null;
  estimated_Wh_range: { low: number; high: number } | null;
  estimated_Wh_reason: string | null;
  estimated_usd: number | null;
  estimated_gCO2e: number | null;
  estimated_gCO2e_range: { low: number; high: number } | null;
  disclosure_flags: string[];
  methodology_version: string;
};
```

---

## 6. References for implementers

- Pack formulas: `METHODOLOGY.md`
- Cloud modeling (optional later): [EcoLogits LLM inference](https://ecologits.ai/latest/methodology/llm_inference/)
- Grid: [EPA eGRID](https://www.epa.gov/egrid), [Electricity Maps methodology](https://www.electricitymaps.com/data/methodology)
