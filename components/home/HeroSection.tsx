import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlyerCard } from "@/components/flyer/flyer-card"
import { Star, Zap, Clock, Shield } from "lucide-react"
import { SAMPLE_FLYERS } from "@/lib/types"
import Link from "next/link"
import FlyersSection from "@/components/home/FlyersSection"

const HeroSection = () => {
    return (
        <section className="relative py-20 px-4">
            <div className="container mx-auto text-center">
                <div className="max-w-4xl mx-auto">
                    <Badge variant="secondary" className="mb-6">
                        Over 10,000+ Premium Templates
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
                        Create Stunning Event Flyers in
                        <span className="text-primary"> Minutes</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
                        Professional flyer templates for nightclubs, lounges, hookah bars, and events. Customize with your details
                        and get ready-to-use flyers instantly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/flyers">
                            <Button size="lg" className="text-lg px-8">
                                Browse Templates
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                                View Pricing
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection