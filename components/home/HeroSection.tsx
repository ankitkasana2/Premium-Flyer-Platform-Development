"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const HeroSection = () => {
  const heroImages = [
    "/hero-section-img.jpg",
    "/hero-section-img.jpg",
    "/hero-section-img.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Change image every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative px-4 min-h-[50vh] sm:min-h-[60vh] flex items-center">
      <div className="container h-full mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <Image
          key={heroImages[currentImageIndex]}
          src={heroImages[currentImageIndex]}
          alt="Halloween Flyer"
          fill
          className="absolute inset-0 object-fill"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Text + Button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center md:items-start md:text-left sm:left-[10%]">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6 leading-snug tracking-wider flex flex-col">
            HALLOWEEN <span className="text-xl md:text-3xl"> PARTY </span>
          </h1>
          <Button
            size="sm"
            className="hover:cursor-pointer hover:scale-105 duration-300 w-[100px] sm:w-[120px] tracking-[.1000rem] bg-primary shadow-lg shadow-black/50"
          >
            GET IT
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
