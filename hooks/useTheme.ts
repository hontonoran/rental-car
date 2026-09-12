"use client";

import { useSyncExternalStore } from "react";

const THEME_STORAGE_KEY = "rental-car:theme";
const THEME_CHANGED_EVENT = "rental-car:theme-changed";

export type Theme = "light" | "dark";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function readTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  return stored === "light" || stored === "dark" ? stored : systemTheme();
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function setTheme(theme: Theme) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new Event(THEME_CHANGED_EVENT));
}

export function toggleTheme() {
  setTheme(readTheme() === "dark" ? "light" : "dark");
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGED_EVENT, onStoreChange);
  };
}

export function useTheme() {
  return useSyncExternalStore(
    subscribeToTheme,
    readTheme,
    () => "light" as Theme,
  );
}
