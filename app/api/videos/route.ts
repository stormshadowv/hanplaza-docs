import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET /api/videos - получить все видео или видео по категории
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')

    let videos

    if (categorySlug) {
      // Получаем категорию по slug
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Категория не найдена' },
          { status: 404 }
        )
      }

      videos = await prisma.video.findMany({
        where: {
          categoryId: category.id,
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      videos = await prisma.video.findMany({
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    const formattedVideos = videos.map((video: any) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      categoryId: video.category.slug,
      duration: video.duration,
      thumbnail: video.thumbnail,
      videoUrl: video.videoUrl,
      uploadDate: video.createdAt.toISOString(),
      views: video.views,
    }))

    return NextResponse.json({ videos: formattedVideos })
  } catch (error) {
    console.error('Get videos error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
})

// POST /api/videos - создать новое видео (только для админов)
export const POST = requireAuth(async (request: NextRequest, context: any) => {
  try {
    const { title, description, categorySlug, duration, thumbnail, videoUrl } = await request.json()

    if (context.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Недостаточно прав' },
        { status: 403 }
      )
    }

    if (!title || !categorySlug || !videoUrl) {
      return NextResponse.json(
        { error: 'Название, категория и URL видео обязательны' },
        { status: 400 }
      )
    }

    // Получаем категорию по slug
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      )
    }

    const video = await prisma.video.create({
      data: {
        title,
        description: description || '',
        categoryId: category.id,
        duration: duration || '0:00',
        thumbnail: thumbnail || '/placeholder.jpg',
        videoUrl,
      },
    })

    return NextResponse.json({ video }, { status: 201 })
  } catch (error) {
    console.error('Create video error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
})

