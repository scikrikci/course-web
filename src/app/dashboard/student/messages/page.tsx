"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MessageSquare } from "lucide-react"

interface User {
  id: number
  username: string
  role: string
  name: string
  email: string
}

export default function StudentMessages() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      const parsedUser: User = JSON.parse(userData)
      if (parsedUser.role !== 'student') {
        router.push('/login')
        return
      }
      setUser(parsedUser)
    } else {
      router.push('/login')
    }
  }, [router])

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/dashboard/student')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfa'ya Dön
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mesajlar</h1>
            <p className="text-gray-600">Öğretmenlerinden gelen mesajları oku</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Mesajlaşma Sistemi</h3>
          <p className="text-gray-600 mb-4">Öğretmenlerinizle mesajlaşabileceğiniz sistem burada olacak</p>
          <p className="text-sm text-gray-500">Bu özellik yakında kullanıma sunulacak</p>
        </CardContent>
      </Card>
    </div>
  )
}