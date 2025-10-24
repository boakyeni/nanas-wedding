'use client';

import Image from 'next/image';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

function cx(...cls) { return cls.filter(Boolean).join(' '); }
function isPortrait(w, h) { if (!w || !h) return undefined; return h > w; }
const gridCols = (n) => ({1:'columns-1',2:'columns-2',3:'columns-3',4:'columns-4',5:'columns-5',6:'columns-6'}[n] || 'columns-2');


function Card({ item, onOpen, radiusClass, shadowClass }) {
  const orientation = useMemo(() => isPortrait(item.width, item.height), [item.width, item.height]);
  const w = item.width || (orientation ? 1200 : 1600);
  const h = item.height || (orientation ? 1600 : 1067);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cx(
        // removed break-inside-avoid from here (keep it on the column item wrapper)
        'group relative block w-full text-left mb-3 sm:mb-4',
        radiusClass,
        shadowClass,
        // stabilize tap behavior on mobile
        'overflow-hidden bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500',
        'touch-manipulation [-webkit-tap-highlight-color:transparent] [backface-visibility:hidden] [contain:paint]'
      )}
    >
      {/* Keep the border/radius on THIS wrapper; do NOT scale this element */}
      <div className={cx('relative w-full overflow-hidden', radiusClass)}>
        {/* Inner wrapper is the one that scales */}
        <div
          className={cx(
            'relative w-full h-full',
            // smooth transforms on mobile GPUs
            'transform-gpu will-change-transform',
            // no hover scale on mobile; enable from sm: and up
            'transition-transform duration-200',
            'active:scale-[0.995] sm:group-active:scale-[0.99] sm:group-hover:scale-[1.02]'
          )}
          // prevent flicker during transform compositing
          style={{ WebkitBackfaceVisibility: 'hidden' }}
        >
          <Image
            src={item.src}
            alt={item.alt}
            width={w}
            height={h}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            // block avoids baseline gaps that can look like border flicker
            className="block w-full h-auto object-cover select-none"
            priority={false}
            draggable={false}
          />
        </div>

        {(item.title || item.description) && (
          <>
            {/* Promote overlays to their own layer to avoid text flicker */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent transform-gpu" />
            <div className="pointer-events-none absolute bottom-2 left-3 right-3 text-white/95 drop-shadow transform-gpu">
              {item.title && <div className="text-sm font-medium leading-tight line-clamp-1">{item.title}</div>}
              {item.description && <div className="text-[11px] opacity-90 line-clamp-1">Tap to open</div>}
            </div>
          </>
        )}
      </div>
    </button>
  );
}


function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const reduce = useReducedMotion();
  const item = items[index];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => { html.style.overflow = prev; };
  }, []);

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const w = item.width || 1600;
  const h = item.height || 1067;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95"
      onClick={onBackdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3">
        <div className="text-white/70 text-sm">{index + 1} / {items.length}</div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="text-white/90 text-sm px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Close
        </button>
      </div>

      <div className="absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-1 sm:px-2 pointer-events-none">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="pointer-events-auto h-10 min-w-10 px-3 rounded-full bg-white/10 text-white/90 text-sm hover:bg-white/15 active:bg-white/20"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="pointer-events-auto h-10 min-w-10 px-3 rounded-full bg-white/10 text-white/90 text-sm hover:bg-white/15 active:bg-white/20"
          aria-label="Next"
        >
          ›
        </button>
      </div>

      <motion.div className="absolute inset-0 overflow-y-auto">
        <motion.div
          key={item.src}
          className="mx-auto w-full max-w-screen-sm px-0 sm:px-2 pt-14 pb-10"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const { offset, velocity } = info;
            if (offset.x > 80 || velocity.x > 600) onPrev();
            else if (offset.x < -80 || velocity.x < -600) onNext();
          }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={w}
              height={h}
              sizes="100vw"
              className="w-full h-auto select-none"
              priority
            />
          </motion.div>

          {(item.title || item.description) && (
            <motion.div
              className="px-4 sm:px-2 mt-4 text-neutral-200"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.22 }}
            >
              {item.title && <h3 className="text-lg font-semibold tracking-tight mb-2">{item.title}</h3>}
              {item.description && (
                <p className="text-sm leading-relaxed text-neutral-300">{item.description}</p>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- MAIN GALLERY ---------- */
export default function Gallery({
  items,
  cols = { base: 2, sm: 3, md: 4, lg: 5 },
  radiusClass = 'rounded-2xl',
  shadowClass = 'shadow-md',
}) {
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(null);

  const openAt = useCallback((i) => setActiveIndex(i), []);
  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => setActiveIndex((i) => (i === null ? i : (i + items.length - 1) % items.length)), [items.length]);
  const next = useCallback(() => setActiveIndex((i) => (i === null ? i : (i + 1) % items.length)), [items.length]);

  const baseCols = gridCols(cols.base ?? 2);
  const smCols = cols.sm ? `sm:${gridCols(cols.sm)}` : '';
  const mdCols = cols.md ? `md:${gridCols(cols.md)}` : '';
  const lgCols = cols.lg ? `lg:${gridCols(cols.lg)}` : '';
  

  return (
    <>
      {/* Desktop-only container to bring sizes down.
          Mobile untouched (no padding/width limit below lg). */}
      <div className="lg:max-w-[1200px] lg:mx-auto lg:px-4">
        {/* Masonry layout */}
        <motion.div
          className={cx(baseCols, smCols, mdCols, lgCols)}
          style={{ columnGap: '1rem' }}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.04 } } }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.src + i}
              className="inline-block w-full align-top break-inside-avoid"
              variants={{
                hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
                show:   { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.28, ease: 'easeOut' } },
              }}
            >
              <Card
                item={item}
                onOpen={() => openAt(i)}
                radiusClass={radiusClass}
                shadowClass={shadowClass}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <Lightbox
            items={items}
            index={activeIndex}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </>
  );
}
