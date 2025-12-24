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
import { AlertCircle, CheckCircle2, Plus, Video as VideoIcon, Folder, Trash2, GitBranch, Edit2, X } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ProcessStep {
  stepNumber?: number
  title: string
  description: string
  responsible: string
  duration: string
  relatedContentIds: string[]
}

interface BusinessProcess {
  id: string
  name: string
  description: string
  departments: string[]
  allowedRoles: string
  steps: ProcessStep[]
}

interface Content {
  id: string
  title: string
  description: string
  categoryId: string
  type: string
  duration?: string
  thumbnail?: string
  videoUrl?: string
  views: number
}

export default function AdminPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [processes, setProcesses] = useState<BusinessProcess[]>([])
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [contentDialogOpen, setContentDialogOpen] = useState(false)
  const [processDialogOpen, setProcessDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [editingProcess, setEditingProcess] = useState<BusinessProcess | null>(null)

  // Форма для категории
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    icon: "folder",
    slug: "",
    allowedRoles: "admin",
  })

  // Форма для контента/видео
  const [contentForm, setContentForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    type: "video",
    duration: "",
    thumbnail: "",
    videoUrl: "",
  })

  // Форма для бизнес-процесса
  const [processForm, setProcessForm] = useState({
    name: "",
    description: "",
    departments: "",
    allowedRoles: "admin",
    steps: [] as ProcessStep[],
  })

  // Форма для шага процесса
  const [stepForm, setStepForm] = useState<ProcessStep>({
    title: "",
    description: "",
    responsible: "",
    duration: "",
    relatedContentIds: [],
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

    checkAdmin()
    loadAllData()
  }, [router])

  const loadAllData = async () => {
    try {
      const [categoriesData, processesData, contentData] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getProcesses(),
        apiClient.getContent(),
      ])
      setCategories(categoriesData.categories)
      setProcesses(processesData.processes)
      setContent(contentData.content)
    } catch (error) {
      console.error("Failed to load data:", error)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const showSuccess = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(""), 3000)
  }

  const showError = (message: string) => {
    setError(message)
    setTimeout(() => setError(""), 5000)
  }

  // ============= КАТЕГОРИИ =============

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("hanplaza_token")
      const url = editingCategory ? `/api/categories/${editingCategory.slug}` : "/api/categories"
      const method = editingCategory ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryForm),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Ошибка сохранения категории")
      }

      showSuccess(editingCategory ? "Категория обновлена!" : "Категория создана!")
      setCategoryDialogOpen(false)
      resetCategoryForm()
      loadAllData()
    } catch (err: any) {
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (slug: string, name: string) => {
    setLoading(true)
    try {
      const response = await apiClient.deleteCategory(slug)
      showSuccess(response.message || `Категория "${name}" удалена`)
      loadAllData()
    } catch (err: any) {
      showError(err.message || "Ошибка при удалении категории")
    } finally {
      setLoading(false)
    }
  }

  const openEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description,
      icon: category.icon,
      slug: category.slug,
      allowedRoles: "admin", // Получаем из API, если нужно
    })
    setCategoryDialogOpen(true)
  }

  const resetCategoryForm = () => {
    setEditingCategory(null)
    setCategoryForm({
      name: "",
      description: "",
      icon: "folder",
      slug: "",
      allowedRoles: "admin",
    })
  }

  // ============= КОНТЕНТ =============

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingContent) {
        await apiClient.updateContent(editingContent.id, contentForm)
        showSuccess("Контент обновлен!")
      } else {
        await apiClient.createContent(contentForm)
        showSuccess("Контент создан!")
      }

      setContentDialogOpen(false)
      resetContentForm()
      loadAllData()
    } catch (err: any) {
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContent = async (id: string, title: string) => {
    setLoading(true)
    try {
      await apiClient.deleteContent(id)
      showSuccess(`"${title}" удален`)
      loadAllData()
    } catch (err: any) {
      showError(err.message || "Ошибка при удалении контента")
    } finally {
      setLoading(false)
    }
  }

  const openEditContent = (item: Content) => {
    setEditingContent(item)
    setContentForm({
      title: item.title,
      description: item.description,
      categoryId: item.categoryId,
      type: item.type,
      duration: item.duration || "",
      thumbnail: item.thumbnail || "",
      videoUrl: item.videoUrl || "",
    })
    setContentDialogOpen(true)
  }

  const resetContentForm = () => {
    setEditingContent(null)
    setContentForm({
      title: "",
      description: "",
      categoryId: "",
      type: "video",
      duration: "",
      thumbnail: "",
      videoUrl: "",
    })
  }

  // ============= БИЗНЕС-ПРОЦЕССЫ =============

  const handleProcessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const departmentsArray = processForm.departments
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d)

      const data = {
        name: processForm.name,
        description: processForm.description,
        departments: departmentsArray,
        allowedRoles: processForm.allowedRoles,
        steps: processForm.steps,
      }

      if (editingProcess) {
        await apiClient.updateProcess(editingProcess.id, data)
        showSuccess("Бизнес-процесс обновлен!")
      } else {
        await apiClient.createProcess(data)
        showSuccess("Бизнес-процесс создан!")
      }

      setProcessDialogOpen(false)
      resetProcessForm()
      loadAllData()
    } catch (err: any) {
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProcess = async (id: string, name: string) => {
    setLoading(true)
    try {
      await apiClient.deleteProcess(id)
      showSuccess(`"${name}" удален`)
      loadAllData()
    } catch (err: any) {
      showError(err.message || "Ошибка при удалении процесса")
    } finally {
      setLoading(false)
    }
  }

  const openEditProcess = (process: BusinessProcess) => {
    setEditingProcess(process)
    setProcessForm({
      name: process.name,
      description: process.description,
      departments: process.departments.join(", "),
      allowedRoles: process.allowedRoles || "admin",
      steps: process.steps || [],
    })
    setProcessDialogOpen(true)
  }

  const resetProcessForm = () => {
    setEditingProcess(null)
    setProcessForm({
      name: "",
      description: "",
      departments: "",
      allowedRoles: "admin",
      steps: [],
    })
  }

  const addStep = () => {
    if (!stepForm.title || !stepForm.description || !stepForm.responsible) {
      showError("Заполните все обязательные поля шага")
      return
    }

    setProcessForm({
      ...processForm,
      steps: [...processForm.steps, { ...stepForm }],
    })

    setStepForm({
      title: "",
      description: "",
      responsible: "",
      duration: "",
      relatedContentIds: [],
    })
  }

  const removeStep = (index: number) => {
    setProcessForm({
      ...processForm,
      steps: processForm.steps.filter((_, i) => i !== index),
    })
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
            <p className="text-muted-foreground">Управление контентом системы обучения</p>
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

          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl">
              <TabsTrigger value="categories">
                <Folder className="h-4 w-4 mr-2" />
                Категории ({categories.length})
              </TabsTrigger>
              <TabsTrigger value="content">
                <VideoIcon className="h-4 w-4 mr-2" />
                Контент ({content.length})
              </TabsTrigger>
              <TabsTrigger value="processes">
                <GitBranch className="h-4 w-4 mr-2" />
                Процессы ({processes.length})
              </TabsTrigger>
            </TabsList>

            {/* ========== КАТЕГОРИИ ========== */}
            <TabsContent value="categories" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Категории</h2>
                <Dialog open={categoryDialogOpen} onOpenChange={(open) => {
                  setCategoryDialogOpen(open)
                  if (!open) resetCategoryForm()
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить категорию
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? "Редактировать категорию" : "Новая категория"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingCategory ? "Измените данные категории" : "Создайте новую категорию обучающих материалов"}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cat-name">Название *</Label>
                        <Input
                          id="cat-name"
                          value={categoryForm.name}
                          onChange={(e) => {
                            setCategoryForm({
                              ...categoryForm,
                              name: e.target.value,
                              slug: editingCategory ? categoryForm.slug : generateSlug(e.target.value),
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
                          disabled={!!editingCategory}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cat-description">Описание</Label>
                        <Textarea
                          id="cat-description"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
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
                          onValueChange={(value) => setCategoryForm({ ...categoryForm, allowedRoles: value })}
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
                            <SelectItem value="customer-service,admin">Обслуживание + Админы</SelectItem>
                            <SelectItem value="all">Все пользователи</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                          Отмена
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Сохранение..." : "Сохранить"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <Card key={cat.slug}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{cat.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            Slug: {cat.slug}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditCategory(cat)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Вы уверены, что хотите удалить категорию <strong>"{cat.name}"</strong>?
                                  {cat.videoCount > 0 && (
                                    <>
                                      <br /><br />
                                      <span className="text-destructive font-semibold">
                                        ⚠️ Будет удалено {cat.videoCount} материалов!
                                      </span>
                                    </>
                                  )}
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
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{cat.description}</p>
                      <Badge variant="secondary">{cat.videoCount} материалов</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* ========== КОНТЕНТ ========== */}
            <TabsContent value="content" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Обучающий контент</h2>
                <Dialog open={contentDialogOpen} onOpenChange={(open) => {
                  setContentDialogOpen(open)
                  if (!open) resetContentForm()
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить контент
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh]">
                    <ScrollArea className="max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingContent ? "Редактировать контент" : "Новый контент"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingContent ? "Измените данные контента" : "Добавьте новый обучающий материал"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleContentSubmit} className="space-y-4 pr-4">
                        <div className="space-y-2">
                          <Label htmlFor="content-title">Название *</Label>
                          <Input
                            id="content-title"
                            value={contentForm.title}
                            onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                            placeholder="Основы работы с клиентами"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="content-desc">Описание</Label>
                          <Textarea
                            id="content-desc"
                            value={contentForm.description}
                            onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                            placeholder="Подробное описание..."
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="content-category">Категория *</Label>
                            <Select
                              value={contentForm.categoryId}
                              onValueChange={(value) => setContentForm({ ...contentForm, categoryId: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите категорию" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="content-type">Тип *</Label>
                            <Select
                              value={contentForm.type}
                              onValueChange={(value) => setContentForm({ ...contentForm, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="video">Видео</SelectItem>
                                <SelectItem value="instruction">Инструкция</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {contentForm.type === "video" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="content-url">URL видео (YouTube embed) *</Label>
                              <Input
                                id="content-url"
                                value={contentForm.videoUrl}
                                onChange={(e) => setContentForm({ ...contentForm, videoUrl: e.target.value })}
                                placeholder="https://www.youtube.com/embed/xxxxx"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="content-duration">Длительность</Label>
                                <Input
                                  id="content-duration"
                                  value={contentForm.duration}
                                  onChange={(e) => setContentForm({ ...contentForm, duration: e.target.value })}
                                  placeholder="15:30"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="content-thumb">Обложка (URL)</Label>
                                <Input
                                  id="content-thumb"
                                  value={contentForm.thumbnail}
                                  onChange={(e) => setContentForm({ ...contentForm, thumbnail: e.target.value })}
                                  placeholder="/image.jpg"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setContentDialogOpen(false)}>
                            Отмена
                          </Button>
                          <Button type="submit" disabled={loading}>
                            {loading ? "Сохранение..." : "Сохранить"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.map((item) => {
                  const category = categories.find((c) => c.id === item.categoryId)
                  return (
                    <Card key={item.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-base">{item.title}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {category?.name || "Без категории"}
                            </CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditContent(item)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Удалить контент?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Вы уверены, что хотите удалить <strong>"{item.title}"</strong>?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteContent(item.id, item.title)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {item.description}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline">{item.type}</Badge>
                          {item.duration && <Badge variant="secondary">{item.duration}</Badge>}
                          <Badge variant="secondary">{item.views} просмотров</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* ========== БИЗНЕС-ПРОЦЕССЫ ========== */}
            <TabsContent value="processes" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Бизнес-процессы</h2>
                <Dialog open={processDialogOpen} onOpenChange={(open) => {
                  setProcessDialogOpen(open)
                  if (!open) resetProcessForm()
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить процесс
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh]">
                    <ScrollArea className="max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProcess ? "Редактировать процесс" : "Новый бизнес-процесс"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingProcess ? "Измените данные процесса" : "Создайте новый бизнес-процесс с этапами"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleProcessSubmit} className="space-y-6 pr-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="proc-name">Название *</Label>
                            <Input
                              id="proc-name"
                              value={processForm.name}
                              onChange={(e) => setProcessForm({ ...processForm, name: e.target.value })}
                              placeholder="Процесс обработки заказа"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="proc-desc">Описание *</Label>
                            <Textarea
                              id="proc-desc"
                              value={processForm.description}
                              onChange={(e) => setProcessForm({ ...processForm, description: e.target.value })}
                              placeholder="Подробное описание бизнес-процесса..."
                              rows={3}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="proc-deps">Отделы (через запятую) *</Label>
                            <Input
                              id="proc-deps"
                              value={processForm.departments}
                              onChange={(e) => setProcessForm({ ...processForm, departments: e.target.value })}
                              placeholder="Отдел продаж, Логистика, Склад"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="proc-roles">Доступные роли *</Label>
                            <Select
                              value={processForm.allowedRoles}
                              onValueChange={(value) => setProcessForm({ ...processForm, allowedRoles: value })}
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
                                <SelectItem value="customer-service,admin">Обслуживание + Админы</SelectItem>
                                <SelectItem value="all">Все пользователи</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Этапы процесса */}
                        <div className="space-y-4 border-t pt-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Этапы процесса</h3>
                            <Badge>{processForm.steps.length} этапов</Badge>
                          </div>

                          {/* Список добавленных этапов */}
                          {processForm.steps.length > 0 && (
                            <div className="space-y-2">
                              {processForm.steps.map((step, index) => (
                                <div key={index} className="p-3 border rounded-lg bg-muted/50">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline">Этап {index + 1}</Badge>
                                        <span className="font-medium">{step.title}</span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">{step.description}</p>
                                      <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                                        <span>Ответственный: {step.responsible}</span>
                                        {step.duration && <span>• {step.duration}</span>}
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => removeStep(index)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Форма добавления нового этапа */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Добавить новый этап</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label htmlFor="step-title">Название этапа *</Label>
                                  <Input
                                    id="step-title"
                                    value={stepForm.title}
                                    onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                                    placeholder="Прием заказа"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="step-resp">Ответственный *</Label>
                                  <Input
                                    id="step-resp"
                                    value={stepForm.responsible}
                                    onChange={(e) => setStepForm({ ...stepForm, responsible: e.target.value })}
                                    placeholder="Менеджер по продажам"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="step-desc">Описание *</Label>
                                <Textarea
                                  id="step-desc"
                                  value={stepForm.description}
                                  onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
                                  placeholder="Описание этапа..."
                                  rows={2}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="step-duration">Длительность</Label>
                                <Input
                                  id="step-duration"
                                  value={stepForm.duration}
                                  onChange={(e) => setStepForm({ ...stepForm, duration: e.target.value })}
                                  placeholder="1 день"
                                />
                              </div>

                              <Button type="button" onClick={addStep} variant="outline" className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Добавить этап
                              </Button>
                            </CardContent>
                          </Card>
                        </div>

                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setProcessDialogOpen(false)}>
                            Отмена
                          </Button>
                          <Button type="submit" disabled={loading || processForm.steps.length === 0}>
                            {loading ? "Сохранение..." : "Сохранить процесс"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {processes.map((process) => (
                  <Card key={process.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{process.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {process.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditProcess(process)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Удалить процесс?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Вы уверены, что хотите удалить бизнес-процесс <strong>"{process.name}"</strong>?
                                  <br /><br />
                                  <span className="text-destructive font-semibold">
                                    ⚠️ Будут удалены все {process.steps?.length || 0} этапов процесса!
                                  </span>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProcess(process.id, process.name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Удалить
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-1">Отделы:</p>
                          <div className="flex flex-wrap gap-1">
                            {process.departments.map((dept, idx) => (
                              <Badge key={idx} variant="secondary">{dept}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Этапы:</p>
                          <Badge>{process.steps?.length || 0} этапов</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  )
}
