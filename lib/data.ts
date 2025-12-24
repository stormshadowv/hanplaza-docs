export type VideoCategory = {
  id: string
  name: string
  description: string
  icon: string
  videoCount: number
}

export type Video = {
  id: string
  title: string
  description: string
  categoryId: string
  duration: string
  thumbnail: string
  videoUrl: string
  uploadDate: string
  views: number
}

// Mock data for video categories
export const categories: VideoCategory[] = [
  {
    id: "manager",
    name: "Менеджер",
    description: "Обучающие материалы для менеджеров по продажам",
    icon: "briefcase",
    videoCount: 12,
  },
  {
    id: "buyer",
    name: "Закупщик",
    description: "Видео для специалистов по закупкам",
    icon: "shopping-cart",
    videoCount: 8,
  },
  {
    id: "warehouse",
    name: "Складской работник",
    description: "Инструкции для складского персонала",
    icon: "package",
    videoCount: 15,
  },
  {
    id: "designer",
    name: "Дизайнер",
    description: "Материалы для дизайнеров интерьеров",
    icon: "palette",
    videoCount: 10,
  },
  {
    id: "logistics",
    name: "Логистика",
    description: "Обучение для специалистов по логистике",
    icon: "truck",
    videoCount: 6,
  },
  {
    id: "customer-service",
    name: "Обслуживание клиентов",
    description: "Тренинги по работе с клиентами",
    icon: "headphones",
    videoCount: 9,
  },
]

// Mock data for videos
export const videos: Video[] = [
  {
    id: "1",
    title: "Основы работы с клиентами",
    description: "Введение в работу менеджера по продажам",
    categoryId: "manager",
    duration: "15:30",
    thumbnail: "/professional-sales-training.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadDate: "2024-01-15",
    views: 234,
  },
  {
    id: "2",
    title: "Техники продаж",
    description: "Продвинутые методы убеждения клиентов",
    categoryId: "manager",
    duration: "22:45",
    thumbnail: "/sales-techniques-presentation.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadDate: "2024-01-20",
    views: 189,
  },
  {
    id: "3",
    title: "Работа с поставщиками",
    description: "Как находить и оценивать поставщиков",
    categoryId: "buyer",
    duration: "18:20",
    thumbnail: "/supplier-meeting-business.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadDate: "2024-01-18",
    views: 156,
  },
  {
    id: "4",
    title: "Контроль качества товаров",
    description: "Проверка качества при приемке",
    categoryId: "buyer",
    duration: "12:10",
    thumbnail: "/quality-control-inspection.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadDate: "2024-01-22",
    views: 142,
  },
  {
    id: "5",
    title: "Организация склада",
    description: "Эффективное использование складских площадей",
    categoryId: "warehouse",
    duration: "20:15",
    thumbnail: "/warehouse-organization.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadDate: "2024-01-25",
    views: 198,
  },
  {
    id: "6",
    title: "Безопасность на складе",
    description: "Правила техники безопасности",
    categoryId: "warehouse",
    duration: "16:40",
    thumbnail: "/warehouse-safety-training.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadDate: "2024-01-28",
    views: 176,
  },
]

export function getVideosByCategory(categoryId: string): Video[] {
  return videos.filter((video) => video.categoryId === categoryId)
}

export function getCategoryById(categoryId: string): VideoCategory | undefined {
  return categories.find((cat) => cat.id === categoryId)
}
