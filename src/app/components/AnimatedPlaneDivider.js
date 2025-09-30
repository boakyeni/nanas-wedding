"use client";
import React from "react";

export default function AnimatedPlaneDivider({
  src = "/plane.svg",
  height = 28,
  speed = 2000,
  gap = 4,              // <- set your gap in px
}) {
  const planeWidth = height;           // 1:1 SVG → width ≈ height
  const tileWidth = planeWidth + gap;  // total repeat width

  const style = {
    background: "linear-gradient(90deg, #b29043, #f1c27d, #b29043)",
    height: `${height}px`,
    width: "100%",
    display: "block",
    overflow: "hidden",
    WebkitMaskImage: `url("${src}")`,
    WebkitMaskRepeat: "repeat-x",
    WebkitMaskPosition: "0 50%",
    WebkitMaskSize: `${tileWidth}px ${height}px`,
    maskImage: `url("${src}")`,
    maskRepeat: "repeat-x",
    maskPosition: "0 50%",
    maskSize: `${tileWidth}px ${height}px`,
    willChange: "mask-position, -webkit-mask-position",
    animation: `plane-scroll ${speed}ms linear infinite`,
  };

  return (
    <>
      <div style={style} />
      <style jsx>{`
        @keyframes plane-scroll {
          from { mask-position: 0px 50%; -webkit-mask-position: 0px 50%; }
          to   { mask-position: ${tileWidth}px 50%; -webkit-mask-position: ${tileWidth}px 50%; } /* rightward */
        }
      `}</style>
    </>
  );
}
