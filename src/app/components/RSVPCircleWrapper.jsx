// components/RSVPCircleWrapper.jsx
"use client";
import { usePathname } from "next/navigation";
import RSVPCircle from "./RSVPCircle";

export default function RSVPCircleWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/rsvp") || pathname.startsWith("/checkin")) return null;
  return <RSVPCircle />;
}
