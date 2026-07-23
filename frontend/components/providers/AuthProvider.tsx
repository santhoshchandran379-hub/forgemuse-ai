'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro'
  aiUsage: { used: number; limit: number }
  createdAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
  isAuthenticated: false,
})

export const useAuth = () => useContext(AuthContext)

// Setup axios defaults
const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('forgemuse-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('forgemuse-token')
    if (storedToken) {
      setToken(storedToken)
      fetchUser(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (authToken: string) => {
    try {
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      setUser(res.data.user)
    } catch {
      localStorage.removeItem('forgemuse-token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    const { token: newToken, user: newUser } = res.data
    localStorage.setItem('forgemuse-token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password })
    const { token: newToken, user: newUser } = res.data
    localStorage.setItem('forgemuse-token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = useCallback(() => {
    localStorage.removeItem('forgemuse-token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...data } : prev)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUser,
      isAuthenticated: !!user && !!token,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default api
