"use client";

import { useEffect } from "react";

export default function ThemeCycle() {
  useEffect(() => {
    if (typeof window === "undefined") return; // Safety for SSR

    let i = 1;
    const themes = ["theme-1", "theme-2", "theme-3", "theme-4"];

    // Set initial theme instantly
    document.body.classList.add(themes[0]);

    const cycle = setInterval(() => {
      // Remove all themes
      themes.forEach((t) => document.body.classList.remove(t));

      // Add next theme
      document.body.classList.add(themes[i]);

      // Increment cycle
      i = (i + 1) % themes.length;
    }, 2000); // change every 2 seconds

    return () => clearInterval(cycle);
  }, []);

  return null;
}