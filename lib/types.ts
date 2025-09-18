export interface Flyer {
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

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  flyerCount: number
  imageUrl: string
}

export const FLYER_CATEGORIES: Category[] = [
  { id: "1", name: "Halloween", slug: "halloween", description: "Spooky Halloween party flyers", flyerCount: 245, imageUrl: "/halloween-category.jpg" },
  { id: "2", name: "Christmas", slug: "christmas", description: "Festive Christmas event flyers", flyerCount: 189, imageUrl: "/pic1.jpg" },
  { id: "3", name: "Valentine's", slug: "valentines", description: "Romantic Valentine's Day flyers", flyerCount: 156, imageUrl: "/pic2.jpg" },
  {
    id: "4",
    name: "Memorial Day",
    slug: "memorial-day",
    description: "Memorial Day celebration flyers",
    flyerCount: 98,
    imageUrl: "/pic3.jpg",
  },
  {
    id: "5",
    name: "President's Day",
    slug: "presidents-day",
    description: "President's Day event flyers",
    flyerCount: 67,
    imageUrl: "/pic4.jpg",
  },
  { id: "6", name: "Summer Parties", slug: "summer-parties", description: "Hot summer party flyers", flyerCount: 312, imageUrl: "/pic5.jpg" },
  { id: "7", name: "Neon Parties", slug: "neon-parties", description: "Bright neon party flyers", flyerCount: 178, imageUrl: "/pic6.jpg" },
  { id: "8", name: "Foam Parties", slug: "foam-parties", description: "Fun foam party flyers", flyerCount: 134, imageUrl: "/pic7.jpg" },
  { id: "9", name: "Ladies Night", slug: "ladies-night", description: "Ladies night event flyers", flyerCount: 223, imageUrl: "/pic1.jpg" },
  { id: "10", name: "Hookah Nights", slug: "hookah-nights", description: "Hookah lounge flyers", flyerCount: 167, imageUrl: "/pic2.jpg" },
  { id: "11", name: "Brunch", slug: "brunch", description: "Brunch event flyers", flyerCount: 145, imageUrl: "/pic3.jpg" },
  { id: "12", name: "EDM/DJs", slug: "edm-djs", description: "Electronic music and DJ flyers", flyerCount: 289, imageUrl: "/pic4.jpg" },
  { id: "13", name: "Game Night", slug: "game-night", description: "Game night event flyers", flyerCount: 112, imageUrl: "/pic5.jpg" },
  {
    id: "14",
    name: "Basic Flyers",
    slug: "basic-flyers",
    description: "Simple and clean flyer designs",
    flyerCount: 456,
    imageUrl: "/pic7.jpg",
  },
]

// Mock flyer data
export const SAMPLE_FLYERS: Flyer[] = [
  {
    id: "1",
    name: "Neon Nights Party",
    category: "Neon Parties",
    price: 15,
    priceType: "regular",
    hasPhotos: true,
    imageUrl: "/pic10.jpg",
    tags: ["neon", "party", "nightclub"],
    isRecentlyAdded: true,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Halloween Horror Night",
    category: "Halloween",
    price: 40,
    priceType: "premium",
    hasPhotos: true,
    imageUrl: "/pic11.jpg",
    tags: ["halloween", "horror", "spooky"],
    isFeatured: true,
  },
  {
    id: "3",
    name: "Ladies Night Elegance",
    category: "Ladies Night",
    price: 10,
    priceType: "basic",
    hasPhotos: true,
    imageUrl: "/ladies-night-elegant-party-flyer.jpg",
    tags: ["ladies", "elegant", "nightclub"],
  },
  {
    id: "4",
    name: "EDM Festival Vibes",
    category: "EDM/DJs",
    price: 15,
    priceType: "regular",
    hasPhotos: true,
    imageUrl: "/edm-festival-electronic-music-flyer.jpg",
    tags: ["edm", "festival", "electronic"],
    isRecentlyAdded: true,
  },
  {
    id: "5",
    name: "Summer Beach Party",
    category: "Summer Parties",
    price: 40,
    priceType: "premium",
    hasPhotos: true,
    imageUrl: "/summer-beach-party-tropical-flyer.jpg",
    tags: ["summer", "beach", "tropical"],
    isFeatured: true,
  },
  {
    id: "6",
    name: "Hookah Lounge Night",
    category: "Hookah Nights",
    price: 15,
    priceType: "regular",
    hasPhotos: true,
    imageUrl: "/hookah-lounge-middle-eastern-flyer.jpg",
    tags: ["hookah", "lounge", "relaxed"],
  },
  {
    id: "6",
    name: "Neon Nights Party",
    category: "Neon Parties",
    price: 15,
    priceType: "regular",
    hasPhotos: true,
    imageUrl: "/neon-party-flyer-dark-background.jpg",
    tags: ["neon", "party", "nightclub"],
    isRecentlyAdded: true,
    isFeatured: true,
  },
]
