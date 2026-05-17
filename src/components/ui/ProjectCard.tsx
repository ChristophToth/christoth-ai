"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const transform = useMotionTemplate`perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  const glow = useMotionTemplate`radial-gradient(400px circle at ${glowX}% ${glowY}%, rgba(124,92,255,0.18), transparent 60%)`;

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateY.set((x - 0.5) * 8);
    rotateX.set(-(y - 0.5) * 8);
    glowX.set(x * 100);
    glowY.set(y * 100);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        delay: (index % 2) * 0.08,
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform }}
      className="group relative overflow-hidden rounded-3xl border border-white/5 bg-ink-800 will-change-transform"
    >
      <a
        href={project.liveUrl ?? "#"}
        target={project.liveUrl ? "_blank" : undefined}
        rel={project.liveUrl ? "noreferrer noopener" : undefined}
        aria-label={`View ${project.title}`}
        className="block"
      >
        <div className="relative aspect-[16/11] overflow-hidden">
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-70 transition-opacity duration-700 group-hover:opacity-30",
              project.accent,
            )}
          />
          <Image
            src={project.cover}
            alt={`${project.title} preview`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />

          <motion.div
            aria-hidden
            style={{ backgroundImage: glow }}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />

          <div className="absolute left-6 top-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-ink-950/50 px-3 py-1 text-xs font-medium text-zinc-200 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="absolute right-6 top-6 grid h-11 w-11 translate-y-1 place-items-center rounded-full bg-white/90 text-ink-950 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-5 w-5" />
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
                {project.client} · {project.year}
              </div>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
                {project.title}
              </h3>
            </div>
            {project.liveUrl && (
              <span className="hidden items-center gap-2 rounded-full border border-white/15 bg-ink-950/60 px-4 py-2 text-sm text-white backdrop-blur-md transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-white md:inline-flex">
                View live
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </div>
      </a>
    </motion.article>
  );
}
