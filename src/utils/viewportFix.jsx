// ViewportFix.jsx
"use client";
import { useEffect } from "react";

export default function ViewportFix() {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    // iOS fires resize on URL bar show/hide, orientation, keyboard
    window.addEventListener("resize", setVh, { passive: true });
    window.addEventListener("orientationchange", setVh, { passive: true });
    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);
  return null;
}
