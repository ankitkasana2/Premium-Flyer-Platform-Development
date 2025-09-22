'use client'
import React, { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FLYER_CATEGORIES } from "@/lib/types"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toJS } from 'mobx'

const pricing = [
    { id: 'price1', label: '10' },
    { id: 'price2', label: '15' },
    { id: 'price3', label: '45' },
]

const FilterBar = () => {

    const { authStore, filterBarStore } = useStore()

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
     console.log("price",toJS(filterBarStore.price))
    }, [toJS(filterBarStore.price)])
    
    


    return (
        <div className='flex flex-col gap-6 h-full p-3'>
            {/* category  */}
            <div className='flex flex-col gap-1'>
                <h2>Category</h2>
                <div className='p-2  rounded-md bg-gray-800/15 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.8)] max-h-40 overflow-y-auto hide-scrollbar'>
                    <ul className="space-y-3">
                        {FLYER_CATEGORIES.map((cat) => (
                            <li key={cat.name} className="flex items-center gap-3">
                                <Checkbox
                                    id={cat.name}
                                    checked={selected.includes(cat.name)}
                                    onCheckedChange={() => toggleCategory(cat.name)}
                                />
                                <Label className='font-light' htmlFor={cat.name}>{cat.name}</Label>
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
                                    checked={selected.includes(price.label)}
                                    onCheckedChange={() => togglePrice(price.label)}
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