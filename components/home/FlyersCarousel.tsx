"use client"

import React from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { FlyerCard } from "@/components/flyer/flyer-card"
import { usePathname } from "next/navigation" 




export function FlyersCarousel({ flyers }: { flyers: any[] }) {

  const pathname = usePathname()


  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: pathname == '/' ? 5 : 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 2,
    },
  }



  return (
    <Carousel
      responsive={responsive}
      // autoPlay
      // autoPlaySpeed={3000}
      keyBoardControl
      arrows
      containerClass="py-5"
      itemClass="px-2"
    >
      {flyers.map((flyer) => (
        <FlyerCard key={flyer.id} flyer={flyer} />
      ))}
    </Carousel>
  )
}
