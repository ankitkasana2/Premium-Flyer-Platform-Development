import { makeAutoObservable, toJS } from "mobx"
import { SAMPLE_FLYERS } from "@/lib/types"

type Flyer = {
  id: string
  name: string
  category: string
  price: number
  priceType: "basic" | "regular" | "premium"
  hasPhotos: boolean
  imageUrl: string
  tags: string[]
  isRecentlyAdded?: boolean
  isFeatured?: boolean
}

export class FlyerFormStore {
  flyer: Flyer | null = null
  similarFlyers: Flyer[] = []

  constructor() {
    makeAutoObservable(this)
  }

  fetchFlyer(id: string) {
    this.flyer = SAMPLE_FLYERS.find(f => f.id === id) ?? null
    this.fetchSimilarFlyers()
  }

  fetchSimilarFlyers() {
    const flyer = this.flyer
    if (!flyer) return

    console.log("flyer:", toJS(flyer))

    this.similarFlyers = SAMPLE_FLYERS
      .filter(f => f.category === flyer.category && f.id !== flyer.id)
  }
}
