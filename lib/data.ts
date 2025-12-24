// Type definitions only - all data is now fetched from the database via API

export type VideoCategory = {
  id: string
  name: string
  description: string
  icon: string
  videoCount: number
  contentCount: number
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

export type Content = {
  id: string
  title: string
  description: string
  categoryId: string
  type: "video" | "article" | "instruction"
  duration?: string
  thumbnail?: string
  videoUrl?: string
  content?: string
  uploadDate: string
  views: number
}

export type BusinessProcess = {
  id: string
  name: string
  description: string
  departments: string[]
  updatedDate: string
  steps: ProcessStep[]
}

export type ProcessStep = {
  id: number
  title: string
  description: string
  responsible: string
  duration?: string
  relatedContentIds?: string[]
}
