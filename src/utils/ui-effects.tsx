"use client";

import { useEffect } from "react";

/**
 * Dahdouh AI — Ultra UI Effects
 * Includes:
 *  - Parallax background layers
 *  - 3D tilt effect for logo
 *  - Smooth theme cycling
 *  - Animation performance optimization
 */

export default function DahdouhUIEffects() {
  useEffect(() => {
    /* ============================================================
       PARALLAX BACKGROUND LAYERS 
       (Moves 3 background layers based on mouse position)
    ============================================================ */
    const layers = document.querySelectorAll<HTMLElement>(".parallax-layer");

    const handleParallax = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;

      layers.forEach((layer, idx) => {
        const speed = (idx + 1) * 4;
        layer.style.transform = `translate(${x / speed}px, ${y / speed}px)`;
      });
    };

    window.addEventListener("mousemove", handleParallax);

    /* ============================================================
       3D LOGO TILT BASED ON MOUSE POSITION 
    ============================================================ */
    const logo = document.querySelector<HTMLElement>(".dahdouh-logo-wrapper");

    const handleLogoTilt = (e: MouseEvent) => {
      if (!logo) return;
      const rect = logo.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (y / 20).toFixed(2);
      const rotateY = (-x / 20).toFixed(2);

      logo.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    window.addEventListener("mousemove", handleLogoTilt);

    /* ============================================================
       SMOOTH THEME CYCLING (4 THEMES)  
       Changes background every 5 seconds smoothly
    ============================================================ */
    let theme = 1;

    const cycleTheme = () => {
      document.body.classList.remove(
        "theme-1",
        "theme-2",
        "theme-3",
        "theme-4"
      );
      document.body.classList.add(`theme-${theme}`);

      theme = theme === 4 ? 1 : theme + 1;
    };

    const themeInterval = setInterval(cycleTheme, 5000);

    /* ============================================================
       PERFORMANCE MODE (Mobile + Low Power Detection)
    ============================================================ */

    const reduceMotion = () => {
      document.body.style.setProperty("--blur-hover", "blur(0)");
      layers.forEach((layer) => {
        layer.style.transition = "none";
      });
      logo?.style.setProperty("animation", "none");
    };

    // If user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reduceMotion();
    }

    // If device is low power (mobile battery saver)
    if (navigator.userAgent.includes("Android") || navigator.userAgent.includes("iPhone")) {
      const batterySupport = (navigator as any).getBattery?.();
      batterySupport?.then((battery: any) => {
        if (battery.level < 0.2 || battery.charging === false) {
          reduceMotion();
        }
      });
    }

    /* ============================================================
       CLEANUP — Prevent memory leaks
    ============================================================ */
    return () => {
      window.removeEventListener("mousemove", handleParallax);
      window.removeEventListener("mousemove", handleLogoTilt);
      clearInterval(themeInterval);
    };

  }, []);

  return null;
}