"use client";

import React from "react";
import Image from "next/image";

export default function PassportCover({
  bgClass = "purple-royal-gradient", // <- use your existing purple royal gradient utility
  titleTop = "PASSPORT",
  couple = { bride: "Nana-Serwaa", groom: "Abdul Wahab" },
  bottomText = "Nana-Serwaa & Abdul Wahab's Wedding",
  logo = "/n_w.png",
  className = "",
}) {
  const gold = "from-[#b29043] via-[#f1c27d] to-[#b29043]"; // same gold as your invite page

  return (
    <section className={`w-full ${className}`}>
      {/* Outer frame ensures a nice portrait proportion while staying responsive */}
      <div
        className={`relative mx-auto aspect-[3/5] max-w-sm sm:max-w-md md:max-w-lg rounded-[28px] overflow-hidden shadow-xl print:shadow-none ${bgClass} passport-cover`}
      >
        {/* Soft vignette + linen texture hint */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.22)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12),transparent_20%,transparent_80%,rgba(0,0,0,0.08))] mix-blend-soft-light" />
        </div>

        {/* Decorative border lines / deboss effect */}
        <div className="absolute inset-3 rounded-2xl " />
        <div className="absolute inset-5 rounded-2xl " />

        {/* Content stack */}
        <div className="relative z-10 h-full w-full flex flex-col items-center px-6">
          {/* Top word: PASSPORT */}
          <div className="mt-8 sm:mt-10 pt-8 w-full flex justify-around">
            <p
              className={`text-center tracking-[0.35em] text-5xl bg-clip-text text-transparent bg-gradient-to-b font-crimson font-semibold ${gold}`}
            >
              {titleTop.toUpperCase()}
            </p>
          </div>

          {/* Center logo area */}
          <div className="flex-1 w-full flex items-center justify-center">
            {logo ? (
              <div className="w-full flex items-center justify-center">
                <Image src={logo} alt="N and W Wedding Logo" width={1000} height={1000}/>
              </div>
            ) : (
              <LogoPlaceholder goldClass={gold} />
            )}
          </div>

          {/* Bottom country-style label -> couple's wedding */}
          <div className="mb-24 text-center flex flex-col justify-around w-[70%]">
            <p
              className={`text-[11px] text-sm tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-b ${gold} flex flex-col font-parisienne`}
            >
              To the wedding of
            </p>
            <h2
              className={`mt-2 pt-2 text-5xl bg-clip-text text-transparent bg-gradient-to-b ${gold} flex flex-col font-mrs_saint_delafield`}
            >
              <span>{couple.bride}</span> <span>&</span> <span>{couple.groom}</span>
            </h2>
          </div>
        </div>

        {/* Center gutter shine */}
        {/* <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-white/20 opacity-70" />
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-16 bg-white/10 blur-xl opacity-30" /> */}
      </div>
    </section>
  );
}

function LogoPlaceholder({ goldClass }) {
  return (
    <div
      className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full  flex items-center justify-center"
      aria-label="Logo placeholder"
    >
      <span
        className={`text-[10px] tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-b ${goldClass}`}
      >
        YOUR LOGO
      </span>
    </div>
  );
}
