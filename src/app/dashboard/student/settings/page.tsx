"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Mail, Shield, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface User {
  id: number
  username: string
  role: string
  name: string
  email: string
}

export default function StudentSettings() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: ""
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      const parsedUser: User = JSON.parse(userData)
      if (parsedUser.role !== 'student') {
        router.push('/login')
        return
      }
      setUser(parsedUser)
      setFormData({
        name: parsedUser.name,
        email: parsedUser.email,
        username: parsedUser.username
      })
    } else {
      router.push('/login')
    }
  }, [router])

  const handleSave = () => {
    if (user) {
      const updatedUser = { ...user, ...formData }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      toast({
        title: "Ayarlar Kaydedildi",
        description: "Profil bilgileriniz başarıyla güncellendi.",
      })
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <div className="p-6">
      <Toaster />
      
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
            <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
            <p className="text-gray-600">Profil bilgilerini ve tercihlerini yönet</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Profil Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Hesap Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Rol</div>
                <div className="text-sm text-gray-600">Öğrenci</div>
              </div>
              <div className="text-sm text-gray-500">Değiştirilemez</div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Hesap Durumu</div>
                <div className="text-sm text-gray-600">Aktif</div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Değişiklikleri Kaydet
          </Button>
        </div>
      </div>
    </div>
  )
}