"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Building,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  UserPlus,
  Calendar,
  Clock,
  TrendingUp,
  BookOpen,
  Award,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import PageHeader from "@/components/layout/PageHeader"
import PageContainer from "@/components/layout/PageContainer"

interface AdminUser {
  id: number
  username: string
  role: string
  level?: string
  name: string
  email: string
  avatar: string
}

interface Teacher {
  id: number
  name: string
  email: string
  subject: string
}

interface Student {
  id: number
  name: string
  email: string
  level: string
  enrollmentDate: string
}

interface Class {
  id: string
  name: string
  level: string
  subject: string
  teacher: Teacher
  students: Student[]
  capacity: number
  startDate: string
  endDate: string
  schedule: string
  status: 'active' | 'inactive' | 'completed'
  description: string
  progress: number
}

// Mock data
const mockTeachers: Teacher[] = [
  {
    id: 1,
    name: "Fatma Kaya",
    email: "fatma@example.com",
    subject: "İngilizce"
  },
  {
    id: 2,
    name: "Ali Demir",
    email: "ali@example.com", 
    subject: "İngilizce"
  }
]

const mockClasses: Class[] = [
  {
    id: "class-1",
    name: "İngilizce A1 - Grup 1",
    level: "A1",
    subject: "İngilizce",
    teacher: mockTeachers[0],
    students: [
      {
        id: 1,
        name: "Ahmet Yılmaz",
        email: "ahmet@example.com",
        level: "A1",
        enrollmentDate: "2024-09-01"
      },
      {
        id: 2,
        name: "Mehmet Özkan",
        email: "mehmet@example.com", 
        level: "A1",
        enrollmentDate: "2024-09-01"
      }
    ],
    capacity: 30,
    startDate: "2024-09-01",
    endDate: "2024-12-31",
    schedule: "Pazartesi, Çarşamba, Cuma 10:00-12:00",
    status: "active",
    description: "Başlangıç seviyesi İngilizce kursu",
    progress: 65
  },
  {
    id: "class-2", 
    name: "İngilizce B2 - Grup 1",
    level: "B2",
    subject: "İngilizce",
    teacher: mockTeachers[1],
    students: [
      {
        id: 3,
        name: "Zeynep Kaya",
        email: "zeynep@example.com",
        level: "B2", 
        enrollmentDate: "2024-10-01"
      }
    ],
    capacity: 25,
    startDate: "2024-10-01",
    endDate: "2025-01-31",
    schedule: "Salı, Perşembe 14:00-16:00",
    status: "active",
    description: "Orta-üst seviye İngilizce kursu",
    progress: 40
  }
]

