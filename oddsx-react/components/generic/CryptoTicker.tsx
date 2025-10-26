"use client";

import { useEffect, useRef, useState } from "react";

type Crypto = {
  symbol: string;
  name: string;
  price: number;
  change: number; // porcentaje
  logo: string;
};

type Props = {
  data?: Crypto[];
  speed?: number;           // px/frame aprox. (1 = como tu demo)
  className?: string;       // clases extra para el contenedor
  applyBodyStyles?: boolean // si quieres aplicar el fondo oscuro global al <body>
};

const DEFAULT_DATA: Crypto[] = [
  { symbol: "BTC", name: "Bitcoin",  price: 61420.35, change:  2.54, logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png" },
  { symbol: "ETH", name: "Ethereum", price: 3280.72, change: -1.23, logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png" },
  { symbol: "SOL", name: "Solana",   price: 132.45,  change:  5.67, logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png" },
  { symbol: "ADA", name: "Cardano",  price: 1.02,    change: -0.45, logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cardano/info/logo.png" },
  { symbol: "XRP", name: "XRP",      price: 0.62,    change:  0.89, logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ripple/info/logo.png" },
  { symbol: "DOT", name: "Polkadot", price: 18.5,    change: -2.10, logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polkadot/info/logo.png" },
  { symbol: "DOGE",name: "Dogecoin", price: 0.15,    change: 10.25, logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/doge/info/logo.png" },
  { symbol: "AVAX",name: "Avalanche",price: 35.67,   change:  3.45, logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png" },
];

export default function CryptoTicker({
  data = DEFAULT_DATA,
  speed = 1,
  className = "",
  applyBodyStyles = false,
}: Props) {
  const [items, setItems] = useState<Crypto[]>(data);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const tickerRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef<number>(0);
  const speedRef = useRef<number>(speed);
  const rafRef = useRef<number | null>(null);

  // Duplicamos la lista para lograr el efecto de loop infinito
  const doubled = [...items, ...items];

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    let running = true;

    const animate = () => {
      if (!running || !tickerRef.current || !wrapRef.current) return;

      posRef.current -= speedRef.current;

      const tickerWidth = tickerRef.current.scrollWidth / 2; // la mitad (porque está duplicado)
      if (posRef.current < -tickerWidth) {
        posRef.current = 0;
      }

      tickerRef.current.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Simular actualizaciones de precio
    const interval = setInterval(() => {
      setItems((prev) =>
        prev.map((c) => {
          if (Math.random() > 0.7) {
            const fluct = (Math.random() - 0.5) * 2; // -1% a +1%
            const newPrice = c.price + c.price * (fluct * 0.01);
            const newChange = c.change + fluct;
            return { ...c, price: newPrice, change: newChange };
          }
          return c;
        })
      );
    }, 2000);

    // Recalcular al resize
    const onResize = () => {
      if (!tickerRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      posRef.current = 0;
      tickerRef.current.style.transform = `translateX(0px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearInterval(interval);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onMouseEnter = () => {
    speedRef.current = 0;
  };
  const onMouseLeave = () => {
    speedRef.current = speed;
  };

  return (
    <>


      <style jsx>{`
        .ticker-container {
          width: 100%;
          overflow: hidden;
          background: #062925;
          padding: 10px 0;
          box-shadow: 0 0 10px rgba(0, 150, 255, 0.3);
        }
        .ticker-wrap {
          display: flex;
          width: fit-content;
          will-change: transform;
        }
        .ticker-item {
          display: flex;
          align-items: center;
          padding: 0 30px;
          color: white;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          white-space: nowrap;
        }
        .crypto-name {
          font-weight: bold;
          margin-right: 10px;
          color: #4fc3f7;
        }
        .crypto-price {
          margin-right: 10px;
        }
        .price-up {
          color: #00e676;
        }
        .price-down {
          color: #ff5252;
        }
        .crypto-change {
          font-size: 0.9em;
        }
        .crypto-logo {
          width: 20px;
          height: 20px;
          margin-right: 10px;
          border-radius: 50%;
          object-fit: cover;
        }
        .dot {
          color: rgba(255,255,255,0.3);
          margin: 0 10px;
        }
      `}</style>

      <div className={`ticker-container ${className}`}>
        <div
          className="ticker-wrap"
          ref={tickerRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* Doble render para el loop infinito */}
          {doubled.map((c, i) => {
            const isUp = c.change >= 0;
            const sign = isUp ? "↑" : "↓";
            const changeClass = isUp ? "price-up" : "price-down";
            return (
              <div className="ticker-item" key={`${c.symbol}-${i}`}>
                <img className="crypto-logo" src={c.logo} alt={c.name} />
                <span className="crypto-name">{c.symbol}</span>
                <span className="crypto-price">
                  ${c.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`crypto-change ${changeClass}`}>
                  {sign} {Math.abs(c.change).toFixed(2)}%
                </span>
                <span className="dot">|</span>
              </div>
            );
          })}
        </div>
        {/* Wrapper ref para posibles mediciones futuras */}
        <div ref={wrapRef} style={{ display: "none" }} />
      </div>
    </>
  );
}
