"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Clock, Users } from "lucide-react"

interface User {
  id: number
  username: string
  role: string
  name: string
  email: string
}

export default function StudentCourses() {
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
            <h1 className="text-3xl font-bold text-gray-900">Derslerim</h1>
            <p className="text-gray-600">Aldığın dersleri görüntüle ve ders materyallerine eriş</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              İngilizce B1
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>İlerleme:</span>
              <Badge className="bg-green-100 text-green-800">%75 Tamamlandı</Badge>
            </div>
            <div className="flex justify-between">
              <span>Öğretmen:</span>
              <span className="font-medium">Sarah Johnson</span>
            </div>
            <div className="flex justify-between">
              <span>Sınıf:</span>
              <span className="font-medium">B1-A</span>
            </div>
            <div className="flex justify-between">
              <span>Ders Günleri:</span>
              <span className="font-medium">Pzt, Çar, Cum</span>
            </div>
            <Button className="w-full mt-4">
              <BookOpen className="w-4 h-4 mr-2" />
              Derse Katıl
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Matematik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>İlerleme:</span>
              <Badge className="bg-yellow-100 text-yellow-800">%60 Tamamlandı</Badge>
            </div>
            <div className="flex justify-between">
              <span>Öğretmen:</span>
              <span className="font-medium">Ahmet Yılmaz</span>
            </div>
            <div className="flex justify-between">
              <span>Sınıf:</span>
              <span className="font-medium">MAT-101</span>
            </div>
            <div className="flex justify-between">
              <span>Ders Günleri:</span>
              <span className="font-medium">Sal, Per</span>
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Materyal İndir
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}