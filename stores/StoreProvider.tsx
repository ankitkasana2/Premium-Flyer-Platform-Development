"use client"

import React, { createContext, useContext, useRef } from "react"
import { FavoritesStore } from "./FavoritesStore"
import { AuthStore } from "./AuthStore"
import { FilterBarStore } from "./FilterBarStore"
import { CategoryStore } from "./CategoryStore"
import { FlyerStore } from "./FlyerStore"

export class RootStore {
  favoritesStore: FavoritesStore
  authStore: AuthStore
  filterBarStore: FilterBarStore
  categoryStore : CategoryStore
  FlyerStore: FlyerStore

  constructor() {
    this.favoritesStore = new FavoritesStore()
    this.authStore = new AuthStore()
    this.filterBarStore = new FilterBarStore()
    this.categoryStore = new CategoryStore()
    this.FlyerStore = new FlyerStore()
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
