"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PenTool, Search, Bell } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Medium</span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/write">
                <Button variant="ghost" size="sm" className="gap-2">
                  <PenTool className="h-4 w-4" />
                  Write
                </Button>
              </Link>

              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/${user.username}`}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/write">
                <Button variant="ghost" size="sm">
                  Write
                </Button>
              </Link>
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
