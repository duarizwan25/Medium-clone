"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { db, type User } from "./database"

interface AuthContextType {
  user: Omit<User, "password"> | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: any) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("current_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const foundUser = await db.findUserByEmail(email)

      if (foundUser && foundUser.password === password) {
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem("current_user", JSON.stringify(userWithoutPassword))
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const signup = async (userData: any): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Check if user already exists
      const existingUserByEmail = await db.findUserByEmail(userData.email)
      const existingUserByUsername = await db.findUserByUsername(userData.username)

      if (existingUserByEmail || existingUserByUsername) {
        setIsLoading(false)
        return false
      }

      const newUser = await db.createUser({
        ...userData,
        followers: [],
        following: [],
      })

      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem("current_user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("current_user")
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    try {
      const updatedUser = await db.updateUser(user._id, userData)
      if (updatedUser) {
        const { password: _, ...userWithoutPassword } = updatedUser
        setUser(userWithoutPassword)
        localStorage.setItem("current_user", JSON.stringify(userWithoutPassword))
        setIsLoading(false)
        return true
      }
      setIsLoading(false)
      return false
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
