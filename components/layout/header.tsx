"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserMenu from "@/components/auth/user-menu"
import { Search, ShoppingCart, Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-[500] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-foreground">Grodify</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search flyers..." className="pl-10 bg-input border-border text-foreground" />
            </div>
          </div>

          {/* links  */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/categories" className="text-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>


          {/* User Actions */}
          <div className="flex items-center space-x-5">
            <div className="hidden md:flex hover:bg-none cursor-pointer">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div className="hidden md:flex">
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search flyers..." className="pl-10 bg-input border-border text-foreground" />
              </div>
              <Link href="/flyers" className="text-foreground hover:text-primary transition-colors py-2">
                Browse Flyers
              </Link>
              <Link href="/categories" className="text-foreground hover:text-primary transition-colors py-2">
                Categories
              </Link>
              <Link href="/pricing" className="text-foreground hover:text-primary transition-colors py-2">
                Pricing
              </Link>
              <div className="flex items-center space-x-4 pt-4">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
