"use client";
import React, { forwardRef } from "react";

const BasketSVG = forwardRef(function BasketSVG(props, ref) {
  return (
    <svg
      id="basket"
      viewBox="0 0 1200 800"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      style={{ display: "block" }}
      ref={ref}
      {...props}
    >
      <g className="basket_extra-line" stroke="#9CA3AF" strokeWidth="2" fill="none">
        <path d="M120 140 H1080" />
        <path d="M160 200 H1040" />
        <path d="M140 260 H1060" />
        <path d="M120 320 H1080" />
        <path d="M180 380 H1020" />
      </g>
      <g className="basket_line" stroke="#111827" strokeWidth="3" fill="none">
        <path d="M200 620 C420 460, 780 460, 1000 620" />
        <path d="M220 660 C440 500, 760 500, 980 660" />
        <path d="M240 700 C460 540, 740 540, 960 700" />
      </g>
      <g className="basket_fill" fill="#FDE68A">
        <rect x="560" y="290" width="80" height="10" rx="5" />
        <rect x="520" y="180" width="160" height="100" rx="8" fill="#E5E7EB" />
        <rect x="570" y="210" width="60" height="60" rx="6" fill="#D1D5DB" />
        <circle cx="600" cy="480" r="40" fill="#F59E0B" />
        <rect x="260" y="520" width="120" height="80" rx="10" fill="#E5E7EB" />
        <rect x="840" y="520" width="120" height="80" rx="10" fill="#E5E7EB" />
      </g>
    </svg>
  );
});

export default BasketSVG;
