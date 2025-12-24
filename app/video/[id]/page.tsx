                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "use client"

import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Content, VideoCategory } from "@/lib/data"
import { ArrowLeft, Clock, Eye, Calendar } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function VideoPage() {
  const params = useParams()
  const router = useRouter()
  const videoId = params.id as string
  
  const [video, setVideo] = useState<Content | null>(null)
  const [category, setCategory] = useState<VideoCategory | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch video
        const videoRes = await fetch(`/api/content/${videoId}`)
        const videoData = await videoRes.json()
        
        if (videoData.content) {
          setVideo(videoData.content)
          
          // Fetch category
          const categoryRes = await fetch(`/api/categories/${videoData.content.categoryId}`)
          const categoryData = await categoryRes.json()
          setCategory(categoryData.category)
          
          // Fetch related videos
          const relatedRes = await fetch(`/api/content?categoryId=${videoData.content.categoryId}&type=video`)
          const relatedData = await relatedRes.json()
          setRelatedVideos(relatedData.content.filter((v: Content) => v.id !== videoId))
        }
      } catch (error) {
        console.error("Error fetching video data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [videoId])

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-8 px-4">
            <p className="text-muted-foreground">Загрузка...</p>
          </main>
        </div>
      </AuthGuard>
    )
  }

  if (!video || !category) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-8 px-4">
            <p className="text-muted-foreground">{"Видео не найдено"}</p>
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
            <Link href={`/category/${video.categoryId}`}>
              <Button variant="ghost" className="mb-4 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {"Назад к"} {category.name}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-black">
                    {video.videoUrl && (
                      <iframe
                        className="w-full h-full"
                        src={video.videoUrl}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-2xl">{video.title}</CardTitle>
                  <CardDescription className="text-base">{video.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {video.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{video.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>
                        {video.views} {"просмотров"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(video.uploadDate).toLocaleDateString("ru-RU")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {relatedVideos.length > 0 && (
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{"Похожие видео"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {relatedVideos.map((relatedVideo) => (
                      <button
                        key={relatedVideo.id}
                        onClick={() => router.push(`/video/${relatedVideo.id}`)}
                        className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200 border border-transparent hover:border-primary/30"
                      >
                        <h3 className="font-semibold mb-1 text-sm leading-snug text-foreground">
                          {relatedVideo.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {relatedVideo.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{relatedVideo.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{relatedVideo.views}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
