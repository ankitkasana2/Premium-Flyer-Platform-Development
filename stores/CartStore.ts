import { makeAutoObservable } from "mobx"

export class CartStore {
    cart: string[] = []

    constructor() {
        makeAutoObservable(this)
    }

    addToCart(id: string) {
        if (!this.cart.includes(id)) {
            this.cart.push(id)
        }
    }

    removeFromCart(id: string) {
        this.cart = this.cart.filter(itemId => itemId !== id)
    }

    clearCart() {
        this.cart = []
    }
}
