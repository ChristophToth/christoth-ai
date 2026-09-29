/**
 * Local OSS runtime scaffold. Talks to a local Ollama server.
 * No cloud account. If Ollama is down, callers fall back to a labeled token estimate.
 */

export type OllamaChatResult = {
  model: string;
  content: string;
  promptTokens: number;
  completionTokens: number;
  /** Completion tokens / generation seconds. Null if the runtime omitted timing. */
  completionTokensPerSec: number | null;
  generationSeconds: number | null;
};

type OllamaChatResponse = {
  model?: string;
  message?: { content?: string };
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
  error?: string;
};

export function parseOllamaChat(body: OllamaChatResponse, fallbackModel: string): OllamaChatResult {
  if (typeof body.error === "string" && body.error.length > 0) {
    throw new Error(body.error);
  }
  const promptTokens = body.prompt_eval_count;
  const completionTokens = body.eval_count;
  if (!Number.isInteger(promptTokens) || !Number.isInteger(completionTokens)) {
    throw new Error("Local runtime response did not include token counts.");
  }
  const content = body.message?.content ?? "";
  let completionTokensPerSec: number | null = null;
  let generationSeconds: number | null = null;
  if (typeof body.eval_duration === "number" && body.eval_duration > 0 && (completionTokens ?? 0) > 0) {
    generationSeconds = body.eval_duration / 1e9;
    completionTokensPerSec = (completionTokens as number) / generationSeconds;
  }
  return {
    model: body.model ?? fallbackModel,
    content,
    promptTokens: promptTokens as number,
    completionTokens: completionTokens as number,
    completionTokensPerSec,
    generationSeconds,
  };
}

export async function ollamaChat(options: {
  host: string;
  model: string;
  messages: { role: "user" | "assistant"; content: string }[];
  signal?: AbortSignal;
}): Promise<OllamaChatResult> {
  const response = await fetch(new URL("/api/chat", options.host), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      stream: false,
    }),
    signal: options.signal,
  });
  const text = await response.text();
  let parsed: OllamaChatResponse;
  try {
    parsed = JSON.parse(text) as OllamaChatResponse;
  } catch {
    throw new Error(`Local runtime returned a non-JSON response (${response.status}).`);
  }
  if (!response.ok) {
    throw new Error(parsed.error ?? `Local runtime error (${response.status}).`);
  }
  return parseOllamaChat(parsed, options.model);
}

export async function ollamaReachable(host: string, signal?: AbortSignal): Promise<boolean> {
  try {
    const response = await fetch(new URL("/api/tags", host), { signal });
    return response.ok;
  } catch {
    return false;
  }
}
