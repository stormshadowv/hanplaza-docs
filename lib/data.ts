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

// Mock data for video categories
export const categories: VideoCategory[] = [
  {
    id: "manager",
    name: "Менеджер",
    description: "Обучающие материалы для менеджеров по продажам",
    icon: "briefcase",
    videoCount: 12,
    contentCount: 18,
  },
  {
    id: "buyer",
    name: "Закупщик",
    description: "Видео для специалистов по закупкам",
    icon: "shopping-cart",
    videoCount: 8,
    contentCount: 14,
  },
  {
    id: "warehouse",
    name: "Складской работник",
    description: "Инструкции для складского персонала",
    icon: "package",
    videoCount: 15,
    contentCount: 22,
  },
  {
    id: "designer",
    name: "Дизайнер",
    description: "Материалы для дизайнеров интерьеров",
    icon: "palette",
    videoCount: 10,
    contentCount: 16,
  },
  {
    id: "logistics",
    name: "Логистика",
    description: "Обучение для специалистов по логистике",
    icon: "truck",
    videoCount: 6,
    contentCount: 11,
  },
  {
    id: "customer-service",
    name: "Обслуживание клиентов",
    description: "Тренинги по работе с клиентами",
    icon: "headphones",
    videoCount: 9,
    contentCount: 13,
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

// Mock data for content (articles, instructions, videos)
export const content: Content[] = [
  {
    id: "article-1",
    title: "Техники активных продаж",
    description: "Полное руководство по современным техникам продаж",
    categoryId: "manager",
    type: "article",
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
    uploadDate: "2024-01-15",
    views: 342,
  },
  {
    id: "instruction-1",
    title: "Работа в CRM системе",
    description: "Пошаговая инструкция по работе в корпоративной CRM",
    categoryId: "manager",
    type: "instruction",
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
    uploadDate: "2024-01-20",
    views: 489,
  },
]

// Mock data for business processes
export const businessProcesses: BusinessProcess[] = [
  {
    id: "sales-process",
    name: "Процесс продажи",
    description: "Полный цикл работы с клиентом от первого контакта до закрытия сделки",
    departments: ["Отдел продаж", "Логистика", "Бухгалтерия"],
    updatedDate: "2024-01-15",
    steps: [
      {
        id: 1,
        title: "Первичный контакт с клиентом",
        description: "Установление связи с потенциальным клиентом, выявление потребностей и интересов. Важно создать положительное первое впечатление и определить, насколько клиент соответствует целевой аудитории.",
        responsible: "Менеджер по продажам",
        duration: "30 минут",
        relatedContentIds: ["article-1", "instruction-1"],
      },
      {
        id: 2,
        title: "Подготовка коммерческого предложения",
        description: "Анализ потребностей клиента и составление персонализированного коммерческого предложения с учетом специфики его бизнеса. Расчет стоимости, сроков поставки и условий сотрудничества.",
        responsible: "Менеджер по продажам",
        duration: "2-4 часа",
        relatedContentIds: [],
      },
      {
        id: 3,
        title: "Презентация предложения",
        description: "Проведение встречи или онлайн-презентации для демонстрации преимуществ продукта. Работа с возражениями, ответы на вопросы клиента, обсуждение деталей сотрудничества.",
        responsible: "Менеджер по продажам",
        duration: "1-2 часа",
        relatedContentIds: ["article-1"],
      },
      {
        id: 4,
        title: "Согласование условий и заключение договора",
        description: "Финальное согласование всех условий сделки: цены, объемов, сроков поставки, условий оплаты. Подготовка и подписание договора поставки. При необходимости - внесение корректировок.",
        responsible: "Менеджер по продажам, Юридический отдел",
        duration: "1-3 дня",
        relatedContentIds: [],
      },
      {
        id: 5,
        title: "Оформление заказа и оплата",
        description: "Создание заказа в системе, выставление счета клиенту. Контроль поступления оплаты, согласование деталей доставки и оформление необходимых документов для отгрузки.",
        responsible: "Менеджер по продажам, Бухгалтерия",
        duration: "1-5 дней",
        relatedContentIds: ["instruction-1"],
      },
      {
        id: 6,
        title: "Отгрузка и доставка товара",
        description: "Координация с складом и логистикой для своевременной отгрузки товара. Информирование клиента о статусе заказа, предоставление трек-номера для отслеживания, контроль доставки до конечной точки.",
        responsible: "Отдел логистики, Склад",
        duration: "3-14 дней",
        relatedContentIds: [],
      },
    ],
  },
  {
    id: "procurement-process",
    name: "Процесс закупки товара",
    description: "Этапы работы с поставщиками от поиска до получения товара на склад",
    departments: ["Отдел закупок", "Склад", "Финансовый отдел"],
    updatedDate: "2024-01-18",
    steps: [
      {
        id: 1,
        title: "Анализ потребности в товаре",
        description: "Изучение остатков на складе, анализ продаж и прогнозирование спроса. Определение необходимого объема закупки и приоритетных товарных позиций.",
        responsible: "Закупщик",
        duration: "1-2 дня",
        relatedContentIds: [],
      },
      {
        id: 2,
        title: "Поиск и выбор поставщика",
        description: "Поиск потенциальных поставщиков, запрос коммерческих предложений, сравнение условий. Оценка надежности поставщика, качества продукции и условий сотрудничества.",
        responsible: "Закупщик",
        duration: "2-5 дней",
        relatedContentIds: [],
      },
      {
        id: 3,
        title: "Переговоры и согласование условий",
        description: "Проведение переговоров с поставщиком для получения лучших условий: цены, объемов, сроков поставки, условий оплаты и возврата. Согласование всех деталей будущей поставки.",
        responsible: "Закупщик",
        duration: "1-3 дня",
        relatedContentIds: [],
      },
      {
        id: 4,
        title: "Оформление заказа поставщику",
        description: "Создание заказа в системе, отправка официального заказа поставщику. Получение подтверждения заказа, счета на оплату и договоренности о сроках поставки.",
        responsible: "Закупщик",
        duration: "1 день",
        relatedContentIds: [],
      },
      {
        id: 5,
        title: "Оплата и контроль отгрузки",
        description: "Передача счета в бухгалтерию для оплаты. Контроль своевременной оплаты и отгрузки товара со стороны поставщика. Получение информации о трекинге груза.",
        responsible: "Закупщик, Бухгалтерия",
        duration: "2-5 дней",
        relatedContentIds: [],
      },
      {
        id: 6,
        title: "Приемка товара на склад",
        description: "Получение товара на склад, проверка соответствия заказу по количеству и качеству. Оформление приходной документации, размещение товара на складе и обновление данных в системе учета.",
        responsible: "Склад, Закупщик",
        duration: "1-2 дня",
        relatedContentIds: [],
      },
    ],
  },
  {
    id: "customer-complaint",
    name: "Обработка рекламации",
    description: "Процедура работы с жалобами и претензиями клиентов",
    departments: ["Клиентский сервис", "Отдел продаж", "Логистика"],
    updatedDate: "2024-01-22",
    steps: [
      {
        id: 1,
        title: "Регистрация обращения",
        description: "Прием и фиксация обращения клиента в CRM системе. Сбор полной информации о проблеме: номер заказа, описание ситуации, контактные данные, фото/видео при необходимости.",
        responsible: "Специалист клиентского сервиса",
        duration: "15 минут",
        relatedContentIds: [],
      },
      {
        id: 2,
        title: "Анализ ситуации",
        description: "Детальное изучение обращения, проверка истории заказа, условий доставки и документации. Определение причины возникновения проблемы и ответственной стороны.",
        responsible: "Специалист клиентского сервиса",
        duration: "30-60 минут",
        relatedContentIds: [],
      },
      {
        id: 3,
        title: "Разработка решения",
        description: "Определение варианта решения проблемы: замена товара, возврат средств, компенсация, скидка на следующую покупку. Согласование решения с руководством при необходимости.",
        responsible: "Специалист клиентского сервиса, Руководитель отдела",
        duration: "1-4 часа",
        relatedContentIds: [],
      },
      {
        id: 4,
        title: "Информирование клиента",
        description: "Связь с клиентом для информирования о принятом решении. Подробное объяснение дальнейших действий, сроков решения проблемы и получение согласия клиента.",
        responsible: "Специалист клиентского сервиса",
        duration: "15-30 минут",
        relatedContentIds: [],
      },
      {
        id: 5,
        title: "Исполнение решения",
        description: "Реализация согласованного решения: организация замены/возврата товара, оформление возврата денег, предоставление компенсации. Координация с соответствующими отделами.",
        responsible: "Специалист клиентского сервиса, Логистика, Бухгалтерия",
        duration: "1-7 дней",
        relatedContentIds: [],
      },
      {
        id: 6,
        title: "Контроль удовлетворенности",
        description: "Обратная связь с клиентом после решения проблемы. Подтверждение того, что клиент удовлетворен результатом. Фиксация кейса в базе знаний для предотвращения подобных ситуаций в будущем.",
        responsible: "Специалист клиентского сервиса",
        duration: "30 минут",
        relatedContentIds: [],
      },
    ],
  },
  {
    id: "onboarding",
    name: "Адаптация нового сотрудника",
    description: "Процесс введения в должность и обучения новых сотрудников",
    departments: ["HR", "Все отделы"],
    updatedDate: "2024-01-25",
    steps: [
      {
        id: 1,
        title: "Подготовка рабочего места",
        description: "Организация рабочего пространства: компьютер, телефон, доступы к системам. Подготовка приветственного пакета с корпоративными материалами, канцелярией и информацией о компании.",
        responsible: "HR-менеджер, IT-отдел",
        duration: "1-2 дня",
        relatedContentIds: [],
      },
      {
        id: 2,
        title: "Первый рабочий день",
        description: "Встреча нового сотрудника, экскурсия по офису, знакомство с командой. Выдача пропуска, настройка рабочего места, предоставление доступов. Проведение вводного инструктажа по охране труда.",
        responsible: "HR-менеджер, Непосредственный руководитель",
        duration: "4-8 часов",
        relatedContentIds: [],
      },
      {
        id: 3,
        title: "Обучение корпоративным стандартам",
        description: "Изучение миссии, ценностей и корпоративной культуры компании. Ознакомление с внутренними регламентами, процедурами и политиками. Обучение работе с корпоративными системами и инструментами.",
        responsible: "HR-менеджер",
        duration: "1-2 дня",
        relatedContentIds: [],
      },
      {
        id: 4,
        title: "Профессиональное обучение",
        description: "Детальное изучение должностных обязанностей, продуктов компании и бизнес-процессов. Практическое обучение на реальных задачах под руководством наставника. Изучение обучающих материалов и прохождение тестов.",
        responsible: "Наставник, Руководитель отдела",
        duration: "1-2 недели",
        relatedContentIds: [],
      },
      {
        id: 5,
        title: "Самостоятельная работа под контролем",
        description: "Выполнение реальных рабочих задач с возможностью консультаций у наставника. Постепенное увеличение сложности и объема задач. Регулярная обратная связь и корректировка действий.",
        responsible: "Наставник, Руководитель отдела",
        duration: "2-4 недели",
        relatedContentIds: [],
      },
      {
        id: 6,
        title: "Оценка результатов адаптации",
        description: "Проведение встречи с сотрудником для обсуждения прогресса. Оценка освоения навыков, знаний и соответствия должности. Планирование дальнейшего развития и постановка целей на испытательный срок.",
        responsible: "HR-менеджер, Руководитель отдела",
        duration: "2-3 часа",
        relatedContentIds: [],
      },
    ],
  },
]

export function getVideosByCategory(categoryId: string): Video[] {
  return videos.filter((video) => video.categoryId === categoryId)
}

export function getCategoryById(categoryId: string): VideoCategory | undefined {
  return categories.find((cat) => cat.id === categoryId)
}

export function getContentById(contentId: string): Content | undefined {
  return content.find((c) => c.id === contentId)
}

export function getContentByCategory(categoryId: string): Content[] {
  return content.filter((c) => c.categoryId === categoryId)
}
