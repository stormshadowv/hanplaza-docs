#!/bin/bash
# Скрипт для переключения с SQLite на PostgreSQL

echo "🔄 Переключение на PostgreSQL..."
echo ""

# Проверка наличия DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Ошибка: DATABASE_URL не задан"
    echo "Добавьте в .env:"
    echo 'DATABASE_URL="postgresql://user:password@host:5432/dbname"'
    exit 1
fi

# Проверка формата DATABASE_URL
if [[ ! "$DATABASE_URL" =~ ^postgresql:// ]]; then
    echo "❌ Ошибка: DATABASE_URL должен начинаться с postgresql://"
    echo "Текущий: $DATABASE_URL"
    exit 1
fi

echo "✅ DATABASE_URL найден и корректен"
echo ""

# Бекап текущей схемы
echo "📦 Создание бекапа schema.prisma..."
cp prisma/schema.prisma prisma/schema.sqlite.backup
echo "✅ Бекап создан: prisma/schema.sqlite.backup"
echo ""

# Замена схемы на PostgreSQL
echo "🔧 Замена схемы на PostgreSQL..."
cp prisma/schema.postgresql.prisma prisma/schema.prisma
echo "✅ Схема обновлена"
echo ""

# Генерация Prisma Client
echo "⚙️  Генерация Prisma Client..."
npx prisma generate
echo "✅ Client сгенерирован"
echo ""

# Применение миграций
echo "🚀 Применение миграций к PostgreSQL..."
npx prisma db push --accept-data-loss
echo "✅ Миграции применены"
echo ""

# Seed данных
echo "🌱 Заполнение базы данных..."
npm run db:seed
echo "✅ Данные добавлены"
echo ""

echo "🎉 Готово! Теперь используется PostgreSQL"
echo ""
echo "Для возврата к SQLite:"
echo "cp prisma/schema.sqlite.backup prisma/schema.prisma"
echo "npx prisma generate"

