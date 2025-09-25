import { makeAutoObservable } from "mobx"
import { SAMPLE_FLYERS, FLYER_CATEGORIES } from "@/lib/types"

export type Flyer = {
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

export class CategoryStore {
    flyers: Flyer[] = []
    category: string = ''


    constructor() {
        makeAutoObservable(this)
    }

    setFlyer(cat: string) {
        if (cat == 'Recently Added' || cat == 'recently-added') {
            this.flyers = SAMPLE_FLYERS.filter(fly => fly.isRecentlyAdded == true)
            this.category = cat
        } else if (cat == 'premium-flyers') {
            this.category = 'Premium Flyers'
            this.flyers = SAMPLE_FLYERS.filter(fly => fly.priceType == 'premium')
        } else if (cat == 'basic-flyers') {
            this.category = 'Basic Flyers'
            this.flyers = SAMPLE_FLYERS.filter(fly => fly.priceType == 'basic')
        }
        else {
            console.log(FLYER_CATEGORIES.find(categ => categ.slug == cat)?.name)
            this.category = 'Categories'
            // let categ = FLYER_CATEGORIES.find(category=>category.slug==cat)
            this.flyers = SAMPLE_FLYERS.filter(fly => fly.category == FLYER_CATEGORIES.find(categ => categ.slug == cat)?.name)
        }
    }


}
