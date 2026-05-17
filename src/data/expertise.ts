export type Tool = {
  name: string;
  description: string;
};

export const TOOLS: Tool[] = [
  { name: "Claude", description: "Reasoning & long-context work" },
  { name: "ChatGPT", description: "Daily-driver LLM" },
  { name: "Copilot", description: "Microsoft 365 enablement" },
  { name: "Gemini", description: "Google workspace AI" },
  { name: "Notion", description: "Knowledge systems" },
  { name: "n8n", description: "Workflow automation" },
  { name: "Tableau", description: "Insights visualization" },
  { name: "Qualtrics", description: "Research at scale" },
];

export const STATS = [
  { value: "14yr", label: "Research & insights" },
  { value: "AI", label: "Enterprise adoption" },
  { value: "AT&T", label: "Current role" },
  { value: "MBA", label: "CSULB · Disruptive Tech" },
];
