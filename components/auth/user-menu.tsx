"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth"
import { AuthModal } from "./auth-modal"
import { User, Settings, Heart, ShoppingBag, LogOut, CreditCard, Download, Bell, ImageDown, ChartBarStacked, CircleDollarSign } from "lucide-react"
import Link from "next/link"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const UserMenu = () => {
  const { authStore } = useStore()
  const { user, signOut } = useAuth()


  if (!user) {
    return (
      <>
        <Button className='h-7 w-14 sm:h-8 sm:w-18 hover:cursor-pointer' onClick={() => authStore.handleAuthModal()}>Sign In</Button>
        <AuthModal isOpen={authStore.authModal} onClose={() => authStore.handleAuthModal()} />
      </>
    )
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center focus:outline-none focus-visible:outline-none focus-visible:ring-0 data-[state=open]:outline-none">
        <Button variant="ghost" className="relative h-5 w-5 sm:h-8 sm:w-8 rounded-full p-0 hover:!bg-transparent hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0 focus:outline-none
        focus:ring-0">
          <Avatar className="h-5 w-5 sm:h-8 sm:w-8">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={'user'} />
            <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#0f0f0f] border-0 shadow-lg" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none text-popover-foreground">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild >
          <Link href="/profile" >
            <User className="h-4 w-4 " />
            <span>Overview</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild >
          <Link href="/orders" >
            <ShoppingBag className=" h-4 w-4" />
            <span>My Orders</span>
          </Link>
        </DropdownMenuItem >
        <DropdownMenuItem asChild>
          <Link href="/favorites" >
            <Heart className=" h-4 w-4" />
            <span>Favorites</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/downloads">
            <Download className=" h-4 w-4" />
            <span>Downloads</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/notifications">
            <Bell className=" h-4 w-4" />
            <span>Notifications</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" >
            <Settings className=" h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/media" >
            <ImageDown className=" h-4 w-4" />
            <span>Media Library</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="sm:hidden">
          <Link href="/categories" >
            <ChartBarStacked className=" h-4 w-4" />
            <span>Category</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="sm:hidden">
          <Link href="/pricing">
            <CircleDollarSign className=" h-4 w-4" />
            <span>Pricing</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} asChild className="cursor-pointer">
          <div>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default observer(UserMenu)
