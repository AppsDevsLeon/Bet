"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

type BrandItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type BrandMarqueeProps = {
  items: BrandItem[];
  className?: string;
  speedMs?: number;          // Velocidad del scroll (ms) - default 2000
  spaceBetween?: number;     // Espaciado base entre slides - default 20
};

export default function BrandMarquee({
  items,
  className = "",
  speedMs = 2000,
  spaceBetween = 20,
}: BrandMarqueeProps) {
  return (
    <div className={`brand-slider ${className}`}>
      <div className="footer_section__slider swiper-wrapper d-flex align-items-center">
        <Swiper
          className="slider_hero"
          loop
          speed={speedMs}
          autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false }}
          slidesPerView="auto"
          modules={[Autoplay]}
          breakpoints={{
            0:   { slidesPerView: 3,  spaceBetween: 5 },
            480: { slidesPerView: 4,  spaceBetween: 10 },
            575: { slidesPerView: 5,  spaceBetween },
            768: { slidesPerView: 7,  spaceBetween },
            991: { slidesPerView: 8,  spaceBetween },
            1199:{ slidesPerView: 10, spaceBetween },
            1499:{ slidesPerView: 13, spaceBetween: 24 },
            1799:{ slidesPerView: 15, spaceBetween: 24 },
          }}
        >
          {items.map((item, idx) => (
            <SwiperSlide key={`${item.src}-${idx}`}>
              <div className="footer_section__slider-brand swiper-slide px-4">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
