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
      className="group bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 cursor-pointer w-56 sm:w-60"
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

        {/* Badges */}
        {/* <div className="absolute top-2 left-2 flex flex-col gap-1">
          {flyer.isRecentlyAdded && (
            <Badge variant="secondary" className="text-xs">
              New
            </Badge>
          )}
          {flyer.isFeatured && <Badge className="text-xs">Featured</Badge>}
        </div> */}

        {/* Favorite button */}
        <div
          className="absolute top-2 right-2"
          onClick={handleToggleFavorite}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-primary text-primary" : "text-red-700"}`} />
        </div>

        {/* Price badge */}
        <div className="absolute bottom-4 right-2">
          <Badge className='bg-primary text-foreground border-primary/20 px-3 py-1 shadow-lg shadow-black/50'>${flyer.price}</Badge>
        </div>
      </div>

      {/* <CardContent className="p-4">
        <h3 className="font-semibold text-card-foreground mb-1 text-balance">{flyer.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{flyer.category}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {flyer.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{flyer.hasPhotos ? "With Photos" : "No Photos"}</span>
        </div>
      </CardContent> */}
    </div>
  )
}
