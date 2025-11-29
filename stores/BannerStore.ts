// stores/BannerStore.ts
import { makeAutoObservable, runInAction } from "mobx"
import { getApiUrl } from "@/config/api"

export type Banner = {
  id: number
  title: string
  description: string
  image: string
  link?: string
  status: number
  created_at: string
  updated_at: string
}

export class BannerStore {
  banners: Banner[] = []
  loading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  // Fetch all banners
  async fetchBanners() {
    this.loading = true
    this.error = null
    
    try {
      const response = await fetch(`${getApiUrl()}/api/banners`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        runInAction(() => {
          this.banners = data.data
        })
      } else {
        throw new Error(data.message || 'Failed to fetch banners')
      }
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'An unknown error occurred'
        console.error('Error fetching banners:', error)
      })
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  // Get banner by ID
  getBannerById(id: number): Banner | undefined {
    return this.banners.find(banner => banner.id === id)
  }

  // Get active banners
  get activeBanners(): Banner[] {
    return this.banners.filter(banner => banner.status === 1)
  }
}

// Create a singleton instance
const bannerStore = new BannerStore()
export default bannerStore