// components/landing-page/DigitalHeroGallery.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const IMAGES = [
  { src: "/images/ixora-bill.png", alt: "IXORA MBMB" },
  { src: "/images/ixora-digital.png", alt: "Digital Governance" },
  { src: "/images/ixora-hai.png", alt: "IXORA Greetings" },
  { src: "/images/ixora-flag.png", alt: "IXORA Melaka Flag" },
  { src: "/images/ixora-mobile.png", alt: "IXORA Mobile App" },
  { src: "/images/ixora-run.png", alt: "IXORA Run" },
  { src: "/images/ixora-hero.png", alt: "IXORA Hero" },
];

export default function DigitalHeroGallery() {
  const [index, setIndex] = useState(0);

  // Auto-tukar setiap 5 saat
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="
        relative mx-auto 
        aspect-[5/4] 
        w-full 
        max-w-xl sm:max-w-2xl 2xl:max-w-3xl
        overflow-hidden
      "
    >
      {/* Semua imej tumpang tindih untuk animasi */}
      {IMAGES.map((img, i) => (
        <div
          key={i}
          className={`
            absolute inset-0 transition-all duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)]
            ${i === index
              ? "opacity-100 blur-0 scale-100 z-10"
              : "opacity-0 blur-[6px] scale-[1.02] z-0"}
          `}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            sizes="(min-width:1280px) 768px, (min-width:640px) 600px, 90vw"
            className="object-contain object-center select-none pointer-events-none"
          />
        </div>
      ))}

      {/* Efek pixel lembut di atas semua imej */}
      <div
        aria-hidden="true"
        className="absolute inset-0 
                   bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)]
                   bg-[length:4px_4px]
                   opacity-30
                   mix-blend-overlay
                   pointer-events-none"
      />
    </div>
  );
}