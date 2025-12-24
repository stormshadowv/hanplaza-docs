"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { apiClient } = await import('@/lib/api-client')
      await apiClient.login(email, password)
      localStorage.setItem("hanplaza_auth", "true")
      router.push("/dashboard")
    } catch (error: any) {
      alert(error.message || 'Ошибка входа')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <Image src="/images/logo.png" alt="Han Plaza" fill className="object-contain" priority />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">{"Добро пожаловать"}</CardTitle>
            <CardDescription className="text-base mt-2">{"Войдите в систему обучения Han Plaza"}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{"Email"}</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@hanplaza.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{"Пароль"}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
