"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SAMPLE_FLYERS, type Flyer } from "@/lib/types"
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { toast } from "sonner"
import { useAuth } from "@/lib/auth"
import { toJS } from "mobx"

type CartItem = {
    id: string
    title?: string
    price?: number
    image?: string
    category?: string
    variant?: string // e.g. "With Photos" / "Without Photos"
}

// LocalStorage key (future-proof to match app naming)


function currency(n?: number) {
    if (!n) return "$0.00"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

const CartPage = () => {

     const { authStore, cartStore } = useStore()

    // const cartFlyers: Flyer[] = useMemo(() => {
    //     return SAMPLE_FLYERS.filter(f => cartStore.cart.includes(f.id))
    // }, [cartStore.cart])
    const cartFlyers = cartStore.cart



    const subtotal = useMemo(() => cartFlyers.reduce((sum, it) => sum + (it.price || 0), 0), [cartFlyers])
    const fees = useMemo(() => Math.round(subtotal * 0.05 * 100) / 100, [subtotal]) // 5% estimate
    const total = useMemo(() => subtotal + fees, [subtotal, fees])

    const EmptyState = () => (
        <div className="rounded-lg border border-border bg-card p-10 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center">
                <span className="text-2xl"><ShoppingBag className="h-6 w-6" /></span>
            </div>
            <h2 className="text-xl font-semibold text-balance">Your cart is empty</h2>
            <p className="text-muted-foreground mt-2">Browse our flyer catalog and add templates to your cart.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
                <Link href="/category">
                    <Button variant="default" className="text-primary-foreground hover:cursor-pointer">
                        Browse Flyers
                    </Button>
                </Link>
                <Link href="/favorites">
                    <Button variant="outline" className="hover:cursor-pointer">View Favorites</Button>
                </Link>
            </div>
        </div>
    )

    return (
        <main className="container mx-auto px-4 py-6 md:py-10">
            <header className="mb-6 md:mb-10">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-balance">Your Cart</h1>
                <p className="text-muted-foreground mt-1">Review your flyer templates and proceed to secure checkout.</p>
            </header>

            {cartFlyers.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Items */}
                    <section className="lg:col-span-2 rounded-lg border border-border bg-card p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Items ({cartFlyers.length})</h2>
                            <Button variant="ghost" className="text-primary" onClick={() => cartStore.clearCart()}>
                                Clear cart
                            </Button>
                        </div>

                        <ul className="mt-4 space-y-4">
                            {cartFlyers.map((fly) => (
                                <li key={fly.id} className="rounded-md border border-border p-4 overflow-hidden">
                                    <div className="flex items-start gap-4">
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                                            {/* Thumbnail */}
                                            {/* Use provided image or placeholder */}
                                            <img
                                                src={
                                                    fly.imageUrl ||
                                                    "/placeholder.svg?height=160&width=160&query=fallback%20flyer%20thumbnail" ||
                                                    "/placeholder.svg"
                                                }
                                                alt={fly.name ? `${fly.name} thumbnail` : "Flyer thumbnail"}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-start gap-2">
                                                <h3 className="font-medium truncate">{fly.name || "Untitled Flyer"}</h3>
                                                {fly.category ? <Badge >{fly.category}</Badge> : null}
                                            </div>

                                            <div className="mt-2 text-sm text-muted-foreground">
                                                Instagram Post size included. Add Story size or Animation at checkout.
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                                <span className="text-base font-semibold">{currency(fly.price)}</span>
                                                <Button variant="outline" size="sm" onClick={() => cartStore.removeFromCart(fly?.id ?? '')} className="gap-2">
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                </Button>
                                                <Link href={`flyer/${fly.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                            <Link href="/categories">
                                <Button variant="outline">Continue Shopping</Button>
                            </Link>
                            <Link href="/cart">
                                <Button className="bg-primary text-primary-foreground">Checkout</Button>
                            </Link>
                        </div>
                    </section>

                    {/* Right: Summary */}
                    <aside className="rounded-lg border border-border bg-card p-4 md:p-6 h-fit">
                        <h2 className="text-lg font-semibold">Order Summary</h2>
                        <div className="mt-4 space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">{currency(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Service fees</span>
                                <span className="font-medium">{currency(fees)}</span>
                            </div>
                            <div className="border-t border-border pt-3 flex items-center justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="font-semibold">{currency(total)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Delivery options and upgrades (Story size, Animation, Rush) are selected on the order form after
                                checkout.
                            </p>
                        </div>

                        <Link href="/cart">
                            <Button className="mt-5 w-full bg-primary text-primary-foreground">Proceed to Checkout</Button>
                        </Link>

                        <div className="mt-4">
                            <h3 className="text-sm font-medium">What’s included</h3>
                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                                <li>• Instagram Post size</li>
                                <li>• Professional PSD editing by our team</li>
                                <li>• Delivery via Email, SMS, and Profile</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            )}
        </main>
    )
}


export default observer(CartPage);
