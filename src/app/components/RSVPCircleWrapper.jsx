// components/RSVPCircleWrapper.jsx
"use client";
import { usePathname } from "next/navigation";
import RSVPCircle from "./RSVPCircle";

export default function RSVPCircleWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/rsvp") || pathname.startsWith("/checkin")) return null;
  if (pathname.startsWith("/invitation")) {
    return <RSVPCircle href='/checkin' threshold={-1} text="FULL SITE"></RSVPCircle>
  } else {
    return null
  }
  return <RSVPCircle />;
}
