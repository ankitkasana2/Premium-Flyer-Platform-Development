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
import FilterBar from '../categories/FilterBar'
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
    price: String,
}

const FlyersSection: React.FC<FlyersSectionProps> = ({ type }) => {

    const [title, setTitle] = useState(type === 'recently' ? 'Recently Added' : type === 'basic' ? 'Basic Flyers' : type === 'ladies' ? 'Ladies Night' : type === 'brunch' ? 'Brunch Flyers' : type === 'Halloween' ? 'Halloween' : type === 'Christmas' ? 'Christmas' : type === "Valentine" ? "Valentine's" : type === "Summer Parties" ? "Summer Parties" : '')


    const [Flyers, setFlyers] = useState(type === 'recently' ? SAMPLE_FLYERS.filter(fly=>{return fly.isRecentlyAdded == true}) : type === 'Halloween' ? SAMPLE_FLYERS.filter(fly=>{return fly.category == 'Halloween'}) : type === 'ladies' ? SAMPLE_FLYERS.filter(fly=>{return fly.category == 'Ladies Night'}) : type === 'brunch' ? SAMPLE_FLYERS.filter(fly=>{return fly.category == 'Brunch'}) : type === 'Christmas' ? SAMPLE_FLYERS.filter(fly=>{return fly.category == 'Christmas'}) : type === "Valentine" ? SAMPLE_FLYERS.filter(fly=>{return fly.category == "Valentine's"}) : type === "Summer Parties" ? SAMPLE_FLYERS.filter(fly=>{return fly.category == "Summer Parties"}) : type === "Neon Parties" ? SAMPLE_FLYERS.filter(fly=>{return fly.category == "Neon Parties"}) : type === "EDM/DJs" ? SAMPLE_FLYERS.filter(fly=>{return fly.category == "EDM/DJs"}) : type === "Hookah Nights" ? SAMPLE_FLYERS.filter(fly=>{return fly.category == "Hookah Nights"}) : type === "Game Night" ? SAMPLE_FLYERS.filter(fly=>{return fly.category == "Game Night"}) :   []  )

   
    //  = SAMPLE_FLYERS.filter((flyer) => flyer.isRecentlyAdded).slice(0, 4)
    return (
        <section className="py-3 px-5">
            <div className='flex flex-col gap-1'>
                {/* title  */}
                <div className='text-xl md:text-2xl font-semibold text-foreground'>
                    <h3>{title}</h3>
                </div>

                <div className='col-span-8 '>
                    <FlyersCarousel flyers={Flyers} />
                </div>

            </div>
        </section>
    )
}

export default FlyersSection