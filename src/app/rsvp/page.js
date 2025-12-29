'use client'
import RSVP from "../components/RSVP"
import { useEffect } from "react"

const RSVPPage = () => {
    useEffect(() => {
    window.location.href = "/checkin";
  }, []);

  return null;
    return (
        <>
        
            {/* <RSVP/> */}
        </>
    )
}

export default RSVPPage;