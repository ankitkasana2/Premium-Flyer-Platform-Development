"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye, ShoppingCart } from "lucide-react"
import type { Flyer } from "@/lib/types"

interface FlyerCardProps {
  flyer: Flyer
  onPreview?: (flyer: Flyer) => void
  onAddToCart?: (flyer: Flyer) => void
  onToggleFavorite?: (flyer: Flyer) => void
}

export function FlyerCard({ flyer, onPreview, onAddToCart, onToggleFavorite }: FlyerCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited)
    onToggleFavorite?.(flyer)
  }

  const getPriceColor = (priceType: string) => {
    switch (priceType) {

      case "premium":
        return "bg-[#FFB700CF] text-[#FFF] border border-[#FFB70033] "
      default:
        return "bg-primary/80 border-primary/20"
    }
  }

  return (
    <div
      className="group bg-card border rounded-xl overflow-hidden transition-all duration-300 
             hover:scale-105 hover:shadow-xl hover:shadow-primary/20 cursor-pointer 
             flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={flyer.imageUrl || "/placeholder.svg"}
          alt={flyer.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-102"
        />
        {/* Favorite button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 hover:cursor-pointer"
          onClick={handleToggleFavorite}
        >
          <Heart className={`w-6 h-6 ${isFavorited ? "fill-primary text-primary" : "text-white"}`} />
        </Button>

        {/* Price badge */}
        <div className="absolute bottom-2 right-2">
          <Badge className={`${getPriceColor(flyer.priceType)} shadow-[0_0_10px_3px_rgba(0,0,0,0.6)]`}>${flyer.price}</Badge>
        </div>

        {/* Premium Ribbon */}
        {flyer.priceType === "premium" && (
          <div className="absolute top-0 left-0 w-22 h-20 overflow-hidden">
            <div className="absolute top-5 -left-5 w-25 bg-[#FFB700] text-black  text-xs font-bold text-center 
                    shadow-[0_0_5px_rgba(0,0,0,0.5)] transform -rotate-45 ">
              Premium
            </div>
          </div>
        )}


      </div>
    </div>

  )
}
