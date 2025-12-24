# Настройка базы данных

## Быстрый старт для продакшена (Neon PostgreSQL)

### 1️⃣ Создайте таблицы в Neon

**Через SQL Editor (самый простой способ):**

1. Откройте [neon.tech](https://neon.tech) → ваш проект
2. Перейдите в **SQL Editor** (левое меню)
3. Скопируйте весь код из файла **`setup-postgresql.sql`**
4. Вставьте в SQL Editor
5. Нажмите **Run** или `Ctrl+Enter`
6. Должно показать "Successfully executed" ✅

### 2️⃣ Создайте админа

После создания таблиц, создайте первого администратора через API:

```bash
curl -X POST https://ваш-сайт.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hanplaza.ru",
    "password": "password123",
    "name": "Администратор",
    "role": "admin"
  }'
```

---

## Для локальной разработки (SQLite)

```bash
# Применить миграции
npx prisma migrate dev

# Заполнить базу тестовыми данными
npx prisma db seed

# Открыть Prisma Studio
npx prisma studio
```

---

## Файлы

- **`schema.prisma`** - SQLite схема для локальной разработки
- **`schema.postgresql.prisma`** - PostgreSQL схема для продакшена
- **`setup-postgresql.sql`** - SQL скрипт для создания таблиц в PostgreSQL
- **`seed.ts`** - Скрипт для заполнения базы тестовыми данными
- **`migrations/`** - SQLite миграции (для локальной разработки)

---

## Troubleshooting

### Ошибка "relation does not exist"
Значит таблицы не созданы. Выполните скрипт `setup-postgresql.sql` в Neon SQL Editor.

### Ошибка "column does not exist"  
Структура базы не соответствует схеме. Удалите все таблицы и выполните `setup-postgresql.sql` заново.

### Нужно пересоздать базу
В Neon SQL Editor выполните:
```sql
DROP TABLE IF EXISTS "Video" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
```

Затем выполните `setup-postgresql.sql`.

