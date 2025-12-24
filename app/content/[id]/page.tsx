"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"
import { ArrowLeft, Eye, Calendar, FileText, BookOpen } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

export default function ContentPage() {
  const params = useParams()
  const contentId = params.id as string
  const [content, setContent] = useState<any>(null)
  const [category, setCategory] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { content: contentData } = await apiClient.getContentById(contentId)
        setContent(contentData)

        // Increment views
        await apiClient.incrementContentViews(contentId)

        // Fetch category
        const { categories } = await apiClient.getCategories()
        const foundCategory = categories.find((c: any) => c.id === contentData.categoryId)
        setCategory(foundCategory || null)
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [contentId])

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

  if (!content || !category) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-8 px-4">
            <p className="text-muted-foreground">{"Материал не найден"}</p>
          </main>
        </div>
      </AuthGuard>
    )
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />
      case "instruction":
        return <BookOpen className="h-4 w-4" />
      default:
        return null
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "article":
        return "Статья"
      case "instruction":
        return "Инструкция"
      default:
        return ""
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 px-4 max-w-4xl">
          <div className="mb-6">
            <Link href={`/category/${category.slug}`}>
              <Button variant="ghost" className="mb-4 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {"Назад к"} {category.name}
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="gap-1">
                  {getContentIcon(content.type)}
                  {getContentTypeLabel(content.type)}
                </Badge>
                <Badge variant="outline">{category.name}</Badge>
              </div>
              <CardTitle className="text-3xl text-balance">{content.title}</CardTitle>
              <CardDescription className="text-base text-pretty">{content.description}</CardDescription>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>
                    {content.views} {"просмотров"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(content.createdAt).toLocaleDateString("ru-RU")}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 text-foreground leading-relaxed">{children}</p>,
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-2 text-foreground">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground">{children}</ol>
                  ),
                  li: ({ children }) => <li className="text-foreground">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {content.content || ""}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}

