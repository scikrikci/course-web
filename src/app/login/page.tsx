"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Award, GraduationCap, Shield, Users } from "lucide-react"

interface User {
  id: number
  username: string
  role: string
  level?: string
  name: string
  email: string
  avatar: string
}

export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [users] = useState<User[]>([
    {
      id: 1,
      username: "ogrenci1",
      role: "student",
      level: "B1",
      name: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      avatar: "/avatars/student1.jpg"
    },
    {
      id: 2,
      username: "ogrenci2",
      role: "student",
      level: "A2",
      name: "Ayşe Demir",
      email: "ayse@example.com",
      avatar: "/avatars/student2.jpg"
    },
    {
      id: 3,
      username: "ogretmen1",
      role: "teacher",
      name: "Mehmet Kaya",
      email: "mehmet@example.com",
      avatar: "/avatars/teacher1.jpg"
    },
    {
      id: 4,
      username: "ogretmen2",
      role: "teacher",
      name: "Fatma Çelik",
      email: "fatma@example.com",
      avatar: "/avatars/teacher2.jpg"
    },
    {
      id: 5,
      username: "yonetici1",
      role: "admin",
      name: "Admin User",
      email: "admin@example.com",
      avatar: "/avatars/admin1.jpg"
    }
  ])

  const handleLogin = () => {
    if (!selectedUser) return
    
    setIsLoading(true)
    const user = users.find(u => u.username === selectedUser)
    
    // Simulate login process
    setTimeout(() => {
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      // Rol bazlı yönlendirme
      switch (user?.role) {
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
          router.push('/dashboard')
      }
    }, 1000)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="w-4 h-4" />
      case 'teacher':
        return <BookOpen className="w-4 h-4" />
      case 'admin':
        return <Shield className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800'
      case 'teacher':
        return 'bg-green-100 text-green-800'
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student':
        return 'Öğrenci'
      case 'teacher':
        return 'Öğretmen'
      case 'admin':
        return 'Yönetici'
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <img
              src="/education.svg"
              alt="Eğitim Platformu"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Eğitim Platformu</h1>
          <p className="text-gray-600 mt-2">Lütfen giriş yapmak için kullanıcı seçin</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Giriş Yap</CardTitle>
            <CardDescription>
              Demo kullanıcılarından birini seçerek platformu deneyimleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-select">Kullanıcı Seç</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Kullanıcı seçin..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.username}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span>{user.name}</span>
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                        {user.level && (
                          <Badge variant="outline">{user.level}</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedUser && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {getRoleIcon(users.find(u => u.username === selectedUser)?.role || '')}
                    </div>
                    <div>
                      <p className="font-medium">
                        {users.find(u => u.username === selectedUser)?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {users.find(u => u.username === selectedUser)?.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={handleLogin} 
              disabled={!selectedUser || isLoading}
              className="w-full"
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </CardContent>
        </Card>

        {/* User Roles Preview */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-center">Kullanıcı Rolleri</h3>
          <div className="grid gap-3">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Öğrenci</h4>
                    <p className="text-sm text-gray-600">Ders takibi, ödev teslim, quiz çözme</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Öğretmen</h4>
                    <p className="text-sm text-gray-600">Ders materyali, ödev kontrolü, quiz oluşturma</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium">Yönetici</h4>
                    <p className="text-sm text-gray-600">Kullanıcı yönetimi, raporlar, sistem ayarları</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}