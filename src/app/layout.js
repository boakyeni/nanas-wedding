import { Geist, Geist_Mono, Parisienne, Montserrat, Tangerine } from "next/font/google";
import "./globals.css";
import Script from 'next/script'

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

const montserrat = Montserrat({
  variable: "--font-montserrat", // ✅ Add this line
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Nimako & Salim",
  description: "Join us to celebrate the wedding of Nana Serwaa and Abdul Wahab.",
  openGraph: {
    title: "Nimako & Salim's Wedding Invitation",
    description: "Join us to celebrate the wedding of Nana Serwaa and Abdul Wahab.",
    images: [
      {
        url: "/n_w.png",
        width: 1500,
        height: 1500,
        alt: "Nimako & Salim Wedding Invitation"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nimako & Salim's Wedding Invitation",
    description: "Join us to celebrate the wedding of Nana Serwaa and Abdul Wahab.",
    images: ["/n_w.png"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" 
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/turn.js/3/turn.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${parisienne.variable} ${montserrat.variable} ${tangerine.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
