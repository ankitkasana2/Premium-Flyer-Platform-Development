'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FlyerCard } from "@/components/flyer/flyer-card"
import { Star, Zap, Clock, Shield } from "lucide-react"
import { SAMPLE_FLYERS } from "@/lib/types"
import Link from "next/link"
import { type } from 'os'
import { useState } from 'react'
import FilterBar from './FilterBar'
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { FlyersCarousel } from './FlyersCarousel'




type FlyersSectionProps = {
    type: String,
}

const FlyersSection: React.FC<FlyersSectionProps> = ({ type }) => {

    const [title, setTitle] = useState(type === 'recently' ? 'Recently Added' : type === 'basic' ? 'Basic Flyers' : type === 'ladies' ? 'Ladies Night' : type === 'brunch' ? 'Brunch Flyers' : 'Featured Flyers')

    const Flyers = SAMPLE_FLYERS
    //  = SAMPLE_FLYERS.filter((flyer) => flyer.isRecentlyAdded).slice(0, 4)
    return (
        <section className="py-7 px-5">
            <div className='flex flex-col gap-5 px-5'>

                <div className='text-2xl md:text-3xl font-bold text-foreground'>
                    <h3>{title}</h3>
                </div>

                <div className='col-span-8'>
                    <FlyersCarousel flyers={Flyers} />
                </div>

            </div>
        </section>
    )
}

export default FlyersSection