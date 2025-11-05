"use client";

import { useEffect, useRef, useState } from "react";

export default function RSVPCircle({
  href = "/rsvp",
  threshold = 8,           // pixels scrolled before showing
  text = "RSVP"
}) {
  const [visible, setVisible] = useState(false);
  const armed = useRef(true); // prevent double-trigger

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (href === "/checkin") {
      const timer = setTimeout(() => {
        setVisible(true);
        armed.current = false;
      }, 7000);
      return () => clearTimeout(timer);
    }
    // If the page is already scrolled (back nav, deep link), show immediately
    if (window.scrollY > threshold) {
      setVisible(true);
      armed.current = false;
      return;
    }

    const reveal = () => {
      if (!armed.current) return;
      if (window.scrollY > threshold) {
        setVisible(true);
        armed.current = false;
        cleanup();
      }
    };

    const onKey = (e) => {
      // also reveal on common “move” keys for accessibility
      const keys = [" ", "Spacebar", "ArrowDown", "PageDown"];
      if (keys.includes(e.key)) {
        setVisible(true);
        armed.current = false;
        cleanup();
      }
    };

    const cleanup = () => {
      window.removeEventListener("scroll", reveal);
      window.removeEventListener("wheel", reveal);
      window.removeEventListener("touchmove", reveal);
      window.removeEventListener("keydown", onKey);
    };

    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("wheel", reveal, { passive: true });
    window.addEventListener("touchmove", reveal, { passive: true });
    window.addEventListener("keydown", onKey);

    return cleanup;
  }, [threshold]);

  return (
    <a
      href={href}
      aria-label="RSVP"
      className={`
        fixed right-6 bottom-6 z-50
        flex h-16 w-16 items-center justify-center rounded-full
        gold-gradient
        text-white font-bold text-sm shadow-lg ring-2 ring-black/10
        transition-all duration-700 text-center leading-none
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
      `}
    >
      {text}
    </a>
  );
}
