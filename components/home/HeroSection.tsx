"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSection = () => {
  const router = useRouter();

  // Each image now has a link (you can replace the URLs with your category paths)
  const heroImages = [
    { src: "/Banner/hero-section-img.jpg", link: "/category/halloween" },
    { src: "/Banner/Banner1.jpg", link: "/category/travel" },


  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Change image every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Manual navigation
  const nextSlide = () =>
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );

  const handleImageClick = (link: string) => {
    router.push(link);
  };

  // Navigate to current category
  // const handleNavigate = () => {
  //   router.push(heroImages[currentImageIndex].link);
  // };

  // Navigate to /categories
  const handleNavigate = () => {
    router.push("/categories");
  };

  return (
    <section className="relative px-4 min-h-[60vh] sm:min-h-[60vh] flex items-center">
      <div className="container h-full mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

        <div
          className="absolute inset-0 transition-all duration-700 ease-in-out cursor-pointer"
          onClick={() => handleImageClick(heroImages[currentImageIndex].link)}
        >
          <Image
            key={heroImages[currentImageIndex].src}
            src={heroImages[currentImageIndex].src}
            alt="Halloween Flyer"
            fill
            className="absolute inset-0 object-fill"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Text + Button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center md:items-start md:text-left sm:left-[10%]">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6 leading-snug tracking-wider flex flex-col">
            HALLOWEEN <span className="text-xl md:text-3xl"> PARTY </span>
          </h1>
          <Button
            size="sm"
            onClick={handleNavigate}
            className="hover:cursor-pointer hover:scale-105 duration-300 w-[100px] sm:w-[120px] tracking-[.1000rem] bg-primary shadow-lg shadow-black/50"
          >
            GET IT
          </Button>
        </div>
        {/* Left/Right Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 p-2 rounded-full"
        >
          <ChevronLeft className="text-white w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 p-2 rounded-full"
        >
          <ChevronRight className="text-white w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;