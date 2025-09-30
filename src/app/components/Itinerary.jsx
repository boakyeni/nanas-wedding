"use client";

import React from "react";
import { useInView } from "react-intersection-observer";

/** Props:
 *  schedule: [{ date: string, events: [{ time, name, address }] }]
 *  title?: string
 */
export default function Itinerary({ schedule = [], title = "The Itinerary" }) {
  const gold = "from-[#b29043] via-[#f1c27d] to-[#b29043]";

  return (
    <section className="w-full">
      {/* Title */}
      <div className="text-center mb-8 mt-8">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight flex justify-around">
          <span className={`flex flex-row m-auto bg-clip-text text-transparent bg-gradient-to-b ${gold}`}>
            <span className="font-tangerine align-top  pb-5">The</span> <p className="pt-5 font-mono">ITINERARY</p>
          </span>
        </h2>
      </div>

      {schedule.map((day, di) => (
        <DayBlock key={di} day={day} gold={gold} />
      ))}
    </section>
  );
}

/* ------------ One day section: center line + alternating rows + fade-in ------------ */
function DayBlock({ day, gold }) {
  // Trigger once when ~60% of the day's block is in view
  const { ref, inView } = useInView({
    threshold: 0.60,
    triggerOnce: false,
    rootMargin: "0px 0px -10% 0px",
  });

  return (
    <div ref={ref} className="mb-12">
      <h3 className="text-center text-xs sm:text-sm tracking-widest uppercase text-neutral-500 mb-6">
        {day.date}
      </h3>

      <ul className="relative">
        {/* center line behind dots */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-neutral-300 z-0" />

        {day.events.map((ev, i) => (
          <TimelineRow key={i} ev={ev} index={i} gold={gold} reveal={inView} delayMs={i * 120} />
        ))}
      </ul>
    </div>
  );
}

function TimelineRow({ ev, index, gold, reveal, delayMs }) {
  const isLeft = index % 2 === 0;

  return (
    <li
      className={[
        "relative grid grid-cols-[1fr_24px_1fr] items-start gap-3 sm:gap-6 py-6 sm:py-8",
        "transition-all duration-[2s] ease-out",
        reveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      ].join(" ")}
      style={{ transitionDelay: `${100 + delayMs}ms` }}
    >
      {/* LEFT cell (visible only when isLeft) */}
      <div className={`${isLeft ? "" : "invisible"} pr-3 sm:pr-6 min-w-0`}>
        <EventCard time={ev.time} name={ev.name} address={ev.address} note={ev.note} align="right" />
      </div>

      {/* CENTER dot (above the line) */}
      <div className="flex items-start justify-center">
        <span
          className={`mt-2 h-3 w-3 rounded-full bg-gradient-to-b ${gold} ring-2 ring-white shadow relative z-10`}
        />
      </div>

      {/* RIGHT cell (visible only when !isLeft) */}
      <div className={`${!isLeft ? "" : "invisible"} pl-3 sm:pl-6 min-w-0`}>
        <EventCard time={ev.time} name={ev.name} address={ev.address} note={ev.note} align="left" />
      </div>
    </li>
  );
}

function EventCard({ time, name, address, note, align = "left" }) {
  const alignClass = align === "right" ? "ml-auto text-right" : "mr-auto text-left";
  return (
    <div className={`max-w-md ${alignClass} font-crimson tracking-widest text-lg`}>
      <div className="text-[0.75rem] sm:text-xs tracking-wider text-neutral-500">
        {time.split(" ").length >= 3 ? (
          <>
            <i>{time.split(" ")[0]}</i>{" "}
            {time.split(" ").slice(1).join(" ")}
          </>
        ) : (
          time
        )}
      </div>
      <div className="mt-0.5 font-medium text-neutral-900 text-base sm:text-lg">{name}</div>
      <div className="text-neutral-600 text-sm sm:text-base break-words">{address}</div>
      <div className="text-neutral-600 text-sm sm:text-base break-words">{note}</div>
    </div>
  );
}
