'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { pb } from '@/lib/pocketbase'
import type { RecordModel } from 'pocketbase'

interface AuthContextValue {
  user: RecordModel | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, passwordConfirm: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function syncAuthCookie() {
  if (pb.authStore.isValid) {
    // httpOnly false so client JS can read (middleware reads from Next.js request cookies)
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false, sameSite: 'Lax', secure: true })
  } else {
    document.cookie = 'pb_auth=; Max-Age=0; path=/'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RecordModel | null>(pb.authStore.record)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Hydrate from cookie on mount (SSR-safe)
    try {
      pb.authStore.loadFromCookie(document.cookie)
    } catch {
      // ignore malformed cookie
    }
    setUser(pb.authStore.record)

    // Subscribe to auth changes and keep cookie in sync
    const unsub = pb.authStore.onChange((_token, record) => {
      setUser(record)
      syncAuthCookie()
    })

    return unsub
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await pb.collection('users').authWithPassword(email, password)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string,
  ) => {
    setIsLoading(true)
    try {
      await pb.collection('users').create({ name, email, password, passwordConfirm })
      await pb.collection('users').authWithPassword(email, password)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    pb.authStore.clear()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
