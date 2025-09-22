import { makeAutoObservable } from "mobx"

export class FilterBarStore {
    price: string[] = []
    category: string[] = []
    type: string[] = []

    constructor() {
        makeAutoObservable(this)
    }

    priceFilter(price: string) {
        const index = this.price.indexOf(price); // check if price exists
        if (index > -1) {
            // price exists, remove it
            this.price.splice(index, 1);
        } else {
            // price does not exist, add it
            this.price.push(price);
        }
    }


    //   remove(id: string) {
    //     this.favorites = this.favorites.filter(fav => fav !== id)
    //   }

    //   get count() {
    //     return this.favorites.length
    //   }
}
