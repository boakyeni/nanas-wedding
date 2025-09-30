"use client";
import React, { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // feel free to tweak
      smoothWheel: true,
      smoothTouch: false, // keep touch natural
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);

    return () => cancelAnimationFrame(id);
  }, []);

  return children;
}
