import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlyerCard } from "@/components/flyer/flyer-card"
import { Star, Zap, Clock, Shield } from "lucide-react"
import { SAMPLE_FLYERS } from "@/lib/types"
import Link from "next/link"
import FlyersSection from "@/components/home/FlyersSection"
import HeroSection from "@/components/home/HeroSection"
import FeaturedCategories from "@/components/home/FeaturedCategories"

export default function HomePage() {


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Flyers */}
      <FlyersSection type={'recently'} />

      {/* Featured Flyers */}
      <FlyersSection type={'Halloween'} />

      {/* Featured Flyers */}
      <FlyersSection type={'ladies'} />

      {/* Featured Flyers */}
      <FlyersSection type={'brunch'} />


      <FlyersSection type={'Christmas'} />


      <FlyersSection type={'Valentine'} />











      {/* Features Section */}
      {/* <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Grodify?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional event flyers quickly and easily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm">
                  Get your custom flyers in as little as 1 hour with our express delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Premium Quality</h3>
                <p className="text-muted-foreground text-sm">
                  Professional designs created by expert designers for maximum impact.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">24/7 Service</h3>
                <p className="text-muted-foreground text-sm">
                  Order anytime, anywhere. Our team works around the clock for you.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Secure & Safe</h3>
                <p className="text-muted-foreground text-sm">
                  SSL encryption and secure payments. Your data is always protected.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Pricing Preview */}
      {/* <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the perfect plan for your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Basic</h3>
                <div className="text-3xl font-bold text-primary mb-4">$10</div>
                <p className="text-muted-foreground text-sm mb-6">Perfect for simple events</p>
                <Button variant="outline" className="w-full bg-transparent">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border ring-2 ring-primary">
              <CardContent className="p-6 text-center">
                <Badge className="mb-4">Most Popular</Badge>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Regular</h3>
                <div className="text-3xl font-bold text-primary mb-4">$15</div>
                <p className="text-muted-foreground text-sm mb-6">Great for most events</p>
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Premium</h3>
                <div className="text-3xl font-bold text-primary mb-4">$40</div>
                <p className="text-muted-foreground text-sm mb-6">For premium events</p>
                <Button variant="outline" className="w-full bg-transparent">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}
    </div>
  )
}
