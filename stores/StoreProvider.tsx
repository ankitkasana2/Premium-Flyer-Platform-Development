"use client"

import React, { createContext, useContext, useRef } from "react"
import { FavoritesStore } from "./FavoritesStore"
import { AuthStore } from "./AuthStore"

export class RootStore {
  favoritesStore: FavoritesStore
   authStore: AuthStore

  constructor() {
    this.favoritesStore = new FavoritesStore()
    this.authStore = new AuthStore()
  }
}

// ✅ create context
const StoreContext = createContext<RootStore | null>(null)

// ✅ provider
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useRef(new RootStore()).current
  return (<StoreContext.Provider value={store}>{children}</StoreContext.Provider>)
}

// ✅ hook
export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used inside StoreProvider")
  return ctx
}
