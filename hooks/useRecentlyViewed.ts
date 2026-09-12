"use client";

import { useSyncExternalStore } from "react";

const RECENTLY_VIEWED_STORAGE_KEY = "rental-car:recently-viewed";
const RECENTLY_VIEWED_CHANGED_EVENT = "rental-car:recently-viewed-changed";
const RECENTLY_VIEWED_LIMIT = 6;
const EMPTY_RECENTLY_VIEWED: string[] = [];

let cachedStorageValue = "";
let cachedRecentlyViewedIds: string[] = EMPTY_RECENTLY_VIEWED;

export function readRecentlyViewedIds() {
  if (typeof window === "undefined") {
    return EMPTY_RECENTLY_VIEWED;
  }

  try {
    const value =
      window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY) ?? "[]";

    if (value === cachedStorageValue) {
      return cachedRecentlyViewedIds;
    }

    cachedStorageValue = value;
    const parsed = JSON.parse(value);
    cachedRecentlyViewedIds = Array.isArray(parsed)
      ? parsed.filter(Boolean).map(String)
      : EMPTY_RECENTLY_VIEWED;

    return cachedRecentlyViewedIds;
  } catch {
    cachedRecentlyViewedIds = EMPTY_RECENTLY_VIEWED;

    return cachedRecentlyViewedIds;
  }
}

function writeRecentlyViewedIds(ids: string[]) {
  const value = JSON.stringify(ids);

  cachedStorageValue = value;
  cachedRecentlyViewedIds = ids;

  window.localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, value);
  window.dispatchEvent(new Event(RECENTLY_VIEWED_CHANGED_EVENT));
}

function subscribeToRecentlyViewed(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(RECENTLY_VIEWED_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(RECENTLY_VIEWED_CHANGED_EVENT, onStoreChange);
  };
}

export function useRecentlyViewedIds() {
  return useSyncExternalStore(
    subscribeToRecentlyViewed,
    readRecentlyViewedIds,
    () => EMPTY_RECENTLY_VIEWED,
  );
}

export function recordRecentlyViewed(carId: string) {
  const currentIds = readRecentlyViewedIds();
  const nextIds = [
    carId,
    ...currentIds.filter((id) => id !== carId),
  ].slice(0, RECENTLY_VIEWED_LIMIT);

  writeRecentlyViewedIds(nextIds);
}
