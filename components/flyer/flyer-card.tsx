"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import type { Flyer } from "@/lib/types"
import Link from "next/link"
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { toast } from "sonner"
import { useAuth } from "@/lib/auth"
import { AuthModal } from "../auth/auth-modal"
import { toJS } from "mobx"

interface FlyerCardProps {
  flyer: Flyer
  onPreview?: (flyer: Flyer) => void
  onAddToCart?: (flyer: Flyer) => void
  onToggleFavorite?: (flyer: Flyer) => void
}

const FlyerCardComponent = ({ flyer, onPreview, onAddToCart, onToggleFavorite }: FlyerCardProps) => {
  
  const [isHovered, setIsHovered] = useState(false)
  const { authStore, favoritesStore } = useStore()
  const { user, signOut } = useAuth()
  const [isFavorited, setIsFavorited] = useState(favoritesStore.favorites.includes(flyer.id))

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault() // ⛔ prevent Link navigation
    e.stopPropagation() // ⛔ stop event bubbling
    if (!user) {
      toast("Please sign in.")
      return
    }

    favoritesStore.handleFavorites(flyer.id)
    setIsFavorited(favoritesStore.favorites.includes(flyer.id))
    onToggleFavorite?.(flyer)
  }

  const getPriceColor = (priceType: string) => {
    switch (priceType) {
      case "premium":
        return "bg-[#FFB700CF] text-[#FFF] border border-[#FFB70033]"
      default:
        return "bg-primary/80 border-primary/20"
    }
  }


  return (
    <Link href={`/flyer/${flyer.id}`}>
      <div
        className="group bg-card border rounded-xl overflow-hidden transition-all duration-300 
             hover:scale-105 hover:shadow-xl hover:shadow-primary/20 cursor-pointer 
             flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={flyer.imageUrl || "/placeholder.svg"}
            alt={flyer.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-102"
          />

          {/* ❤️ Favorite Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 hover:cursor-pointer"
            onClick={handleToggleFavorite}
          >
            <Heart
              className={`w-6 h-6 ${isFavorited ? "fill-primary text-primary" : "text-white"
                }`}
            />
          </Button>

          {/* 💰 Price Badge */}
          <div className="absolute bottom-2 right-2">
            <Badge
              className={`${getPriceColor(
                flyer.priceType
              )} shadow-[0_0_10px_3px_rgba(0,0,0,0.6)]`}
            >
              ${flyer.price}
            </Badge>
          </div>

          {/* 🌟 Premium Ribbon */}
          {flyer.priceType === "premium" && (
            <div className="absolute top-0 left-0 w-22 h-20 overflow-hidden">
              <div
                className="absolute top-5 -left-5 w-25 bg-[#FFB700] text-black text-xs font-bold text-center 
                      shadow-[0_0_5px_rgba(0,0,0,0.5)] transform -rotate-45"
              >
                Premium
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}


export const FlyerCard = observer(FlyerCardComponent)
