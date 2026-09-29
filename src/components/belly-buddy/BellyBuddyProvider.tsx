"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loadState,
  saveState,
  setProfile as writeProfile,
  upsertCheckIn,
  clearAllData,
} from "@/lib/belly-buddy/storage";
import type {
  BellyBuddyProfile,
  BellyBuddyState,
  DailyCheckIn,
} from "@/lib/belly-buddy/types";
import { emptyState, todayKey } from "@/lib/belly-buddy/types";

interface BellyBuddyContextValue {
  ready: boolean;
  state: BellyBuddyState;
  today: string;
  todayCheckIn: DailyCheckIn | undefined;
  saveProfile: (name: string) => void;
  saveCheckIn: (checkIn: DailyCheckIn) => void;
  startPlan: () => void;
  resetAll: () => void;
}

const BellyBuddyContext = createContext<BellyBuddyContextValue | null>(null);

export function BellyBuddyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<BellyBuddyState>(emptyState);
  const today = todayKey();

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState(state);
  }, [state, ready]);

  const saveProfile = useCallback((name: string) => {
    const trimmed = name.trim() || "Friend";
    const profile: BellyBuddyProfile = {
      name: trimmed,
      createdAt: new Date().toISOString(),
      planStartDate: null,
    };
    setState((prev) => writeProfile(prev, profile));
  }, []);

  const saveCheckIn = useCallback((checkIn: DailyCheckIn) => {
    setState((prev) => upsertCheckIn(prev, checkIn));
  }, []);

  const startPlan = useCallback(() => {
    setState((prev) => {
      if (!prev.profile) return prev;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          planStartDate: prev.profile.planStartDate ?? todayKey(),
        },
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    setState(clearAllData());
  }, []);

  const value = useMemo<BellyBuddyContextValue>(
    () => ({
      ready,
      state,
      today,
      todayCheckIn: state.checkIns[today],
      saveProfile,
      saveCheckIn,
      startPlan,
      resetAll,
    }),
    [ready, state, today, saveProfile, saveCheckIn, startPlan, resetAll],
  );

  return (
    <BellyBuddyContext.Provider value={value}>
      {children}
    </BellyBuddyContext.Provider>
  );
}

export function useBellyBuddy(): BellyBuddyContextValue {
  const ctx = useContext(BellyBuddyContext);
  if (!ctx) {
    throw new Error("useBellyBuddy must be used inside BellyBuddyProvider");
  }
  return ctx;
}
