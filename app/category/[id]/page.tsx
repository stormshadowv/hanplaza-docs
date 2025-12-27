"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"
import type { Content } from "@/lib/data"
import { ArrowLeft, Clock, Eye, Calendar, Video, BookOpen } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

type ContentFilter = "all" | "video" | "instruction"

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  // В Next.js 15+ params может быть Promise, поэтому нужна правильная обработка
  const categorySlug = typeof params?.id === 'string' ? params.id : (Array.isArray(params?.id) ? params.id[0] : '')
  
  const [category, setCategory] = useState<any>(null)
  const [allContent, setAllContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ContentFilter>("all")
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)

  useEffect(() => {
    // Проверяем что slug получен
    if (!categorySlug) {
      console.log("No category slug provided")
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        console.log("Loading category with slug:", categorySlug)
        // Сначала загружаем категорию чтобы получить её ID
        const categoriesData = await apiClient.getCategories()
        console.log("All categories:", categoriesData.categories)
        const foundCategory = categoriesData.categories.find((c: any) => c.slug === categorySlug)
        
        if (!foundCategory) {
          console.log("Category not found for slug:", categorySlug)
          console.log("Available category slugs:", categoriesData.categories.map((c: any) => c.slug))
          setLoading(false)
          return
        }
        
        console.log("Found category:", foundCategory)
        setCategory(foundCategory)

        // Теперь загружаем контент по ID категории
        console.log("Fetching content for categoryId:", foundCategory.id)
        const contentResponse = await fetch(`/api/content?categoryId=${foundCategory.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("hanplaza_token")}`,
          },
        })
        
        const contentData = await contentResponse.json()
        console.log("Content data received:", contentData)
        
        if (contentData.content && contentData.content.length > 0) {
          setAllContent(contentData.content)
          // Выбираем первое видео по умолчанию, если есть
          const firstVideo = contentData.content.find((c: Content) => c.type === "video")
          setSelectedContent(firstVideo || contentData.content[0] || null)
        } else {
          console.log("No content found for category")
          setAllContent([])
          setSelectedContent(null)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        console.error('Category slug:', categorySlug)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [categorySlug, router])

  const filteredContent = filter === "all" 
    ? allContent 
    : allContent.filter((item) => item.type === filter)

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-3 w-3" />
      case "instruction":
        return <BookOpen className="h-3 w-3" />
      default:
        return null
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return "Видео"
      case "instruction":
        return "Инструкция"
      default:
        return ""
    }
  }

  const handleViewContent = (item: Content) => {
    if (item.type === "video") {
      setSelectedContent(item)
    } else {
      router.push(`/content/${item.id}`)
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-8 px-4">
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  if (!category) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-8 px-4">
            <p className="text-muted-foreground">{"Категория не найдена"}</p>
          </main>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 px-4">
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {"Назад к категориям"}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>

          {/* Content filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="gap-2"
            >
              {"Все материалы"} ({allContent.length})
            </Button>
            <Button
              variant={filter === "video" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("video")}
              className="gap-2"
            >
              <Video className="h-4 w-4" />
              {"Видео"} ({allContent.filter((c) => c.type === "video").length})
            </Button>
            <Button
              variant={filter === "instruction" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("instruction")}
              className="gap-2"
            >
              <BookOpen className="h-4 w-4" />
              {"Инструкции"} ({allContent.filter((c) => c.type === "instruction").length})
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player - only show if there's selected video content */}
            {selectedContent?.type === "video" && (
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-black">
                      {selectedContent.videoUrl && (
                        <iframe
                          className="w-full h-full"
                          src={selectedContent.videoUrl}
                          title={selectedContent.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="gap-1">
                        {getContentIcon(selectedContent.type)}
                        {getContentTypeLabel(selectedContent.type)}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{selectedContent.title}</CardTitle>
                    <CardDescription className="text-base">{selectedContent.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {selectedContent.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{selectedContent.duration}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>
                          {selectedContent.views} {"просмотров"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(selectedContent.uploadDate).toLocaleDateString("ru-RU")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Content List */}
            <div className={selectedContent?.type === "video" ? "lg:col-span-1" : "lg:col-span-3"}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {filter === "all" ? "Все материалы" : getContentTypeLabel(filter)} ({filteredContent.length})
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className={`grid gap-3 max-h-[600px] overflow-y-auto ${
                    selectedContent?.type === "video" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {filteredContent.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      {filter === "all" 
                        ? "В этой категории пока нет материалов" 
                        : `${getContentTypeLabel(filter)} в этой категории пока нет`
                      }
                    </div>
                  ) : (
                    filteredContent.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleViewContent(item)}
                      className={`text-left p-3 rounded-lg transition-all duration-200 ${
                        selectedContent?.id === item.id && item.type === "video"
                          ? "bg-primary/10 border border-primary/50"
                          : "bg-muted/50 hover:bg-muted border border-transparent hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Badge variant="outline" className="gap-1 text-xs">
                          {getContentIcon(item.type)}
                          {getContentTypeLabel(item.type)}
                        </Badge>
                      </div>
                      <h3
                        className={`font-semibold mb-1 text-sm leading-snug ${
                          selectedContent?.id === item.id && item.type === "video" ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {item.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.duration}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{item.views}</span>
                        </div>
                      </div>
                    </button>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
