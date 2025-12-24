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

  // Создаем контент (статьи и инструкции)
  const contents = [
    {
      id: 'article-1',
      title: 'Техники активных продаж',
      description: 'Полное руководство по современным техникам продаж',
      categoryId: managerCategory!.id,
      type: 'article',
      content: `# Техники активных продаж

## Введение

Активные продажи — это проактивный подход к работе с клиентами, при котором менеджер самостоятельно инициирует контакт и ведет клиента через весь процесс принятия решения.

## Основные принципы

### 1. Подготовка к продаже
- Изучите продукт досконально
- Определите целевую аудиторию
- Подготовьте презентационные материалы

### 2. Установление контакта
- Первое впечатление решает многое
- Используйте открытые вопросы
- Активно слушайте клиента

### 3. Выявление потребностей
Задавайте правильные вопросы:
- Что для вас важно при выборе?
- Какие задачи вы хотите решить?
- Какой у вас опыт работы с подобными продуктами?

## Техника СПИН-продаж

**С**итуационные вопросы - узнайте текущую ситуацию клиента
**П**роблемные вопросы - выявите проблемы и сложности
**И**звлекающие вопросы - усильте осознание проблемы
**Н**аправляющие вопросы - покажите ценность решения`,
      views: 342,
    },
    {
      id: 'instruction-1',
      title: 'Работа в CRM системе',
      description: 'Пошаговая инструкция по работе в корпоративной CRM',
      categoryId: managerCategory!.id,
      type: 'instruction',
      content: `# Работа в CRM системе Han Plaza

## Вход в систему

1. Откройте браузер (рекомендуется Chrome или Firefox)
2. Перейдите по адресу: crm.hanplaza.com
3. Введите ваш логин и пароль
4. Нажмите кнопку "Войти"

## Создание новой сделки

### Шаг 1: Добавление клиента
1. Нажмите кнопку "+ Новый клиент" в верхнем меню
2. Заполните обязательные поля:
   - Название компании
   - Контактное лицо
   - Телефон
   - Email
3. Сохраните данные

### Шаг 2: Создание сделки
1. Перейдите в карточку клиента
2. Нажмите "Создать сделку"
3. Укажите:
   - Название сделки
   - Сумму
   - Ожидаемую дату закрытия
   - Ответственного менеджера

### Шаг 3: Ведение сделки
- Обновляйте статус на каждом этапе
- Добавляйте комментарии и файлы
- Планируйте задачи и встречи
- Отслеживайте историю взаимодействий

## Важно!
> Обновляйте CRM ежедневно для корректного отображения воронки продаж`,
      views: 489,
    },
  ]

  for (const content of contents) {
    await prisma.content.upsert({
      where: { id: content.id },
      update: {},
      create: content,
    })
  }

  console.log('✅ Контент создан')

  // Создаем бизнес-процессы
  const salesProcess = await prisma.businessProcess.upsert({
    where: { id: 'sales-process' },
    update: {},
    create: {
      id: 'sales-process',
      name: 'Процесс продажи',
      description: 'Полный цикл работы с клиентом от первого контакта до закрытия сделки',
      departments: JSON.stringify(['Отдел продаж', 'Логистика', 'Бухгалтерия']),
    },
  })

  const procurementProcess = await prisma.businessProcess.upsert({
    where: { id: 'procurement-process' },
    update: {},
    create: {
      id: 'procurement-process',
      name: 'Процесс закупки товара',
      description: 'Этапы работы с поставщиками от поиска до получения товара на склад',
      departments: JSON.stringify(['Отдел закупок', 'Склад', 'Финансовый отдел']),
    },
  })

  const complaintProcess = await prisma.businessProcess.upsert({
    where: { id: 'customer-complaint' },
    update: {},
    create: {
      id: 'customer-complaint',
      name: 'Обработка рекламации',
      description: 'Процедура работы с жалобами и претензиями клиентов',
      departments: JSON.stringify(['Клиентский сервис', 'Отдел продаж', 'Логистика']),
    },
  })

  const onboardingProcess = await prisma.businessProcess.upsert({
    where: { id: 'onboarding' },
    update: {},
    create: {
      id: 'onboarding',
      name: 'Адаптация нового сотрудника',
      description: 'Процесс введения в должность и обучения новых сотрудников',
      departments: JSON.stringify(['HR', 'Все отделы']),
    },
  })

  console.log('✅ Бизнес-процессы созданы')

  // Создаем шаги для процесса продажи
  const salesSteps = [
    {
      stepNumber: 1,
      title: 'Первичный контакт с клиентом',
      description: 'Установление связи с потенциальным клиентом, выявление потребностей и интересов. Важно создать положительное первое впечатление и определить, насколько клиент соответствует целевой аудитории.',
      responsible: 'Менеджер по продажам',
      duration: '30 минут',
      relatedContentIds: JSON.stringify(['article-1', 'instruction-1']),
      processId: salesProcess.id,
    },
    {
      stepNumber: 2,
      title: 'Подготовка коммерческого предложения',
      description: 'Анализ потребностей клиента и составление персонализированного коммерческого предложения с учетом специфики его бизнеса. Расчет стоимости, сроков поставки и условий сотрудничества.',
      responsible: 'Менеджер по продажам',
      duration: '2-4 часа',
      relatedContentIds: null,
      processId: salesProcess.id,
    },
    {
      stepNumber: 3,
      title: 'Презентация предложения',
      description: 'Проведение встречи или онлайн-презентации для демонстрации преимуществ продукта. Работа с возражениями, ответы на вопросы клиента, обсуждение деталей сотрудничества.',
      responsible: 'Менеджер по продажам',
      duration: '1-2 часа',
      relatedContentIds: JSON.stringify(['article-1']),
      processId: salesProcess.id,
    },
    {
      stepNumber: 4,
      title: 'Согласование условий и заключение договора',
      description: 'Финальное согласование всех условий сделки: цены, объемов, сроков поставки, условий оплаты. Подготовка и подписание договора поставки. При необходимости - внесение корректировок.',
      responsible: 'Менеджер по продажам, Юридический отдел',
      duration: '1-3 дня',
      relatedContentIds: null,
      processId: salesProcess.id,
    },
    {
      stepNumber: 5,
      title: 'Оформление заказа и оплата',
      description: 'Создание заказа в системе, выставление счета клиенту. Контроль поступления оплаты, согласование деталей доставки и оформление необходимых документов для отгрузки.',
      responsible: 'Менеджер по продажам, Бухгалтерия',
      duration: '1-5 дней',
      relatedContentIds: JSON.stringify(['instruction-1']),
      processId: salesProcess.id,
    },
    {
      stepNumber: 6,
      title: 'Отгрузка и доставка товара',
      description: 'Координация с складом и логистикой для своевременной отгрузки товара. Информирование клиента о статусе заказа, предоставление трек-номера для отслеживания, контроль доставки до конечной точки.',
      responsible: 'Отдел логистики, Склад',
      duration: '3-14 дней',
      relatedContentIds: null,
      processId: salesProcess.id,
    },
  ]

  for (const step of salesSteps) {
    await prisma.processStep.create({
      data: step,
    })
  }

  console.log('✅ Шаги процессов созданы')
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

