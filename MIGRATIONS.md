# Миграции базы данных

## Обзор

Проект использует Prisma для управления схемой базы данных и миграциями. База данных в продакшене - PostgreSQL.

## Структура базы данных

### Основные таблицы

1. **User** - Пользователи системы
   - Поля: id, email, password, name, role, createdAt, updatedAt
   - Роли: admin, manager, buyer, warehouse, designer, logistics, customer-service

2. **Category** - Категории обучающих материалов
   - Поля: id, name, description, icon, slug, allowedRoles, createdAt, updatedAt
   - Связи: один ко многим с Video

3. **Video** - Видео материалы
   - Поля: id, title, description, duration, thumbnail, videoUrl, views, categoryId, createdAt, updatedAt
   - Связи: многие к одному с Category

4. **Content** - Контент (статьи, инструкции)
   - Поля: id, title, description, categoryId, type, duration, thumbnail, videoUrl, content, views, createdAt, updatedAt
   - Типы: video, article, instruction

5. **BusinessProcess** - Бизнес-процессы
   - Поля: id, name, description, departments (JSON), createdAt, updatedAt
   - Связи: один ко многим с ProcessStep

6. **ProcessStep** - Шаги бизнес-процессов
   - Поля: id, stepNumber, title, description, responsible, duration, relatedContentIds (JSON), processId, createdAt, updatedAt
   - Связи: многие к одному с BusinessProcess

## История миграций

### 20251224200338_init
Начальная миграция с базовыми таблицами:
- User
- Category
- Video

### 20251224200416_add_content_and_business_processes
Добавление новых функций:
- Content (статьи и инструкции)
- BusinessProcess (бизнес-процессы)
- ProcessStep (шаги процессов)

## Команды для работы с миграциями

### Создание новой миграции (разработка)
```bash
npx prisma migrate dev --schema=prisma/schema.postgresql.prisma --name название_миграции
```

### Применение миграций (продакшен)
```bash
npx prisma migrate deploy --schema=prisma/schema.postgresql.prisma
```

### Генерация Prisma Client
```bash
npx prisma generate --schema=prisma/schema.postgresql.prisma
```

### Заполнение базы тестовыми данными
```bash
npm run db:seed
```

### Просмотр базы данных
```bash
npm run db:studio
```

## Переключение между SQLite и PostgreSQL

Проект поддерживает две схемы:
- `prisma/schema.prisma` - для SQLite (разработка)
- `prisma/schema.postgresql.prisma` - для PostgreSQL (продакшен)

В продакшене используется PostgreSQL схема. Убедитесь, что в `.env` файле указан правильный `DATABASE_URL`.

## Важные замечания

1. **JSON поля**: Поля `departments` и `relatedContentIds` хранятся как JSON строки. При работе с ними используйте `JSON.stringify()` и `JSON.parse()`.

2. **Каскадное удаление**: При удалении Category удаляются все связанные Video. При удалении BusinessProcess удаляются все связанные ProcessStep.

3. **Уникальные индексы**: 
   - User.email
   - Category.slug

4. **Значения по умолчанию**:
   - User.role = "user"
   - Video.views = 0
   - Content.views = 0
   - Category.allowedRoles = ""

## Rollback миграций

Если нужно откатить миграцию:

```bash
# Откатить последнюю миграцию
npx prisma migrate resolve --rolled-back название_миграции --schema=prisma/schema.postgresql.prisma
```

## Troubleshooting

### Ошибка "migration_lock.toml provider mismatch"
Если вы переключаетесь между SQLite и PostgreSQL, обновите `prisma/migrations/migration_lock.toml`:
```toml
provider = "postgresql"  # или "sqlite"
```

### Ошибка "type datetime does not exist"
Это происходит при попытке применить SQLite миграции к PostgreSQL. Используйте правильную схему (`schema.postgresql.prisma`) и пересоздайте миграции.

### База данных не синхронизирована со схемой
```bash
# Сбросить базу данных и применить все миграции заново
npx prisma migrate reset --schema=prisma/schema.postgresql.prisma
```

**⚠️ ВНИМАНИЕ**: Эта команда удалит все данные!

