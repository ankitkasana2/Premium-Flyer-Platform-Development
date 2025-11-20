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

    const { filterBarStore, flyersStore } = useStore()

    const [selected, setSelected] = useState<string[]>([])

    const toggleCategory = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        )
    }

     const togglePrice = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        )

        filterBarStore.priceFilter(id)
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
                                    checked={selected.includes(cat.name)}
                                    onCheckedChange={() => toggleCategory(cat.name)}
                                />
                                <Label className='font-light' htmlFor={cat.name}>
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
                                    checked={selected.includes(price.id)}
                                    onCheckedChange={() => togglePrice(price.id)}
                                />
                                <Label className='font-light' htmlFor={price.label}>{price.label}</Label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* type  */}
            <div className='flex flex-col gap-1'>
                <h2>Tempalte Type</h2>
                <div className='p-2  rounded-md bg-gray-700/15 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.8)]'>
                    <ul className="space-y-3">

                        <li className="flex items-center gap-3">
                            <Checkbox
                                id='info'
                            />
                            <Label className='font-light' htmlFor='info'>Info Only</Label>
                        </li>
                        <li className="flex items-center gap-3">
                            <Checkbox
                                id='photos'
                            />
                            <Label className='font-light' htmlFor='photos'>With Photos</Label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default observer(FilterBar)