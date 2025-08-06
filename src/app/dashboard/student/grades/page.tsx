"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Award, TrendingUp } from "lucide-react"

interface User {
  id: number
  username: string
  role: string
  name: string
  email: string
}

export default function StudentGrades() {
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
            <h1 className="text-3xl font-bold text-gray-900">Notlarım</h1>
            <p className="text-gray-600">Not ortalamanı ve sınav sonuçlarını takip et</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              İngilizce B1
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Genel Ortalama:</span>
              <Badge className="bg-green-100 text-green-800">88.5</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Grammar Quiz</span>
                <span className="text-sm font-medium">85/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Vocabulary Test</span>
                <span className="text-sm font-medium">92/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Speaking Exam</span>
                <span className="text-sm font-medium">87/100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Matematik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Genel Ortalama:</span>
              <Badge className="bg-yellow-100 text-yellow-800">76.2</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Ara Sınav</span>
                <span className="text-sm font-medium">78/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Quiz 1</span>
                <span className="text-sm font-medium">74/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Quiz 2</span>
                <span className="text-sm font-medium">77/100</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}