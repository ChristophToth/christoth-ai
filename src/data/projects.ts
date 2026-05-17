export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  tags: string[];
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
    cover:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80",
    accent: "from-orange-400/40 to-rose-500/40",
  },
];
