// components/DressCodeCarousel.jsx
"use client";

import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const FALLBACK_ITEMS = [
  { id: "w-trad-1", gender: "women", occasion: "traditional", title: "Kente Wrap", notes: "Statement jewelry; keep shoes neutral.", colors: ["Gold", "Emerald"], image: "/women_dress1.png" },
  { id: "m-trad-1", gender: "men", occasion: "traditional", title: "Kaftan", notes: "Rich kente with simple leather slippers.", colors: ["Gold", "Black"], image: "/kaftan1.png" },
  { id: "m-trad-3", gender: "men", occasion: "traditional", title: "Smock (Fugu)", notes: "Lightweight, pair with neutral trousers.", colors: ["Navy", "White"], image: "/men_dress_trad1.png" },
  { id: "m-formal-1", gender: "men", occasion: "formal", title: "Tux / Black Tie", notes: "Classic black tux; bow tie preferred.", colors: ["Black", "White"], image: "/tux1.png" },
  { id: "w-formal-1", gender: "women", occasion: "formal", title: "Evening Gown", notes: "Floor length; metallic accents welcome.", colors: ["Navy"], image: "/egown.png" },
    { id: "w-formal-3", gender: "women", occasion: "formal", title: "Party Dress", notes: "Floor length; metallic accents welcome.", colors: ["Gold"], image: "/salmonwomendress.png" },
    { id: "w-formal-4", gender: "women", occasion: "formal", title: "Mermaid", notes: "Off the shoulder mermaid", colors: ["Purple"], image: "/purplewomendress.png" },
    { id: "w-formal-5", gender: "women", occasion: "formal", title: "Harmony Gown", notes: "Harmony Gown", colors: ["Blue"], image: "/bluewomendress.png" },
    { id: "w-formal-6", gender: "women", occasion: "formal", title: "Formal Dress", notes: "Formal Dress", colors: ["Blue"], image: "/purplewomendress2.png" },
];

export default function DressCodeCarousel({ items = FALLBACK_ITEMS, id }) {
  const [gender, setGender] = useState("women");
  const [occasion, setOccasion] = useState("traditional");

  const filtered = useMemo(
    () => items.filter(i => i.gender === gender),
    [items, gender]
  );

  return (
    <>
      {/* full-bleed guard (same trick you used) */}
      <div className="relative w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] overflow-x-hidden touch-pan-y">
        <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight flex justify-around">
          <span className={`flex flex-row m-auto bg-clip-text text-transparent text-gradient-gold`}>
            <span className="font-tangerine align-top  pb-5">The</span> <p className="pt-5 font-mono">DRESS</p>
          </span>
        </h2>
      </div>
        {/* centered track */}
        <div id={id} className="relative mx-auto w-full max-w-sm px-4">
          {/* Toggles */}
          <div className="mt-2 flex items-center justify-around gap-3 mx-auto">
            <ToggleGroup
              label="Gender"
              options={[{ value: "men", label: "Men" }, { value: "women", label: "Women" }]}
              value={gender}
              onChange={setGender}
            />
            {/* <ToggleGroup
              label="Style"
              options={[{ value: "formal", label: "Formal" }]}
              value="formal"
              onChange={() => {}}
            /> */}
          </div>

          {/* Swiper: allow visual overflow so side cards peek, but guard above prevents page X-scroll */}
          <div className="mt-4 relative h-[560px]">
            <Swiper
              modules={[EffectCoverflow, Pagination, Keyboard]}
              effect="coverflow"
              keyboard={{ enabled: true }}
              slidesPerView={1}
              centeredSlides
              centeredSlidesBounds
              watchOverflow
              initialSlide={1}
              pagination={{ clickable: true }}
              coverflowEffect={{ rotate: 10, stretch: 0, depth: 120, modifier: 1, slideShadows: false }}
              className="!overflow-visible h-full select-none"
            >
              {filtered.map((item, i) => (
                <SwiperSlide key={item.id} className="!rounded-[28px] !overflow-hidden !bg-transparent">
                  <DressCard item={item} eager={i === 0} />
                </SwiperSlide>
              ))}
            </Swiper>

            {filtered.length === 0 && (
              <div className="mt-4 rounded-xl border border-neutral-200 bg-white/70 p-4 text-center text-sm">
                No looks yet for this selection.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- UI bits ---------- */

function ToggleGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col w-fit">
      <span className="mb-1 text-[11px] tracking-widest text-neutral-500">
        {label.toUpperCase()}
      </span>

      {/* Mobile: full-width row; Desktop: same look */}
      <div className="flex w-full gap-2 p-1 rounded-full bg-neutral-100 ring-1 ring-black/5">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`
                flex-1 min-w-24 h-9 rounded-full text-sm font-medium transition
                sm:flex-none sm:min-w-[90px]
                ${selected ? "text-white purple-royal-gradient shadow" : "text-neutral-800"}
              `}
            >
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


function DressCard({ item, eager = false }) {
  return (
    <div className="relative h-[520px] rounded-[28px] overflow-hidden  isolate">
      {/* full-bleed image (transparent PNGs render fine over checker or plain) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-contain"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />

      {/* Top-left chip */}
      <div className="absolute top-3 left-3">
        <span className="inline-flex items-center h-8 px-3 rounded-full text-xs font-medium text-white purple-royal-gradient shadow">
          {cap(item.occasion)} • {cap(item.gender)}
        </span>
      </div>

      {/* Bottom info — matches your BlurInfoPanel approach */}
      <BlurInfoPanel>
        <h3 className="text-lg font-semibold">{item.title}</h3>
        {item.notes && <p className="mt-1 text-[13px] text-neutral-200">{item.notes}</p>}

        {item.colors?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.colors.map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="inline-flex items-center gap-2 rounded-full px-3 h-8 text-[12px] font-medium text-white dark-royal-gradient ring-1 ring-white/10"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </BlurInfoPanel>
    </div>
  );
}

/* same blur pattern you used */
function BlurInfoPanel({ children }) {
  return (
    <div className="absolute bottom-0 w-full px-4 pb-5">
      <div
        className="
          relative rounded-xl overflow-hidden text-white
          bg-black/55
          supports-[backdrop-filter]:bg-black/30
          supports-[backdrop-filter]:backdrop-blur-sm
          supports-[-webkit-backdrop-filter]:[-webkit-backdrop-filter:blur(6px)]
        "
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="relative p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

/* helpers */
function cap(s) {
  s = String(s || "");
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}
