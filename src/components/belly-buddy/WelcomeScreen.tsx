"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useBellyBuddy } from "@/components/belly-buddy/BellyBuddyProvider";
import { KindBubble, PrimaryButton } from "@/components/belly-buddy/ui";

export function WelcomeScreen() {
  const { saveProfile } = useBellyBuddy();
  const router = useRouter();
  const [name, setName] = useState("");

  function continueOnboarding() {
    saveProfile(name);
    router.push("/belly-buddy");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col justify-center px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2rem] border border-[color:var(--bb-line)] bg-[color:var(--bb-cream)] px-6 py-10 shadow-[0_24px_60px_rgba(61,110,84,0.12)] sm:px-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[color:var(--bb-sky)]/70 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-[color:var(--bb-honey)]/35 blur-3xl"
        />

        <p className="relative font-bb-display text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--bb-leaf)]">
          Belly Buddy
        </p>
        <h1 className="relative mt-3 max-w-xl font-bb-display text-4xl leading-[1.05] text-[color:var(--bb-ink)] sm:text-5xl">
          A soft place to notice your belly — and tell the doctor the story.
        </h1>
        <p className="relative mt-4 max-w-lg text-lg text-[color:var(--bb-mute)]">
          We go one tiny step at a time. No wrong answers. Your notes stay on
          this device so you can share them when you are ready.
        </p>

        <KindBubble className="relative mt-8 max-w-md">
          <label htmlFor="bb-name" className="block text-sm font-semibold text-[color:var(--bb-ink)]">
            What should we call you?
          </label>
          <input
            id="bb-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") continueOnboarding();
            }}
            placeholder="Your first name"
            autoComplete="given-name"
            className="mt-2 w-full rounded-2xl border-2 border-[color:var(--bb-line)] bg-white px-4 py-3 text-lg text-[color:var(--bb-ink)] outline-none ring-[color:var(--bb-leaf)] placeholder:text-[color:var(--bb-mute)] focus:ring-2"
          />
          <p className="mt-2 text-sm text-[color:var(--bb-mute)]">
            You can change this later. Friend is fine too.
          </p>
          <div className="mt-5">
            <PrimaryButton onClick={continueOnboarding}>
              Let&apos;s begin
            </PrimaryButton>
          </div>
        </KindBubble>

        <p className="relative mt-8 text-sm text-[color:var(--bb-mute)]">
          Belly Buddy helps you track feelings, food, stress, and sleep for your
          care team. It does not diagnose ulcers or illness — your doctor does
          that.
        </p>
      </motion.div>
    </div>
  );
}
