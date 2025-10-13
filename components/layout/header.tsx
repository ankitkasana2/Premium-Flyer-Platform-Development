"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserMenu from "@/components/auth/user-menu"
import { Search, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-[50] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center w-full justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" height={10} alt="Logo" width={10} className="w-24 sm:w-32 md:w-36" />
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search flyers..."
                className="pl-10 bg-card border-border text-input-text shadow-md
                focus-visible:!ring-0 focus-visible:!outline-none
                focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
                transition-all duration-300"
              />
            </div>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/categories" className="text-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center md:space-x-5 gap-4 mr-1">
            {/* Mobile Search Icon */}
            <div
              className="sm:hidden cursor-pointer"
              onClick={() => setIsSearchOpen((prev) => !prev)}
            >
              <Search
                className={cn(
                  "h-5 w-5 transition-colors",
                  isSearchOpen ? "text-primary" : "text-foreground"
                )}
              />
            </div>

            <div className="flex hover:bg-none cursor-pointer">
              <ShoppingCart className="w-5 h-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex items-center">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Dropdown style) */}
      <div
        className={cn(
          "sm:hidden sm:bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300 overflow-hidden",
          isSearchOpen ? "max-h-20 opacity-100 px-3 pb-3 " : "max-h-0 opacity-0"
        )}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search flyers..."
            className="pl-10 bg-card border-border text-input-text shadow-md
            focus-visible:!ring-0 focus-visible:!outline-none
            focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
            transition-all duration-300"
          />
        </div>
      </div>
    </header>
  )
}
