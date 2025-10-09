"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FlyerCard } from "@/components/flyer/flyer-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SAMPLE_FLYERS, type Flyer } from "@/lib/types"
import { HeartOff } from "lucide-react"
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { toast } from "sonner"
import { useAuth } from "@/lib/auth"
import { toJS } from "mobx"

const FavoritesPage = () => {
  const { user, loading, updateProfile } = useAuth()
  const { authStore, favoritesStore } = useStore()

  const favoriteFlyers: Flyer[] = useMemo(() => {
   return SAMPLE_FLYERS.filter(f=>favoritesStore.favorites.includes(f.id))
  }, [user])

  const handleRemoveFavorite = (flyerId: string) => {
    if (!user) return
    const next = (user.favorites || []).filter((id) => id !== flyerId)
    updateProfile({ favorites: next })
  }

  const handleClearAll = () => {
    if (!user) return
    updateProfile({ favorites: [] })
  }

  return (
    <div className="min-h-screen bg-background">


      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">Your Favorites</h1>
          <p className="text-sm text-muted-foreground">Save flyer templates you love and reorder them anytime.</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="bg-card border-border h-64 animate-pulse" />
            ))}
          </div>
        )}

        {/* Not signed in */}
        {!loading && !user && (
          <div className="max-w-xl mx-auto">
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-semibold text-card-foreground mb-2">Sign in to view favorites</h3>
                <p className="text-muted-foreground mb-6">
                  Create an account or sign in to save flyer templates to your favorites and access them across devices.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link href="/">
                    <Button className="px-6">Browse Templates</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="bg-transparent px-6">
                      Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty state */}
        {!loading && user && favoriteFlyers.length === 0 && (
          <div className="max-w-xl mx-auto">
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HeartOff className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-card-foreground mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6">
                  Explore our collection and tap the heart icon on a flyer to save it here.
                </p>
                <Link href="/categories">
                  <Button className="px-6">Find Flyers</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Favorites grid */}
        {!loading && user && favoriteFlyers.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">
                {favoriteFlyers.length} {favoriteFlyers.length === 1 ? "template" : "templates"} saved
              </span>
              <Button variant="outline" size={'sm'} className="hover:!bg-primary hover:!text-white" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {favoriteFlyers.map((flyer) => (
                <div key={flyer.id} className="relative">
                  <FlyerCard flyer={flyer} onToggleFavorite={() => handleRemoveFavorite(flyer.id)} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}


export default observer(FavoritesPage)
