"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  src: string;
  alt: string;
};

type Props = {
  slides: Slide[];
  aspect?: string; // default: "aspect-[5/4]"
  autoplayMs?: number; // default: 5000
};

export default function HeroCarousel({
  slides,
  aspect = "aspect-[5/4]",
  autoplayMs = 5000,
}: Props) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const go = (next: number) => {
    setIdx((prev) => (next + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!autoplayMs) {
      return;
    }
    timer.current && clearInterval(timer.current);
    timer.current = setInterval(() => go(idx + 1), autoplayMs);
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [idx, autoplayMs, slides.length]);

  if (!slides?.length) return null;

  return (
    <div
      className={`relative mx-auto w-full ${aspect} max-w-xl sm:max-w-2xl 2xl:max-w-3xl`}
      onMouseEnter={() => timer.current && clearInterval(timer.current)}
      onMouseLeave={() => {
        if (!autoplayMs) return;
        timer.current = setInterval(() => go(idx + 1), autoplayMs);
      }}
    >
      {/* Slides */}
      <div className="relative h-full w-full overflow-hidden rounded-2xl">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== idx}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={i === 0}
              className="object-contain drop-shadow"
              sizes="(min-width: 1280px) 768px, (min-width: 640px) 600px, 90vw"
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(idx - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#B01C2F]/30"
      >
        <ChevronLeft className="h-5 w-5 text-[#B01C2F]" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(idx + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#B01C2F]/30"
      >
        <ChevronRight className="h-5 w-5 text-[#B01C2F]" />
      </button>

      {/* Dots */}
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-4 rounded-full transition-all ${
              i === idx ? "bg-[#B01C2F] w-5" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}