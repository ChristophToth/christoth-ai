import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { dirname, extname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { COPY } from "./copy.ts";
import { cloudListPriceBand, estimateApiUsage, type ApiEstimateInput } from "./estimate-api.ts";
import {
  EIA_RESIDENTIAL_USD_PER_KWH,
  estimateLocal,
  roughTokenCount,
  workedExampleEnergyWh,
  type LocalEstimateInput,
  type ThroughputSource,
  type TokenSource,
} from "./estimate-local.ts";
import { formatRange, formatUsdRange, sumRanges } from "./format.ts";
import { DEFAULT_REGION_ID, GRID_REGIONS } from "./grids.ts";
import { HARDWARE_PROFILES, WORKED_EXAMPLE } from "./hardware.ts";
import { LIST_PRICE_NOTE, LIST_PRICE_SNAPSHOT } from "./list-prices.ts";
import { renderMarkdown } from "./markdown.ts";
import { ollamaChat, ollamaReachable, type OllamaChatResult } from "./ollama.ts";
import { METHODOLOGY_VERSION } from "./version.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = join(ROOT, "public");
const PORT = Number(process.env.PORT ?? 4173);
const HOST = process.env.HOST ?? "127.0.0.1";
const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(payload);
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let bytes = 0;
  for await (const chunk of request) {
    const buffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
    bytes += buffer.length;
    if (bytes > 1_000_000) {
      throw new HttpError(413, "Request body is too large.");
    }
    chunks.push(buffer);
  }
  if (chunks.length === 0) {
    return {};
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch {
    throw new HttpError(400, "Request body must be JSON.");
  }
}

function readRanges(value: unknown): { low: number; high: number }[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((entry) => {
    const record = asRecord(entry);
    const low = record.low;
    const high = record.high;
    if (typeof low !== "number" || typeof high !== "number" || !Number.isFinite(low) || !Number.isFinite(high)) {
      throw new HttpError(400, "Ranges need numeric low and high.");
    }
    return { low, high };
  });
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new HttpError(400, "Request body must be a JSON object.");
  }
  return value as Record<string, unknown>;
}

function integerField(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 10_000_000) {
    throw new HttpError(400, `${key} must be an integer from 0 to 10000000.`);
  }
  return value;
}

function optionalPositive(record: Record<string, unknown>, key: string): number | null {
  if (!(key in record) || record[key] === null) {
    return null;
  }
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new HttpError(400, `${key} must be a non-negative number or null.`);
  }
  return value;
}

function stringField(record: Record<string, unknown>, key: string, fallback = ""): string {
  const value = record[key];
  if (value === undefined || value === null) {
    return fallback;
  }
  if (typeof value !== "string") {
    throw new HttpError(400, `${key} must be a string.`);
  }
  return value;
}

function localInputFromBody(
  record: Record<string, unknown>,
  tokens: { promptTokens: number; completionTokens: number; tokenSource: TokenSource } | null,
): LocalEstimateInput {
  const measuredLow = optionalPositive(record, "measuredActivePowerWLow");
  const measuredHigh = optionalPositive(record, "measuredActivePowerWHigh");
  const measured =
    measuredLow !== null && measuredHigh !== null ? { low: measuredLow, high: measuredHigh } : null;
  const throughput = optionalPositive(record, "completionTokensPerSec");
  const throughputSourceRaw = stringField(record, "throughputSource", throughput ? "user_reported" : "unavailable");
  const throughputSource: ThroughputSource =
    throughputSourceRaw === "runtime_measured" || throughputSourceRaw === "user_reported"
      ? throughputSourceRaw
      : "unavailable";
  const tokenSourceRaw = stringField(record, "tokenSource", "user_entered");
  const tokenSource: TokenSource =
    tokenSourceRaw === "runtime_measured" || tokenSourceRaw === "rough_char_estimate"
      ? tokenSourceRaw
      : "user_entered";

  return {
    promptTokens: tokens ? tokens.promptTokens : integerField(record, "promptTokens"),
    completionTokens: tokens ? tokens.completionTokens : integerField(record, "completionTokens"),
    tokenSource: tokens ? tokens.tokenSource : tokenSource,
    completionTokensPerSec: throughput,
    throughputSource: throughput !== null && throughput > 0 ? throughputSource : "unavailable",
    hardwareProfileId: stringField(record, "hardwareProfileId", "laptop_cpu"),
    measuredActivePowerW: measured,
    regionId: stringField(record, "regionId", DEFAULT_REGION_ID),
    priceUsdPerKwh: optionalPositive(record, "priceUsdPerKwh"),
    includeIdle: record.includeIdle === true,
    idlePowerW: optionalPositive(record, "idlePowerW"),
    idleMinutes: optionalPositive(record, "idleMinutes"),
  };
}

