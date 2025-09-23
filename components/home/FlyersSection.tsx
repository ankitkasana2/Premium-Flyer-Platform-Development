'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FlyerCard } from "@/components/flyer/flyer-card"
import { Star, Zap, Clock, Shield } from "lucide-react"
import { SAMPLE_FLYERS } from "@/lib/types"
import Link from "next/link"
import { type } from 'os'
import { useState, useEffect } from 'react'
import FilterBar from '../categories/FilterBar'
import { FlyersCarousel } from './FlyersCarousel'
import { useSearchParams } from "next/navigation";
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toJS } from "mobx"


type Flyer = {
    id: string
    name: string
    category: string
    price: number
    priceType: "basic" | "regular" | "premium"
    hasPhotos: boolean
    imageUrl: string
    tags: string[]
    isRecentlyAdded?: boolean
    isFeatured?: boolean
};

type FlyersSectionProps = {
    type: {
        id: string;
        name: string;
        slug: string;
        homePage: boolean;
    };

}

type Filter = {
    price: string[]; // or number[] depending on your store
    category: string[];
    type: string[];
};

const FlyersSection: React.FC<FlyersSectionProps> = ({ type }) => {

    const { authStore, filterBarStore } = useStore()

    const searchParams = useSearchParams();

    const [Flyers, setFlyers] = useState<Flyer[]>([]);
    const [filter, setFilter] = useState<Filter>({
        price: [],
        category: [],
        type: []
    });


    useEffect(() => {
        setFilter(prev => ({
            ...prev,      // keep existing category and type
            price: toJS(filterBarStore.price)     // update price
        }));

        console.log(filter)

    }, [filterBarStore.price])



    useEffect(() => {
        if (type.name == 'Recently Added') {
            setFlyers(SAMPLE_FLYERS.filter(fly => fly.isRecentlyAdded == true))
        } else if (type.name == 'Premium Flyers') {
            setFlyers(SAMPLE_FLYERS.filter(fly => fly.price == 40))
        } else if (type.name == 'Basic Flyers') {
            setFlyers(SAMPLE_FLYERS.filter(fly => fly.price == 10))
        }
        else {
            const flyer = SAMPLE_FLYERS.filter(fly => fly.category == type.name)
            setFlyers(flyer)
        }
    }, [searchParams])


    useEffect(() => {
     console.log(searchParams)
    }, [filter])
    






    return (
        <section className="py-3 px-5">
            <div className='flex flex-col gap-1'>
                {/* title  */}
                <div className='text-lg md:text-xl font-semibold text-foreground'>
                    <Link href={`/categories?${type.slug}`}>{type.name}</Link>
                </div>

                <div className='col-span-8 '>
                    <FlyersCarousel flyers={Flyers} />
                </div>

            </div>
        </section>
    )
}

export default observer(FlyersSection)