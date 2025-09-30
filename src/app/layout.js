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
  title: "Nimako & Saliu",
  description: "Join us to celebrate the wedding of Nana Serwaa and Abdul Wahab.",
  openGraph: {
    title: "Nimako & Saliu's Wedding",
    description: "Join us to celebrate the wedding of Nana Serwaa and Abdul Wahab.",
    images: [
      {
        url: "/n_w.png",
        width: 1500,
        height: 1500,
        alt: "Nimako & Saliu Wedding"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nimako & Saliu's Wedding",
    description: "Join us to celebrate the wedding of Nana Serwaa and Abdul Wahab.",
    images: ["/n_w.png"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <head>
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
