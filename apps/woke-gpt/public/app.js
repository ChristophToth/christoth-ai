const $ = (id) => {
  const node = document.getElementById(id);
  if (!node) {
    throw new Error(`Missing #${id}`);
  }
  return node;
};

const state = {
  messages: [],
  replies: [],
  assumptions: null,
};

function numberOrNull(value) {
  const text = String(value).trim();
  if (text.length === 0) {
    return null;
  }
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function formPayload(extra = {}) {
  const price = numberOrNull($("price").value);
  const tps = numberOrNull($("tps").value);
  const wattsLow = numberOrNull($("watts-low").value);
  const wattsHigh = numberOrNull($("watts-high").value);
  const [provider, modelId] = $("cloud-model").value.split("|");
  return {
    hardwareProfileId: $("hardware").value,
    regionId: $("region").value,
    priceUsdPerKwh: price,
    completionTokensPerSec: tps,
    throughputSource: tps ? "user_reported" : "unavailable",
    measuredActivePowerWLow: wattsLow,
    measuredActivePowerWHigh: wattsHigh,
    includeIdle: false,
    provider: provider || "anthropic",
    model_id: modelId || "claude-haiku-4-5",
    ...extra,
  };
}

function fillSelect(select, options, selected) {
  select.replaceChildren();
  for (const option of options) {
    const node = document.createElement("option");
    node.value = option.value;
    node.textContent = option.label;
    if (option.value === selected) {
      node.selected = true;
    }
    select.append(node);
  }
}

function renderAssumptions(estimate) {
  const assumptions = estimate.assumptions;
  const price = assumptions.priceUsdPerKwh;
  const priceText =
    assumptions.priceSource === "default_eia_us_residential"
      ? "Default ~17–18¢/kWh — edit for your rate (price_source: default_eia_us_residential)"
      : price
        ? `${price.low} $/kWh (rate you entered)`
        : "no price";
  const power = assumptions.powerBandW
    ? `~${assumptions.powerBandW.low}–${assumptions.powerBandW.high} W`
    : "no power band";
  $("assumption-body").textContent = [
    assumptions.powerNote,
    `Power used: ${power} (${assumptions.powerSource}).`,
    `Throughput: ${assumptions.completionTokensPerSec ?? "not measured"} tok/s (${assumptions.throughputSource}).`,
    `Formula: ${assumptions.formula}. Applied to prompt + completion tokens.`,
    `Grid: ${assumptions.regionLabel}. ~${assumptions.intensityGPerKwh} g/kWh. ${assumptions.intensitySource}`,
    `Grid vintage: eGRID ${assumptions.egridYear ?? "n/a"} · ${assumptions.intensityCadence} factors only.`,
    `Idle: ${assumptions.idlePolicy}. Not added to generation energy.`,
    `Region id ${assumptions.regionId}. Confidence: ${assumptions.intensityConfidence}.`,
    `Price: ${priceText}.`,
    assumptions.annualFactorNote,
    assumptions.tokenNote ?? "",
    `methodology ${estimate.methodologyVersion}.`,
  ]
    .filter(Boolean)
    .join(" ");

  const tokens = estimate.tokens;
  const tokenLabel = tokens.source === "runtime_measured" ? String(tokens.total) : `~${tokens.total}`;
  $("tokens").textContent = tokenLabel;
  $("tokens-sub").textContent =
    tokens.source === "runtime_measured"
      ? `${tokens.prompt} prompt + ${tokens.completion} completion, measured by the local runtime.`
      : `Rough token estimate (about 4 characters per token), not a model tokenizer. ${tokens.prompt} prompt + ${tokens.completion} completion.`;

  if (estimate.energyWh) {
    $("energy").textContent = estimate.display.energy;
    $("energy-sub").textContent = `Based on ~${tokens.total} tokens × Wh/token for ${assumptions.hardwareProfileLabel}. ${assumptions.powerNote}`;
  } else {
    $("energy").textContent = "Energy estimate unavailable — hardware profile not calibrated";
    $("energy-sub").textContent =
      "This hardware profile needs a measured Wh/token — showing range only / hidden until calibrated.";
  }

  if (estimate.costUsd) {
    $("cost").textContent = estimate.display.cost;
    const priceLine =
      assumptions.priceSource === "default_eia_us_residential"
        ? "Default ~17–18¢/kWh — edit for your rate"
        : `At ${price?.low} $/kWh (rate you entered)`;
    $("cost-sub").textContent =
      estimate.costUsd.high < 0.01
        ? `${priceLine}. Under 1¢ for this reply — the range is the estimate, not a line on a utility bill.`
        : priceLine;
  } else {
    $("cost").textContent = "—";
    $("cost-sub").textContent = estimate.energyWh ? "Add your $/kWh for a cost estimate" : "Electricity cost follows the energy estimate.";
  }

  if (estimate.gco2e) {
    $("co2").textContent = estimate.display.gco2e;
    $("co2-sub").textContent = `Grid: ${assumptions.regionLabel} · ${assumptions.intensityGPerKwh} g/kWh (${assumptions.intensitySource}) Using annual grid factors (e.g. pinned EPA eGRID2023). v0 has no live Electricity Maps intensity.`;
  } else {
    $("co2").textContent = "—";
    $("co2-sub").textContent = "Pick your grid region for a CO₂e estimate";
  }

  const localEnergy = estimate.energyWh ? estimate.display.energy : "energy unavailable until calibrated";
  const localCo2 = estimate.gco2e ? estimate.display.gco2e : "CO₂e omitted";
  $("local-line").textContent = `Local (${assumptions.hardwareProfileLabel}, ${assumptions.regionLabel}): ${localEnergy} · ${localCo2}`;
}

function renderCloud(cloud, sampleDisplay, sampleBand) {
  const name = `${cloud.sources.price === "unknown" ? $("cloud-model").value : $("cloud-model").selectedOptions[0]?.textContent ?? "cloud"}`;
  $("cloud-line").textContent = `Cloud (${name}): energy unknown from provider · Wh: null. Provider doesn’t publish energy for this model. Cloud Wh is null in v0; we won’t invent a precise Wh. An optional range is shown only when explicitly enabled and labeled as a third-party model.`;
  if (cloud.estimated_Wh !== null || cloud.estimated_Wh_range !== null) {
    $("cloud-line").textContent = "Cloud energy was returned unexpectedly. v0 keeps cloud Wh null.";
  }
  $("cloud-intensity").textContent = "Provider grid intensity unknown — CO₂e shown as a range or omitted";
  $("api-cost").textContent = cloud.estimated_usd_display ?? "—";
  $("sample-band").textContent = sampleDisplay ?? "—";
  if (sampleBand) {
    $("sample-note").textContent = sampleBand.note;
  }
}

async function refreshSession() {
  const ranges = state.replies.filter((reply) => reply.energyWh);
  if (ranges.length === 0) {
    $("session-note").textContent =
      state.replies.length === 0
        ? "Run a prompt to see usage estimates."
        : "This hardware profile needs a measured Wh/token — showing range only / hidden until calibrated.";
    return;
  }
  const response = await fetch("/api/session-display", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      energyWh: ranges.map((reply) => reply.energyWh),
      costUsd: state.replies.filter((reply) => reply.costUsd).map((reply) => reply.costUsd),
      gco2e: state.replies.filter((reply) => reply.gco2e).map((reply) => reply.gco2e),
    }),
  });
  const body = await response.json();
  const tokens = state.replies.reduce((sum, reply) => sum + reply.tokens.total, 0);
  $("session-note").textContent = `Session so far: ${tokens} tokens · energy ${body.energy ?? "unavailable"} · electricity ${body.cost ?? "—"} · ${body.gco2e ?? "CO₂e omitted"}. Latest reply is in the meters.`;
}

