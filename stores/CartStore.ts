// import { makeAutoObservable } from "mobx"

// export class CartStore {
//     cart: string[] = []

//     constructor() {
//         makeAutoObservable(this)
//     }

//     addToCart(id: string) {
//         if (!this.cart.includes(id)) {
//             this.cart.push(id)
//         }
//     }

//     removeFromCart(id: string) {
//         this.cart = this.cart.filter(itemId => itemId !== id)
//     }

//     clearCart() {
//         this.cart = []
//     }
// }





// import { makeAutoObservable } from "mobx"
// import { getApiUrl } from "@/config/api"


// export class CartStore {
//     cart: string[] = []
//     // cartfly: string[] = []




//     constructor() {
//         makeAutoObservable(this)
//     }

//     async addToCart(id: string, userId: string, formData?: any) {
//         if (!userId) {
//             throw new Error("User ID is required to add items to the cart.")
//         }

//         console.log("🛒 addToCart called")

//         // 1) Add to local cart
//         if (!this.cart.includes(id)) {
//             this.cart.push(id)
//         }

//         // 2) Prepare API values here
//         const payload = {
//             user_id: userId,
//             flyer_id: id,
//             event_title: formData.event_title,
//             event_date: formData.event_date,
//             image_url: formData.image_url,         // id IS flyer_id
//             form_data: formData ?? null
//         }

//         console.log("📦 Saving to server:", payload)

//         try {
//             // const res = await fetch(`http://193.203.161.174:3007/api/cart/add`, {
//             const res = await fetch(getApiUrl("/api/cart/add"), {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(payload)
//             })

//             const data = await res.json()
//             console.log("🟢 Cart saved:", data)

//         } catch (err) {
//             console.error("❌ Cart save error:", err)
//         }
//     }



//     // Load cart for user
//     async load(userId: string) {
//         // alert("Loading cart for user: " + userId);
//         if (!userId) return

//         try {
//             const res = await fetch(getApiUrl(`/api/cart/${userId}`))
//             const data = await res.json()

//             if (data.success) {
//                 // Save full flyer objects
//                 this.cart = data.cart
//             }
//         } catch (err) {
//             console.error("❌ Cart load error:", err)
//         }
//     }   


//     removeFromCart(id: string) {
//         this.cart = this.cart.filter(itemId => itemId !== id)
//     }

//     clearCart() {
//         this.cart = []
//     }
//      get count() {
//     return this.cart?.length ?? 7
//   }
// }



// stores/CartStore.ts
import { makeAutoObservable } from "mobx"
import { getApiUrl } from "@/config/api"

export interface CartFlyer {
  id: string
  name: string
  price: number
  imageUrl?: string
  category?: string
  // add any other fields your API returns
}

export class CartStore {
  cart: string[] = []                    // Only flyer IDs
  cartItems: CartFlyer[] = []            // ← NEW: Full flyer details
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async addToCart(id: string, userId: string, formData?: any) {
    if (!userId) throw new Error("User ID is required")

    // Optimistically update local cart
    if (!this.cart.includes(id)) {
      this.cart.push(id)
    }

    const payload = {
      user_id: userId,
      flyer_id: id,
      event_title: formData?.event_title,
      event_date: formData?.event_date,
      image_url: formData?.image_url,
      form_data: formData ?? null
    }

    try {
      const res = await fetch(getApiUrl("/api/cart/add"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      console.log("Cart saved:", data)

      // Optional: reload full cart after add to stay in sync
      // await this.load(userId)
    } catch (err) {
      console.error("Cart save error:", err)
      // Revert optimistic update on error?
      this.removeFromCart(id)
    }
  }

  // Load full cart with flyer details
  async load(userId: string) {
    if (!userId) return

    this.isLoading = true
    this.error = null

    try {
      const res = await fetch(getApiUrl(`/api/cart/${userId}`))
      const json = await res.json()

      if (json.success && Array.isArray(json.data)) {
        this.cartItems = json.data as CartFlyer[]           // Save full objects
        this.cart = json.data.map((item: CartFlyer) => item.id)  // Keep IDs too
      } else {
        this.cartItems = []
        this.cart = []
      }
    } catch (err) {
      console.error("Cart load error:", err)
      this.error = "Failed to load cart"
      this.cartItems = []
      this.cart = []
    } finally {
      this.isLoading = false
    }
  }

  removeFromCart(id: string) {
    this.cart = this.cart.filter(itemId => itemId !== id)
    this.cartItems = this.cartItems.filter(item => item.id !== id)
    // Optional: call backend to remove
  }

  clearCart() {
    this.cart = []
    this.cartItems = []
  }

get count() {
  return this.cartItems.length
}

  get totalPrice() {
    return this.cartItems.reduce((sum, item) => sum + (item.price || 0), 0)
  }
}
