'use client'

import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

/* ------------------------------- DATA ---------------------------------- */
const HOTELS = [
  {
    name: "Kempinski Hotel Gold Coast City",
    area: "Ridge, Accra",
    tags: ["Pool", "Spa", "5★"],
    phone: "+233 302 746 000",
    image: "/kp.jpg",
    links: [{ label: "Website", url: "https://www.kempinski.com/en/accra" }],
    coords: { lat: 5.5566, lng: -0.1973, label: "Kempinski Accra" },
    notes: "Central, business-district location. Good for groups.",
  },
  {
    name: "Movenpick Ambassador Hotel Accra",
    area: "Accra",
    tags: ["Central", "5★"],
    phone: "+233 30 221 0630",
    image: "/mah.jpg",
    links: [{ label: "Website", url: "https://movenpick.accor.com/en/africa/ghana/accra/moevenpick-ambassador-hotel-accra.html" }],
    coords: { lat: 5.5832, lng: -0.1518, label: "Movenpick Ambassador Hotel", googleUrl: "https://maps.app.goo.gl/2jHY1jkKessC1Btm9" },
    notes: "Ensure to book Accra location",
  },
  {
    name: "Number One Oxford Street",
    area: "Osu, Accra",
    tags: ["Central", "5★"],
    phone: "+233 59 692 0856",
    image: "/oxford1.webp",
    links: [
      { label: "Instagram", url: "https://www.instagram.com/no1oxfordstreet/?hl=en" },
      { label: "Website", url: "https://1oxfordstreetaccra.com/" }
    ],
    coords: { lat: 5.5607, lng: -0.1852, label: "No1 Oxford", googleUrl: "https://maps.app.goo.gl/eSXPpqiPgJVgKxpq5" },
    notes: "",
  },
  {
    name: "Fiesta Residences",
    area: "Cantoments, Accra",
    tags: ["Serviced-Apartments", "4★"],
    phone: "+233 30 274 0811",
    image: "/fr.jpg",
    links: [{ label: "Website", url: "https://fiestaresidences.com/" }],
    coords: { lat: 5.5607, lng: -0.1852, label: "Fiesta Residences", googleUrl: "https://maps.app.goo.gl/zKBbXRecPhr1mZ8y6" },
    notes: "Great for longer stays; Ideal Location near Jubilee House",
  },
  {
    name: "Lancaster Accra",
    area: "Airport Residental, Accra",
    tags: ["Pool", "4★"],
    image: "/lh.jpg",
    phone: "+233 030 221 3161",
    links: [{ label: "Website", url: "https://lancasteraccra.com/" }],
    coords: { lat: 5.5607, lng: -0.1852, label: "Lancaster Accra", googleUrl: "https://maps.app.goo.gl/y3FEPUVrX78hNGHdA" },
    notes: "Proximity to Airport",
  },
]

/* ------------------------------- THEME --------------------------------- */
const GOLD = '#E9D8A6'
const PURPLE = '#371f76'
const ROYAL = '#6d28d9'

// Marker icon
function gradientMarkerIcon(active = false) {
  const size = active ? 44 : 38
  return L.divIcon({
    className: 'wedding-marker',
    iconSize: [size, size],
    html: `
      <div class="marker-wrap ${active ? 'active' : ''}" style="width:${size}px;height:${size}px">
        <div class="marker-core"></div>
      </div>
    `,
    popupAnchor: [0, -size / 2],
    tooltipAnchor: [0, -size / 2],
  })
}

// one-time CSS (markers + fades)
let _markersCSS = false
function ensureMarkerStyles() {
  if (_markersCSS || typeof document === 'undefined') return
  _markersCSS = true
  const s = document.createElement('style')
  s.innerHTML = `
    .marker-wrap { position: relative; display: grid; place-items: center; border-radius: 9999px;
      box-shadow: 0 8px 18px rgba(55,31,118,0.25), 0 2px 6px rgba(0,0,0,0.15); }
    .marker-wrap::after { content: ''; position: absolute; inset: 0; border-radius: 9999px; padding: 2px;
      background: linear-gradient(135deg, ${ROYAL}, ${GOLD});
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude; }
    .marker-core { width: 70%; height: 70%; border-radius: 9999px;
      background: radial-gradient(circle at 30% 30%, ${GOLD}, ${PURPLE}); }
    .marker-wrap.active { animation: pulse 1.6s ease-in-out infinite; }
    @keyframes pulse { 0%,100%{ transform: scale(1); } 50%{ transform: scale(1.06); } }

    /* simple fade utility */
    .fade-enter { opacity: 0; transform: translateY(6px); }
    .fade-enter-active { opacity: 1; transform: translateY(0); transition: opacity 220ms ease, transform 220ms ease; }
    .fade-exit { opacity: 1; }
    .fade-exit-active { opacity: 0; transition: opacity 160ms ease; }
  `
  document.head.appendChild(s)
}

