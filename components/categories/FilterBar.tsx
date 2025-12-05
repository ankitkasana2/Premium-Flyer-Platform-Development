'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SAMPLE_FLYERS, getCategoriesWithFlyers, getCategoryCounts } from "@/lib/types"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"

const pricing = [
    { id: 'basic', label: '10' },
    { id: 'regular', label: '15' },
    { id: 'premium', label: '40' },
]

const FilterBar = () => {

    const { filterBarStore, flyersStore, categoryStore } = useStore()

    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedPrices, setSelectedPrices] = useState<string[]>([])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])

    const toggleCategory = (categoryName: string) => {
        const newSelected = selectedCategories.includes(categoryName)
            ? selectedCategories.filter((c) => c !== categoryName)
            : [...selectedCategories, categoryName]

        setSelectedCategories(newSelected)
        filterBarStore.categoryFilter(categoryName)

        // Apply category filter
        if (newSelected.length > 0) {
            // Filter flyers by selected categories
            const allFlyers = flyersStore.flyers.length ? flyersStore.flyers : SAMPLE_FLYERS
            const filtered = allFlyers.filter((flyer: any) => {
                // Check if flyer has categories array (API format)
                if (Array.isArray(flyer.categories)) {
                    return newSelected.some(cat => flyer.categories.includes(cat))
                }
                // Fallback to old format
                return newSelected.includes(flyer.category)
            })
            categoryStore.flyers = filtered
            categoryStore.category = newSelected.join(', ')
        } else {
            // No category selected, show current category or all
            if (categoryStore.category) {
                categoryStore.setFlyer(categoryStore.category)
            }
        }
    }

    const togglePrice = (id: string) => {
        const newSelected = selectedPrices.includes(id)
            ? selectedPrices.filter((c) => c !== id)
            : [...selectedPrices, id]

        setSelectedPrices(newSelected)
        filterBarStore.priceFilter(id)

        // Apply price filter to current category
        categoryStore.setFlyerByFilter(filterBarStore.price)
    }

    const toggleType = (type: string) => {
        const newSelected = selectedTypes.includes(type)
            ? selectedTypes.filter((t) => t !== type)
            : [...selectedTypes, type]

        setSelectedTypes(newSelected)
        filterBarStore.typeFilter(type)

        // Apply type filter
        if (newSelected.length > 0) {
            const allFlyers = flyersStore.flyers.length ? flyersStore.flyers : SAMPLE_FLYERS
            const filtered = allFlyers.filter((flyer: any) => {
                if (newSelected.includes('info')) {
                    return !flyer.hasPhotos && !flyer.has_photos
                }
                if (newSelected.includes('photos')) {
                    return flyer.hasPhotos || flyer.has_photos
                }
                return true
            })
            categoryStore.flyers = filtered
        } else {
            // Reset to current category
            if (categoryStore.category) {
                categoryStore.setFlyer(categoryStore.category)
            }
        }
    }

    useEffect(() => {
        if (!flyersStore.flyers.length) {
            flyersStore.fetchFlyers()
        }
    }, [flyersStore])

    const flyerSource = flyersStore.flyers.length ? flyersStore.flyers : SAMPLE_FLYERS
    const availableCategories = useMemo(
        () => getCategoriesWithFlyers(flyerSource),
        [flyerSource]
    )
    const categoryCounts = useMemo(
        () => getCategoryCounts(flyerSource),
        [flyerSource]
    )


    return (
        <div className='flex flex-col gap-6 h-full p-3'>
            {/* category  */}
            <div className='flex flex-col gap-1'>
                <h2>Category</h2>
                <div className='p-2  rounded-md bg-gray-800/15 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.8)] max-h-40 overflow-y-auto hide-scrollbar'>
                    <ul className="space-y-3">
                        {availableCategories.map((cat) => (
                            <li key={cat.name} className="flex items-center gap-3">
                                <Checkbox
                                    id={cat.name}
                                    checked={selectedCategories.includes(cat.name)}
                                    onCheckedChange={() => toggleCategory(cat.name)}
                                />
                                <Label className='font-light cursor-pointer' htmlFor={cat.name}>
                                    {cat.name}
                                    {categoryCounts[cat.name] ? ` (${categoryCounts[cat.name]})` : ""}
                                </Label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* price range  */}
            <div className='flex flex-col gap-1'>
                <h2>Price</h2>
                <div className='p-2 rounded-md bg-gray-700/15 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.8)]'>
                    <ul className="space-y-3">
                        {pricing.map((price) => (
                            <li key={price.label} className="flex items-center gap-3">
                                <Checkbox
                                    id={price.label}
                                    checked={selectedPrices.includes(price.id)}
                                    onCheckedChange={() => togglePrice(price.id)}
                                />
                                <Label className='font-light cursor-pointer' htmlFor={price.label}>${price.label}</Label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* type  */}
            <div className='flex flex-col gap-1'>
                <h2>Template Type</h2>
                <div className='p-2  rounded-md bg-gray-700/15 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.8)]'>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <Checkbox
                                id='info'
                                checked={selectedTypes.includes('info')}
                                onCheckedChange={() => toggleType('info')}
                            />
                            <Label className='font-light cursor-pointer' htmlFor='info'>Info Only</Label>
                        </li>
                        <li className="flex items-center gap-3">
                            <Checkbox
                                id='photos'
                                checked={selectedTypes.includes('photos')}
                                onCheckedChange={() => toggleType('photos')}
                            />
                            <Label className='font-light cursor-pointer' htmlFor='photos'>With Photos</Label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default observer(FilterBar)