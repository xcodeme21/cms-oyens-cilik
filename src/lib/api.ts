import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// API Types
export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin'
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: AdminUser
}

export interface Letter {
  id: number
  letter: string
  letterLower: string
  exampleWord: string
  pronunciation: string
  audioUrl?: string
  imageUrl?: string
}

export interface NumberContent {
  id: number
  value: number
  word: string
  pronunciation: string
  audioUrl?: string
  imageUrl?: string
}

export interface Animal {
  id: number
  name: string
  nameEnglish: string
  description: string
  funFact: string
  difficulty: string
  emoji: string
  imageUrl?: string
  audioUrl?: string
}

// Auth API
export const authApi = {
  login: (data: LoginRequest) => api.post<{ data: LoginResponse }>('/admin/auth/login', data),
  getMe: () => api.get<{ data: AdminUser }>('/admin/auth/me'),
  logout: () => api.post('/admin/auth/logout'),
}

// Admin Users API
export const adminUsersApi = {
  getAll: () => api.get<{ data: AdminUser[] }>('/admin/users'),
  getById: (id: string) => api.get<{ data: AdminUser }>(`/admin/users/${id}`),
  create: (data: { email: string; password: string; name: string; role?: string }) =>
    api.post<{ data: AdminUser }>('/admin/users', data),
  update: (id: string, data: Partial<AdminUser & { password?: string }>) =>
    api.put<{ data: AdminUser }>(`/admin/users/${id}`, data),
  delete: (id: string) => api.delete(`/admin/users/${id}`),
}

// Content API
export const contentApi = {
  // Letters
  getLetters: () => api.get<{ data: Letter[] }>('/content/letters'),
  getLetter: (id: number) => api.get<{ data: Letter }>(`/content/letters/${id}`),
  createLetter: (data: Partial<Letter>) => api.post<{ data: Letter }>('/admin/content/letters', data),
  updateLetter: (id: number, data: Partial<Letter>) =>
    api.put<{ data: Letter }>(`/admin/content/letters/${id}`, data),
  deleteLetter: (id: number) => api.delete(`/admin/content/letters/${id}`),

  // Numbers
  getNumbers: () => api.get<{ data: NumberContent[] }>('/content/numbers'),
  getNumber: (id: number) => api.get<{ data: NumberContent }>(`/content/numbers/${id}`),
  createNumber: (data: Partial<NumberContent>) =>
    api.post<{ data: NumberContent }>('/admin/content/numbers', data),
  updateNumber: (id: number, data: Partial<NumberContent>) =>
    api.put<{ data: NumberContent }>(`/admin/content/numbers/${id}`, data),
  deleteNumber: (id: number) => api.delete(`/admin/content/numbers/${id}`),

  // Animals
  getAnimals: () => api.get<{ data: Animal[] }>('/content/animals'),
  getAnimal: (id: number) => api.get<{ data: Animal }>(`/content/animals/${id}`),
  createAnimal: (data: Partial<Animal>) => api.post<{ data: Animal }>('/admin/content/animals', data),
  updateAnimal: (id: number, data: Partial<Animal>) =>
    api.put<{ data: Animal }>(`/admin/content/animals/${id}`, data),
  deleteAnimal: (id: number) => api.delete(`/admin/content/animals/${id}`),
}