function apiInputFromBody(record: Record<string, unknown>): ApiEstimateInput {
  if ("published_energy_wh" in record || "apiKey" in record || "api_key" in record) {
    throw new HttpError(
      400,
      "This v0 stub does not accept API keys or energy figures. Provider watt-hours stay null unless a future connector supplies a published value in-process.",
    );
  }
  const price = record.user_price_per_1m;
  let userPrice: ApiEstimateInput["user_price_per_1m"];
  if (price !== undefined && price !== null) {
    const priceRecord = asRecord(price);
    userPrice = {
      prompt_usd: optionalPositive(priceRecord, "prompt_usd"),
      completion_usd: optionalPositive(priceRecord, "completion_usd"),
    };
  }
  return {
    provider: stringField(record, "provider"),
    model_id: stringField(record, "model_id"),
    prompt_tokens: integerField(record, "prompt_tokens"),
    completion_tokens: integerField(record, "completion_tokens"),
    region: stringField(record, "region") || null,
    locale_grid_hint: stringField(record, "locale_grid_hint") || null,
    request_id: stringField(record, "request_id") || null,
    user_price_per_1m: userPrice,
  };
}

function assumptionsBody() {
  return {
    methodologyVersion: METHODOLOGY_VERSION,
    defaultRegionId: DEFAULT_REGION_ID,
    regions: GRID_REGIONS,
    hardwareProfiles: HARDWARE_PROFILES,
    listPrices: LIST_PRICE_SNAPSHOT,
    listPriceNote: LIST_PRICE_NOTE,
    eiaResidentialUsdPerKwh: EIA_RESIDENTIAL_USD_PER_KWH,
    workedExample: {
      ...WORKED_EXAMPLE,
      energyWh: workedExampleEnergyWh(),
      display: formatRange(workedExampleEnergyWh(), workedExampleEnergyWh(), "Wh"),
      note: "Illustrative only. Not this session and not a meter.",
    },
    copy: COPY,
    ollamaHost: OLLAMA_HOST,
  };
}

async function handleChat(record: Record<string, unknown>) {
  const prompt = stringField(record, "prompt").trim();
  if (prompt.length === 0 || prompt.length > 32_000) {
    throw new HttpError(400, "prompt must be 1 to 32000 characters.");
  }
  const model = stringField(record, "model", "llama3.2").trim() || "llama3.2";
  const history = Array.isArray(record.messages) ? record.messages : [];
  const messages: { role: "user" | "assistant"; content: string }[] = [];
  for (const entry of history) {
    const item = asRecord(entry);
    const role = item.role === "assistant" ? "assistant" : item.role === "user" ? "user" : null;
    const content = typeof item.content === "string" ? item.content : "";
    if (role && content.trim().length > 0) {
      messages.push({ role, content });
    }
  }
  messages.push({ role: "user", content: prompt });

  let runtime: OllamaChatResult | null = null;
  let runtimeError: string | null = null;
  try {
    runtime = await ollamaChat({
      host: OLLAMA_HOST,
      model,
      messages,
      signal: AbortSignal.timeout(120_000),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Local runtime unavailable.";
    runtimeError =
      message === "fetch failed"
        ? `Could not reach Ollama at ${OLLAMA_HOST}. Start it with ollama serve, or enter a measured tokens/sec.`
        : message;
  }

  const promptTokens = runtime ? runtime.promptTokens : roughTokenCount(prompt);
  const completionTokens = runtime ? runtime.completionTokens : 0;
  const manualTps = optionalPositive(record, "completionTokensPerSec");
  const measuredTps = runtime?.completionTokensPerSec ?? null;
  const estimate = estimateLocal({
    ...localInputFromBody(record, {
      promptTokens,
      completionTokens,
      tokenSource: runtime ? "runtime_measured" : "rough_char_estimate",
    }),
    completionTokensPerSec: measuredTps ?? manualTps,
    throughputSource: measuredTps ? "runtime_measured" : manualTps ? "user_reported" : "unavailable",
  });

  const cloud = estimateApiUsage(
    apiInputFromBody({
      provider: stringField(record, "provider", "anthropic"),
      model_id: stringField(record, "model_id", "claude-haiku-4-5"),
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      region: null,
      user_price_per_1m: record.user_price_per_1m ?? null,
    }),
  );
  const sampleBand = cloudListPriceBand(promptTokens, completionTokens);

  return {
    mode: runtime ? "ollama" : "runtime_unavailable",
    runtimeError,
    model: runtime?.model ?? model,
    reply: runtime?.content ?? null,
    generationSeconds: runtime?.generationSeconds ?? null,
    estimate,
    cloud,
    sampleBand,
    sampleBandDisplay: sampleBand ? formatUsdRange(sampleBand.lowUsd, sampleBand.highUsd) : null,
  };
}

async function serveStatic(response: ServerResponse, urlPath: string): Promise<void> {
  const relative = urlPath.replace(/^\/+/, "");
  if (relative.includes("\0") || relative.split(/[/\\]/).includes("..")) {
    throw new HttpError(403, "Forbidden.");
  }
  const filePath = join(PUBLIC_DIR, relative);
  if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR + sep)) {
    throw new HttpError(403, "Forbidden.");
  }
  const body = await readFile(filePath);
  const type = CONTENT_TYPES[extname(filePath)] ?? "application/octet-stream";
  response.writeHead(200, { "content-type": type });
  response.end(body);
}

