"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import type { Content } from "@/lib/data"
import { ArrowRight, Calendar, ChevronRight, Clock, User, PlayCircle, FileText, Video, BookOpen, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

type ContentFilter = "all" | "video" | "instruction"

export default function ProcessPage() {
  const params = useParams()
  const router = useRouter()
  const processId = params.id as string
  
  const [process, setProcess] = useState<any>(null)
  const [allRelatedContent, setAllRelatedContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<ContentFilter>("all")
  const [selectedContent, setSelectedContent] = useState<any | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch process
        const { process: processData } = await apiClient.getProcessById(processId)
        setProcess(processData)

        // Collect all unique content IDs
        const contentIds = new Set<string>()
        processData.steps.forEach((step: any) => {
          if (step.relatedContentIds && step.relatedContentIds.length > 0) {
            step.relatedContentIds.forEach((id: string) => contentIds.add(id))
          }
        })

        // Fetch all related content
        if (contentIds.size > 0) {
          const contentPromises = Array.from(contentIds).map((id) =>
            apiClient.getContentById(id).catch(() => null)
          )
          const contents = await Promise.all(contentPromises)
          const validContents = contents.filter((c) => c !== null).map((c) => c!.content)
          setAllRelatedContent(validContents)
          setSelectedContent(validContents[0] || null)
        }
      } catch (error) {
        console.error("Error fetching process:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [processId])

  const filteredContent = filter === "all" 
    ? allRelatedContent 
    : allRelatedContent.filter((item) => item.type === filter)

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

  if (!process) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-8 px-4">
            <p className="text-muted-foreground">{"Процесс не найден"}</p>
          </main>
        </div>
      </AuthGuard>
    )
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-3 w-3" />
      case "instruction":
        return <BookOpen className="h-3 w-3" />
      case "article":
        return <FileText className="h-3 w-3" />
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
      case "article":
        return "Статья"
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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 px-4">
          {/* Back button and Header */}
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {"Назад к главной"}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">{process.name}</h1>
            <p className="text-muted-foreground mb-4">{process.description}</p>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {"Обновлено: "}
                  {new Date(process.updatedAt).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-muted-foreground">{"Отделы:"}</span>
                <div className="flex flex-wrap gap-2">
                  {process.departments.map((dept: string) => (
                    <Badge key={dept} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content filters - only show if there are related materials */}
          {allRelatedContent.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="gap-2"
              >
                {"Все материалы"} ({allRelatedContent.length})
              </Button>
              <Button
                variant={filter === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("video")}
                className="gap-2"
              >
                <Video className="h-4 w-4" />
                {"Видео"} ({allRelatedContent.filter((c) => c.type === "video").length})
              </Button>
              <Button
                variant={filter === "instruction" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("instruction")}
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                {"Инструкции"} ({allRelatedContent.filter((c) => c.type === "instruction").length})
              </Button>
            </div>
          )}

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Video player - only show if there's selected video content */}
            {selectedContent?.type === "video" && (
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-black">
                      <iframe
                        className="w-full h-full"
                        src={selectedContent.videoUrl}
                        title={selectedContent.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
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
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{selectedContent.duration}</span>
                      </div>
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

            {/* Content List - only show if there are related materials */}
            {allRelatedContent.length > 0 && (
              <div className={selectedContent?.type === "video" ? "lg:col-span-1" : "lg:col-span-3"}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {"Обучающие материалы"} ({filteredContent.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent
                    className={`grid gap-3 max-h-[600px] overflow-y-auto ${
                      selectedContent?.type === "video" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {filteredContent.map((item) => (
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
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Process Steps */}
          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">{"Этапы процесса"}</h2>

            <div className="relative">
              {/* Vertical line connecting steps */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />

              <div className="space-y-6">
                {process.steps.map((step: any, index: number) => (
                  <Card
                    key={step.id}
                    className="relative hover:shadow-md transition-all duration-300 border-l-4 border-l-accent ml-6"
                  >
                    {/* Step number circle */}
                    <div className="absolute -left-[52px] top-6 w-12 h-12 rounded-full bg-accent flex items-center justify-center border-4 border-background z-10">
                      <span className="text-lg font-bold text-accent-foreground">{step.id}</span>
                    </div>

                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                          <CardDescription className="text-base leading-relaxed">{step.description}</CardDescription>
                        </div>
                        {index < process.steps.length - 1 && (
                          <ArrowRight className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{step.responsible}</span>
                        </div>
                        {step.duration && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{step.duration}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

