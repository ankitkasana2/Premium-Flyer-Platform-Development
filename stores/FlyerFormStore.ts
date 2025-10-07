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

// flyer form detail
export type FlyerFormDetails = {
  eventDetails: {
    presenting: string
    mainTitle: string
    date: Date | null
    flyerInfo?: string
    addressAndPhone?: string
    venueLogo?: File | null
  }

  djsOrArtists: {
    name: string
    image?: File | null
  }[]

  host: {
    name: string
    image?: File | null
  } | null

  sponsors: {
    sponsor1?: File | null
    sponsor2?: File | null
    sponsor3?: File | null
  }

  extras: {
    storySizeVersion: boolean
    customFlyer: boolean
    animatedFlyer: boolean
    instagramPostSize: boolean
  }

  deliveryTime: string

  customNote?: string

  subtotal?: number
}

export class FlyerFormStore {
  flyer: Flyer | null = null
  similarFlyers: Flyer[] = []
  flyerFormDetail: FlyerFormDetails = {
    eventDetails: {
      presenting: "",
      mainTitle: "",
      date: null,
      flyerInfo: "",
      addressAndPhone: "",
      venueLogo: null,
    },
    djsOrArtists: [
      { name: "", image: null },
      { name: "", image: null },
    ],
    host: { name: "", image: null },
    sponsors: { sponsor1: null, sponsor2: null, sponsor3: null },
    extras: {
      storySizeVersion: false,
      customFlyer: false,
      animatedFlyer: false,
      instagramPostSize: true,
    },
    deliveryTime: "24h",
    customNote: "",
    subtotal: 0,
  }

  constructor() {
    makeAutoObservable(this)
  }

  // -----------------------------
  // 1️⃣ Fetch flyer and similar flyers
  // -----------------------------
  fetchFlyer(id: string) {
    this.flyer = SAMPLE_FLYERS.find((f) => f.id === id) ?? null
    this.fetchSimilarFlyers()
  }

  fetchSimilarFlyers() {
    const flyer = this.flyer
    if (!flyer) return

    console.log("flyer:", toJS(flyer))

    this.similarFlyers = SAMPLE_FLYERS.filter(
      (f) => f.category === flyer.category && f.id !== flyer.id
    )
  }

  // -----------------------------
  // 2️⃣ Event Details
  // -----------------------------
  updateEventDetails(key: keyof FlyerFormDetails["eventDetails"], value: any) {
    this.flyerFormDetail.eventDetails[key] = value
  }

  // -----------------------------
  // 3️⃣ DJs / Artists
  // -----------------------------
  updateDJ(
    index: number,
    key: keyof FlyerFormDetails["djsOrArtists"][number],
    value: string | File | null
  ) {
    this.flyerFormDetail.djsOrArtists[index][key] = value as any
  }

  addDJ() {
    if (this.flyerFormDetail.djsOrArtists.length < 4) {
      this.flyerFormDetail.djsOrArtists.push({ name: "", image: null })
    }
  }

  removeDJ(index: number) {
    this.flyerFormDetail.djsOrArtists.splice(index, 1)
  }

  // -----------------------------
  // 4️⃣ Host
  // -----------------------------
  updateHost(key: "name" | "image", value: string | File | null) {
    if (this.flyerFormDetail.host)
      this.flyerFormDetail.host[key] = value as any
  }

  // -----------------------------
  // 5️⃣ Sponsors
  // -----------------------------
  updateSponsor(
    key: keyof FlyerFormDetails["sponsors"],
    file: File | null
  ) {
    this.flyerFormDetail.sponsors[key] = file
  }

  // -----------------------------
  // 6️⃣ Extras
  // -----------------------------
  toggleExtra(key: keyof FlyerFormDetails["extras"]) {
    this.flyerFormDetail.extras[key] = !this.flyerFormDetail.extras[key]
  }

  // -----------------------------
  // 7️⃣ Delivery Time
  // -----------------------------
  updateDeliveryTime(value: string) {
    this.flyerFormDetail.deliveryTime = value
  }

  // -----------------------------
  // 8️⃣ Custom Note
  // -----------------------------
  updateCustomNote(value: string) {
    this.flyerFormDetail.customNote = value
  }


  // subtotal 
  get subtotal() {
    let total = this.flyer?.price ?? 0;

    // Extras pricing
    const extrasPricing: Record<keyof FlyerFormDetails["extras"], number> = {
      storySizeVersion: 10,
      customFlyer: 10,
      animatedFlyer: 25,
      instagramPostSize: 0,
    };

    for (const key in this.flyerFormDetail.extras) {
      if (this.flyerFormDetail.extras[key as keyof FlyerFormDetails["extras"]]) {
        total += extrasPricing[key as keyof FlyerFormDetails["extras"]];
      }
    }

    // Delivery time pricing
    const deliveryPricing: Record<string, number> = {
      "1hours": 20,
      "5hours": 10,
      "24hours": 0,
    };

    total += deliveryPricing[this.flyerFormDetail.deliveryTime] ?? 0;

    this.flyerFormDetail.subtotal = total

    return total;
  }


  // -----------------------------
  // 9️⃣ Validate form
  // -----------------------------
  validateForm(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    const event = this.flyerFormDetail.eventDetails
    const host = this.flyerFormDetail.host
    const djs = this.flyerFormDetail.djsOrArtists
    const delivery = this.flyerFormDetail.deliveryTime

    // ✅ Event Details
    if (!event.presenting.trim()) errors.push("Presenting field is required.")
    if (!event.mainTitle.trim()) errors.push("Event Title is required.")
    if (!event.date) errors.push("Event date is required.")
    if (!event.addressAndPhone?.trim()) errors.push("Address & Phone is required.")

    // ✅ DJs / Artists (at least 1 name required)
    if (djs.length === 0 || !djs.some((dj) => dj.name.trim())) {
      errors.push("At least one DJ or Artist name is required.")
    }

    // ✅ Host
    if (!host || !host.name.trim()) errors.push("Host name is required.")

    // ✅ Delivery Time (must not be empty)
    if (!delivery || delivery.trim() === "") {
      errors.push("Please select a delivery time.")
    }



    return { valid: errors.length === 0, errors }
  }

}
