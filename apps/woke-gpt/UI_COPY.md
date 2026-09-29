# Woke GPT — v0 Usage Panel & Efficiency Tips (UI Copy)

**methodology_version:** `2026-09-28.v0`  
**tone:** CEO-plain, short, practical — no preachy greenwashing  
**pairs with:** `apps/woke-gpt/METHODOLOGY.md`

Strings below are paste-ready. Placeholders use `{curly}` braces.

---

## 1. Estimate-not-meter banner

**Primary (always visible on usage panel):**
> Estimates, not meters — approximate energy, cost, and CO₂e. [Methodology]

**Compact:**
> ~ Estimates · not a utility meter · [How we calculate]

**Accessibility / aria:**
> Energy and cost figures are estimates based on tokens, hardware assumptions, and published grid data. They are not measured from a utility meter.

---

## 2. Usage panel strings

### 2.1 Section title
> This session (estimated)

### 2.2 Energy
| Role | Copy |
|------|------|
| Label | Energy estimate |
| Value | `~{energy_wh_low}–{energy_wh_high} Wh` *or* `~{energy_wh} Wh` |
| Empty / TBD | Energy estimate unavailable — hardware profile not calibrated |
| Subtext | Based on ~{tokens} tokens × Wh/token for {hardware_profile_label} |

### 2.3 Cost (local electricity)
| Role | Copy |
|------|------|
| Label | Electricity cost estimate |
| Value | `~${cost_usd}` |
| Subtext | At {price_cents}/kWh ({price_source_label}) |
| Missing price | Add your $/kWh for a cost estimate |

### 2.4 Cost (API — when cloud connector used)
| Role | Copy |
|------|------|
| Label | API cost estimate |
| Value | `~${api_cost_usd}` |
| Subtext | From token usage × $/1M rates — not electricity |
| Note | Shown separately from local electricity cost |

### 2.5 CO₂e
| Role | Copy |
|------|------|
| Label | CO₂e estimate |
| Value | `~{gco2e_low}–{gco2e_high} g` *or* `~{gco2e} g CO₂e` |
| Subtext | Grid: {region_label} · {intensity_g_per_kwh} g/kWh ({intensity_source}) |
| Unknown region | Pick your grid region for a CO₂e estimate |

### 2.6 Local vs cloud compare
| Role | Copy |
|------|------|
| Section | Same workload — local vs cloud |
| Local line | Local ({hardware_profile_label}, {region_label}): ~{local_wh} Wh · ~{local_gco2e} g CO₂e |
| Cloud line (known) | Cloud ({provider}/{model}): ~{cloud_wh} Wh · ~{cloud_gco2e} g CO₂e |
| Cloud line (unknown energy) | Cloud ({provider}/{model}): energy unknown from provider · showing range / model estimate if available |
| Cloud intensity unknown | Provider grid intensity unknown — CO₂e shown as a range or omitted |
| Footer | Local isn’t always lower. Dirty local grid + hungry hardware can beat a clean, efficient cloud run — and the reverse. |
| CTA | Compare uses the same token counts on both sides. |

### 2.7 Methodology link / tooltip
| Role | Copy |
|------|------|
| Link text | Methodology |
| Tooltip | Tokens × estimated Wh/token for your hardware, then grid intensity and $/kWh (or API prices). Open methodology for sources and formulas. |
| Footer chip | `methodology {methodology_version}` |

### 2.8 Hardware / region pickers (short labels)
| Control | Placeholder / helper |
|---------|----------------------|
| Hardware profile | Your machine (affects Wh/token) |
| Grid region | Where your power comes from (US: eGRID subregion) |
| $/kWh | Your utility rate (optional) |

---

## 3. Empty / error / honesty states

| State | Copy |
|-------|------|
| No tokens yet | Run a prompt to see usage estimates. |
| Profile TBD | This hardware profile needs a measured Wh/token — showing range only / hidden until calibrated. |
| Cloud energy null | Provider doesn’t publish energy for this model. We won’t invent a precise Wh. |
| Offline intensity | Using annual grid factors (e.g. EPA eGRID). Not live carbon intensity. |
| Stale methodology | Estimates use methodology {methodology_version}. |

---

## 4. Efficiency tips (5–8) — real levers only

Practical tips tied to energy math (smaller model → fewer watts×seconds; fewer tokens → less work; cleaner grid × Wh; etc.). No guilt tone.

1. **Use a smaller model when it’s good enough**  
   Fewer parameters and lighter runtimes usually mean less energy per reply. Try the smallest local model that still does the job.

2. **Cut tokens you don’t need**  
   Shorter prompts and shorter max replies reduce work. Drop boilerplate, repeated paste, and “just in case” context.

3. **Watch context bloat**  
   Long chat history and huge pasted docs get re-processed. Summarize or start a fresh thread when the thread gets fat.

4. **Quantize for local runs**  
   Lower-bit weights (when quality holds) often raise tokens/sec at similar or lower power — better Wh/token on the same box.

5. **Batch when you’re offline-processing**  
   One batched job on a GPU is usually more efficient than many tiny one-off calls with the model thrashing cold.

6. **Match place to hardware**  
   Clean local grid + efficient laptop/Apple Silicon → local can look good. Hot discrete GPU on a carbon-heavy grid, or a box left loaded 24/7 for rare chats → cloud (or sleep/unload) may win. Compare; don’t assume.

7. **Unload when idle**  
   A model sitting in VRAM still draws power. Quit or unload between sessions if you’re not chatting continuously.

8. **Prefer task-specific tools over a giant general model**  
   Classification/summarize-with-a-small-model often beats asking a large general LLM the same narrow question (see inference-energy literature in Methodology).

---

## 5. Optional one-liners for settings

> Show energy estimates on every reply  
> Include idle/residency in session totals (experimental)  
> Default grid region: {region}  
> Electricity rate: {rate} $/kWh  

---

## 6. What not to say (v0)

- “Carbon neutral,” “green AI,” “zero impact,” “planet-friendly LLM”
- Exact Wh without `~` or a range when using profile defaults
- “Local is always greener”
- Fake provider energy when the API doesn’t publish it