export default function ClassesPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [classes, setClasses] = useState<Class[]>(mockClasses)
  const [filteredClasses, setFilteredClasses] = useState<Class[]>(mockClasses)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

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

  // Filtreleme işlemi
  useEffect(() => {
    let filtered = classes

    if (searchTerm) {
      filtered = filtered.filter(cls => 
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter(cls => cls.level === levelFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(cls => cls.status === statusFilter)
    }

    setFilteredClasses(filtered)
  }, [classes, searchTerm, levelFilter, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case 'inactive':
        return <Badge className="bg-yellow-100 text-yellow-800">Pasif</Badge>
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Tamamlandı</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getLevelBadge = (level: string) => {
    const colors = {
      'A1': 'bg-green-100 text-green-800',
      'A2': 'bg-blue-100 text-blue-800',
      'B1': 'bg-yellow-100 text-yellow-800',
      'B2': 'bg-orange-100 text-orange-800',
      'C1': 'bg-red-100 text-red-800',
      'C2': 'bg-purple-100 text-purple-800'
    }
    return <Badge className={colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{level}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  const handleDeleteClass = (classId: string) => {
    setClasses(classes.filter(cls => cls.id !== classId))
    toast({
      title: "Sınıf silindi",
      description: "Sınıf başarıyla sistemden kaldırıldı.",
    })
  }

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <PageContainer>
      <PageHeader
        title="Sınıf Yönetimi"
        description="Sistemdeki tüm sınıfları görüntüleyip yönetin."
        breadcrumb={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Sınıflar" },
        ]}
      />

      {/* İstatistik Kartları */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sınıf</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 yeni sınıf bu ay
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Sınıf</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Şu anda eğitim veren
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Öğrenci</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((total, cls) => total + cls.students.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tüm sınıflarda kayıtlı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doluluk Oranı</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((classes.reduce((total, cls) => total + cls.students.length, 0) / 
              classes.reduce((total, cls) => total + cls.capacity, 0)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Ortalama kapasite kullanımı
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Araç Çubuğu */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Sınıf ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Seviye filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Seviyeler</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Durum filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Sınıf
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Yeni Sınıf Ekle</DialogTitle>
                  <DialogDescription>
                    Sisteme yeni bir sınıf ekleyin.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Sınıf Adı
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="level" className="text-right">
                      Seviye
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seviye seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1</SelectItem>
                        <SelectItem value="A2">A2</SelectItem>
                        <SelectItem value="B1">B1</SelectItem>
                        <SelectItem value="B2">B2</SelectItem>
                        <SelectItem value="C1">C1</SelectItem>
                        <SelectItem value="C2">C2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacher" className="text-right">
                      Öğretmen
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Öğretmen seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTeachers.map(teacher => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="capacity" className="text-right">
                      Kapasite
                    </Label>
                    <Input id="capacity" type="number" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsCreateModalOpen(false)}>
                    Kaydet
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Sınıf Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle>Sınıflar ({filteredClasses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sınıf Adı</TableHead>
                <TableHead>Öğretmen</TableHead>
                <TableHead>Seviye</TableHead>
                <TableHead>Öğrenci Sayısı</TableHead>
                <TableHead>İlerleme</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{cls.name}</div>
                      <div className="text-sm text-gray-500">{cls.subject}</div>
                      <div className="text-xs text-gray-400">{cls.schedule}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{cls.teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{cls.teacher.name}</div>
                        <div className="text-xs text-gray-500">{cls.teacher.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getLevelBadge(cls.level)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={getCapacityColor(cls.students.length, cls.capacity)}>
                        {cls.students.length}/{cls.capacity}
                      </span>
                      {cls.students.length >= cls.capacity * 0.9 && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={cls.progress} className="w-16" />
                      <span className="text-sm">{cls.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(cls.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedClass(cls)
                          setIsViewModalOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedClass(cls)
                          setIsEditModalOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClass(cls.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sınıf Detay Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Sınıf Detayları</DialogTitle>
          </DialogHeader>
          {selectedClass && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Genel Bilgiler</TabsTrigger>
                <TabsTrigger value="students">Öğrenciler</TabsTrigger>
                <TabsTrigger value="schedule">Program</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Sınıf Adı</Label>
                    <p className="mt-1 font-medium">{selectedClass.name}</p>
                  </div>
                  <div>
                    <Label>Seviye</Label>
                    <div className="mt-1">{getLevelBadge(selectedClass.level)}</div>
                  </div>
                  <div>
                    <Label>Öğretmen</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{selectedClass.teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{selectedClass.teacher.name}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Durum</Label>
                    <div className="mt-1">{getStatusBadge(selectedClass.status)}</div>
                  </div>
                  <div>
                    <Label>Başlangıç Tarihi</Label>
                    <p className="mt-1">{formatDate(selectedClass.startDate)}</p>
                  </div>
                  <div>
                    <Label>Bitiş Tarihi</Label>
                    <p className="mt-1">{formatDate(selectedClass.endDate)}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Program</Label>
                    <p className="mt-1">{selectedClass.schedule}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Açıklama</Label>
                    <p className="mt-1">{selectedClass.description}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>İlerleme</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Progress value={selectedClass.progress} className="flex-1" />
                      <span>{selectedClass.progress}%</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="students">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      Öğrenciler ({selectedClass.students.length}/{selectedClass.capacity})
                    </h3>
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Öğrenci Ekle
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Öğrenci</TableHead>
                        <TableHead>Seviye</TableHead>
                        <TableHead>Kayıt Tarihi</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedClass.students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getLevelBadge(student.level)}</TableCell>
                          <TableCell>{formatDate(student.enrollmentDate)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Ders Programı</h3>
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Haftalık Program
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{selectedClass.schedule}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Dönem Bilgileri
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          <div className="flex justify-between">
                            <span>Başlangıç:</span>
                            <span>{formatDate(selectedClass.startDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Bitiş:</span>
                            <span>{formatDate(selectedClass.endDate)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}