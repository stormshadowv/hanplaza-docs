import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Создаем тестовых пользователей
  const hashedPassword = await bcrypt.hash('password123', 10)

  const users = [
    {
      email: 'admin@hanplaza.ru',
      password: hashedPassword,
      name: 'Администратор',
      role: 'admin',
    },
    {
      email: 'manager@hanplaza.ru',
      password: hashedPassword,
      name: 'Менеджер',
      role: 'manager',
    },
    {
      email: 'buyer@hanplaza.ru',
      password: hashedPassword,
      name: 'Закупщик',
      role: 'buyer',
    },
    {
      email: 'warehouse@hanplaza.ru',
      password: hashedPassword,
      name: 'Складской работник',
      role: 'warehouse',
    },
    {
      email: 'designer@hanplaza.ru',
      password: hashedPassword,
      name: 'Дизайнер',
      role: 'designer',
    },
    {
      email: 'logistics@hanplaza.ru',
      password: hashedPassword,
      name: 'Логист',
      role: 'logistics',
    },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
  }

  console.log('✅ Пользователи созданы')

  // Создаем категории с привязкой к ролям
  const categories = [
    {
      slug: 'manager',
      name: 'Менеджер',
      description: 'Обучающие материалы для менеджеров по продажам',
      icon: 'briefcase',
      allowedRoles: 'manager,admin', // Только менеджеры и админы
    },
    {
      slug: 'buyer',
      name: 'Закупщик',
      description: 'Видео для специалистов по закупкам',
      icon: 'shopping-cart',
      allowedRoles: 'buyer,admin', // Только закупщики и админы
    },
    {
      slug: 'warehouse',
      name: 'Складской работник',
      description: 'Инструкции для складского персонала',
      icon: 'package',
      allowedRoles: 'warehouse,admin', // Только складские и админы
    },
    {
      slug: 'designer',
      name: 'Дизайнер',
      description: 'Материалы для дизайнеров интерьеров',
      icon: 'palette',
      allowedRoles: 'designer,admin', // Только дизайнеры и админы
    },
    {
      slug: 'logistics',
      name: 'Логистика',
      description: 'Обучение для специалистов по логистике',
      icon: 'truck',
      allowedRoles: 'logistics,admin', // Только логисты и админы
    },
    {
      slug: 'customer-service',
      name: 'Обслуживание клиентов',
      description: 'Тренинги по работе с клиентами',
      icon: 'headphones',
      allowedRoles: 'customer-service,admin', // Только обслуживание клиентов и админы
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('✅ Категории созданы')

  // Получаем созданные категории для связи с видео
  const managerCategory = await prisma.category.findUnique({
    where: { slug: 'manager' },
  })
  const buyerCategory = await prisma.category.findUnique({
    where: { slug: 'buyer' },
  })
  const warehouseCategory = await prisma.category.findUnique({
    where: { slug: 'warehouse' },
  })

  // Создаем видео
  const videos = [
    {
      title: 'Основы работы с клиентами',
      description: 'Введение в работу менеджера по продажам',
      categoryId: managerCategory!.id,
      duration: '15:30',
      thumbnail: '/professional-sales-training.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      views: 234,
    },
    {
      title: 'Техники продаж',
      description: 'Продвинутые методы убеждения клиентов',
      categoryId: managerCategory!.id,
      duration: '22:45',
      thumbnail: '/sales-techniques-presentation.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      views: 189,
    },
    {
      title: 'Работа с поставщиками',
      description: 'Как находить и оценивать поставщиков',
      categoryId: buyerCategory!.id,
      duration: '18:20',
      thumbnail: '/supplier-meeting-business.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      views: 156,
    },
    {
      title: 'Контроль качества товаров',
      description: 'Проверка качества при приемке',
      categoryId: buyerCategory!.id,
      duration: '12:10',
      thumbnail: '/quality-control-inspection.png',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      views: 142,
    },
    {
      title: 'Организация склада',
      description: 'Эффективное использование складских площадей',
      categoryId: warehouseCategory!.id,
      duration: '20:15',
      thumbnail: '/warehouse-organization.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      views: 198,
    },
    {
      title: 'Безопасность на складе',
      description: 'Правила техники безопасности',
      categoryId: warehouseCategory!.id,
      duration: '16:40',
      thumbnail: '/warehouse-safety-training.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      views: 176,
    },
  ]

  for (const video of videos) {
    await prisma.video.create({
      data: video,
    })
  }

  console.log('✅ Видео созданы')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