function appendBubble(role, text) {
  const empty = $("empty-thread");
  empty.hidden = true;
  const block = document.createElement("article");
  block.className = "bubble";
  const who = document.createElement("strong");
  who.textContent = role;
  const body = document.createElement("p");
  body.textContent = text;
  block.append(who, body);
  $("transcript").append(block);
  $("transcript").scrollTop = $("transcript").scrollHeight;
}

async function rerunEstimate() {
  const last = state.replies.at(-1);
  if (!last) {
    return;
  }
  const response = await fetch("/api/estimate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(
      formPayload({
        promptTokens: last.tokens.prompt,
        completionTokens: last.tokens.completion,
        tokenSource: last.tokens.source,
        completionTokensPerSec: last.throughput ?? numberOrNull($("tps").value),
        throughputSource: last.throughput ? "runtime_measured" : numberOrNull($("tps").value) ? "user_reported" : "unavailable",
      }),
    ),
  });
  const estimate = await response.json();
  if (!response.ok) {
    $("session-note").textContent = estimate.error ?? "Could not update the estimate.";
    return;
  }
  last.energyWh = estimate.energyWh;
  last.costUsd = estimate.costUsd;
  last.gco2e = estimate.gco2e;
  last.tokens = estimate.tokens;
  renderAssumptions(estimate);
  const cloudResponse = await fetch("/api/connectors/estimate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      provider: formPayload().provider,
      model_id: formPayload().model_id,
      prompt_tokens: estimate.tokens.prompt,
      completion_tokens: estimate.tokens.completion,
    }),
  });
  const cloudBody = await cloudResponse.json();
  renderCloud(cloudBody.estimate, cloudBody.sampleBandDisplay, cloudBody.sampleBand);
  await refreshSession();
}

