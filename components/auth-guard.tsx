"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const auth = localStorage.getItem("hanplaza_auth")
      const token = localStorage.getItem("hanplaza_token")
      
      if (!auth || !token) {
        router.push("/login")
        setIsLoading(false)
        return
      }

      // Проверяем валидность токена через API
      try {
        const { apiClient } = await import('@/lib/api-client')
        await apiClient.getMe()
        setIsAuthenticated(true)
      } catch (error) {
        // Токен невалиден, очищаем и редиректим на логин
        localStorage.removeItem("hanplaza_auth")
        localStorage.removeItem("hanplaza_token")
        localStorage.removeItem("hanplaza_user")
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
