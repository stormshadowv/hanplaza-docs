import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// DELETE /api/categories/[slug] - удалить категорию (только для админов)
export const DELETE = requireAuth(async (request: NextRequest, context: any) => {
  try {
    const { slug } = await context.params

    if (context.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Недостаточно прав' },
        { status: 403 }
      )
    }

    // Проверяем существование категории
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { videos: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      )
    }

    // Удаляем категорию (видео удалятся автоматически благодаря onDelete: Cascade)
    await prisma.category.delete({
      where: { slug },
    })

    return NextResponse.json({ 
      success: true,
      message: `Категория "${category.name}" и ${category._count.videos} видео успешно удалены`
    })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
})

// PATCH /api/categories/[slug] - обновить категорию (только для админов)
export const PATCH = requireAuth(async (request: NextRequest, context: any) => {
  try {
    const { slug } = await context.params
    const { name, description, icon, allowedRoles } = await request.json()

    if (context.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Недостаточно прав' },
        { status: 403 }
      )
    }

    const category = await prisma.category.update({
      where: { slug },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(icon && { icon }),
        ...(allowedRoles !== undefined && { allowedRoles }),
      },
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
})

