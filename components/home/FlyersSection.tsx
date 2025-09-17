'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlyerCard } from "@/components/flyer/flyer-card"
import { Star, Zap, Clock, Shield } from "lucide-react"
import { SAMPLE_FLYERS } from "@/lib/types"
import Link from "next/link"
import { type } from 'os'
import { useState } from 'react'
import FilterBar from './FilterBar'

type FlyersSectionProps = {
    type: String,
}

const FlyersSection: React.FC<FlyersSectionProps> = ({ type }) => {

    const [title, setTitle] = useState("")

    const Flyers = SAMPLE_FLYERS.filter((flyer) => type == "feature" ? flyer.isFeatured : flyer.isRecentlyAdded).slice(0, 4)
    //  = SAMPLE_FLYERS.filter((flyer) => flyer.isRecentlyAdded).slice(0, 4)
    return (
        <section className="py-15">
            <div className="grid grid-cols-10 gap-2">
                <FilterBar/>

                <div className='col-span-8'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {Flyers.map((flyer) => (
                            <FlyerCard key={flyer.id} flyer={flyer} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default FlyersSection