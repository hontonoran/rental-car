"use client";

import { useSyncExternalStore } from "react";

const FAVORITES_STORAGE_KEY = "rental-car:favorites";
const FAVORITES_CHANGED_EVENT = "rental-car:favorites-changed";
const EMPTY_FAVORITES: string[] = [];

let cachedStorageValue = "";
let cachedFavoriteIds: string[] = EMPTY_FAVORITES;

export function readFavoriteIds() {
  if (typeof window === "undefined") {
    return EMPTY_FAVORITES;
  }

  try {
    const value = window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]";

    if (value === cachedStorageValue) {
      return cachedFavoriteIds;
    }

    cachedStorageValue = value;
    const parsed = JSON.parse(value);
    cachedFavoriteIds = Array.isArray(parsed)
      ? parsed.filter(Boolean).map(String)
      : EMPTY_FAVORITES;

    return cachedFavoriteIds;
  } catch {
    cachedFavoriteIds = EMPTY_FAVORITES;

    return cachedFavoriteIds;
  }
}

function writeFavoriteIds(ids: string[]) {
  const value = JSON.stringify(ids);

  cachedStorageValue = value;
  cachedFavoriteIds = ids;

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, value);
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
}

function subscribeToFavorites(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(FAVORITES_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(FAVORITES_CHANGED_EVENT, onStoreChange);
  };
}

export function useFavoriteIds() {
  return useSyncExternalStore(
    subscribeToFavorites,
    readFavoriteIds,
    () => EMPTY_FAVORITES,
  );
}

export function toggleFavorite(carId: string) {
  const favoriteIds = readFavoriteIds();
  const isFavorite = favoriteIds.includes(carId);
  const nextFavoriteIds = isFavorite
    ? favoriteIds.filter((id) => id !== carId)
    : [...favoriteIds, carId];

  writeFavoriteIds(nextFavoriteIds);

  return !isFavorite;
}
