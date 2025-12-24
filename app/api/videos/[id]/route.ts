import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET /api/videos/:id - получить конкретное видео
export const GET = requireAuth(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Видео не найдено' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      video: {
        id: video.id,
        title: video.title,
        description: video.description,
        categoryId: video.category.slug,
        duration: video.duration,
        thumbnail: video.thumbnail,
        videoUrl: video.videoUrl,
        uploadDate: video.createdAt.toISOString(),
        views: video.views,
      },
    })
  } catch (error) {
    console.error('Get video error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
})

// PATCH /api/videos/:id - обновить видео (например, увеличить счетчик просмотров)
export const PATCH = requireAuth(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const body = await request.json()

    if (body.action === 'increment_views') {
      const video = await prisma.video.update({
        where: { id },
        data: {
          views: {
            increment: 1,
          },
        },
      })

      return NextResponse.json({ video })
    }

    return NextResponse.json(
      { error: 'Неизвестное действие' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Update video error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
})

