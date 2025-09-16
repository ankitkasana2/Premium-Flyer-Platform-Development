export interface OrderItem {
  id: string
  flyerId: string
  flyerName: string
  flyerImage: string
  price: number
  priceType: "basic" | "regular" | "premium"
  hasPhotos: boolean
  extras: {
    storySize: boolean
    makeDifferent: boolean
    animated: boolean
    instagramPost: boolean
  }
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  orderDetails: {
    presenting: string
    mainTitle: string
    date: string
    eventInformation: string
    mainDJ: string
    additionalDJs: string[]
    hostedBy: string
    address: string
    phoneNumber: string
    venueLogo?: File
    promoterLogo?: File
    sponsorLogo?: File
    customNotes: string
    uploadedImages: File[]
  }
  deliveryOption: "24hours" | "5hours" | "1hour"
  status: "pending" | "in-progress" | "designing" | "ready" | "delivered"
  totalAmount: number
  createdAt: string
  updatedAt: string
  deliveryDeadline: string
  trackingUpdates: {
    status: string
    message: string
    timestamp: string
  }[]
}

export const DELIVERY_OPTIONS = [
  { value: "24hours", label: "24 Hours", price: 0, description: "Standard delivery - Free" },
  { value: "5hours", label: "5 Hours", price: 10, description: "Fast delivery - $10 extra" },
  { value: "1hour", label: "1 Hour", price: 20, description: "Express delivery - $20 extra" },
] as const

export const ORDER_STATUSES = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  "in-progress": { label: "In Progress", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  designing: { label: "Designing", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  ready: { label: "Ready", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  delivered: { label: "Delivered", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
}

// Mock orders data
export const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD-001",
    userId: "1",
    items: [
      {
        id: "1",
        flyerId: "1",
        flyerName: "Neon Nights Party",
        flyerImage: "/neon-party-flyer-dark-background.jpg",
        price: 15,
        priceType: "regular",
        hasPhotos: true,
        extras: {
          storySize: true,
          makeDifferent: false,
          animated: true,
          instagramPost: true,
        },
      },
    ],
    orderDetails: {
      presenting: "Club Neon",
      mainTitle: "Neon Nights Party",
      date: "2024-12-31",
      eventInformation: "New Year's Eve celebration with neon theme",
      mainDJ: "DJ Neon Master",
      additionalDJs: ["DJ Light", "DJ Glow"],
      hostedBy: "Club Neon Management",
      address: "123 Party Street, Miami, FL",
      phoneNumber: "+1 (555) 123-4567",
      customNotes: "Please make the neon colors extra bright",
      uploadedImages: [],
    },
    deliveryOption: "5hours",
    status: "designing",
    totalAmount: 50, // 15 + 10 (story) + 25 (animated) + 10 (5hr delivery)
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    deliveryDeadline: "2024-01-15T15:00:00Z",
    trackingUpdates: [
      {
        status: "pending",
        message: "Order received and payment confirmed",
        timestamp: "2024-01-15T10:00:00Z",
      },
      {
        status: "in-progress",
        message: "Order details reviewed and approved",
        timestamp: "2024-01-15T12:00:00Z",
      },
      {
        status: "designing",
        message: "Designer started working on your flyer",
        timestamp: "2024-01-15T14:30:00Z",
      },
    ],
  },
]
