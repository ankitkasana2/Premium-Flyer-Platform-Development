import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FLYER_CATEGORIES } from "@/lib/types"
import Link from "next/link"
import FilterBar from "@/components/categories/FilterBar"
import FlyersSection from "@/components/home/FlyersSection"

export default function CategoriesPage() {
  return (
    <section className="min-h-[150vh] bg-background grid grid-cols-7">
      {/* filter bar  */}
      <div className="col-span-1 sticky top-16 h-screen bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-r border-border z-50 shadow-lg">
        <FilterBar />
      </div>

      {/* carsoul bar  */}
      <div className="col-span-6 ">
        {/* Featured Flyers */}
        <FlyersSection type={'recently'} />
        {/* Featured Flyers */}
        <FlyersSection type={'basic'} />

        {/* Featured Flyers */}
        <FlyersSection type={'ladies'} />

        {/* Featured Flyers */}
        <FlyersSection type={'brunch'} />
      </div>
    </section>
  )
}
