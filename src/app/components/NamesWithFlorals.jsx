'use client'
import { motion } from 'framer-motion';

export default function NamesWithFlorals({ couple, gold = 'from-[#E9D8A6] to-[#B08968]' }) {
  // Draw → HOLD → undraw → repeat (forever)
  const strokeAnimate = { pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] };
  const strokeTrans = (i = 1) => ({
    pathLength: {
      duration: 4.2, ease: 'easeInOut', times: [0, 0.5, 0.9, 1],
      repeat: Infinity, repeatDelay: 0.3, delay: 0.24 * i,
    },
    opacity: {
      duration: 4.2, ease: 'easeInOut', times: [0, 0.5, 0.9, 1],
      repeat: Infinity, repeatDelay: 0.3, delay: 0.24 * i,
    },
  });

  const fadeAnimate = { opacity: [0, 1, 1, 0] };
  const fadeTrans = (i = 1) => ({
    opacity: {
      duration: 4.0, ease: 'easeInOut', times: [0, 0.5, 0.9, 1],
      repeat: Infinity, repeatDelay: 0.4, delay: 0.24 * i,
    },
  });

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Heading */}
      <h1 className="my-5 text-center text-5xl md:text-5xl font-tangerine tracking-tight max-md:flex max-md:flex-col">
        <span className={`bg-clip-text text-transparent bg-gradient-to-b ${gold}`}>
          {couple.bride}
        </span>
        <span className="max-md:pb-3 md:mx-3 text-neutral-400 text-3xl">&amp;</span>
        <span className={`pr-4 bg-clip-text text-transparent bg-gradient-to-b ${gold}`}>
          {couple.groom}
        </span>
      </h1>

      {/* Florals overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* LEFT — mirror on Y-axis so it curves OUT */}
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-24 md:w-36 xl:w-44"
          style={{ transform: 'translateY(-50%) scaleX(-1)' }}
        >
          <motion.path
            d="M20,170 C60,140 80,110 95,70"
            stroke="#B08CFF" strokeWidth="2" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={strokeAnimate} transition={strokeTrans(1)}
          />
          <motion.path
            d="M55,140 C45,130 35,130 25,135 C35,145 45,148 55,140Z"
            fill="#C9B3FF"
            initial={{ opacity: 0 }} animate={fadeAnimate} transition={fadeTrans(2)}
          />
          <motion.path
            d="M80,110 C70,100 60,98 50,103 C60,112 70,115 80,110Z"
            fill="#A180FF"
            initial={{ opacity: 0 }} animate={fadeAnimate} transition={fadeTrans(3)}
          />
          <motion.circle
            cx="100" cy="60" r="10" fill="url(#gradPurple)"
            initial={{ opacity: 0 }} animate={fadeAnimate} transition={fadeTrans(4)}
          />
          <defs>
            <linearGradient id="gradPurple" x1="0" x2="1">
              <stop offset="0%" stopColor="#8B5CF6"/>
              <stop offset="100%" stopColor="#C4B5FD"/>
            </linearGradient>
          </defs>
        </motion.svg>

        {/* RIGHT — no mirror so it curves OUT on the right */}
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-24 md:w-36 xl:w-44"
          style={{ transform: 'translateY(-50%)' }}
        >
          <motion.path
            d="M20,170 C60,140 80,110 95,70"
            stroke="#C08A3E" strokeWidth="2" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={strokeAnimate} transition={strokeTrans(1)}
          />
          <motion.path
            d="M55,140 C45,130 35,130 25,135 C35,145 45,148 55,140Z"
            fill="#E9D8A6"
            initial={{ opacity: 0 }} animate={fadeAnimate} transition={fadeTrans(2)}
          />
          <motion.path
            d="M80,110 C70,100 60,98 50,103 C60,112 70,115 80,110Z"
            fill="#D4A373"
            initial={{ opacity: 0 }} animate={fadeAnimate} transition={fadeTrans(3)}
          />
          <motion.circle
            cx="100" cy="60" r="10" fill="url(#gradGold)"
            initial={{ opacity: 0 }} animate={fadeAnimate} transition={fadeTrans(4)}
          />
          <defs>
            <linearGradient id="gradGold" x1="0" x2="1">
              <stop offset="0%" stopColor="#F6E27A"/>
              <stop offset="100%" stopColor="#C08A3E"/>
            </linearGradient>
          </defs>
        </motion.svg>

        {/* soft glow — centered & width-clamped to avoid overflow */}
        <motion.div
          initial={{ opacity: 0.15 }}
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70%] md:h-[80%] max-w-[95%] aspect-[3/1] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 50%, rgba(233,216,166,0.35), rgba(255,255,255,0) 70%)'
          }}
        />
      </div>
    </div>
  );
}
