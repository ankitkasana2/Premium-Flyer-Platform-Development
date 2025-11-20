import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlyerCard } from "@/components/flyer/flyer-card"
import { Star, Zap, Clock, Shield } from "lucide-react"
import { getCategoriesWithFlyers } from "@/lib/types"
import Link from "next/link"
import Image from 'next/image'

const FeaturedCategories = () => {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Popular Categories</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Discover flyer templates for every type of event and occasion
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 cursor-pointer gap-4">
                    {getCategoriesWithFlyers()
                        .filter((category) => category.homePage)
                        .map((category) => (
                        <Link className='flex flex-col gap-2 items-center' key={category.id} href={`/catalog?category=${encodeURIComponent(category.name)}`}>
                            <div className='relative w-full h-[40vh] border rounded-md overflow-hidden group cursor-pointer'>
                                <Image
                                    src={"/placeholder.svg"}
                                    alt={category.name}
                                    fill
                                    className="absolute object-cover  transition-transform duration-400 group-hover:scale-110"
                                />
                            </div>
                            <div>{category.name}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedCategories