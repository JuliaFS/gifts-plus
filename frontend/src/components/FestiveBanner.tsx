"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const slides = [
  {
    title: "Mother's Day Deals",
    subtitle: "Limited edition deals are live now",
    desc: "Up to 70% OFF selected products",
    image: "/products/buket-rozi.jpg",
    bg: "from-gray-50 to-gray-200",
  },
  {
    title: "Spring Collection",
    subtitle: "Fresh gifts for every moment",
    desc: "New arrivals just dropped",
    image: "/products/backet_koshnica.png",
    bg: "from-pink-50 to-purple-100",
  },
  {
    title: "Luxury Bouquets",
    subtitle: "Premium handmade arrangements",
    desc: "Best sellers of the season",
    image: "/products/backet_koshnica_st_valentine.png",
    bg: "from-yellow-50 to-orange-100",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );

      gsap.fromTo(
        ".hero-image",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
      );
    }, root);

    return () => ctx.revert();
  }, [index]);

  const slide = slides[index];

  return (
    <div className="w-full flex justify-center">
      <div
        ref={root}
        className={`relative w-full max-w-[1800px] overflow-hidden rounded-xl shadow-lg bg-gradient-to-r ${slide.bg}`}
      >
        {/* MAIN LAYOUT */}
        <div className="flex flex-col md:flex-row items-center justify-between min-h-[280px] md:h-[380px] p-5 md:p-10">

          {/* LEFT CONTENT */}
          <div className="hero-content w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-[clamp(1.6rem,4vw,3rem)] font-extrabold text-red-600 uppercase leading-tight">
              {slide.title}
            </h1>

            <p className="mt-3 text-[clamp(0.9rem,1.5vw,1.2rem)] text-gray-700 font-medium">
              {slide.subtitle}
            </p>

            <p className="mt-2 text-[clamp(0.8rem,1.2vw,1rem)] text-gray-500">
              {slide.desc}
            </p>

            <button 
              onClick={() => {
                document.getElementById("hot-products")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-6 px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition cursor-pointer"
            >
              Shop Now
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hero-image w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
            <div className="relative w-[180px] sm:w-[240px] md:w-[320px] aspect-square">
              <Image
                src={slide.image}
                alt="hero"
                fill
                className="object-cover rounded-full shadow-xl border-4 border-white"
              />
            </div>
          </div>
        </div>

        {/* DOTS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === index ? "bg-black scale-125" : "bg-black/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}