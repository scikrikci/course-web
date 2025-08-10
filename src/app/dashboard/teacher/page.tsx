"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, BarChart, Megaphone, Calendar } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import PageContainer from "@/components/layout/PageContainer"

interface User {
  id: number
  username: string
  role: string
  level?: string
  name: string
  email: string
  avatar: string
}

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null)
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
  }, [router])

  // Attendance kaldırıldı

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

    return (
    <PageContainer>
      <PageHeader
        title={`Hoş Geldin, ${user.name}!`}
        description="Öğretmen panelindesin. Sınıflarını yönet, ödevleri kontrol et."
        breadcrumb={[
          { label: "Öğretmen", href: "/dashboard/teacher" },
          { label: "Ana Sayfa" },
        ]}
      />

      {/* Hızlı Aksiyonlar */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card 
          className="border-l-4 border-l-green-500 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
          onClick={() => router.push('/dashboard/teacher/assignments')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 group-hover:text-green-700">Hızlı Ödev Ver</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600">Tüm sınıflara</p>
              </div>
              <FileText className="w-5 h-5 text-green-600 group-hover:text-green-700 group-hover:scale-110 transition-all" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="border-l-4 border-l-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
          onClick={() => router.push('/dashboard/teacher/announcements')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 group-hover:text-blue-700">Duyuru Yap</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600">Önemli bildirim</p>
              </div>
              <Megaphone className="w-5 h-5 text-blue-600 group-hover:text-blue-700 group-hover:scale-110 transition-all" />
            </div>
          </CardContent>
        </Card>
        
        {/* Yoklama hızlı aksiyon kaldırıldı */}
        
        <Card 
          className="border-l-4 border-l-orange-500 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
          onClick={() => router.push('/dashboard/teacher/grades')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 group-hover:text-orange-700">Not Girişi</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600">23 ödev bekliyor</p>
              </div>
              <BarChart className="w-5 h-5 text-orange-600 group-hover:text-orange-700 group-hover:scale-110 transition-all" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teacher Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Sınıflarım
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">9-A Sınıfı (İngilizce)</span>
                    <Badge className="bg-blue-100 text-blue-800">28 Öğrenci</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">9-B Sınıfı (İngilizce)</span>
                    <Badge className="bg-blue-100 text-blue-800">25 Öğrenci</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">10-A Sınıfı (İngilizce)</span>
                    <Badge className="bg-blue-100 text-blue-800">30 Öğrenci</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Kontrol Bekleyen Ödevler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">İngilizce Essay</p>
                      <p className="text-sm text-gray-600">9-A Sınıfı</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">15 Bekliyor</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Vocabulary Test</p>
                      <p className="text-sm text-gray-600">9-B Sınıfı</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">8 Bekliyor</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Grammar Quiz</p>
                      <p className="text-sm text-gray-600">10-A Sınıfı</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Tamamlandı</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-blue-600" />
                  Bu Hafta İstatistikleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Toplam Ders</span>
                    <Badge className="bg-blue-100 text-blue-800">12 Ders</Badge>
                  </div>
                  {/* Ortalama katılım kaldırıldı */}
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Yeni Öğrenci</span>
                    <Badge className="bg-purple-100 text-purple-800">3 Kişi</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

        {/* Devam özeti kaldırıldı */}

            {/* Öğrenci Hızlı Erişim */}
            <Card className="md:col-span-2 lg:col-span-3 border-l-4 border-l-indigo-500 min-h-96">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Öğrenci Listesi & Hızlı Not Girişi
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="grid gap-4 md:grid-cols-2 h-full">
                  <div className="space-y-3 flex flex-col h-full">
                    <h4 className="font-medium text-indigo-600">9-A Sınıfı - Aktif Öğrenciler</h4>
                    <div className="space-y-2 flex-1 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                      {[
                        { name: "Ahmet Yılmaz", lastGrade: 85, status: "present" },
                        { name: "Ayşe Kara", lastGrade: 92, status: "present" },
                        { name: "Mehmet Can", lastGrade: 78, status: "absent" },
                        { name: "Zeynep Öz", lastGrade: 88, status: "present" },
                        { name: "Ali Demir", lastGrade: 0, status: "missing_assignment" },
                        { name: "Fatma Şahin", lastGrade: 91, status: "present" },
                        { name: "Can Arslan", lastGrade: 73, status: "present" },
                        { name: "Elif Topal", lastGrade: 86, status: "present" },
                        { name: "Emre Kaya", lastGrade: 82, status: "absent" },
                        { name: "Selin Yurt", lastGrade: 94, status: "present" },
                        { name: "Burak Özen", lastGrade: 76, status: "present" },
                        { name: "Melike Tan", lastGrade: 89, status: "present" }
                      ].map((student, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              student.status === 'present' ? 'bg-green-500' : 
                              student.status === 'absent' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            <span className="text-sm font-medium text-gray-900">{student.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={student.lastGrade >= 80 ? "default" : student.lastGrade >= 60 ? "secondary" : "destructive"}>
                              {student.lastGrade > 0 ? student.lastGrade : "Not Ver"}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 text-xs px-2 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transform hover:scale-105 transition-all duration-200 active:scale-95"
                              onClick={() => {
                                alert(`${student.name} için not girişi açılıyor...`)
                                // TODO: Not girişi modal açılması
                              }}
                            >
                              Not Ver
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-orange-600">Bugünün Programı</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium">09:00 - 9-A İngilizce</span>
                          <p className="text-xs text-gray-600">Unit 5: Present Perfect</p>
                        </div>
                        <Badge variant="secondary">30 dk kaldı</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium">14:00 - 10-A İngilizce</span>
                          <p className="text-xs text-gray-600">Grammar Review</p>
                        </div>
                        <Badge variant="outline">5 saat kaldı</Badge>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-red-600 mt-4">Acil Durumlar</h4>
                    <div className="space-y-2">
                      <div className="border-l-4 border-l-red-500 pl-4 py-2 bg-red-50">
                        <p className="font-medium text-sm">23 Ödev Bekliyor</p>
                        <p className="text-xs text-gray-600">Not girişi için son 2 gün</p>
                      </div>
                      {/* Devamsızlık uyarısı kaldırıldı */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
      </div>
    </PageContainer>
  )
}