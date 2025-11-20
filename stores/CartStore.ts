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





import { makeAutoObservable } from "mobx"
import { getApiUrl } from "@/config/api"


export class CartStore {
    cart: string[] = []
    // cartfly: string[] = []




    constructor() {
        makeAutoObservable(this)
    }

    async addToCart(id: string, userId: string, formData?: any) {
        if (!userId) {
            throw new Error("User ID is required to add items to the cart.")
        }

        console.log("🛒 addToCart called")

        // 1) Add to local cart
        if (!this.cart.includes(id)) {
            this.cart.push(id)
        }

        // 2) Prepare API values here
        const payload = {
            user_id: userId,
            flyer_id: id,          // id IS flyer_id
            form_data: formData ?? null
        }

        console.log("📦 Saving to server:", payload)

        try {
            // const res = await fetch(`http://193.203.161.174:3007/api/cart/add`, {
            const res = await fetch(getApiUrl("/api/cart/add"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            console.log("🟢 Cart saved:", data)

        } catch (err) {
            console.error("❌ Cart save error:", err)
        }
    }



    // Load cart for user
    async load(userId: string) {
        if (!userId) return

        try {
            const res = await fetch(getApiUrl(`/api/cart/user/${userId}`))
            const data = await res.json()

            if (data.success) {
                // Save full flyer objects
                this.cart = data.cart
            }
        } catch (err) {
            console.error("❌ Cart load error:", err)
        }
    }


    removeFromCart(id: string) {
        this.cart = this.cart.filter(itemId => itemId !== id)
    }

    clearCart() {
        this.cart = []
    }
}
