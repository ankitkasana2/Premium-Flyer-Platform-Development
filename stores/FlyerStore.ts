import { makeAutoObservable } from "mobx"
import { toJS } from "mobx"
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
};

export class FlyerStore {
    flyer: Flyer | null = null

    constructor() {
        makeAutoObservable(this)
    }

    fetchFlyer(id: string) {
        this.flyer = SAMPLE_FLYERS.find(f => f.id == id) ?? null
    }


}
