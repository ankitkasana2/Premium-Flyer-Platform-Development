"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";

const HeroSection = observer(() => {
  const router = useRouter();
  const { bannerStore } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch banners on component mount
  useEffect(() => {
    bannerStore.fetchBanners();
  }, []);

  // Auto-rotate banners every 10 seconds if there are banners
  useEffect(() => {
    if (bannerStore.activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex =>
        (prevIndex + 1) % bannerStore.activeBanners.length
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [bannerStore.activeBanners.length]);

  // Manual navigation
  const nextSlide = () => {
    setCurrentImageIndex(prevIndex =>
      (prevIndex + 1) % bannerStore.activeBanners.length
    );
  };

  const prevSlide = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? bannerStore.activeBanners.length - 1 : prevIndex - 1
    );
  };

  // Handle banner click
  const handleBannerClick = () => {
    const currentBanner = bannerStore.activeBanners[currentImageIndex];
    const link = bannerStore.getBannerLink(currentBanner);
    if (link) {
      router.push(link);
    }
  };

  // Handle button click
  const handleButtonClick = () => {
    const currentBanner = bannerStore.activeBanners[currentImageIndex];
    const link = bannerStore.getBannerLink(currentBanner);
    if (link) {
      router.push(link);
    } else {
      router.push("/categories");
    }
  };

  // Loading state
  if (bannerStore.loading) {
    return (
      <section className="relative px-4 min-h-[60vh] sm:min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      </section>
    );
  }

  // Error state
  if (bannerStore.error) {
    return (
      <section className="relative px-4 min-h-[60vh] sm:min-h-[60vh] flex items-center justify-center bg-red-50 text-red-600">
        Error loading banners: {bannerStore.error}
      </section>
    );
  }

  // No banners state
  if (bannerStore.activeBanners.length === 0) {
    return (
      <section className="relative px-4 min-h-[60vh] sm:min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500">
          No banners available
        </div>
      </section>
    );
  }

  const currentBanner = bannerStore.activeBanners[currentImageIndex];
  const bannerImageUrl = currentBanner.image_url ||
    (currentBanner.image.startsWith('http')
      ? currentBanner.image
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://193.203.161.174:3007'}/uploads/banners/${currentBanner.image}`);

  return (
    <section className="relative px-4 min-h-[60vh] sm:min-h-[60vh] flex items-center">
      <div className="absolute inset-0 w-full h-full">
        {/* Banner Image with Click Handler */}
        <div
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={handleBannerClick}
        >
          <Image
            src={bannerImageUrl}
            alt={currentBanner.title || 'Banner'}
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Banner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center md:items-start md:text-left sm:left-[10%]">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6 leading-snug tracking-wider flex flex-col">
            {currentBanner.title || 'Special Offer'}
            {currentBanner.description && (
              <span className="text-sm md:text-lg mt-2 text-muted-foreground">
                {currentBanner.description}
              </span>
            )}
          </h1>

          {/* Conditionally render button only if button_enabled is true */}
          {currentBanner.button_enabled && (
            <Button
              size="sm"
              onClick={handleButtonClick}
              className="hover:cursor-pointer hover:scale-105 duration-300 min-w-[100px] sm:min-w-[120px] px-6 tracking-[.1000rem] bg-primary shadow-lg shadow-black/50 z-10"
            >
              {currentBanner.button_text || 'GET IT'}
            </Button>
          )}
        </div>

        {/* Navigation Arrows */}
        {bannerStore.activeBanners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full"
              aria-label="Next banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </section>
  );
});

export default HeroSection;