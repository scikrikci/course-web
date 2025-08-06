"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Search, Users, PlusCircle, Eye, MessageSquare, FileText, Calendar, Filter, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface User {
  id: number
  username: string
  role: string
  name: string
  email: string
  avatar: string
}

interface Student {
  id: number
  name: string
  email: string
  attendance: number
  lastActivity: string
  grade: string
}

interface Class {
  id: string
  name: string
  grade: string
  subject: string
  studentCount: number
  schedule: string[]
  students: Student[]
  description: string
  room: string
}

export default function TeacherClasses() {
  const [user, setUser] = useState<User | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGrade, setFilterGrade] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      const parsedUser: User = JSON.parse(userData)
      if (parsedUser.role !== 'teacher') {
        router.push('/login')
        return
      }
      setUser(parsedUser)
    } else {
      router.push('/login')
    }

    // Sample data
    setClasses([
      {
        id: "9a-eng",
        name: "9-A İngilizce",
        grade: "9",
        subject: "İngilizce",
        studentCount: 28,
        schedule: ["Pazartesi 09:00", "Çarşamba 10:00", "Cuma 11:00"],
        room: "A-205",
        description: "9. sınıf temel İngilizce dersi",
        students: [
          { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com", attendance: 95, lastActivity: "2 saat önce", grade: "85" },
          { id: 2, name: "Ayşe Kaya", email: "ayse@example.com", attendance: 92, lastActivity: "1 gün önce", grade: "92" },
          { id: 3, name: "Mehmet Demir", email: "mehmet@example.com", attendance: 88, lastActivity: "3 saat önce", grade: "78" },
          { id: 4, name: "Fatma Özkan", email: "fatma@example.com", attendance: 98, lastActivity: "30 dk önce", grade: "96" },
          { id: 5, name: "Ali Şahin", email: "ali@example.com", attendance: 85, lastActivity: "2 gün önce", grade: "82" }
        ]
      },
      {
        id: "9b-eng",
        name: "9-B İngilizce",
        grade: "9", 
        subject: "İngilizce",
        studentCount: 25,
        schedule: ["Salı 14:00", "Perşembe 09:00", "Cuma 13:00"],
        room: "A-206",
        description: "9. sınıf temel İngilizce dersi",
        students: [
          { id: 6, name: "Zeynep Arslan", email: "zeynep@example.com", attendance: 94, lastActivity: "1 saat önce", grade: "89" },
          { id: 7, name: "Burak Yıldız", email: "burak@example.com", attendance: 90, lastActivity: "4 saat önce", grade: "87" },
          { id: 8, name: "Elif Çelik", email: "elif@example.com", attendance: 97, lastActivity: "45 dk önce", grade: "93" }
        ]
      },
      {
        id: "10a-eng",
        name: "10-A İngilizce",
        grade: "10",
        subject: "İngilizce", 
        studentCount: 30,
        schedule: ["Pazartesi 14:00", "Çarşamba 15:00", "Perşembe 10:00"],
        room: "B-103",
        description: "10. sınıf orta seviye İngilizce dersi",
        students: [
          { id: 9, name: "Emre Kıyak", email: "emre@example.com", attendance: 91, lastActivity: "6 saat önce", grade: "84" },
          { id: 10, name: "Selin Mutlu", email: "selin@example.com", attendance: 96, lastActivity: "2 saat önce", grade: "91" }
        ]
      }
    ])
  }, [router])

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = filterGrade === "all" || cls.grade === filterGrade
    return matchesSearch && matchesGrade
  })

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return "text-green-600 bg-green-100"
    if (attendance >= 85) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const getGradeColor = (grade: string) => {
    const numGrade = parseInt(grade)
    if (numGrade >= 90) return "text-green-600 bg-green-100"
    if (numGrade >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sınıflarım</h1>
            <p className="text-gray-600">Tüm sınıflarınızı ve öğrencilerinizi yönetin</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Sınıf ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white"
          >
            <option value="all">Tüm Sınıflar</option>
            <option value="9">9. Sınıf</option>
            <option value="10">10. Sınıf</option>
            <option value="11">11. Sınıf</option>
            <option value="12">12. Sınıf</option>
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {classItem.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Calendar className="w-4 h-4 mr-2" />
                      Ders Programı
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="w-4 h-4 mr-2" />
                      Notlar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Mesaj Gönder
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{classItem.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Class Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Sınıf: </span>
                    <Badge variant="secondary">{classItem.grade}. Sınıf</Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Oda: </span>
                    <span className="font-medium">{classItem.room}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Öğrenci: </span>
                    <span className="font-medium">{classItem.studentCount} kişi</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Branş: </span>
                    <span className="font-medium">{classItem.subject}</span>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Ders Saatleri:</h4>
                  <div className="space-y-1">
                    {classItem.schedule.map((time, index) => (
                      <div key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/teacher/classes/${classItem.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Detaylar
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Mesaj
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sınıf bulunamadı</h3>
          <p className="text-gray-600">Arama kriterlerinize uygun sınıf bulunmuyor.</p>
        </div>
      )}
    </div>
  )
}