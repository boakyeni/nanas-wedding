"use client";

import React from "react";

export default function RegistryPage({
  title = "Wedding Registry",
  subtitle = "",
  macysUrl = "https://www.macys.com/registry/Nana-Nimako-Nanaba-Abdul-Wahab-Saliu/1043039",
  cabUrl = "https://www.crateandbarrel.com/gift-registry/nana-nimako-and-abdul-wahab-nanaba-saliu/r7267809",
}) {
  return (
    <section
      id="registry"
      className="relative w-full overflow-hidden"
    >
      {/* Light backdrop */}
      <div
        aria-hidden
        className="absolute inset-0"
      />
      <div
        aria-hidden
        className="absolute inset-0 "
        style={{ maskImage: "linear-gradient(#000 80%, transparent)" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-neutral-800">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center">
            {/* <span className="h-px w-10 bg-black/10" />
             <span className="text-[12px] tracking-[0.22em] uppercase text-neutral-500">
              With Love & Gratitude
            </span> 
            <span className="h-px w-10 bg-black/10" /> */}
          </div>
          <div className="text-center mb-2 mt-4">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight flex justify-around">
          <span className={`flex flex-row m-auto bg-clip-text text-transparent bg-gradient-to-b text-gradient-gold`}>
            <span className="font-tangerine align-top  pb-5">The</span> <p className="pt-5 font-mono">REGISTRY</p>
          </span>
        </h2>
      </div>
          {subtitle ? (
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-neutral-600">
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Cards */}
        <div className="mt-10 grid w-full gap-5 sm:gap-6 md:gap-8 sm:grid-cols-2">
          {/* Macy's */}
          <div className="rounded-3xl border border-black/10 bg-white/90 backdrop-blur-sm shadow-[0_8px_40px_-20px_rgba(0,0,0,0.25)]">
            <div className="px-6 py-7 sm:px-8">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl sm:text-3xl">Macy’s</h2>
                <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-neutral-600">
                  <span className="h-2 w-2 rounded-full bg-neutral-400" />
                  Registry
                </span>
              </div>
              <p className="mt-2 text-neutral-600">
                Classic selections and timeless essentials.
              </p>
              <div className="mt-6">
                <a
                  href={macysUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white shadow transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 purple-royal-gradient"
                >
                  View Macy’s Registry
                </a>
              </div>
            </div>
          </div>

          {/* Crate & Barrel */}
          <div className="rounded-3xl border border-black/10 bg-white/90 backdrop-blur-sm shadow-[0_8px_40px_-20px_rgba(0,0,0,0.25)]">
            <div className="px-6 py-7 sm:px-8">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl sm:text-3xl">
                  Crate &amp; Barrel
                </h2>
                <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-neutral-600">
                  <span className="h-2 w-2 rounded-full bg-neutral-400" />
                  Registry
                </span>
              </div>
              <p className="mt-2 text-neutral-600">
                Modern design for beautiful everyday living.
              </p>
              <div className="mt-6">
                <a
                  href={cabUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white shadow transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 purple-royal-gradient"
                >
                  View Crate &amp; Barrel Registry
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider (subtle, echoes countdown vibe) */}
        
        <div className="m-4 text-center text-xs tracking-[0.22em] uppercase text-neutral-500">
          Packages can be shipped directly to the Nimako & Saliu residence
        </div>
        <div className="m-4 text-center text-xs tracking-[0.22em] uppercase text-neutral-500">
          Address provided in registry shopping cart
        </div>
        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>
    </section>
  );
}