async function boot() {
  $("run").disabled = true;
  const [healthResponse, assumptionsResponse] = await Promise.all([
    fetch("/api/health"),
    fetch("/api/assumptions"),
  ]);
  const health = await healthResponse.json();
  const assumptions = await assumptionsResponse.json();
  state.assumptions = assumptions;
  $("version-chip").textContent = `methodology ${assumptions.methodologyVersion}`;
  $("foot-version").textContent = `methodology ${assumptions.methodologyVersion}`;
  const status = $("runtime-status");
  if (health.ollama === "reachable") {
    status.textContent = `Local runtime reachable at ${health.ollamaHost}`;
    status.className = "status up";
  } else {
    status.textContent = `Local runtime not reachable at ${health.ollamaHost}. You can still estimate from a measured tokens/sec.`;
    status.className = "status down";
  }
  fillSelect(
    $("hardware"),
    assumptions.hardwareProfiles.map((profile) => ({
      value: profile.id,
      label: profile.powerBand
        ? `${profile.label} · envelope ~${profile.powerBand.lowW}–${profile.powerBand.highW} W`
        : `${profile.label} · Wh/token TBD until measured`,
    })),
    "laptop_cpu",
  );
  fillSelect(
    $("region"),
    assumptions.regions.map((region) => ({
      value: region.id,
      label: `${region.label} · ~${region.intensityGPerKwh} g/kWh`,
    })),
    assumptions.defaultRegionId,
  );
  fillSelect(
    $("cloud-model"),
    assumptions.listPrices.map((price) => ({
      value: `${price.provider}|${price.modelId}`,
      label: `${price.label} · $${price.promptUsdPer1M}/$${price.completionUsdPer1M} per 1M`,
    })),
    "anthropic|claude-haiku-4-5",
  );
  $("example-copy").textContent = `${assumptions.workedExample.note} ~${assumptions.workedExample.activeW} W at ~${assumptions.workedExample.tokensPerSec} tok/s for ${assumptions.workedExample.tokens} tokens → ${assumptions.workedExample.display}.`;
  $("sample-note").textContent = assumptions.listPriceNote;
  $("run").disabled = false;
}

for (const id of ["hardware", "region", "price", "tps", "watts-low", "watts-high", "cloud-model"]) {
  $(id).addEventListener("change", () => {
    void rerunEstimate();
  });
}

$("chat-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = $("prompt").value.trim();
  if (!prompt) {
    return;
  }
  const button = $("run");
  button.disabled = true;
  appendBubble("You", prompt);
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(formPayload({ prompt, model: $("model").value, messages: state.messages })),
    });
    const body = await response.json();
    if (!response.ok) {
      appendBubble("Harness", body.error ?? "Request failed.");
      return;
    }
    state.messages.push({ role: "user", content: prompt });
    if (body.reply) {
      state.messages.push({ role: "assistant", content: body.reply });
      appendBubble(body.model, body.reply);
    } else {
      appendBubble(
        "Harness",
        body.runtimeError
          ? `No local model reply. ${body.runtimeError} Token count below is a rough estimate, not a tokenizer.`
          : "No local model reply.",
      );
    }
    state.replies.push({
      tokens: body.estimate.tokens,
      energyWh: body.estimate.energyWh,
      costUsd: body.estimate.costUsd,
      gco2e: body.estimate.gco2e,
      throughput: body.estimate.assumptions.completionTokensPerSec,
    });
    renderAssumptions(body.estimate);
    renderCloud(body.cloud, body.sampleBandDisplay, body.sampleBand);
    await refreshSession();
    $("prompt").value = "";
  } finally {
    button.disabled = false;
  }
});

void boot();
