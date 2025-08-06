"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Calendar, Clock } from "lucide-react"

interface User {
  id: number
  username: string
  role: string
  name: string
  email: string
}

export default function StudentAssignments() {
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
            <h1 className="text-3xl font-bold text-gray-900">Ödevlerim</h1>
            <p className="text-gray-600">Ödevlerini görüntüle, teslim et ve geri bildirimlerini incele</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">İngilizce Essay - Present Perfect</h3>
                <p className="text-gray-600 mb-3">150 kelimelik bir essay yazın</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Son Teslim: 25 Ocak 2024
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    2 gün kaldı
                  </div>
                </div>
              </div>
              <Badge className="bg-red-100 text-red-800">Bekliyor</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Matematik Problemleri</h3>
                <p className="text-gray-600 mb-3">Sayfa 45-50 problemleri</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Teslim Edildi: 20 Ocak 2024
                  </div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Tamamlandı - 85/100</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Vocabulary Quiz</h3>
                <p className="text-gray-600 mb-3">Unit 5 kelimeleri quiz</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Son Teslim: 30 Ocak 2024
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    7 gün kaldı
                  </div>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Devam Ediyor</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}