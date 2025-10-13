"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type CartItem = {
    id: string
    title?: string
    price?: number
    image?: string
    category?: string
    variant?: string // e.g. "With Photos" / "Without Photos"
}

// LocalStorage key (future-proof to match app naming)
const CART_KEY = "grodify:cart"

function readCart(): CartItem[] {
    if (typeof window === "undefined") return []
    try {
        const raw = window.localStorage.getItem(CART_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

function writeCart(items: CartItem[]) {
    if (typeof window === "undefined") return
    window.localStorage.setItem(CART_KEY, JSON.stringify(items))
}

function currency(n?: number) {
    if (!n) return "$0.00"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
}

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([])

    useEffect(() => {
        setItems(readCart())
    }, [])

    const subtotal = useMemo(() => items.reduce((sum, it) => sum + (it.price || 0), 0), [items])
    const fees = useMemo(() => Math.round(subtotal * 0.05 * 100) / 100, [subtotal]) // 5% estimate
    const total = useMemo(() => subtotal + fees, [subtotal, fees])

    const removeItem = (id: string) => {
        const next = items.filter((i) => i.id !== id)
        setItems(next)
        writeCart(next)
    }

    const clearCart = () => {
        setItems([])
        writeCart([])
    }

    const EmptyState = () => (
        <div className="rounded-lg border border-border bg-card p-10 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center">
                <span className="text-2xl"><ShoppingBag className="h-6 w-6"/></span>
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
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-balance">Your Cart</h1>
                <p className="text-muted-foreground mt-1">Review your flyer templates and proceed to secure checkout.</p>
            </header>

            {items.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Items */}
                    <section className="lg:col-span-2 rounded-lg border border-border bg-card p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Items ({items.length})</h2>
                            <Button variant="ghost" className="text-destructive" onClick={clearCart}>
                                Clear cart
                            </Button>
                        </div>

                        <ul className="mt-4 space-y-4">
                            {items.map((it) => (
                                <li key={it.id} className="rounded-md border border-border p-4 overflow-hidden">
                                    <div className="flex items-start gap-4">
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                                            {/* Thumbnail */}
                                            {/* Use provided image or placeholder */}
                                            <img
                                                src={
                                                    it.image ||
                                                    "/placeholder.svg?height=160&width=160&query=fallback%20flyer%20thumbnail" ||
                                                    "/placeholder.svg"
                                                }
                                                alt={it.title ? `${it.title} thumbnail` : "Flyer thumbnail"}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-start gap-2">
                                                <h3 className="font-medium truncate">{it.title || "Untitled Flyer"}</h3>
                                                {it.category ? <Badge variant="secondary">{it.category}</Badge> : null}
                                                {it.variant ? <Badge variant="outline">{it.variant}</Badge> : null}
                                            </div>

                                            <div className="mt-2 text-sm text-muted-foreground">
                                                Instagram Post size included. Add Story size or Animation at checkout.
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                                <span className="text-base font-semibold">{currency(it.price)}</span>
                                                <Button variant="outline" size="sm" onClick={() => removeItem(it.id)} className="gap-2">
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                </Button>
                                                <Link href={`/order/${it.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        Customize
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                            <Link href="/flyers">
                                <Button variant="outline">Continue Shopping</Button>
                            </Link>
                            <Link href="/checkout/preview">
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

                        <Link href="/checkout/preview">
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
