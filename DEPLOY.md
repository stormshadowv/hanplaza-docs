# 🚀 Инструкция по деплою Han Plaza

## Вариант 1: Vercel + Neon (PostgreSQL) - Рекомендуется

### Шаг 1: Подготовка базы данных PostgreSQL

1. **Создайте аккаунт на [Neon](https://neon.tech)** (бесплатно)
2. **Создайте новый проект**
3. **Скопируйте DATABASE_URL** (формат: `postgresql://user:password@host/dbname`)

### Шаг 2: Подготовка GitHub репозитория

```bash
# В корне проекта
git init
git add .
git commit -m "Initial commit"

# Создайте репозиторий на GitHub и запушьте код
git remote add origin https://github.com/ваш-username/han-plaza.git
git branch -M main
git push -u origin main
```

### Шаг 3: Деплой на Vercel

1. **Зайдите на [vercel.com](https://vercel.com)**
2. **Нажмите "Add New Project"**
3. **Импортируйте ваш GitHub репозиторий**
4. **Настройте Environment Variables:**
   - `DATABASE_URL` = ваш PostgreSQL URL от Neon
   - `JWT_SECRET` = создайте случайную строку (например: `openssl rand -base64 32`)
   - `NEXT_PUBLIC_API_URL` = `/api`

5. **Deploy!**

### Шаг 4: Настройка домена

1. В Vercel перейдите в **Settings → Domains**
2. Добавьте домен `hanplaza-docs.ru`
3. В настройках домена у регистратора добавьте DNS записи:
   ```
   A Record: @ → 76.76.21.21
   CNAME: www → cname.vercel-dns.com
   ```

### Шаг 5: Запуск миграций и seed

После успешного деплоя выполните один раз:

```bash
# Установите Vercel CLI
npm i -g vercel

# Логин
vercel login

# Подключитесь к вашему проекту
vercel link

# Запустите команды на продакшене
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed
```

---

## Вариант 2: Railway (с SQLite или PostgreSQL)

### Шаг 1: Подготовка

1. **Зайдите на [railway.app](https://railway.app)**
2. **Создайте новый проект из GitHub**
3. **Выберите ваш репозиторий**

### Шаг 2: Для PostgreSQL

1. **Добавьте PostgreSQL сервис** в Railway
2. **Подключите DATABASE_URL** автоматически

### Шаг 3: Environment Variables

Добавьте в Railway:
- `DATABASE_URL` (если используете PostgreSQL)
- `JWT_SECRET` = случайная строка
- `NEXT_PUBLIC_API_URL` = `/api`

### Шаг 4: Настройка домена

1. В Railway перейдите в **Settings → Domains**
2. Добавьте custom domain `hanplaza-docs.ru`
3. Настройте DNS у регистратора согласно инструкции Railway

---

## Вариант 3: VPS (Полный контроль)

### Требования
- Ubuntu 22.04 или новее
- Node.js 18+
- Nginx
- PM2

### Быстрая установка

```bash
# 1. Установка зависимостей
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

# 2. Установка PM2
sudo npm install -g pm2

# 3. Клонирование проекта
cd /var/www
git clone https://github.com/your-username/han-plaza.git
cd han-plaza

# 4. Установка зависимостей проекта
npm install

# 5. Настройка .env
nano .env
# Добавьте:
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="ваш-секретный-ключ"
# NODE_ENV="production"

# 6. Миграции и seed
npx prisma migrate deploy
npx prisma db seed

# 7. Сборка
npm run build

# 8. Запуск с PM2
pm2 start npm --name "hanplaza" -- start
pm2 save
pm2 startup

# 9. Настройка Nginx
sudo nano /etc/nginx/sites-available/hanplaza

# Добавьте конфигурацию (см. ниже)
sudo ln -s /etc/nginx/sites-available/hanplaza /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 10. SSL сертификат (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d hanplaza-docs.ru -d www.hanplaza-docs.ru
```

### Nginx конфигурация

```nginx
server {
    listen 80;
    server_name hanplaza-docs.ru www.hanplaza-docs.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Переменные окружения (.env)

Создайте файл `.env` со следующими переменными:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
# Или для SQLite:
# DATABASE_URL="file:./dev.db"

# JWT Secret (используйте случайную строку)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# API URL
NEXT_PUBLIC_API_URL="/api"

# Node Environment
NODE_ENV="production"
```

**Генерация JWT_SECRET:**
```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## После деплоя

### 1. Создайте админа

Войдите на сайт с учетными данными:
- **Email:** `admin@hanplaza.ru`
- **Пароль:** `password123`

**⚠️ ВАЖНО:** Сразу смените пароль!

### 2. Создайте остальных пользователей

Зарегистрируйте пользователей через админ-панель или API.

### 3. Настройте категории и контент

Используйте админ-панель на `/admin`

---

## Рекомендации по безопасности

1. **Смените JWT_SECRET** на случайную строку
2. **Смените пароли** всех тестовых пользователей
3. **Настройте HTTPS** (Let's Encrypt бесплатно)
4. **Настройте backup** базы данных
5. **Включите мониторинг** (Sentry, LogRocket)

---

## Устранение проблем

### Ошибка подключения к БД

```bash
# Проверьте DATABASE_URL
echo $DATABASE_URL

# Проверьте подключение
npx prisma db push
```

### Ошибки после деплоя

```bash
# Очистите кеш
npm run build

# Проверьте логи (Vercel)
vercel logs

# Проверьте логи (PM2)
pm2 logs hanplaza
```

---

## Поддержка

При возникновении проблем:
1. Проверьте логи
2. Убедитесь что все environment variables настроены
3. Проверьте что миграции БД применены
4. Проверьте что seed выполнен

**Готово!** 🎉 Ваше приложение должно быть доступно на `hanplaza-docs.ru`

