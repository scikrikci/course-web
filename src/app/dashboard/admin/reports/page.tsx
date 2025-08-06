"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Award,
  Target,
  Download,
  Calendar,
  Filter,
  FileText,
  PieChart,
  LineChart
} from "lucide-react"

interface AdminUser {
  id: number
  username: string
  role: string
  level?: string
  name: string
  email: string
  avatar: string
}

interface StudentReport {
  id: number
  name: string
  class: string
  level: string
  attendance: number
  averageGrade: number
  completedAssignments: number
  totalAssignments: number
  progress: number
  lastActivity: string
}

interface ClassReport {
  id: string
  name: string
  teacher: string
  studentCount: number
  averageAttendance: number
  averageGrade: number
  completionRate: number
  activeSince: string
}

interface SystemMetrics {
  totalUsers: number
  activeUsers: number
  totalClasses: number
  activeClasses: number
  totalAssignments: number
  completedAssignments: number
  averageSessionTime: number
  systemUptime: number
}

// Mock data
const mockStudentReports: StudentReport[] = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    class: "İngilizce A1 - Grup 1",
    level: "A1",
    attendance: 92,
    averageGrade: 85,
    completedAssignments: 18,
    totalAssignments: 20,
    progress: 75,
    lastActivity: "2024-12-15T10:30:00"
  },
  {
    id: 2,
    name: "Fatma Kaya",
    class: "İngilizce B2 - Grup 1", 
    level: "B2",
    attendance: 88,
    averageGrade: 78,
    completedAssignments: 15,
    totalAssignments: 18,
    progress: 65,
    lastActivity: "2024-12-14T16:45:00"
  },
  {
    id: 3,
    name: "Mehmet Demir",
    class: "İngilizce A1 - Grup 1",
    level: "A1", 
    attendance: 76,
    averageGrade: 72,
    completedAssignments: 14,
    totalAssignments: 20,
    progress: 60,
    lastActivity: "2024-12-13T14:20:00"
  }
]

const mockClassReports: ClassReport[] = [
  {
    id: "class-1",
    name: "İngilizce A1 - Grup 1",
    teacher: "Fatma Kaya",
    studentCount: 28,
    averageAttendance: 87,
    averageGrade: 79,
    completionRate: 85,
    activeSince: "2024-09-01"
  },
  {
    id: "class-2",
    name: "İngilizce B2 - Grup 1", 
    teacher: "Ali Demir",
    studentCount: 22,
    averageAttendance: 91,
    averageGrade: 82,
    completionRate: 88,
    activeSince: "2024-10-01"
  }
]

const mockSystemMetrics: SystemMetrics = {
  totalUsers: 1247,
  activeUsers: 890,
  totalClasses: 45,
  activeClasses: 42,
  totalAssignments: 2340,
  completedAssignments: 1980,
  averageSessionTime: 45,
  systemUptime: 99.8
}

