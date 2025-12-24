import { NextRequest } from 'next/server'
import { verifyToken } from './jwt'

export async function authenticate(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return { authenticated: false, user: null }
  }

  const user = verifyToken(token)

  if (!user) {
    return { authenticated: false, user: null }
  }

  return { authenticated: true, user }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const { authenticated, user } = await authenticate(request)

    if (!authenticated) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Передаем user в контекст
    if (context) {
      context.user = user
    }

    return handler(request, context)
  }
}

