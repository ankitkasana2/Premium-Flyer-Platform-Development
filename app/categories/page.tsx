import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FLYER_CATEGORIES } from "@/lib/types"
import Link from "next/link"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Flyer Categories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive collection of flyer templates organized by event type and theme
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FLYER_CATEGORIES.map((category) => (
            <Card key={category.id} className="bg-card border-border hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-card-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                  <Badge variant="secondary">{category.flyerCount}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">{category.description}</p>
                <Link href={`/flyers?category=${category.slug}`}>
                  <Button className="w-full">Browse {category.name} Flyers</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Section */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're constantly adding new categories and templates. Contact us if you need a specific style or theme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Request Custom Category</Button>
            <Button variant="outline" size="lg" className="bg-transparent">
              Contact Support
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
