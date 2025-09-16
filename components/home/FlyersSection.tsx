import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlyerCard } from "@/components/flyer/flyer-card"
import { Star, Zap, Clock, Shield } from "lucide-react"
import { SAMPLE_FLYERS } from "@/lib/types"
import Link from "next/link"
import { type } from 'os'

type FlyersSectionProps = {
    type: String,
}

const FlyersSection: React.FC<FlyersSectionProps> = ({type}) => {
    const Flyers = SAMPLE_FLYERS.filter((flyer) => type=="feature" ? flyer.isFeatured : flyer.isRecentlyAdded).slice(0, 4)
    //  = SAMPLE_FLYERS.filter((flyer) => flyer.isRecentlyAdded).slice(0, 4)
    return (
        <section className="py-16 px-4">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{type=="feature" ? "Featured Templates" : "Recently Added"}</h2>
                    <p className="text-xl text-muted-foreground">{type=="feature" ? "Our most popular and trending flyer designs" : "Fresh new designs added to our collection"}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {Flyers.map((flyer) => (
                        <FlyerCard key={flyer.id} flyer={flyer} />
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/flyers">
                        <Button variant="outline" size="lg" className="bg-transparent">
                            View All Templates
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default FlyersSection