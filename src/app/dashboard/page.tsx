"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  role: string
  level?: string
  name: string
  email: string
  avatar: string
}

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      const user: User = JSON.parse(userData)
      // Rol bazlı yönlendirme
      switch (user.role) {
        case 'student':
          router.push('/dashboard/student')
          break
        case 'teacher':
          router.push('/dashboard/teacher')
          break
        case 'admin':
          router.push('/dashboard/admin')
          break
        default:
          router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Yönlendiriliyor...</p>
      </div>
    </div>
  )
}