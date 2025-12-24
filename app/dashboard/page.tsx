"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient, Category } from "@/lib/api-client"
import { Briefcase, Headphones, Package, Palette, ShoppingCart, Truck, Video } from "lucide-react"
import Link from "next/link"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  briefcase: Briefcase,
  "shopping-cart": ShoppingCart,
  package: Package,
  palette: Palette,
  truck: Truck,
  headphones: Headphones,
}

export default function DashboardPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { categories: data } = await apiClient.getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{"Обучающие материалы"}</h1>
            <p className="text-muted-foreground">{"Выберите категорию для просмотра видео"}</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const Icon = iconMap[category.icon] || Video
                return (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 h-full group cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            {category.videoCount} {"видео"}
                          </div>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="text-base">{category.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
