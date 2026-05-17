"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { RevealText } from "@/components/ui/RevealText";
import { PROJECTS } from "@/data/projects";

export function Projects() {
  return (
    <section
      id="work"
      aria-label="Selected work"
      className="relative py-32 md:py-44"
    >
      <div className="container-page">
        <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.3em] text-accent"
            >
              ◆ Case themes
            </motion.span>
            <RevealText
              as="h2"
              className="font-display text-display-lg font-semibold tracking-tight text-balance"
            >
              Where the thesis becomes practice.
            </RevealText>
          </div>
          <motion.a
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            href="#contact"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-zinc-200 transition-colors hover:border-accent/60 hover:bg-accent/10 hover:text-white"
          >
            All projects
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
