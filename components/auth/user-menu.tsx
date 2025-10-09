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
import { User, Settings, Heart, ShoppingBag, LogOut, CreditCard, Download, Bell, ImageDown } from "lucide-react"
import Link from "next/link"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toast } from "sonner"

const UserMenu = () => {
  const { authStore } = useStore()
  const { user, signOut } = useAuth()


  if (!user) {
    return (
      <>
        <Button onClick={() => authStore.handleAuthModal()}>Sign In</Button>
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
      <DropdownMenuTrigger >
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={'naman'} />
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
        <DropdownMenuItem className="p-0">
          <Link href="/profile" className="w-full flex items-center gap-3 text-white hover:bg-primary p-2 rounded-sm">
            <User className="h-4 w-4 text-white" />
            <span>Overview</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-0">
          <Link href="/orders" className="w-full flex items-center gap-3 text-white hover:bg-primary p-2 rounded-sm">
            <ShoppingBag className=" h-4 w-4" />
            <span>My Orders</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Link href="/favorites" className="w-full flex items-center gap-3 text-white hover:bg-primary p-2 rounded-sm">
            <Heart className=" h-4 w-4" />
            <span>Favorites</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Link href="/billing" className="w-full flex items-center gap-3 text-white hover:bg-primary p-2 rounded-sm">
            <Download className=" h-4 w-4" />
            <span>Downloads</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Link href="/notifications" className="w-full flex items-center gap-3 text-white hover:bg-primary p-2 rounded-sm">
            <Bell className=" h-4 w-4" />
            <span>Notifications</span>
          </Link>
        </DropdownMenuItem>
         <DropdownMenuItem className="p-0">
          <Link href="/settings" className="w-full flex items-center gap-3 text-white hover:bg-primary p-2 rounded-sm">
            <Settings className=" h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
         <DropdownMenuItem className="p-0">
          <Link href="/settings" className="w-full flex items-center gap-3 text-white hover:bg-primary p-2 rounded-sm">
            <ImageDown className=" h-4 w-4" />
            <span>Media Library</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer p-0">
          <div className="w-full flex items-center gap-3 text-white hover:bg-primary p-1 rounded-sm">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default observer(UserMenu)