export default function ReportsPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState("last-month")
  const [selectedClass, setSelectedClass] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      const parsedUser: AdminUser = JSON.parse(userData)
      if (parsedUser.role !== 'admin') {
        router.push('/login')
        return
      }
      setCurrentUser(parsedUser)
    } else {
      router.push('/login')
    }
  }, [router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  const getPerformanceColor = (value: number, type: 'grade' | 'attendance' | 'progress') => {
    let thresholds = { good: 80, average: 60 }
    
    if (type === 'attendance') {
      thresholds = { good: 85, average: 70 }
    } else if (type === 'progress') {
      thresholds = { good: 75, average: 50 }
    }

    if (value >= thresholds.good) return "text-green-600"
    if (value >= thresholds.average) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (value: number, type: 'grade' | 'attendance' | 'progress') => {
    let thresholds = { good: 80, average: 60 }
    
    if (type === 'attendance') {
      thresholds = { good: 85, average: 70 }
    } else if (type === 'progress') {
      thresholds = { good: 75, average: 50 }
    }

    if (value >= thresholds.good) {
      return <Badge className="bg-green-100 text-green-800">Mükemmel</Badge>
    }
    if (value >= thresholds.average) {
      return <Badge className="bg-yellow-100 text-yellow-800">İyi</Badge>
    }
    return <Badge className="bg-red-100 text-red-800">Gelişmeli</Badge>
  }

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <div className="p-6">
      {/* Başlık */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Performans Raporları</h1>
        <p className="text-gray-600">
          Sistem performansını ve öğrenci başarısını analiz edin.
        </p>
      </div>

      {/* Filtreler */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Zaman aralığı" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Son Hafta</SelectItem>
                  <SelectItem value="last-month">Son Ay</SelectItem>
                  <SelectItem value="last-quarter">Son 3 Ay</SelectItem>
                  <SelectItem value="last-year">Son Yıl</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sınıf filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Sınıflar</SelectItem>
                  {mockClassReports.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button>
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Ana Metrikler */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Kullanıcı Oranı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((mockSystemMetrics.activeUsers / mockSystemMetrics.totalUsers) * 100)}%
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.2% geçen aya göre
            </div>
            <Progress 
              value={(mockSystemMetrics.activeUsers / mockSystemMetrics.totalUsers) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ödev Tamamlama</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((mockSystemMetrics.completedAssignments / mockSystemMetrics.totalAssignments) * 100)}%
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.1% geçen aya göre
            </div>
            <Progress 
              value={(mockSystemMetrics.completedAssignments / mockSystemMetrics.totalAssignments) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Oturum</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSystemMetrics.averageSessionTime}dk</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.3dk geçen aya göre
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Kullanıcı başına ortalama
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistem Sağlığı</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSystemMetrics.systemUptime}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              99.5%+ son 30 gün
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Sistem çalışma süresi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detaylı Raporlar */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Öğrenci Performansı</TabsTrigger>
          <TabsTrigger value="classes">Sınıf Analizi</TabsTrigger>
          <TabsTrigger value="engagement">Katılım Metrikleri</TabsTrigger>
          <TabsTrigger value="system">Sistem İstatistikleri</TabsTrigger>
        </TabsList>
        
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Öğrenci Performans Raporu</CardTitle>
              <CardDescription>
                Öğrencilerin akademik performansı ve sistem katılımı
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStudentReports.map((student) => (
                  <div key={student.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.class}</p>
                        <Badge variant="outline" className="mt-1">{student.level}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Son Aktivite</p>
                        <p className="text-xs">{formatDate(student.lastActivity)}</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className={`text-lg font-bold ${getPerformanceColor(student.averageGrade, 'grade')}`}>
                            {student.averageGrade}
                          </span>
                          <span className="text-sm text-gray-500">/100</span>
                        </div>
                        <p className="text-xs text-gray-600">Ortalama Not</p>
                        {getPerformanceBadge(student.averageGrade, 'grade')}
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className={`text-lg font-bold ${getPerformanceColor(student.attendance, 'attendance')}`}>
                            {student.attendance}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Devam Oranı</p>
                        {getPerformanceBadge(student.attendance, 'attendance')}
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-lg font-bold">
                            {student.completedAssignments}/{student.totalAssignments}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Tamamlanan Ödev</p>
                        <Progress 
                          value={(student.completedAssignments / student.totalAssignments) * 100} 
                          className="mt-1" 
                        />
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className={`text-lg font-bold ${getPerformanceColor(student.progress, 'progress')}`}>
                            {student.progress}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">Kurs İlerlemesi</p>
                        {getPerformanceBadge(student.progress, 'progress')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Sınıf Performans Analizi</CardTitle>
              <CardDescription>
                Sınıfların genel performansı ve karşılaştırmalı analiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClassReports.map((cls) => (
                  <div key={cls.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium">{cls.name}</h4>
                        <p className="text-sm text-gray-600">Öğretmen: {cls.teacher}</p>
                        <p className="text-sm text-gray-600">Öğrenci Sayısı: {cls.studentCount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Aktif Since</p>
                        <p className="text-xs">{formatDate(cls.activeSince)}</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {cls.averageAttendance}%
                        </div>
                        <p className="text-sm text-gray-600">Ortalama Devam</p>
                        <Progress value={cls.averageAttendance} className="mt-2" />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {cls.averageGrade}
                        </div>
                        <p className="text-sm text-gray-600">Ortalama Not</p>
                        <Progress value={cls.averageGrade} className="mt-2" />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {cls.completionRate}%
                        </div>
                        <p className="text-sm text-gray-600">Tamamlama Oranı</p>
                        <Progress value={cls.completionRate} className="mt-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Günlük Aktif Kullanıcılar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Bugün</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">342</span>
                      <Badge className="bg-green-100 text-green-800">+8.2%</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dün</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">316</span>
                      <Badge className="bg-yellow-100 text-yellow-800">-2.1%</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bu Hafta Ortalama</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">329</span>
                      <Badge className="bg-blue-100 text-blue-800">+5.7%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  En Başarılı Sınıflar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClassReports
                    .sort((a, b) => b.averageGrade - a.averageGrade)
                    .slice(0, 3)
                    .map((cls, index) => (
                    <div key={cls.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "outline"}>
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{cls.name}</span>
                      </div>
                      <span className="font-bold">{cls.averageGrade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="system">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Sistem Kullanım İstatistikleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Toplam Kullanıcı</span>
                    <span className="font-bold">{mockSystemMetrics.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Aktif Kullanıcı</span>
                    <span className="font-bold">{mockSystemMetrics.activeUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Toplam Sınıf</span>
                    <span className="font-bold">{mockSystemMetrics.totalClasses}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Aktif Sınıf</span>
                    <span className="font-bold">{mockSystemMetrics.activeClasses}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Performans Özeti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Sistem Sağlığı</span>
                      <span className="text-sm font-medium">{mockSystemMetrics.systemUptime}%</span>
                    </div>
                    <Progress value={mockSystemMetrics.systemUptime} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Ödev Tamamlama Oranı</span>
                      <span className="text-sm font-medium">
                        {Math.round((mockSystemMetrics.completedAssignments / mockSystemMetrics.totalAssignments) * 100)}%
                      </span>
                    </div>
                    <Progress value={(mockSystemMetrics.completedAssignments / mockSystemMetrics.totalAssignments) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Kullanıcı Aktivite Oranı</span>
                      <span className="text-sm font-medium">
                        {Math.round((mockSystemMetrics.activeUsers / mockSystemMetrics.totalUsers) * 100)}%
                      </span>
                    </div>
                    <Progress value={(mockSystemMetrics.activeUsers / mockSystemMetrics.totalUsers) * 100} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}