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

  // Use authStore.user instead of useAuth() to work with AWS Cognito
  const user = authStore.user

  const [isFavorited, setIsFavorited] = useState(favoritesStore.isFavorited(flyer.id))
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)

  // Update isFavorited when favoritesStore changes
  useEffect(() => {
    setIsFavorited(favoritesStore.isFavorited(flyer.id))
  }, [favoritesStore.favorites, flyer.id])


  const handleToggleFavorite = async (e: React.MouseEvent) => {
    console.log("❤️ Heart button clicked!", { flyerId: flyer.id, user: user?.id })

    e.preventDefault() // ⛔ prevent Link navigation
    e.stopPropagation() // ⛔ stop event bubbling

    if (!user) {
      console.log("⚠️ No user logged in, showing auth modal")
      authStore.handleAuthModal()
      return
    }

    if (isTogglingFavorite) {
      console.log("⚠️ Already toggling, skipping")
      return // Prevent double-click
    }

    setIsTogglingFavorite(true)

    // 🚀 OPTIMISTIC UI UPDATE - Toggle immediately for instant feedback
    const wasAlreadyFavorited = isFavorited
    setIsFavorited(!wasAlreadyFavorited)
    console.log("⚡ Optimistic update: setting favorited to", !wasAlreadyFavorited)

    try {
      console.log("🔄 Toggling favorite for flyer:", flyer.id)
      await favoritesStore.toggleFavorite(user.id, Number(flyer.id))

      // Show success toast
      if (favoritesStore.isFavorited(flyer.id)) {
        toast.success("Added to favorites!")
      } else {
        toast.success("Removed from favorites")
      }

      onToggleFavorite?.(flyer)
    } catch (error: any) {
      console.error("❌ Error toggling favorite:", error)

      // 🔄 REVERT OPTIMISTIC UPDATE on error
      setIsFavorited(wasAlreadyFavorited)
      console.log("🔄 Reverted optimistic update due to error")

      toast.error(error.message || "Failed to update favorites")
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  const getPriceColor = (priceType: string) => {
    switch (priceType) {
      case "premium":
        return "bg-[#FFB700CF] text-[#FFF] border border-[#FFB70033]"
      default:
        return "bg-primary/80 border-primary/20"
    }
  }

  // 🎀 Ribbon Logic
  const getPrice = (f: any) => {
    if (typeof f.price === 'number') return f.price;
    if (typeof f.price === 'string') return parseFloat(f.price.replace('$', ''));
    return 0;
  }

  const price = getPrice(flyer);
  const isPremium = price === 40;

  const hasPhotoRibbon =
    flyer.form_type === 'With Image' ||
    flyer.form_type === 'With Photo' ||
    flyer.hasPhotos === true;


  return (


    // <Link href={`/flyer/${flyer.id}`}>
    <Link
      href={{
        pathname: `/flyer/${flyer.id}`,
        query: {
          image: flyer.image_url,
          name: flyer.name,
          // price: flyer.price,
          price: 10,
        },
      }}
    >

      <div
        className="group bg-card border rounded-xl overflow-hidden transition-all duration-300 
             hover:scale-105 hover:shadow-xl hover:shadow-primary/20 cursor-pointer 
             flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={flyer.image_url || "/placeholder.svg"}
            alt={flyer.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-102"
          />

          {/* ❤️ Favorite Button */}
          <button
            type="button"
            className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 hover:cursor-pointer z-50 pointer-events-auto inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 size-9"
            onClick={handleToggleFavorite}
          >
            <Heart
              className={`w-6 h-6 ${isFavorited ? "fill-primary text-primary" : "text-white"}`}
            />
          </button>

          {/* 💰 Price Badge */}
          <div className="absolute bottom-2 right-2 z-30">
            <Badge
              className={`${getPriceColor(
                flyer.priceType || (isPremium ? 'premium' : 'regular')
              )} shadow-[0_0_10px_3px_rgba(0,0,0,0.6)]`}
            >
              {/* $ */}
              {flyer.price}
            </Badge>
          </div>

          {/* 🎀 Ribbons System */}
          <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-20">

            {/* 🏆 Premium Ribbon */}
            {isPremium && (
              <div style={{
                left: "-35px",
                top: "11px",

              }}
                className="absolute top-[22px] -left-[30px] w-[120px] bg-[#FFB700] text-black text-[10px] font-bold text-center 
                      shadow-md transform -rotate-45 z-20 py-1 uppercase tracking-wider border-y border-white/20"
              >
                Premium
              </div>
            )}

            {/* 🟥 Photo Ribbon */}
            {hasPhotoRibbon && (
              <div
                className={`absolute w-[120px] text-white text-[9px] font-bold text-center 
                      shadow-md transform -rotate-45 z-10 py-0.5 uppercase tracking-wider border-y border-white/20
                      ${isPremium
                    ? 'top-[27px] -left-[21px] bg-[#D32F2F]' // Position below Premium
                    : 'top-[22px] -left-[30px] bg-[#D32F2F]' // Position at top (same as Premium)
                  }`}
              >
                PHOTO
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>

  )
}


export const FlyerCard = observer(FlyerCardComponent)
