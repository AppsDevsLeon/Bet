// components/anim/CardWaves.jsx
import { useEffect, useRef } from "react";

export default function CardWaves({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf, t = 0;

    const resize = () => {
      const { clientWidth, clientHeight } = c;
      c.width = clientWidth;
      c.height = clientHeight;
    };

    const draw = () => {
      t += 0.02;
      const { width, height } = c;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < 5; i++) {
        const amp = 8 + i * 4;
        const freq = 0.02 + i * 0.004;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y =
            height * 0.55 +
            Math.sin(x * freq + t * (1.1 - i * 0.08)) * amp * Math.cos((x + i * 30) * 0.01);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = 1.2 + i * 0.4;
        const a = 0.55 - i * 0.06;
        ctx.strokeStyle = `rgba(${90 + i * 12}, ${120 + i * 6}, 255, ${a})`;
        ctx.shadowColor = `rgba(${90 + i * 12}, ${120 + i * 6}, 255, ${a})`;
        ctx.shadowBlur = 8 + i * 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
