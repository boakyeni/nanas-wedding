import { Geist, Geist_Mono, Parisienne, Montserrat, Tangerine, Crimson_Text, Mrs_Saint_Delafield } from "next/font/google";
import 'leaflet/dist/leaflet.css';
import "./globals.css";
import Script from 'next/script'
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import SizeObserver from "@/utils/sizeObserver";
import ScrollObserver from "@/utils/scrollObserver";
import RSVPCircleWrapper from "./components/RSVPCircleWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const parisienne = Parisienne({
  variable: "--font-parisienne", // ✅ Add this line
  subsets: ["latin"],
  weight: "400",
});

const tangerine = Tangerine({
  variable: "--font-tangerine", // ✅ Add this line
  subsets: ["latin"],
  weight: "400",
});
const mrs_saint_delafield = Mrs_Saint_Delafield({
  variable: "--font-mrs-saint-delafield", // ✅ Add this line
  subsets: ["latin"],
  weight: "400",
});

const montserrat = Montserrat({
  variable: "--font-montserrat", // ✅ Add this line
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const crimson = Crimson_Text({
  variable: "--font-crimson", // ✅ Add this line
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
export const metadataBase = new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

export const metadata = {
  title: "Nimako & Bandau",
  description: "Join us to celebrate the wedding of Nana Serwaa and Abdul Wahab.",
  openGraph: {
    title: "The Wedding of Nimako & Bandau",
    description: "Join us to celebrate the wedding of Nana Serwaa and Abdul Wahab.",
    images: [
      {
        url: "/n_w.png",
        width: 1500,
        height: 1500,
        alt: "The Wedding of Nimako & Bandau"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Wedding of Nimako & Bandau",
    description: "Join us to celebrate the wedding of Nana Serwaa and Abdul Wahab.",
    images: ["/n_w.png"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
<Script id="strip-ios-chrome-attrs" strategy="beforeInteractive">
          {`
            (function () {
              try {
                const isBad = (name) =>
                  name && (name.startsWith('__gchrome_') || name === 'g_reader');

                const stripAttrs = (el) => {
                  if (!el || !el.attributes) return;
                  for (const a of Array.from(el.attributes)) {
                    if (isBad(a.name)) el.removeAttribute(a.name);
                  }
                };

                // 1) Scrub anything already in the DOM (html + subtree)
                const scrubAll = () => {
                  stripAttrs(document.documentElement);
                  const all = document.getElementsByTagName('*');
                  for (let i = 0; i < all.length; i++) stripAttrs(all[i]);
                };
                scrubAll();

                // 2) Observe new/changed attributes until hydration finishes
                const mo = new MutationObserver((mutations) => {
                  for (const m of mutations) {
                    if (m.type === 'attributes' && isBad(m.attributeName)) {
                      m.target.removeAttribute(m.attributeName);
                    } else if (m.type === 'childList') {
                      m.addedNodes.forEach((n) => {
                        if (n.nodeType === 1) {
                          stripAttrs(n);
                          // also strip its subtree
                          const els = n.getElementsByTagName?.('*');
                          if (els) for (let i = 0; i < els.length; i++) stripAttrs(els[i]);
                        }
                      });
                    }
                  }
                });

                mo.observe(document.documentElement, {
                  subtree: true,
                  attributes: true,
                  childList: true
                });

                // Optional: stop observing a bit after load to save work
                window.addEventListener('load', () => {
                  // give React a moment to hydrate
                  setTimeout(() => mo.disconnect(), 3000);
                });
              } catch {}
            })();
          `}
        </Script>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
          strategy="beforeInteractive"
        />
        {/* <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/turn.js/3/turn.min.js"
          strategy="afterInteractive"
        /> */}
        <Script id="vh-fix" strategy="afterInteractive">
          {`
function setVh(){
    document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
  }
  setVh();
  // Only update on orientation change (not scroll)
  window.addEventListener('orientationchange', setVh, { passive: true });
        `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${parisienne.variable} ${montserrat.variable} ${tangerine.variable} ${crimson.variable} ${mrs_saint_delafield.variable} antialiased`}
        style={{
          background: '#f8f6f2',
          margin: 0,
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        suppressHydrationWarning
      >
        <SizeObserver>
          <ScrollObserver>
            {children}
            <RSVPCircleWrapper/>
          </ScrollObserver>
        </SizeObserver>
      </body>
    </html>
  );
}
