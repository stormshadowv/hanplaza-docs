"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClient, Category } from "@/lib/api-client"
import { AlertCircle, CheckCircle2, Plus, Video as VideoIcon, Folder, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  // Форма для видео
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    categorySlug: "",
    duration: "",
    thumbnail: "",
    videoUrl: "",
  })

  // Форма для категории
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    icon: "folder",
    slug: "",
    allowedRoles: "admin", // По умолчанию только админы
  })

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = localStorage.getItem("hanplaza_user")
        if (user) {
          const userData = JSON.parse(user)
          if (userData.role !== "admin") {
            router.push("/dashboard")
            return
          }
          setIsAdmin(true)
        }
      } catch (error) {
        console.error("Error checking admin:", error)
        router.push("/dashboard")
      }
    }

    const loadCategories = async () => {
      try {
        const { categories: data } = await apiClient.getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }

    checkAdmin()
    loadCategories()
  }, [router])

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hanplaza_token")}`,
        },
        body: JSON.stringify(videoForm),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Ошибка создания видео")
      }

      setSuccess("Видео успешно добавлено!")
      setVideoForm({
        title: "",
        description: "",
        categorySlug: "",
        duration: "",
        thumbnail: "",
        videoUrl: "",
      })

      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("hanplaza_token")}`,
        },
        body: JSON.stringify(categoryForm),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Ошибка создания категории")
      }

      setSuccess("Категория успешно добавлена!")
      setCategoryForm({
        name: "",
        description: "",
        icon: "folder",
        slug: "",
        allowedRoles: "admin",
      })

      // Обновляем список категорий
      const { categories: data } = await apiClient.getCategories()
      setCategories(data)

      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleDeleteCategory = async (slug: string, name: string) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await apiClient.deleteCategory(slug)
      setSuccess(response.message || `Категория "${name}" успешно удалена`)

      // Обновляем список категорий
      const { categories: data } = await apiClient.getCategories()
      setCategories(data)

      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Ошибка при удалении категории")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Панель администратора</h1>
            <p className="text-muted-foreground">Управление категориями и видео</p>
          </div>

          {success && (
            <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="video">
                <VideoIcon className="h-4 w-4 mr-2" />
                Добавить видео
              </TabsTrigger>
              <TabsTrigger value="category">
                <Folder className="h-4 w-4 mr-2" />
                Добавить категорию
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video">
              <Card>
                <CardHeader>
                  <CardTitle>Новое видео</CardTitle>
                  <CardDescription>Добавьте обучающее видео в систему</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVideoSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Название видео *</Label>
                      <Input
                        id="title"
                        value={videoForm.title}
                        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                        placeholder="Основы работы с клиентами"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={videoForm.description}
                        onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                        placeholder="Подробное описание видео..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Категория *</Label>
                        <Select
                          value={videoForm.categorySlug}
                          onValueChange={(value) => setVideoForm({ ...videoForm, categorySlug: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.slug} value={cat.slug}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Длительность</Label>
                        <Input
                          id="duration"
                          value={videoForm.duration}
                          onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                          placeholder="15:30"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">URL видео (YouTube embed) *</Label>
                      <Input
                        id="videoUrl"
                        value={videoForm.videoUrl}
                        onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/embed/xxxxx"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Используйте формат: https://www.youtube.com/embed/VIDEO_ID
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">URL изображения (обложка)</Label>
                      <Input
                        id="thumbnail"
                        value={videoForm.thumbnail}
                        onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                        placeholder="/image.jpg или https://..."
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      {loading ? "Добавление..." : "Добавить видео"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="category">
              <Card>
                <CardHeader>
                  <CardTitle>Новая категория</CardTitle>
                  <CardDescription>Создайте новую категорию обучающих материалов</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCategorySubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cat-name">Название категории *</Label>
                      <Input
                        id="cat-name"
                        value={categoryForm.name}
                        onChange={(e) => {
                          setCategoryForm({
                            ...categoryForm,
                            name: e.target.value,
                            slug: generateSlug(e.target.value),
                          })
                        }}
                        placeholder="Менеджер"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cat-slug">Slug (URL) *</Label>
                      <Input
                        id="cat-slug"
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                        placeholder="manager"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Генерируется автоматически, но можно изменить
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cat-description">Описание</Label>
                      <Textarea
                        id="cat-description"
                        value={categoryForm.description}
                        onChange={(e) =>
                          setCategoryForm({ ...categoryForm, description: e.target.value })
                        }
                        placeholder="Обучающие материалы для..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cat-icon">Иконка</Label>
                      <Select
                        value={categoryForm.icon}
                        onValueChange={(value) => setCategoryForm({ ...categoryForm, icon: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="briefcase">Briefcase (Портфель)</SelectItem>
                          <SelectItem value="shopping-cart">Shopping Cart (Корзина)</SelectItem>
                          <SelectItem value="package">Package (Пакет)</SelectItem>
                          <SelectItem value="palette">Palette (Палитра)</SelectItem>
                          <SelectItem value="truck">Truck (Грузовик)</SelectItem>
                          <SelectItem value="headphones">Headphones (Наушники)</SelectItem>
                          <SelectItem value="folder">Folder (Папка)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cat-roles">Доступные роли *</Label>
                      <Select
                        value={categoryForm.allowedRoles}
                        onValueChange={(value) =>
                          setCategoryForm({ ...categoryForm, allowedRoles: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Только админы</SelectItem>
                          <SelectItem value="manager,admin">Менеджеры + Админы</SelectItem>
                          <SelectItem value="buyer,admin">Закупщики + Админы</SelectItem>
                          <SelectItem value="warehouse,admin">Складские + Админы</SelectItem>
                          <SelectItem value="designer,admin">Дизайнеры + Админы</SelectItem>
                          <SelectItem value="logistics,admin">Логистика + Админы</SelectItem>
                          <SelectItem value="customer-service,admin">
                            Обслуживание + Админы
                          </SelectItem>
                          <SelectItem value="all">Все пользователи</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Какие роли могут видеть эту категорию
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      <Plus className="h-4 w-4 mr-2" />
                      {loading ? "Добавление..." : "Добавить категорию"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Существующие категории</CardTitle>
                <CardDescription>Текущие категории в системе</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div
                      key={cat.slug}
                      className="p-4 border rounded-lg hover:border-primary/50 transition-colors relative group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">{cat.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Slug: {cat.slug} • Видео: {cat.videoCount}
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить категорию <strong>&quot;{cat.name}&quot;</strong>?
                                <br />
                                <br />
                                {cat.videoCount > 0 && (
                                  <span className="text-destructive font-semibold">
                                    ⚠️ Внимание: Будет удалено {cat.videoCount} видео из этой категории!
                                  </span>
                                )}
                                <br />
                                Это действие нельзя отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCategory(cat.slug, cat.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