/* -------------------------------- UTILS -------------------------------- */
const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
const uniqueTags = list => Array.from(new Set(list.flatMap(h => h.tags))).sort()

/* ---------------------------- MAP WIDGET ------------------------------- */
function HotelsLeafletMap({ list, selectedName, showPopups = true, onMarkerClick }) {
  const mapRef = useRef(null)
  const markerRefs = useRef({})
  useEffect(() => { ensureMarkerStyles() }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !list?.length) return
    const b = L.latLngBounds(list.map(h => [h.coords.lat, h.coords.lng]))
    const id = setTimeout(() => map.fitBounds(b, { padding: [40, 40] }), 60)
    return () => clearTimeout(id)
  }, [list])

  useEffect(() => {
    if (!selectedName || !showPopups) return
    const m = markerRefs.current[selectedName]
    if (m) setTimeout(() => m.openPopup(), 150)
  }, [selectedName, showPopups])

  return (
    <MapContainer
      center={[5.561, -0.191]}
      zoom={13}
      className="h-full w-full"
      zoomControl={false}
      whenCreated={(m)=> (mapRef.current = m)}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap, &copy; CARTO"
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {list.map((h) => (
        <Marker
          key={h.name}
          position={[h.coords.lat, h.coords.lng]}
          icon={gradientMarkerIcon(selectedName === h.name)}
          ref={(ref) => { if (ref) markerRefs.current[h.name] = ref }}
          eventHandlers={{ click: () => onMarkerClick && onMarkerClick(h) }}
        >
          {showPopups && <Popup className="hotel-popup">{h.name}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  )
}

/* --------------------------- DESKTOP SIDEBAR --------------------------- */
function SidebarList({ list, query, setQuery, tags, selectedTags, toggleTag, onSelect }) {
  return (
    <aside className="relative bg-gradient-to-b from-[#2b175b] to-[#0f0822] text-white">
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(233,216,166,0.25),transparent_60%)]"/>
      <div className="relative p-4 md:p-5 space-y-4 h-full">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 ring-1 ring-white/10 bg-white/5">
          <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#E9D8A6]" />
          <span className="text-sm font-medium tracking-wide">Wedding Hotels — Accra</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search hotels, areas, notes…"
            className="w-full rounded-xl bg-white/10 backdrop-blur px-3 py-2 outline-none placeholder-white/60 focus:ring-2 focus:ring-[#E9D8A6]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map(t => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                selectedTags.includes(t)
                  ? 'border-[#E9D8A6] bg-[#E9D8A6]/15 text-[#E9D8A6]'
                  : 'border-white/20 hover:border-[#E9D8A6]/60 text-white/80 hover:text-white'
              }`}
            >{t}</button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => toggleTag('__clear__')}
              className="px-3 py-1 rounded-full text-sm border border-transparent text-white/80 hover:text-white hover:border-white/20"
            >Clear</button>
          )}
        </div>

        <div className="h-[calc(100%-9rem)] overflow-y-auto pr-1 space-y-3">
          {list.map(h => (
            <button
              key={h.name}
              onClick={() => onSelect(h)}
              className="w-full text-left group rounded-xl p-3 transition border border-white/10 hover:border-white/25 hover:bg-white/5"
            >
              <HotelRow h={h} dark />
            </button>
          ))}
          {list.length === 0 && <p className="text-white/70 text-sm">No matches.</p>}
        </div>
      </div>
    </aside>
  )
}

function HotelRow({ h, dark=false }) {
  return (
    <div className="flex gap-3">
      <div className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden ring-1 ${dark ? 'ring-white/10' : 'ring-black/10'}`}>
        <img src={h.image} alt={h.name} className="w-full h-full object-cover"/>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`font-semibold truncate ${dark ? 'text-white' : 'text-neutral-900'}`}>{h.name}</h3>
          {h.tags.find(t => t.includes('★')) && (
            <span className={`ml-auto inline-flex items-center gap-1 text-xs ${dark ? 'text-[#E9D8A6]' : 'text-amber-700'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l2.9 6.3 6.8.6-5.2 4.6 1.6 6.7L12 16.9 5.9 20.2l1.6-6.7L2.3 8.9l6.8-.6L12 2z"/>
              </svg>
              {h.tags.find(t => t.includes('★'))}
            </span>
          )}
        </div>
        <p className={`text-sm ${dark ? 'text-white/70' : 'text-neutral-600'}`}>{h.area}</p>
        {h.notes && <p className={`text-xs mt-1 ${dark ? 'text-white/60' : 'text-neutral-600'}`}>{h.notes}</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          {h.tags.map(t => (
            <span key={t} className={`text-[11px] px-2 py-0.5 rounded-full ${dark ? 'bg-white/10 text-white/80 ring-1 ring-white/10' : 'bg-neutral-100 text-neutral-700 ring-1 ring-black/5'}`}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------- MOBILE DRAGGABLE SHEET ---------------------- */
function MobileSheet({
  containerRef,
  list,
  tags,
  query,
  setQuery,
  selectedTags,
  toggleTag,
  mode,             // 'list' | 'details'
  setMode,
  focusedHotel,
  setFocusedHotel,
}) {
  // Snap points
  const MIN = 0.20, MID = 0.45, FULL = 1.0
  const STOPS = [MIN, MID, FULL]

  // height / snapping state
  const [ratio, _setRatio] = useState(MID)
  const ratioRef = useRef(MID)
  const setRatio = (v) => { ratioRef.current = v; _setRatio(v) }

  const [dragging, setDragging] = useState(false)
  const [fadeClass, setFadeClass] = useState('') // fade for details enter/exit
  const heightRef = useRef(1)
  const headerRef = useRef(null)
  const [headerH, setHeaderH] = useState(0)

  // measure parent height so the sheet is always on-screen
  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const setH = () => { heightRef.current = node.clientHeight || 1 }
    setH()
    let ro
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(setH); ro.observe(node)
    } else {
      window.addEventListener('resize', setH)
    }
    return () => {
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', setH)
    }
  }, [containerRef])

  // measure header to size scroll area correctly
  useLayoutEffect(() => {
    const set = () => setHeaderH(headerRef.current ? headerRef.current.offsetHeight : 0)
    set()
    if (typeof ResizeObserver !== 'undefined' && headerRef.current) {
      const ro = new ResizeObserver(set); ro.observe(headerRef.current); return () => ro.disconnect()
    }
  }, [])

  // Entering details → snap to FULL and fade in content
  useEffect(() => {
    if (mode === 'details') {
      setRatio(FULL)
      // fade in details content
      setFadeClass('fade-enter')
      const t = requestAnimationFrame(() => setFadeClass('fade-enter fade-enter-active'))
      return () => cancelAnimationFrame(t)
    } else {
      // switching back to list: we let height transition handle it; ensure no lingering classes
      setFadeClass('')
    }
  }, [mode]) // eslint-disable-line

  // drag with pointer events (prevent browser scroll)
  const onHandlePointerDown = (e) => {
    e.preventDefault(); e.stopPropagation()
    try { e.currentTarget.setPointerCapture?.(e.pointerId) } catch {}
    const startY = e.clientY
    const startR = ratioRef.current
    setDragging(true)

    const move = (ev) => {
      ev.preventDefault()
      const dy = ev.clientY - startY
      const delta = dy / heightRef.current
      setRatio(clamp(startR - delta, MIN, FULL))
    }
    const up = () => {
      setDragging(false)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      const current = ratioRef.current
      const nearest = STOPS.reduce((p, c) => Math.abs(c - current) < Math.abs(p - current) ? c : p, STOPS[0])
      setRatio(nearest)
    }
    window.addEventListener('pointermove', move, { passive: false })
    window.addEventListener('pointerup', up)
  }

  const sheetHeight = `calc(${(ratio * 100).toFixed(2)}%)`
  const showOnlySearch = mode === 'list' && ratio <= MIN + 0.01
  const verticalList = mode === 'list' && ratio > 0.82 // list: horizontal @ mid, vertical @ full

  // filtered tags UI (list mode only)
  const tagRow = (
    <div className="flex flex-wrap gap-2">
      {tags.map(t => (
        <button
          key={t}
          onClick={() => toggleTag(t)}
          className={`px-3 py-1 rounded-full text-sm border transition ${
            selectedTags.includes(t)
              ? 'border-[#E9D8A6] bg-[#E9D8A6]/15 text-[#E9D8A6]'
              : 'border-white/20 hover:border-[#E9D8A6]/60 text-white/80 hover:text-white'
          }`}
        >{t}</button>
      ))}
      {selectedTags.length > 0 && (
        <button
          onClick={() => toggleTag('__clear__')}
          className="px-3 py-1 rounded-full text-sm border border-transparent text-white/80 hover:text-white hover:border-white/20"
        >Clear</button>
      )}
    </div>
  )

  return (
    <div
      className={`md:hidden absolute left-0 right-0 bottom-0 z-20
        bg-gradient-to-b from-[#2b175b] to-[#0f0822] text-white rounded-t-2xl shadow-2xl ring-1 ring-white/10
        ${dragging ? '' : 'transition-[height] duration-300'}`}
      style={{
        height: sheetHeight,
        paddingBottom: 'env(safe-area-inset-bottom)',
        overscrollBehavior: 'contain',
      }}
    >
      {/* Handle */}
      <div
        className="flex justify-center py-2 cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onHandlePointerDown}
        style={{ touchAction: 'none' }}
      >
        <div className="h-1.5 w-12 rounded-full bg-white/40" />
      </div>

      {/* Header swaps content by mode */}
      <div ref={headerRef} className="px-4 pb-3 space-y-3">
        {mode === 'list' ? (
          <>
            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search hotels, areas, notes…"
                className="w-full rounded-xl bg-white/10 backdrop-blur px-3 py-2 outline-none placeholder-white/60 focus:ring-2 focus:ring-[#E9D8A6]"
              />
            </div>
            {!showOnlySearch && tagRow}
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs text-white/60">Selected</p>
              <h2 className="text-base font-semibold truncate">{focusedHotel?.name}</h2>
            </div>
            <button
              onClick={() => { setMode('list'); setFocusedHotel(null); setRatio(FULL) }} // <- snaps to "tall" position
              className="px-3 py-1.5 rounded-lg ring-1 ring-white/15 bg-white/10 hover:bg-white/15 text-sm"
            >
              ✕ Close
            </button>
          </div>
        )}
      </div>

      {/* CONTENT */}
      {mode === 'details' && focusedHotel ? (
        <div
          className={`px-4 pb-6 overflow-y-auto ${fadeClass}`}
          style={{ height: `calc(100% - ${headerH}px)` }}
          onAnimationEnd={() => {
            // clean fade classes after enter completes
            if (fadeClass.includes('fade-enter-active')) setFadeClass('')
          }}
        >
          <div className="rounded-xl overflow-hidden ring-1 ring-white/10">
            <img src={focusedHotel.image} alt={focusedHotel.name} className="w-full h-44 object-cover" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-[#6d28d9] to-[#E9D8A6]" />
              <span className="text-sm text-white/80">{focusedHotel.area}</span>
            </div>
            {focusedHotel.notes && <p className="text-white/80 text-sm">{focusedHotel.notes}</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              {focusedHotel.tags.map(t => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 ring-1 ring-white/10">{t}</span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {focusedHotel.links?.map(l => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-md text-sm ring-1 ring-[#E9D8A6] text-[#3d2a6e] bg-gradient-to-br from-[#fffaf0] to-[#f5eada] hover:brightness-105">
                  {l.label}
                </a>
              ))}
              {focusedHotel.coords?.googleUrl && (
                <a href={focusedHotel.coords.googleUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-md text-sm ring-1 ring-[#E9D8A6] text-[#3d2a6e] bg-gradient-to-br from-[#fffaf0] to-[#f5eada] hover:brightness-105">
                  Google Maps
                </a>
              )}
            </div>
            {focusedHotel.phone && <p className="mt-2 text-xs text-white/70">{focusedHotel.phone}</p>}
          </div>
        </div>
      ) : (
        // LIST MODE
        <>
          {verticalList ? (
            // FULL → vertical list
            <div
              className="px-4 pb-4 overflow-y-auto"
              style={{ height: `calc(100% - ${headerH}px)` }}
            >
              <div className="space-y-3">
                {list.map(h => (
                  <button
                    key={h.name}
                    onClick={() => { setFocusedHotel(h); setMode('details') }} // sheet auto-snaps to FULL in effect
                    className="w-full text-left rounded-xl p-3 transition border text-white bg-white/5 border-white/10 hover:border-white/25"
                  >
                    <HotelRow h={h} dark />
                  </button>
                ))}
                {list.length === 0 && <p className="text-white/70 text-sm">No matches.</p>}
              </div>
            </div>
          ) : (
            // MID/MIN → horizontal cards
            <div className="pb-4 pl-4 pr-1">
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none]" style={{ WebkitOverflowScrolling: 'touch' }}>
                {list.map(h => (
                  <button
                    key={h.name}
                    onClick={() => { setFocusedHotel(h); setMode('details') }}
                    className="snap-center min-w-[85%] max-w-[85%] rounded-2xl p-3 transition border text-left bg-white/5 border-white/10 hover:border-white/25"
                  >
                    <HotelRow h={h} dark />
                  </button>
                ))}
                {list.length === 0 && <p className="text-white/70 text-sm px-2">No matches.</p>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ------------------------------ ROOT COMP ------------------------------ */
export default function WeddingsMap({ className = 'h-screen', lockBodyScroll = true }) {
  const containerRef = useRef(null)

  // Lock page scroll so mobile gestures never scroll the document
  useEffect(() => {
    if (!lockBodyScroll || typeof document === 'undefined') return
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [lockBodyScroll])

  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [mode, setMode] = useState('list') // 'list' | 'details'
  const [focusedHotel, setFocusedHotel] = useState(null)

  const tags = useMemo(() => uniqueTags(HOTELS), [])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const tagFilter = (h) => selectedTags.length === 0 || selectedTags.every(t => h.tags.includes(t))
    return HOTELS.filter(h => {
      const txt = (h.name + ' ' + h.area + ' ' + (h.notes||'')).toLowerCase()
      return (!q || txt.includes(q)) && tagFilter(h)
    })
  }, [query, selectedTags])

  const toggleTag = (t) => {
    if (t === '__clear__') { setSelectedTags([]); return }
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className} overflow-hidden`}>
      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-[380px_minmax(0,1fr)] h-full">
        <SidebarList
          list={filtered}
          query={query}
          setQuery={setQuery}
          tags={tags}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          onSelect={(h) => { setFocusedHotel(h) }}
        />
        <div className="relative">
          <div className="absolute top-3 right-3 z-[400]">
            <div className="rounded-full px-3 py-1 text-sm font-medium text-[#2b175b] ring-1 ring-[#E9D8A6] shadow-md bg-gradient-to-r from-[#E9D8A6] to-[#b08968]">
              Hotels • Purple × Gold
            </div>
          </div>
          <HotelsLeafletMap
            list={filtered}
            selectedName={focusedHotel?.name}
            showPopups={true}
            onMarkerClick={(h) => setFocusedHotel(h)}
          />
        </div>
      </div>

      {/* Mobile layers */}
      <div className="md:hidden absolute inset-0 z-10">
        <HotelsLeafletMap
          list={focusedHotel ? [focusedHotel] : filtered}
          selectedName={focusedHotel?.name}
          showPopups={false} // Apple Maps behavior: details in sheet, no popups
          onMarkerClick={(h) => { setFocusedHotel(h); setMode('details') }}
        />
      </div>

      <MobileSheet
        containerRef={containerRef}
        list={filtered}
        tags={tags}
        query={query}
        setQuery={setQuery}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        mode={mode}
        setMode={setMode}
        focusedHotel={focusedHotel}
        setFocusedHotel={setFocusedHotel}
      />
    </div>
  )
}
