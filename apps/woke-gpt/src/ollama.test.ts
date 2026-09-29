import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseOllamaChat } from "./ollama.ts";

describe("Ollama scaffold", () => {
  it("reads measured token counts and completion tokens per second", () => {
    const parsed = parseOllamaChat(
      {
        model: "llama3.2",
        message: { content: "hello" },
        prompt_eval_count: 12,
        eval_count: 8,
        eval_duration: 2_000_000_000,
      },
      "llama3.2",
    );
    assert.equal(parsed.promptTokens, 12);
    assert.equal(parsed.completionTokens, 8);
    assert.equal(parsed.generationSeconds, 2);
    assert.equal(parsed.completionTokensPerSec, 4);
  });

  it("refuses a runtime payload without token counts", () => {
    assert.throws(() => parseOllamaChat({ message: { content: "hi" } }, "llama3.2"), /token counts/);
  });
});
