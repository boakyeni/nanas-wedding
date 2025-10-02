// components/BridalParty.jsx
"use client";

import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const FALLBACK_ITEMS = [
    { id: 14, name: "Nanu Jalieba", side: "bride", image: "/nanu.jpg", role: 'Matron of Honor' },
    { id: 5, name: "Benjamin Frempong", side: "groom", image: "groom4.jpg", role: "Best Man" },
    { id: 13, name: "Celine Hylton Dei", side: "bride", image: "/celine.jpg", role: 'Maid of Honor' },
    { id: 2, name: "Nana K", side: "groom", image: "groom1.jpeg", singleLine: true },
    { id: 1, name: "Maggie Moreton", side: "bride", image: "/maggie.jpg" },
    { id: 4, name: "Ussifu Obama", side: "groom", image: "groom3.jpg" },
    { id: 12, name: "Yuliya Meskela", side: "bride", image: "/yuliya2.jpg" },
    { id: 3, name: "Kumi Isaac", side: "groom", image: "isaac.jpg" },
    { id: 15, name: "Chloe Hoses", side: "bride", image: "/chloe.jpeg" },
    { id: 7, name: "Andrew Zato", side: "groom", image: "groom6.jpg" },
    { id: 16, name: "Naomi Smith-George", side: "bride", image: "/naomi.jpeg" },
    { id: 8, name: "Surag", side: "groom", image: "groom7.jpg", singleLine: true },
    { id: 17, name: "Janet Boachie", side: "bride", image: "/janet2.jpeg" },
    { id: 9, name: "Maxwell Takyi", side: "groom", image: "groom8.jpg" },
    { id: 18, name: "Christa Boachie", side: "bride", image: "/christa.jpg" },
    { id: 10, name: "Obeng Walker", side: "groom", image: "groom9.jpg" },
    { id: 19, name: "Lovia Ampofo", side: "bride", image: "/lovia3.jpg" },
    { id: 6, name: "Randy Marfo", side: "groom", image: "groom5.jpg" },
    { id: 20, name: "Effie Baidoo", side: "bride", image: "/effie.jpeg" },
    { id: 11, name: "Emmanuel Fynn", side: "groom", image: "groom10.jpg" },
];

export default function BridalParty({ items = FALLBACK_ITEMS, id }) {
    const [filter, setFilter] = useState("all"); // "all" | "bride" | "groom"
    const filtered = useMemo(() => (filter === "all" ? items : items.filter(p => p.side === filter)), [items, filter]);

    return (
        <section id={id} className="w-full scroll-mt-24 bg-[#f8f6f2]">
            {/* Header + filter */}
            <div className="flex flex-col gap-3 sm:items-center mt-2">
                <div className="text-center mb-2">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight flex justify-around">
                        <span className={`flex flex-row m-auto bg-clip-text text-transparent bg-gradient-to-b text-gradient-gold`}>
                            <span className="font-tangerine align-top  pb-5">The</span> <p className="pt-5 font-mono">Bridal Party</p>
                        </span>
                    </h2>
                </div>
                <ToggleGroup
                    label="Show"
                    options={[
                        { label: "All", value: "all" },
                        { label: "Bridesmaids", value: "bride" },
                        { label: "Groomsmen", value: "groom" },
                    ]}
                    value={filter}
                    onChange={setFilter}
                />
            </div>

            {/* MOBILE: exactly 1 per page */}
            <div className="sm:hidden mt-4 relative w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] overflow-x-hidden">
                <Swiper
                    modules={[Pagination, Keyboard]}
                    keyboard={{ enabled: true }}
                    slidesPerView={1}
                    spaceBetween={0}
                    centeredSlides={false}
                    slidesOffsetBefore={0}
                    slidesOffsetAfter={0}
                    watchOverflow
                    pagination={{ clickable: true }}
                    className="!pb-8 !overflow-visible"
                >
                    {filtered.map(p => (
                        <SwiperSlide key={p.id} className="!w-full">
                            {/* put padding INSIDE the slide so the slide itself is still full width */}
                            <div className="px-4">
                                <PartyCard person={p} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* DESKTOP: grid */}
            <div className="mt-6 hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map(p => (
                    <PartyCard key={p.id} person={p} />
                ))}
            </div>
        </section>
    );
}

/* UI bits */

function PartyCard({ person }) {
    const parts = person.name.trim().split(" ");
    const first = parts[0];                // first word only
    const last = parts.slice(1).join(" "); // everything else

    const getBadgeClasses = () => {
        if (person.side === "bride" && person.role) {
            return "bg-gradient-to-r from-fuchsia-500 to-purple-600";
        }
        if (person.side === "groom" && person.role) {
            return "bg-gradient-to-r from-blue-600 to-indigo-700";
        }
        if (person.side === "bride") {
            return "purple-royal-gradient";
        }
        return "dark-royal-gradient";
    };

    const label =
        person.role && person.role.trim() !== ""
            ? person.role
            : person.side === "bride"
                ? "Bridesmaid"
                : "Groomsman";

    const Badge = (
        <span
            className={`inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide text-white shadow-md ${getBadgeClasses()}`}
        >
            {label}
        </span>
    );

    return (
        <div className="relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden bg-white transition-all duration-500 ease-out group flex flex-col">
            {/* Image */}
            <div className="aspect-[3/4] w-full overflow-hidden relative">
                <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />
            </div>

            {/* Text area — fixed height ensures uniform cards */}
            <div className="px-6 py-5 h-[150px]">
                {person.singleLine ? (
                    // --- Single-line: center content ---
                    <div className="h-full flex items-start justify-between gap-3">
                        <div className="flex flex-row items-center justify-between w-full">
                            <h3 className="font-tangerine text-5xl font-bold text-neutral-900 leading-tight group-hover:text-purple-800 transition-colors">
                                {person.name}
                            </h3>
                            {Badge}
                        </div>
                    </div>
                ) : (
                    // --- Default split into 2 lines ---
                    <div className="flex flex-col justify-center h-full">
                        <div className="flex items-center justify-between">
                            <h3
                                className={`font-tangerine text-5xl font-bold tracking-wide leading-tight group-hover:text-purple-800 transition-colors ${person.side === "bride" ? "text-gradient-gold" : "text-blue-950"
                                    }`}
                            >
                                {first}
                            </h3>
                            {Badge}
                        </div>
                        <h3
                            className={`font-tangerine text-5xl font-bold text-neutral-900 tracking-wide leading-tight group-hover:text-purple-800 transition-colors ${person.side === "bride" ? "text-gradient-gold" : ""
                                }`}
                        >
                            {last}
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
}







function ToggleGroup({ label, options, value, onChange }) {
    return (
        <div className="flex flex-col px-4 max-w-[400px]">
            <span className="mb-1 text-[11px] tracking-widest text-neutral-500">{label.toUpperCase()}</span>
            <div className="flex gap-2 rounded-full bg-neutral-100 p-1 ring-1 ring-black/5">
                {options.map(opt => {
                    const selected = value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            className={`flex-1 min-w-0 h-9 rounded-full px-3 text-sm font-medium transition
              sm:flex-none sm:min-w-[110px]
              ${selected ? "text-white purple-royal-gradient shadow" : "text-neutral-800"}`}
                        >
                            <span className="truncate">{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
