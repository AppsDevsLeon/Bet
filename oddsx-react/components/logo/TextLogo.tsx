"use client";
import * as React from "react";

type Variant = "solid" | "soft" | "gradient";

export interface TextLogoProps
  extends React.SVGAttributes<SVGSVGElement> {
  text?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  letterSpacing?: number;
  skew?: number;
  height?: number;
  variant?: Variant;
  gradientFrom?: string;
  gradientTo?: string;
}

const TextLogo: React.FC<TextLogoProps> = ({
  text = "OLYMPIABET",
  fill = "#ffffff",
  stroke = "#141414",
  strokeWidth = 1,
  fontFamily = "'Bebas Neue', Inter, system-ui, sans-serif",
  fontWeight = 800,
  letterSpacing = 1.5,
  skew = -6,
  height = 36,
  variant = "solid",
  gradientFrom = "#7c3aed",
  gradientTo = "#22d3ee",
  style,
  className,
  ...rest
}) => {
  const gid = React.useId().replace(/:/g, "");
  const gradientId = `grad-${gid}`;

  const computedFill =
    variant === "gradient"
      ? `url(#${gradientId})`
      : variant === "soft"
      ? `${fill}E6`
      : fill;

  return (
    <svg
      viewBox="0 0 1000 200"
      height={height}
      style={{ display: "block", ...(style || {}) }}
      className={className}
      aria-label={text}
      role="img"
      {...rest}
    >
      {variant === "gradient" && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
        </defs>
      )}

      <g transform={`skewX(${skew})`}>
        {strokeWidth > 0 && (
          <text
            x="20"
            y="145"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            style={{
              fontFamily,
              fontWeight: String(fontWeight),
              letterSpacing: `${letterSpacing}px`,
            }}
          >
            {text}
          </text>
        )}

        <text
          x="20"
          y="145"
          fill={computedFill}
          style={{
            fontFamily,
            fontWeight: String(fontWeight),
            letterSpacing: `${letterSpacing}px`,
          }}
        >
          {text}
        </text>
      </g>
    </svg>
  );
};

export default TextLogo;
