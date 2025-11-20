import { makeAutoObservable, runInAction } from "mobx";
import { getApiUrl } from "@/config/api";

export class FlyersStore {
  flyers = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch all flyers from backend
  fetchFlyers = async () => {
    this.loading = true;
    this.error = null;

    try {
      const response = await fetch(getApiUrl("/api/flyers"), {
        cache: "no-store",
      });

      const data = await response.json();

      runInAction(() => {
        this.flyers = data;
        this.loading = false;
      });

    } catch (err: any) {
      runInAction(() => {
        this.error = err.message;
        this.loading = false;
      });
    }
  };

  // Helpers — computed filters
  get recentlyAdded() {
    return this.flyers.filter((f) => f.recentlyAdded);
  }

  get premiumFlyers() {
    return this.flyers.filter((f) => f.price === 40);
  }

  get basicFlyers() {
    return this.flyers.filter((f) => f.price === 10);
  }

  flyersByCategory(category: string) {
    return this.flyers.filter((f) =>
      f.categories?.includes(category)
    );
  }
}
