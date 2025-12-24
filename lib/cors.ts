// Разрешенные домены для CORS
export const allowedOrigins = [
  'https://hanplaza-docs.ru',
  'https://www.hanplaza-docs.ru',
  'http://localhost:3000', // для локальной разработки
]

// Функция для получения CORS заголовков
export function getCorsHeaders(origin: string | null) {
  const isAllowed = origin && allowedOrigins.includes(origin)
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

