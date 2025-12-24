"use client"

import { Button } from "@/components/ui/button"
import { LogOut, User, Shield } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const router = useRouter()

  const handleLogout = async () => {
    const { apiClient } = await import('@/lib/api-client')
    apiClient.logout()
    router.push("/login")
  }

  const userStr = typeof window !== "undefined" ? localStorage.getItem("hanplaza_user") : null
  const user = userStr ? JSON.parse(userStr) : { email: "", role: "" }
  const isAdmin = user.role === "admin"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10">
            <Image src="/images/logo.png" alt="Han Plaza" fill className="object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{"Han Plaza"}</h1>
            <p className="text-xs text-muted-foreground">{"База знаний"}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{"Мой аккаунт"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                {isAdmin && (
                  <p className="text-xs text-primary font-semibold">👑 Администратор</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    {"Админ-панель"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              {"Выйти"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
