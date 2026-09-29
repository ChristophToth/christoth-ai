"use client";

import {
  STORAGE_KEY,
  emptyState,
  type BellyBuddyState,
  type DailyCheckIn,
  type BellyBuddyProfile,
} from "./types";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadState(): BellyBuddyState {
  if (!canUseStorage()) return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as BellyBuddyState;
    if (!parsed || parsed.version !== 1) return emptyState();
    return {
      profile: parsed.profile ?? null,
      checkIns: parsed.checkIns ?? {},
      version: 1,
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state: BellyBuddyState): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function upsertCheckIn(
  state: BellyBuddyState,
  checkIn: DailyCheckIn,
): BellyBuddyState {
  return {
    ...state,
    checkIns: {
      ...state.checkIns,
      [checkIn.date]: checkIn,
    },
  };
}

export function setProfile(
  state: BellyBuddyState,
  profile: BellyBuddyProfile,
): BellyBuddyState {
  return {
    ...state,
    profile,
  };
}

export function clearAllData(): BellyBuddyState {
  const next = emptyState();
  saveState(next);
  return next;
}
