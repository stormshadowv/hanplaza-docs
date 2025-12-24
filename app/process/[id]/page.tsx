"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { ArrowRight, Calendar, ChevronRight, Clock, User, PlayCircle, FileText } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function ProcessPage() {
  const params = useParams()
  const processId = params.id as string
  
  const [process, setProcess] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching process with ID:", processId)
        const { process: processData } = await apiClient.getProcessById(processId)
        console.log("Process data received:", processData)
        setProcess(processData)
      } catch (error) {
        console.error("Error fetching process:", error)
        console.error("Process ID that failed:", processId)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [processId])

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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              {"Главная"}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{process.name}</span>
          </div>

          {/* Process Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3">{process.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{process.description}</p>

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
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
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

                      {step.relatedContentIds && step.relatedContentIds.length > 0 && (
                        <div className="border-t pt-4 mt-4">
                          <p className="text-sm font-semibold text-muted-foreground mb-3">{"Обучающие материалы:"}</p>
                          <StepContent contentIds={step.relatedContentIds} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Back button */}
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              {"Вернуться к списку"}
            </Link>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

// Component to handle loading and displaying step content
function StepContent({ contentIds }: { contentIds: string[] }) {
  const [contents, setContents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const contentPromises = contentIds.map((id) =>
          apiClient.getContentById(id).catch(() => null)
        )
        const results = await Promise.all(contentPromises)
        const validContents = results.filter((c) => c !== null).map((c) => c!.content)
        setContents(validContents)
      } catch (error) {
        console.error("Error fetching step content:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchContents()
  }, [contentIds])

  if (loading) {
    return <p className="text-sm text-muted-foreground">{"Загрузка материалов..."}</p>
  }

  if (contents.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {contents.map((content) => (
        <Link key={content.id} href={`/content/${content.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="h-auto py-2 px-3 hover:bg-accent/10 hover:border-accent transition-colors bg-transparent"
          >
            {content.type === "video" ? (
              <PlayCircle className="h-4 w-4 mr-2 text-accent" />
            ) : (
              <FileText className="h-4 w-4 mr-2 text-accent" />
            )}
            <span className="text-sm">{content.title}</span>
            {content.type === "video" && content.duration && (
              <span className="text-xs text-muted-foreground ml-2">
                {content.duration}
              </span>
            )}
          </Button>
        </Link>
      ))}
    </div>
  )
}

