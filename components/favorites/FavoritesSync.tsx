"use client"

import { useEffect } from "react"
import { useStore } from "@/stores/StoreProvider"

/**
 * FavoritesSync component
 * Automatically fetches user's favorites when they log in
 * This component should be placed in the root layout
 */
export function FavoritesSync() {
    const { authStore, favoritesStore } = useStore()

    // Use authStore.user instead of useAuth() to work with AWS Cognito
    const user = authStore.user

    useEffect(() => {
        if (user?.id) {
            console.log("🔄 User logged in, fetching favorites for:", user.id)
            favoritesStore.fetchFavorites(user.id)
        } else {
            console.log("🔄 User logged out, clearing favorites")
            favoritesStore.clearLocalFavorites()
        }
    }, [user?.id, favoritesStore])

    // This component doesn't render anything
    return null
}
