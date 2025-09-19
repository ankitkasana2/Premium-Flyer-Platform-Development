// stores/AuthStore.ts
import { makeAutoObservable } from "mobx"

export class AuthStore {
    user: {
        id: string;
        name: string;
        email: string;
        provider: string;
        favorites: string[];
        orders: string[];
        password?: string;
    } | null = null
    token: string | null = null
    loading: boolean = false
    error: string | null = null
    authModal: boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    // Login simulation
    login = async (user: string) => {
        this.loading = true
        this.error = null
        try {
            // Replace with your real API call
            await new Promise((res) => setTimeout(res, 1000))
            // this.user = { id: "123", name: username }
            this.token = "fake-jwt-token"
        } catch (err: any) {
            this.error = err.message || "Login failed"
        } finally {
            this.loading = false
        }
    }

    logout = () => {
        this.user = null
        this.token = null
    }

    get isLoggedIn() {
        return !!this.user
    }

    //   open/close login window 
    handleAuthModal = () => {
        this.authModal = !this.authModal
    }
}
