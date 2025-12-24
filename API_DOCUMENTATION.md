# API Документация - Han Plaza

## Базовый URL
```
http://localhost:3000/api
```

## Авторизация

Все защищенные endpoints требуют JWT токен в заголовке:
```
Authorization: Bearer {your_jwt_token}
```

---

## 🔐 Авторизация

### 1. Вход в систему
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "admin@hanplaza.ru",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@hanplaza.ru",
    "name": "Администратор",
    "role": "admin"
  }
}
```

**Errors:**
- `400` - Отсутствуют обязательные поля
- `401` - Неверный email или пароль

---

### 2. Регистрация
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "newuser@hanplaza.ru",
  "password": "securepassword",
  "name": "Новый Пользователь",
  "role": "manager"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "newuser@hanplaza.ru",
    "name": "Новый Пользователь",
    "role": "manager"
  }
}
```

**Errors:**
- `400` - Пользователь уже существует или отсутствуют обязательные поля

---

### 3. Получить текущего пользователя
**GET** `/auth/me` 🔒

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@hanplaza.ru",
    "name": "Администратор",
    "role": "admin",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `401` - Неавторизован
- `404` - Пользователь не найден

---

## 📚 Категории

### 1. Получить категории (с учетом роли)
**GET** `/categories` 🔒

**Headers:**
```
Authorization: Bearer {token}
```

**Описание:**
Возвращает только те категории, к которым пользователь имеет доступ согласно своей роли.
- Администраторы (`admin`) видят все категории
- Остальные пользователи видят только свои категории

**Response (200):**
```json
{
  "categories": [
    {
      "id": "manager",
      "slug": "manager",
      "name": "Менеджер",
      "description": "Обучающие материалы для менеджеров по продажам",
      "icon": "briefcase",
      "videoCount": 12
    }
  ]
}
```

**Пример:** Пользователь с ролью `manager` увидит только категорию "Менеджер".

---

### 2. Создать категорию (только админ)
**POST** `/categories` 🔒 👑

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Новая категория",
  "description": "Описание новой категории",
  "icon": "folder",
  "slug": "new-category",
  "allowedRoles": "manager,admin"
}
```

**Поле `allowedRoles`:**
- Список ролей через запятую, которые могут видеть эту категорию
- Примеры: `"manager,admin"`, `"buyer,admin"`, `"all"`, `""`
- Пустая строка `""` или значение `"all"` означает доступ для всех

**Response (201):**
```json
{
  "category": {
    "id": "uuid",
    "slug": "new-category",
    "name": "Новая категория",
    "description": "Описание новой категории",
    "icon": "folder",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `400` - Отсутствуют обязательные поля
- `403` - Недостаточно прав (требуется роль admin)

---

## 🎥 Видео

### 1. Получить все видео
**GET** `/videos` 🔒

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `category` (optional) - slug категории

**Examples:**
```
GET /videos
GET /videos?category=manager
```

**Response (200):**
```json
{
  "videos": [
    {
      "id": "uuid",
      "title": "Основы работы с клиентами",
      "description": "Введение в работу менеджера по продажам",
      "categoryId": "manager",
      "duration": "15:30",
      "thumbnail": "/professional-sales-training.jpg",
      "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "uploadDate": "2024-01-15T10:30:00.000Z",
      "views": 234
    }
  ]
}
```

**Errors:**
- `404` - Категория не найдена (если указан параметр category)

---

### 2. Получить конкретное видео
**GET** `/videos/{id}` 🔒

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "video": {
    "id": "uuid",
    "title": "Основы работы с клиентами",
    "description": "Введение в работу менеджера по продажам",
    "categoryId": "manager",
    "duration": "15:30",
    "thumbnail": "/professional-sales-training.jpg",
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "uploadDate": "2024-01-15T10:30:00.000Z",
    "views": 234
  }
}
```

**Errors:**
- `404` - Видео не найдено

---

### 3. Создать видео (только админ)
**POST** `/videos` 🔒 👑

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Новое обучающее видео",
  "description": "Подробное описание видео",
  "categorySlug": "manager",
  "duration": "20:00",
  "thumbnail": "/image.jpg",
  "videoUrl": "https://www.youtube.com/embed/xxxxx"
}
```

**Response (201):**
```json
{
  "video": {
    "id": "uuid",
    "title": "Новое обучающее видео",
    "description": "Подробное описание видео",
    "categoryId": "uuid",
    "duration": "20:00",
    "thumbnail": "/image.jpg",
    "videoUrl": "https://www.youtube.com/embed/xxxxx",
    "views": 0,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `400` - Отсутствуют обязательные поля
- `403` - Недостаточно прав (требуется роль admin)
- `404` - Категория не найдена

---

### 4. Обновить видео (увеличить просмотры)
**PATCH** `/videos/{id}` 🔒

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "action": "increment_views"
}
```

**Response (200):**
```json
{
  "video": {
    "id": "uuid",
    "views": 235,
    ...
  }
}
```

**Errors:**
- `400` - Неизвестное действие

---

## Легенда

- 🔒 - Требуется авторизация (JWT токен)
- 👑 - Требуется роль админа

## Коды ответов

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Примеры использования

### cURL

**Логин:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hanplaza.ru","password":"password123"}'
```

**Получить категории:**
```bash
curl -X GET http://localhost:3000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### JavaScript (Fetch)

```javascript
// Логин
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@hanplaza.ru',
    password: 'password123'
  })
});

const { token, user } = await response.json();

// Получить категории
const categoriesResponse = await fetch('/api/categories', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { categories } = await categoriesResponse.json();
```

### Использование с apiClient

Проект включает готовый API клиент в `lib/api-client.ts`:

```typescript
import { apiClient } from '@/lib/api-client';

// Логин
const { token, user } = await apiClient.login('admin@hanplaza.ru', 'password123');

// Получить категории
const { categories } = await apiClient.getCategories();

// Получить видео по категории
const { videos } = await apiClient.getVideos('manager');

// Увеличить просмотры
await apiClient.incrementVideoViews('video-id');
```

