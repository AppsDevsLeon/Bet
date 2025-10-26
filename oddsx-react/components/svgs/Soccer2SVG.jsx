"use client";
import React, { forwardRef } from "react";

const Soccer2SVG = forwardRef(function Soccer2SVG(props, ref) {
  return (
    <svg
      id="soccer2"
      viewBox="0 0 1200 800"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      style={{ display: "block" }}
      ref={ref}
      {...props}
    >
      <g className="soccer2_extra-line" stroke="#6B7280" strokeWidth="2" fill="none">
        <path d="M60 120 H1140" />
        <path d="M90 200 H1110" />
        <path d="M80 260 H1120" />
        <path d="M110 330 H1090" />
        <path d="M70 400 H1130" />
      </g>
      <g className="soccer2_line" stroke="#111827" strokeWidth="3" fill="none">
        <path d="M140 580 C360 420, 840 420, 1060 580" />
        <path d="M160 630 C380 470, 820 470, 1040 630" />
        <path d="M180 680 C400 520, 800 520, 1020 680" />
      </g>
      <g className="soccer2_fill" fill="#E5E7EB">
        <rect x="220" y="520" width="120" height="80" rx="10" />
        <rect x="380" y="530" width="140" height="90" rx="12" />
        <rect x="560" y="525" width="130" height="95" rx="12" />
        <rect x="720" y="530" width="140" height="90" rx="12" />
        <rect x="900" y="520" width="120" height="80" rx="10" />
      </g>
    </svg>
  );
});

export default Soccer2SVG;