async function serveMethodology(response: ServerResponse): Promise<void> {
  const markdown = await readFile(join(ROOT, "METHODOLOGY.md"), "utf8");
  const body = renderMarkdown(markdown);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Woke GPT methodology ${METHODOLOGY_VERSION}</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <main class="wrap methodology">
    <p class="eyebrow"><a href="/">← Harness</a></p>
    <p class="stamp">Estimates, not meters</p>
    ${body}
    <p><a href="/METHODOLOGY.md">Raw Markdown</a></p>
  </main>
</body>
</html>`;
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(html);
}

async function serveMethodologyMarkdown(response: ServerResponse): Promise<void> {
  const markdown = await readFile(join(ROOT, "METHODOLOGY.md"));
  response.writeHead(200, { "content-type": "text/markdown; charset=utf-8" });
  response.end(markdown);
}

const server = createServer((request, response) => {
  void (async () => {
    const url = new URL(request.url ?? "/", `http://${HOST}`);
    try {
      if (request.method === "GET" && url.pathname === "/api/health") {
        const runtimeUp = await ollamaReachable(OLLAMA_HOST, AbortSignal.timeout(1500));
        sendJson(response, 200, {
          ok: true,
          methodologyVersion: METHODOLOGY_VERSION,
          ollama: runtimeUp ? "reachable" : "unavailable",
          ollamaHost: OLLAMA_HOST,
        });
        return;
      }
      if (request.method === "GET" && url.pathname === "/api/assumptions") {
        sendJson(response, 200, assumptionsBody());
        return;
      }
      if (request.method === "POST" && url.pathname === "/api/estimate") {
        const estimate = estimateLocal(localInputFromBody(asRecord(await readJson(request)), null));
        sendJson(response, 200, estimate);
        return;
      }
      if (request.method === "POST" && url.pathname === "/api/connectors/estimate") {
        const body = asRecord(await readJson(request));
        const estimate = estimateApiUsage(apiInputFromBody(body));
        const band = cloudListPriceBand(
          integerField(body, "prompt_tokens"),
          integerField(body, "completion_tokens"),
        );
        sendJson(response, 200, {
          estimate,
          sampleBand: band,
          sampleBandDisplay: band ? formatUsdRange(band.lowUsd, band.highUsd) : null,
        });
        return;
      }
      if (request.method === "POST" && url.pathname === "/api/session-display") {
        const body = asRecord(await readJson(request));
        const energy = readRanges(body.energyWh);
        const cost = readRanges(body.costUsd);
        const gco2e = readRanges(body.gco2e);
        const energySum = sumRanges(energy);
        const costSum = sumRanges(cost);
        const gco2eSum = sumRanges(gco2e);
        sendJson(response, 200, {
          energy: energySum ? formatRange(energySum.low, energySum.high, "Wh") : null,
          cost: costSum ? formatUsdRange(costSum.low, costSum.high) : null,
          gco2e: gco2eSum ? formatRange(gco2eSum.low, gco2eSum.high, "g CO₂e") : null,
        });
        return;
      }
      if (request.method === "POST" && url.pathname === "/api/chat") {
        sendJson(response, 200, await handleChat(asRecord(await readJson(request))));
        return;
      }
      if (request.method === "GET" && (url.pathname === "/methodology" || url.pathname === "/methodology/")) {
        await serveMethodology(response);
        return;
      }
      if (request.method === "GET" && url.pathname === "/METHODOLOGY.md") {
        await serveMethodologyMarkdown(response);
        return;
      }
      if (request.method === "GET") {
        const path = url.pathname === "/" ? "/index.html" : url.pathname;
        await serveStatic(response, path);
        return;
      }
      throw new HttpError(405, "Method not allowed.");
    } catch (error) {
      if (error instanceof HttpError) {
        sendJson(response, error.status, { error: error.message });
        return;
      }
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOENT") {
        sendJson(response, 404, { error: "Not found." });
        return;
      }
      const message = error instanceof Error ? error.message : "Server error.";
      sendJson(response, 500, { error: message });
    }
  })();
});

server.listen(PORT, HOST, () => {
  console.log(`Woke GPT harness listening on http://${HOST}:${PORT}`);
  console.log(`methodology ${METHODOLOGY_VERSION}`);
});
