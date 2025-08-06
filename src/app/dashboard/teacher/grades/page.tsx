"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, BarChart, Plus, Edit, Download, Upload, Filter, TrendingUp, Users, FileSpreadsheet, Calculator } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface User {
  id: number
  username: string
  role: string
  name: string
  email: string
  avatar: string
}

interface Grade {
  id: string
  studentId: number
  studentName: string
  className: string
  examType: string
  subject: string
  score: number
  maxScore: number
  date: string
  weight: number
  notes?: string
}

interface Student {
  id: number
  name: string
  email: string
  className: string
  average: number
  grades: Grade[]
  attendance: number
}

export default function TeacherGrades() {
  const [user, setUser] = useState<User | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState("all")
  const [filterExamType, setFilterExamType] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddGradeDialogOpen, setIsAddGradeDialogOpen] = useState(false)
  const [newGrade, setNewGrade] = useState({
    studentId: "",
    className: "",
    examType: "",
    score: "",
    maxScore: "100",
    weight: "1",
    notes: ""
  })
  const router = useRouter()
  const { toast } = useToast()

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

    // Sample grades data
    const sampleGrades: Grade[] = [
      {
        id: "g1",
        studentId: 1,
        studentName: "Ahmet Yılmaz",
        className: "9-A İngilizce",
        examType: "Yazılı Sınav",
        subject: "İngilizce",
        score: 85,
        maxScore: 100,
        date: "2024-01-15",
        weight: 3,
        notes: "Present Perfect konusunda başarılı"
      },
      {
        id: "g2",
        studentId: 1,
        studentName: "Ahmet Yılmaz",
        className: "9-A İngilizce",
        examType: "Quiz",
        subject: "İngilizce",
        score: 92,
        maxScore: 100,
        date: "2024-01-20",
        weight: 1
      },
      {
        id: "g3",
        studentId: 2,
        studentName: "Ayşe Kaya",
        className: "9-A İngilizce",
        examType: "Yazılı Sınav",
        subject: "İngilizce",
        score: 96,
        maxScore: 100,
        date: "2024-01-15",
        weight: 3,
        notes: "Mükemmel performans"
      },
      {
        id: "g4",
        studentId: 3,
        studentName: "Mehmet Demir",
        className: "9-A İngilizce",
        examType: "Ödev",
        subject: "İngilizce",
        score: 78,
        maxScore: 100,
        date: "2024-01-18",
        weight: 2
      }
    ]

    setGrades(sampleGrades)

    // Calculate student averages
    const studentData: Student[] = [
      { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com", className: "9-A İngilizce", average: 0, grades: [], attendance: 95 },
      { id: 2, name: "Ayşe Kaya", email: "ayse@example.com", className: "9-A İngilizce", average: 0, grades: [], attendance: 98 },
      { id: 3, name: "Mehmet Demir", email: "mehmet@example.com", className: "9-A İngilizce", average: 0, grades: [], attendance: 88 },
      { id: 4, name: "Fatma Özkan", email: "fatma@example.com", className: "9-B İngilizce", average: 0, grades: [], attendance: 92 },
      { id: 5, name: "Ali Şahin", email: "ali@example.com", className: "10-A İngilizce", average: 0, grades: [], attendance: 90 }
    ]

    // Group grades by student and calculate averages
    studentData.forEach(student => {
      const studentGrades = sampleGrades.filter(g => g.studentId === student.id)
      student.grades = studentGrades
      
      if (studentGrades.length > 0) {
        const totalWeightedScore = studentGrades.reduce((sum, grade) => 
          sum + (grade.score / grade.maxScore * 100) * grade.weight, 0
        )
        const totalWeight = studentGrades.reduce((sum, grade) => sum + grade.weight, 0)
        student.average = Math.round(totalWeightedScore / totalWeight)
      }
    })

    setStudents(studentData)
  }, [router])

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = filterClass === "all" || student.className === filterClass
    return matchesSearch && matchesClass
  })

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = filterClass === "all" || grade.className === filterClass
    const matchesExamType = filterExamType === "all" || grade.examType === filterExamType
    return matchesSearch && matchesClass && matchesExamType
  })

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-100"
    if (percentage >= 80) return "text-blue-600 bg-blue-100"
    if (percentage >= 70) return "text-yellow-600 bg-yellow-100"
    if (percentage >= 60) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }

  const handleAddGrade = () => {
    const grade: Grade = {
      id: `g-${Date.now()}`,
      studentId: parseInt(newGrade.studentId),
      studentName: students.find(s => s.id === parseInt(newGrade.studentId))?.name || "",
      className: newGrade.className,
      examType: newGrade.examType,
      subject: "İngilizce",
      score: parseInt(newGrade.score),
      maxScore: parseInt(newGrade.maxScore),
      date: new Date().toISOString().split('T')[0],
      weight: parseInt(newGrade.weight),
      notes: newGrade.notes
    }

    setGrades(prev => [grade, ...prev])
    
    // Update student average
    setStudents(prev => prev.map(student => {
      if (student.id === grade.studentId) {
        const updatedGrades = [grade, ...student.grades]
        const totalWeightedScore = updatedGrades.reduce((sum, g) => 
          sum + (g.score / g.maxScore * 100) * g.weight, 0
        )
        const totalWeight = updatedGrades.reduce((sum, g) => sum + g.weight, 0)
        const average = Math.round(totalWeightedScore / totalWeight)
        
        return { ...student, grades: updatedGrades, average }
      }
      return student
    }))

    setNewGrade({
      studentId: "",
      className: "",
      examType: "",
      score: "",
      maxScore: "100",
      weight: "1",
      notes: ""
    })
    setIsAddGradeDialogOpen(false)
    
    toast({
      title: "Not Eklendi",
      description: "Öğrenci notu başarıyla eklendi.",
    })
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Not Yönetimi</h1>
            <p className="text-gray-600">Öğrenci notlarını görüntüleyin ve yönetin</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Dışa Aktar
            </Button>
            <Dialog open={isAddGradeDialogOpen} onOpenChange={setIsAddGradeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Not Ekle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Not Ekle</DialogTitle>
                  <DialogDescription>
                    Öğrenci için yeni not girin
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Öğrenci</Label>
                      <Select value={newGrade.studentId} onValueChange={(value) => setNewGrade(prev => ({ ...prev, studentId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map(student => (
                            <SelectItem key={student.id} value={student.id.toString()}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="className">Sınıf</Label>
                      <Select value={newGrade.className} onValueChange={(value) => setNewGrade(prev => ({ ...prev, className: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9-A İngilizce">9-A İngilizce</SelectItem>
                          <SelectItem value="9-B İngilizce">9-B İngilizce</SelectItem>
                          <SelectItem value="10-A İngilizce">10-A İngilizce</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examType">Sınav Türü</Label>
                    <Select value={newGrade.examType} onValueChange={(value) => setNewGrade(prev => ({ ...prev, examType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yazılı Sınav">Yazılı Sınav</SelectItem>
                        <SelectItem value="Quiz">Quiz</SelectItem>
                        <SelectItem value="Ödev">Ödev</SelectItem>
                        <SelectItem value="Proje">Proje</SelectItem>
                        <SelectItem value="Sözlü Sınav">Sözlü Sınav</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="score">Alınan Puan</Label>
                      <Input
                        id="score"
                        type="number"
                        value={newGrade.score}
                        onChange={(e) => setNewGrade(prev => ({ ...prev, score: e.target.value }))}
                        placeholder="85"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxScore">Maksimum Puan</Label>
                      <Input
                        id="maxScore"
                        type="number"
                        value={newGrade.maxScore}
                        onChange={(e) => setNewGrade(prev => ({ ...prev, maxScore: e.target.value }))}
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Ağırlık</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={newGrade.weight}
                        onChange={(e) => setNewGrade(prev => ({ ...prev, weight: e.target.value }))}
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notlar (İsteğe bağlı)</Label>
                    <Input
                      id="notes"
                      value={newGrade.notes}
                      onChange={(e) => setNewGrade(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Ek notlar..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleAddGrade} className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Not Ekle
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddGradeDialogOpen(false)}>
                      İptal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Öğrenci ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Sınıflar</SelectItem>
              <SelectItem value="9-A İngilizce">9-A İngilizce</SelectItem>
              <SelectItem value="9-B İngilizce">9-B İngilizce</SelectItem>
              <SelectItem value="10-A İngilizce">10-A İngilizce</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterExamType} onValueChange={setFilterExamType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Sınav Türleri</SelectItem>
              <SelectItem value="Yazılı Sınav">Yazılı Sınav</SelectItem>
              <SelectItem value="Quiz">Quiz</SelectItem>
              <SelectItem value="Ödev">Ödev</SelectItem>
              <SelectItem value="Proje">Proje</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="students">Öğrenci Detayları</TabsTrigger>
          <TabsTrigger value="grades">Not Listesi</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                <div className="text-sm text-gray-600">Toplam Öğrenci</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(students.reduce((acc, s) => acc + s.average, 0) / students.length) || 0}
                </div>
                <div className="text-sm text-gray-600">Sınıf Ortalaması</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{grades.length}</div>
                <div className="text-sm text-gray-600">Toplam Not</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {students.filter(s => s.average >= 85).length}
                </div>
                <div className="text-sm text-gray-600">Başarılı Öğrenci</div>
              </CardContent>
            </Card>
          </div>

          {/* Top Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                En Başarılı Öğrenciler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students
                  .sort((a, b) => b.average - a.average)
                  .slice(0, 5)
                  .map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 font-bold">
                          {index + 1}
                        </div>
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.className}</p>
                        </div>
                      </div>
                      <Badge className={getGradeColor(student.average)}>
                        {student.average}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* Students List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>{student.className}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ortalama: </span>
                      <Badge className={getGradeColor(student.average)}>
                        {student.average || "N/A"}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Devam: </span>
                      <span className="font-medium">%{student.attendance}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Not Sayısı: </span>
                      <span className="font-medium">{student.grades.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Durum: </span>
                      <Badge variant={student.average >= 60 ? "default" : "destructive"}>
                        {student.average >= 60 ? "Başarılı" : "Risk"}
                      </Badge>
                    </div>
                  </div>

                  {student.grades.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Son Notlar:</h4>
                      <div className="space-y-1">
                        {student.grades.slice(0, 3).map((grade) => (
                          <div key={grade.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{grade.examType}</span>
                            <Badge className={getGradeColor((grade.score / grade.maxScore) * 100)}>
                              {grade.score}/{grade.maxScore}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transform hover:scale-105 transition-all duration-200 active:scale-95"
                    onClick={() => {
                      alert(`${filteredStudents.find(s => s.id === student.id)?.name} öğrencisinin detaylı not bilgileri açılıyor...`)
                      // TODO: Öğrenci detay sayfasına yönlendirme
                    }}
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Detayları Gör
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          {/* Grades Table */}
          <Card>
            <CardHeader>
              <CardTitle>Not Listesi</CardTitle>
              <CardDescription>
                Tüm notlar ve detayları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Öğrenci</th>
                      <th className="text-left p-2">Sınıf</th>
                      <th className="text-left p-2">Sınav Türü</th>
                      <th className="text-center p-2">Puan</th>
                      <th className="text-center p-2">Yüzde</th>
                      <th className="text-center p-2">Ağırlık</th>
                      <th className="text-left p-2">Tarih</th>
                      <th className="text-center p-2">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrades.map((grade) => (
                      <tr key={grade.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {grade.studentName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {grade.studentName}
                          </div>
                        </td>
                        <td className="p-2">{grade.className}</td>
                        <td className="p-2">{grade.examType}</td>
                        <td className="text-center p-2">
                          {grade.score}/{grade.maxScore}
                        </td>
                        <td className="text-center p-2">
                          <Badge className={getGradeColor((grade.score / grade.maxScore) * 100)}>
                            {Math.round((grade.score / grade.maxScore) * 100)}%
                          </Badge>
                        </td>
                        <td className="text-center p-2">{grade.weight}x</td>
                        <td className="p-2">
                          {new Date(grade.date).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="text-center p-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transform hover:scale-110 transition-all duration-200 active:scale-95"
                            onClick={() => {
                              alert(`${grade.studentName} öğrencisinin ${grade.examType} notunu düzenleme açılıyor...`)
                              // TODO: Not düzenleme modal açılması
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredGrades.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Not bulunamadı</h3>
                  <p className="text-gray-600">Filtrelere uygun not bulunmuyor.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}