'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FLYER_CATEGORIES } from "@/lib/types"
import Link from "next/link"
import FilterBar from "@/components/categories/FilterBar"
import FlyersSection from "@/components/home/FlyersSection"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toJS } from "mobx"
import { useEffect, useState } from "react"

function CategoriesPage() {


  const { authStore, filterBarStore } = useStore()
  const [filter, setFilter] = useState({
    price : [],
    category: '',
    type: ''
  })

  // useEffect(() => {
  //   setFilter(prev => ({
  //   ...prev,      // keep existing category and type
  //   price: toJS(filterBarStore.price)     // update price
  // }));
  // }, [toJS(filterBarStore.price)])
  




  return (
    <section className="min-h-[150vh] bg-background grid grid-cols-11">
      {/* filter bar  */}
      <div className="col-span-2 sticky top-16 h-screen bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-r border-border z-50 shadow-lg">
        <FilterBar />
      </div>

      {/* carsoul bar  */}
      <div className="col-span-9 ">
        {/* Featured Flyers */}
        <FlyersSection type={'recently'} price={''}/>
      </div>
    </section>
  )
}


export default observer(CategoriesPage)
