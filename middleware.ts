import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCorsHeaders } from '@/lib/cors'

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  // Обработка preflight запросов
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { headers: corsHeaders })
  }

  // Добавляем CORS headers ко всем ответам
  const response = NextResponse.next()
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

// Применяем middleware только к API routes
export const config = {
  matcher: '/api/:path*',
}

