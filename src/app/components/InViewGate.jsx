// components/InViewGate.jsx
"use client";
import { useInView } from "react-intersection-observer";

export default function InViewGate({
  children,
  amount = 0.6,   // % of target that must be visible (0..1)
  once = true,
  rootMargin = "0px 0px -10% 0px", // start a bit before it fully centers
  className = "",
  activeClass = "is-active",
}) {
  const { ref, inView } = useInView({ threshold: amount, triggerOnce: once, rootMargin });
  return (
    <div ref={ref} className={`${className} ${inView ? activeClass : ""}`}>
      {children}
    </div>
  );
}
