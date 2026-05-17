export type Service = {
  number: string;
  title: string;
  description: string;
  bullets: string[];
};

export const SERVICES: Service[] = [
  {
    number: "01",
    title: "Strategy",
    description:
      "Turning AI ambition into practical roadmaps: where it belongs, which workflows matter, and what has to change for teams to use it.",
    bullets: [
      "Use-case discovery & prioritization",
      "Adoption frameworks & maturity models",
      "Governance & change management",
    ],
  },
  {
    number: "02",
    title: "Enablement",
    description:
      "Training, prompts, playbooks, and champion systems that turn access into confidence and confidence into repeat behavior.",
    bullets: [
      "Role-based curricula",
      "Prompt libraries & playbooks",
      "Community & champion programs",
    ],
  },
  {
    number: "03",
    title: "Measurement",
    description:
      "Using research instincts to read what is working, what is stalling, and where adoption is becoming part of the operating model.",
    bullets: [
      "Behavioral signals & feedback loops",
      "Workflow depth & role coverage",
      "Measurement that goes beyond pilot",
    ],
  },
];
