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
      case "basic":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "regular":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "premium":
        return "bg-primary/10 text-primary border-primary/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
   <div
  className="group bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 cursor-pointer w-44 sm:w-52 md:w-52 lg:w-58"
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
    {/* Favorite & Price badges */}
  </div>
</div>

  )
}
