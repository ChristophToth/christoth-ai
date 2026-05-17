export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  tags: string[];
  summary: string;
  signal: string;
  cover: string;
  liveUrl?: string;
  accent: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "marketing-ai-rollout",
    title: "Scaling AI fluency across marketing",
    client: "Enterprise marketing",
    year: "2024 — present",
    tags: ["Strategy", "Enablement", "Change Management"],
    summary:
      "A practical adoption system for helping marketing teams move from experimentation to repeatable AI-assisted workflows.",
    signal:
      "Focus: role-based fluency, champion behavior, and reusable patterns rather than one-off prompt demos.",
    cover:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80",
    accent: "from-violet-500/40 to-fuchsia-500/40",
  },
  {
    slug: "knowledge-management-redesign",
    title: "Research & insights knowledge systems",
    client: "Research & insights",
    year: "2023 — 2024",
    tags: ["Knowledge Mgmt", "AI Search", "Workflow"],
    summary:
      "A shift from static insight repositories toward knowledge systems that make past learning easier to retrieve and reuse.",
    signal:
      "Focus: findability, synthesis, and trusted context for faster decision support.",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80",
    accent: "from-sky-500/40 to-cyan-400/40",
  },
  {
    slug: "ai-use-case-discovery",
    title: "AI use-case discovery operating rhythm",
    client: "Cross-functional",
    year: "2024",
    tags: ["Discovery", "Prioritization", "Workshops"],
    summary:
      "A repeatable method for moving from scattered AI ideas to prioritized workflows with owners, value hypotheses, and next actions.",
    signal:
      "Focus: identifying where behavior change, data readiness, and business value intersect.",
    cover:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600&q=80",
    accent: "from-emerald-400/40 to-lime-400/40",
  },
  {
    slug: "ai-fluency-curriculum",
    title: "Role-based AI fluency systems",
    client: "Workforce Enablement",
    year: "2024 — 2025",
    tags: ["Training", "Playbooks", "Champion Network"],
    summary:
      "A role-based fluency approach that teaches AI through real tasks, reusable examples, and social proof from early adopters.",
    signal:
      "Focus: confidence, repetition, and momentum after the first training moment.",
    cover:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80",
    accent: "from-orange-400/40 to-rose-500/40",
  },
];
