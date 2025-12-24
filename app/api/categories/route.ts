import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET /api/categories - получить категории с учетом роли пользователя
export const GET = requireAuth(async (request: NextRequest, context: any) => {
  try {
    const userRole = context.user.role
    
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { videos: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Фильтруем категории по роли пользователя
    const filteredCategories = categories.filter((category: any) => {
      // Админы видят все
      if (userRole === 'admin') {
        return true
      }
      
      // Если allowedRoles пустое, не задано или "all" - доступно всем
      if (!category.allowedRoles || category.allowedRoles === '' || category.allowedRoles === 'all') {
        return true
      }
      
      // Проверяем, есть ли роль пользователя в списке разрешенных
      const allowedRolesArray = category.allowedRoles.split(',').map((r: string) => r.trim())
      return allowedRolesArray.includes(userRole)
    })

    const formattedCategories = filteredCategories.map((category: any) => ({
      id: category.slug,
      slug: category.slug,
      name: category.name,
      description: category.description,
      icon: category.icon,
      videoCount: category._count.videos,
    }))

    return NextResponse.json({ categories: formattedCategories })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
})

// POST /api/categories - создать новую категорию (только для админов)
export const POST = requireAuth(async (request: NextRequest, context: any) => {
  try {
    const { name, description, icon, slug } = await request.json()

    if (context.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Недостаточно прав' },
        { status: 403 }
      )
    }

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Название и slug обязательны' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || '',
        icon: icon || 'folder',
        slug,
      },
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
})

