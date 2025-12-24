const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export interface User {
  id: string
  email: string
  name: string | null
  role: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  videoCount: number
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('hanplaza_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Ошибка сервера' }))
      throw new Error(error.error || 'Ошибка запроса')
    }

    return response.json()
  }

  // Auth
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    // Сохраняем токен
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanplaza_token', response.token)
      localStorage.setItem('hanplaza_user', JSON.stringify(response.user))
    }
    
    return response
  }

  async register(email: string, password: string, name?: string, role?: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    })
    
    // Сохраняем токен
    if (typeof window !== 'undefined') {
      localStorage.setItem('hanplaza_token', response.token)
      localStorage.setItem('hanplaza_user', JSON.stringify(response.user))
    }
    
    return response
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me')
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hanplaza_token')
      localStorage.removeItem('hanplaza_user')
      localStorage.removeItem('hanplaza_auth')
    }
  }

  // Categories
  async getCategories(): Promise<{ categories: Category[] }> {
    return this.request<{ categories: Category[] }>('/categories')
  }

  async deleteCategory(slug: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/categories/${slug}`, {
      method: 'DELETE',
    })
  }

  // Content
  async getContent(categoryId?: string, type?: string): Promise<{ content: any[] }> {
    let query = ''
    const params = []
    if (categoryId) params.push(`categoryId=${categoryId}`)
    if (type) params.push(`type=${type}`)
    if (params.length > 0) query = `?${params.join('&')}`
    
    return this.request<{ content: any[] }>(`/content${query}`)
  }

  async getContentById(id: string): Promise<{ content: any }> {
    return this.request<{ content: any }>(`/content/${id}`)
  }

  async incrementContentViews(id: string): Promise<void> {
    await this.request(`/content/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'increment_views' }),
    })
  }

  async createContent(data: any): Promise<{ content: any }> {
    return this.request<{ content: any }>('/content', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateContent(id: string, data: any): Promise<{ content: any }> {
    return this.request<{ content: any }>(`/content/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteContent(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/content/${id}`, {
      method: 'DELETE',
    })
  }

  // Business Processes
  async getProcesses(): Promise<{ processes: any[] }> {
    return this.request<{ processes: any[] }>('/processes')
  }

  async getProcessById(id: string): Promise<{ process: any }> {
    return this.request<{ process: any }>(`/processes/${id}`)
  }

  async createProcess(data: any): Promise<{ process: any }> {
    return this.request<{ process: any }>('/processes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProcess(id: string, data: any): Promise<{ process: any }> {
    return this.request<{ process: any }>(`/processes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProcess(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/processes/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()

