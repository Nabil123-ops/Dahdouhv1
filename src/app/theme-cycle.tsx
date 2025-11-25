"use client";

import { useEffect } from "react";

export default function ThemeCycle() {
  useEffect(() => {
    let i = 1;

    const cycle = setInterval(() => {
      document.body.classList.remove("theme-1", "theme-2", "theme-3", "theme-4");
      document.body.classList.add(`theme-${i}`);

      i = i === 4 ? 1 : i + 1;
    }, 2000); // 2 seconds

    return () => clearInterval(cycle);
  }, []);

  return null;
}