"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import CardFilter from "./CardFilter";
/**
 * Props:
 * - items: [{ slug, title, subtitle, image, tags:[], area, ... }]
 * - id?: string (for in-page anchor)
 * Vibe coded
 */
export default function ActivityCardStack({ items, id }) {

    // Build a unique, sorted list of categories (tags)
    const categories = useMemo(() => {
        const set = new Set();
        for (const a of items) (a.tags || []).forEach(t => set.add(t));
        return Array.from(set).sort();
    }, [items]);

    const [selectedCategory, setSelectedCategory] = useState(null); // string | null
    const [open, setOpen] = useState(false); // dropdown open/close

    // Filtered list (by single category)
    const filtered = useMemo(() => {
        if (!selectedCategory) return items;
        return items.filter(a => (a.tags || []).includes(selectedCategory));
    }, [items, selectedCategory]);

    // Close dropdown when clicking outside
    const popRef = useRef(null);
    useEffect(() => {
        const onDocClick = (e) => {
            if (!popRef.current) return;
            if (!popRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    // Press Escape to close
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    // Force Swiper to remount on filter change so it resets to the first slide
    const swiperKey = selectedCategory || "all";

    return (
        <>
            {/* Full-bleed guard: prevents page X-scroll without global CSS */}
            <div
                className="
          relative w-screen
          ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]
          overflow-x-hidden
          touch-pan-y
        "
            >
                      
        <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight flex justify-around">
          <span className={`flex flex-row m-auto bg-clip-text text-transparent text-gradient-gold`}>
            <span className="font-tangerine align-top  pb-5">The</span> <p className="pt-5 font-mono">CITY</p>
          </span>
        </h2>
      </div>
                {/* Your centered card stack area */}
                <div id={id} className="relative mx-auto w-full max-w-sm px-4 h-[650px]">
                    {/* Filter stays absolute to this centered container */}
                    <CardFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />

                    {/* Swiper (allow visual overflow so back cards show) */}
                    <Swiper
                        key={swiperKey}
                        modules={[EffectCards]}
                        effect="cards"
                        grabCursor
                        className="!overflow-visible h-[600px] select-none"
                    >
                        {filtered.map((a, i) => (
                            <SwiperSlide
                                key={a.slug}
                                className="!rounded-[28px] !overflow-hidden !bg-transparent"
                            >
                                <div className="relative h-full w-full rounded-[28px] overflow-hidden shadow-xl ring-1 ring-black/5 bg-transparent isolate">
                                    {/* image, gradient, info panel, CTA — unchanged */}
                                    <img
                                        src={a.image}
                                        alt={a.title}
                                        className="absolute inset-0 h-full w-full object-cover"
                                        loading={i === 0 ? "eager" : "lazy"}
                                        fetchPriority={i === 0 ? "high" : "auto"}
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                                    <div className="absolute top-4 left-4">
                                        <span className="inline-block rounded-full bg-white/80 backdrop-blur-md text-[11px] px-3 py-1 font-medium text-neutral-800 shadow">
                                            {(a.tags && a.tags[0]) || "EXPLORE"}
                                        </span>
                                    </div>

                                    <BlurInfoPanel>
                                        <p className="text-[12px] uppercase tracking-widest text-neutral-200">
                                            {a.area || "Ghana"}
                                        </p>
                                        <h2 className="mt-1 text-2xl font-semibold">{a.title}</h2>
                                        {a.subtitle && (
                                            <p className="mt-1 text-sm text-neutral-200">{a.subtitle}</p>
                                        )}
                                    </BlurInfoPanel>

                                    <div className="absolute left-4 bottom-4">

                                        <button
                                            onClick={() => {
                                                const isCollection = Array.isArray(a.locations) && a.locations.length > 0;
                                                const href = isCollection ? `/ghana/collection/${encodeURIComponent(a.slug)}`
                                                    : `/ghana/${encodeURIComponent(a.slug)}`;
                                                window.location.href = href
                                            }}
                                            className="py-2 px-4 rounded-xl text-white font-semibold tracking-tight shadow-lg bg-gradient-to-r from-[#b29043] via-[#f1c27d] to-[#b29043] hover:opacity-95 active:scale-95 transition"
                                        >
                                            Learn more
                                        </button>

                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {filtered.length === 0 && (
                        <div className="mt-4 rounded-xl border border-neutral-200 bg-white/70 p-4 text-center text-sm">
                            No activities in “{selectedCategory}”.
                            <button className="ml-2 underline" onClick={() => setSelectedCategory(null)}>
                                Show all
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
{/*Same every where */ }
function BlurInfoPanelBasic({ children }) {
    return (
        <div className="absolute bottom-0 w-full px-4 pb-20">
            <div className="relative rounded-xl overflow-hidden text-white bg-black/55">
                {/* subtle top feather so it blends into the photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none" />
                <div className="relative p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

/* tweaks on safari sometimes */
function BlurInfoPanel({ children }) {
    return (
        <div className="absolute bottom-0 w-full px-4 pb-20">
            <div
                className="
          relative rounded-xl overflow-hidden text-white
          bg-black/55                        /* solid base so no white flash */
          supports-[backdrop-filter]:bg-black/30
          supports-[backdrop-filter]:backdrop-blur-sm
          supports-[-webkit-backdrop-filter]:[-webkit-backdrop-filter:blur(6px)]
        "
            >
                {/* soft feather into the photo */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="relative p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

