export type FAQItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What does AI adoption actually look like in practice?",
    answer:
      "Less about the model, more about the muscle. Real adoption is a behavior-change problem dressed up as a technology one: use-case discovery, role-based enablement, prompt libraries, governance, and measurement that goes well beyond pilot vanity metrics. I work backwards from how teams actually do their jobs, not from the tooling roadmap.",
  },
  {
    question: "Why does a research and insights background matter for AI?",
    answer:
      "Because AI use cases live or die on understanding the human in the loop. Fourteen years of consumer empathy and synthesis translates directly into framing the right problems, designing prompts and workflows people will actually adopt, and reading signal from noise once things are live.",
  },
  {
    question: "Are you available for advisory, speaking, or new roles?",
    answer:
      "Yes — selectively. I'm based in Southern California and currently focused on AI adoption inside AT&T, while finishing my MBA at CSULB. Open to advisory engagements, panels, and conversations about senior roles where AI adoption is the strategic priority, not a side project.",
  },
  {
    question: "Why the MBA in Disruptive Technologies?",
    answer:
      "Because the next decade of work isn't just about adopting AI — it's about navigating overlapping waves of AI, blockchain, and sustainability that reshape how organizations operate. The CSULB program is built explicitly around those forces, which mirrors how I think about strategy.",
  },
  {
    question: "How do you measure AI adoption beyond a pilot?",
    answer:
      "By tracking behavior, not just usage. License attach-rate is the floor, not the ceiling. I look at frequency, depth, breadth across roles, time-to-value on real workflows, and qualitative signal from champions in the field — then connect those back to the business outcomes leadership actually cares about.",
  },
];
