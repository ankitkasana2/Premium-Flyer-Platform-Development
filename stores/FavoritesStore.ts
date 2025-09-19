import { makeAutoObservable } from "mobx"

export class FavoritesStore {
  favorites: string[] = []

  constructor() {
    makeAutoObservable(this)
  }

  add(id: string) {
    if (!this.favorites.includes(id)) {
      this.favorites.push(id)
    }
  }

  remove(id: string) {
    this.favorites = this.favorites.filter(fav => fav !== id)
  }

  get count() {
    return this.favorites.length
  }
}
