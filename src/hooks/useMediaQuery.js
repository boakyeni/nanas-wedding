"use client";
import { useEffect, useState } from "react";

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Guard SSR
    if (typeof window === "undefined") return;
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();               // set initial
    m.addEventListener?.("change", onChange);
    // Safari <14 fallback
    m.addListener?.(onChange);

    return () => {
      m.removeEventListener?.("change", onChange);
      m.removeListener?.(onChange);
    };
  }, [query]);

  return matches;
}
