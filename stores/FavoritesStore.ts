import { makeAutoObservable } from "mobx"

export class FavoritesStore {
  favorites: string[] = []

  constructor() {
    makeAutoObservable(this)
  }

  handleFavorites(id: string) {
    if (!this.favorites.includes(id)) {
      this.favorites.push(id)
    } else {
      this.favorites = this.favorites.filter(favId => favId !== id)
    }
  }


  get count() {
    return this.favorites.length
  }
}
