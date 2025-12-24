"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { Briefcase, Headphones, Package, Palette, ShoppingCart, Truck, Video, GitBranch } from "lucide-react"
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
  const [categories, setCategories] = useState<any[]>([])
  const [processes, setProcesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, processesData] = await Promise.all([
          apiClient.getCategories(),
          apiClient.getProcesses(),
        ])
        setCategories(categoriesData.categories)
        setProcesses(processesData.processes)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-8 px-4">
            <p className="text-center text-muted-foreground">Загрузка...</p>
          </main>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 px-4 space-y-12">
          <section>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent">
                  <GitBranch className="h-6 w-6 text-accent-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">{"Бизнес-процессы"}</h2>
              </div>
              <p className="text-muted-foreground">{"Схемы и описания ключевых бизнес-процессов компании Han Plaza"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processes.map((process) => (
                <Link key={process.id} href={`/process/${process.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:border-accent/50 h-full group cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                          <GitBranch className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {process.steps.length} {"этапов"}
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-accent-foreground transition-colors">
                        {process.name}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">{process.description}</CardDescription>
                      <div className="pt-2 flex flex-wrap gap-1">
                        {process.departments.slice(0, 2).map((dept: any) => (
                          <span
                            key={dept}
                            className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium"
                          >
                            {dept}
                          </span>
                        ))}
                        {process.departments.length > 2 && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            +{process.departments.length - 2}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">{"Обучающие материалы"}</h2>
              </div>
              <p className="text-muted-foreground">{"Выберите категорию для просмотра видео и инструкций"}</p>
            </div>

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
                            {category.videoCount || 0} {"материалов"}
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
          </section>
        </main>
      </div>
    </AuthGuard>
  )
}
