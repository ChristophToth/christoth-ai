import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = 4174;
const base = `http://127.0.0.1:${port}`;

function start(): ChildProcess {
  return spawn(process.execPath, ["--experimental-strip-types", "src/server.ts"], {
    cwd: root,
    env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

async function waitForServer(child: ChildProcess): Promise<void> {
  let logs = "";
  child.stdout?.on("data", (chunk: Buffer) => {
    logs += chunk.toString();
  });
  child.stderr?.on("data", (chunk: Buffer) => {
    logs += chunk.toString();
  });
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Server exited early.\n${logs}`);
    }
    try {
      const response = await fetch(`${base}/api/health`);
      if (response.ok) {
        return;
      }
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Server did not start.\n${logs}`);
}

async function main(): Promise<void> {
  const child = start();
  try {
    await waitForServer(child);

    const health = await fetch(`${base}/api/health`).then((response) => response.json());
    if (health.methodologyVersion !== "2026-09-28.v0") {
      throw new Error(`Unexpected methodology version: ${health.methodologyVersion}`);
    }

    const page = await fetch(`${base}/`).then((response) => response.text());
    if (!page.includes("Estimates, not meters")) {
      throw new Error("Home page is missing the estimate banner.");
    }

    const methodology = await fetch(`${base}/methodology`).then((response) => response.text());
    if (!methodology.includes("2026-09-28.v0") || !methodology.includes("Energy_Wh")) {
      throw new Error("Methodology page is missing the pack version or formula.");
    }

    const estimate = await fetch(`${base}/api/estimate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        promptTokens: 600,
        completionTokens: 3000,
        tokenSource: "user_entered",
        completionTokensPerSec: 10,
        throughputSource: "user_reported",
        hardwareProfileId: "laptop_cpu",
        regionId: "US",
        priceUsdPerKwh: null,
      }),
    }).then((response) => response.json());
    if (estimate.display?.energy !== "~1.5–4.5 Wh") {
      throw new Error(`Unexpected energy display: ${JSON.stringify(estimate)}`);
    }

    const uncalibrated = await fetch(`${base}/api/estimate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        promptTokens: 100,
        completionTokens: 100,
        hardwareProfileId: "discrete_gpu_consumer",
        regionId: "NYUP",
      }),
    }).then((response) => response.json());
    if (uncalibrated.energyWh !== null) {
      throw new Error("Uncalibrated GPU profile returned watt-hours.");
    }

    const blocked = await fetch(`${base}/api/connectors/estimate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        provider: "anthropic",
        model_id: "claude-haiku-4-5",
        prompt_tokens: 1000,
        completion_tokens: 1000,
        apiKey: "sk-test",
      }),
    });
    if (blocked.status !== 400) {
      throw new Error(`Expected API key rejection, got ${blocked.status}`);
    }

    const cloud = await fetch(`${base}/api/connectors/estimate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        provider: "anthropic",
        model_id: "claude-haiku-4-5",
        prompt_tokens: 1_000_000,
        completion_tokens: 0,
      }),
    }).then((response) => response.json());
    if (cloud.estimate.estimated_Wh !== null || cloud.estimate.estimated_usd !== 1) {
      throw new Error(`Unexpected cloud stub: ${JSON.stringify(cloud)}`);
    }

    console.log("smoke ok");
  } finally {
    child.kill("SIGTERM");
    await once(child, "exit").catch(() => undefined);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
