"use client"

import * as React from "react"
import { FlyerCard } from "@/components/flyer/flyer-card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function FlyersCarousel({ flyers }: { flyers: any[] }) {
  return (
    <div className=" relative">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="gap-2 py-2 px-1">
          {flyers.map((flyer) => (
            <CarouselItem
              key={flyer.id}
              className="flex-[0_0_auto] w-[230px]" // each card ~250px wide, adjusts to screen
            >
              <FlyerCard flyer={flyer} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation buttons inside */}
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  )
}
