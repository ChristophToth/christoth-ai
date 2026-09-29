"use client";

import { BellyBuddyNav } from "@/components/belly-buddy/BellyBuddyNav";
import { useBellyBuddy } from "@/components/belly-buddy/BellyBuddyProvider";
import { WelcomeScreen } from "@/components/belly-buddy/WelcomeScreen";
import { usePathname } from "next/navigation";

export function BellyBuddyShell({ children }: { children: React.ReactNode }) {
  const { ready, state } = useBellyBuddy();
  const pathname = usePathname();

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <p className="font-bb-display text-xl text-[color:var(--bb-ink)]">
          Warming up your Belly Buddy…
        </p>
      </div>
    );
  }

  if (!state.profile) {
    return <WelcomeScreen />;
  }

  const showNav = pathname.startsWith("/belly-buddy");

  return (
    <>
      {showNav ? <BellyBuddyNav name={state.profile.name} /> : null}
      {children}
      <footer className="mx-auto max-w-3xl px-4 pb-10 pt-4 text-center text-sm text-[color:var(--bb-mute)] sm:px-6">
        Belly Buddy is a personal tracking helper, not medical advice or a
        diagnosis. Please share your notes with a doctor or clinician.
      </footer>
    </>
  );
}
