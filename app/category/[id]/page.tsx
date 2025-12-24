"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient, Category, Video } from "@/lib/api-client"
import { ArrowLeft, Clock, Eye, Calendar } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.id as string
  const [category, setCategory] = useState<Category | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем категории и видео
        const [categoriesData, videosData] = await Promise.all([
          apiClient.getCategories(),
          apiClient.getVideos(categorySlug)
        ])

        const foundCategory = categoriesData.categories.find(c => c.slug === categorySlug)
        setCategory(foundCategory || null)
        setVideos(videosData.videos)
        setSelectedVideo(videosData.videos[0] || null)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [categorySlug])

  useEffect(() => {
    // Увеличиваем счетчик просмотров при выборе видео
    if (selectedVideo) {
      apiClient.incrementVideoViews(selectedVideo.id).catch(console.error)
    }
  }, [selectedVideo])

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-black">
                    <iframe
                      className="w-full h-full"
                      src={selectedVideo?.videoUrl}
                      title={selectedVideo?.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>

              {selectedVideo && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-2xl">{selectedVideo.title}</CardTitle>
                    <CardDescription className="text-base">{selectedVideo.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{selectedVideo.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>
                          {selectedVideo.views} {"просмотров"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(selectedVideo.uploadDate).toLocaleDateString("ru-RU")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Video List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {"Все видео"} ({videos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {videos.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        selectedVideo?.id === video.id
                          ? "bg-primary/10 border border-primary/50"
                          : "bg-muted/50 hover:bg-muted border border-transparent"
                      }`}
                    >
                      <h3
                        className={`font-semibold mb-1 text-sm leading-snug ${
                          selectedVideo?.id === video.id ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{video.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{video.views}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
