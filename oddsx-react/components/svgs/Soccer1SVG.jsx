"use client";
import React, { forwardRef } from "react";

const Soccer1SVG = forwardRef(function Soccer1SVG(props, ref) {
  return (
    <svg
      id="soccer1"
      viewBox="0 0 1200 800"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      style={{ display: "block" }}
      ref={ref}
      {...props}
    >
      <g className="soccer1_extra-line" stroke="#9CA3AF" strokeWidth="2" fill="none">
        <g><path d="M50 100 H1150" /></g>
        <g><path d="M100 150 H1100" /></g>
        <g><path d="M80 220 H1120" /></g>
        <g><path d="M60 300 H1140" /></g>
        <g><path d="M120 360 H1080" /></g>
      </g>
      <g className="soccer1_line" stroke="#111827" strokeWidth="3" fill="none">
        <path d="M200 600 C400 400, 800 400, 1000 600" />
        <path d="M220 640 C420 440, 780 440, 980 640" />
        <path d="M240 680 C440 480, 760 480, 960 680" />
      </g>
      <g className="soccer1_fill" fill="#E5E7EB">
        <rect x="200" y="500" width="120" height="80" rx="10" />
        <rect x="360" y="520" width="140" height="90" rx="12" />
        <rect x="540" y="510" width="130" height="95" rx="12" />
        <rect x="700" y="520" width="140" height="90" rx="12" />
        <rect x="880" y="500" width="120" height="80" rx="10" />
      </g>
      <g className="soccer1ball" transform="translate(140,260)">
        <g>
          <circle cx="0" cy="0" r="28" fill="#F9FAFB" />
          <circle cx="60" cy="10" r="26" fill="#F3F4F6" />
          <circle cx="30" cy="50" r="24" fill="#E5E7EB" />
          <circle cx="-35" cy="45" r="22" fill="#E5E7EB" />
          <circle cx="-50" cy="-10" r="24" fill="#F3F4F6" />
        </g>
        <g className="soccer1ball-line" stroke="#111827" strokeWidth="2" fill="none">
          <path d="M-60 0 Q0 -60 60 0" />
          <path d="M-40 20 Q0 -20 40 20" />
          <path d="M-40 -20 Q0 20 40 -20" />
          <path d="M0 -60 V60" />
        </g>
      </g>
    </svg>
  );
});

export default Soccer1SVG;
