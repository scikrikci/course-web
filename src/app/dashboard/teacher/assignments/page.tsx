"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, FileText, Eye, Download, CheckCircle, Clock, AlertCircle, Plus, Filter, Calendar, Users, MessageSquare, Star } from "lucide-react"
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

interface Assignment {
  id: string
  title: string
  description: string
  className: string
  grade: string
  dueDate: string
  submittedCount: number
  totalStudents: number
  status: "active" | "overdue" | "completed"
  type: "essay" | "quiz" | "project" | "homework"
  maxScore: number
  createdDate: string
}

interface Submission {
  id: string
  assignmentId: string
  studentId: number
  studentName: string
  studentEmail: string
  submittedDate: string
  status: "submitted" | "graded" | "late" | "missing"
  score?: number
  maxScore: number
  feedback?: string
  fileUrl?: string
  submissionText?: string
}

export default function TeacherAssignments() {
  const [user, setUser] = useState<User | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [students, setStudents] = useState<{ id: number; name: string; className: string }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("assignments")
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    className: "",
    dueDate: "",
    type: "homework" as Assignment["type"],
    maxScore: 100,
    recipients: "all",
    selectedStudents: [] as number[],
    sendNotification: true,
    allowLateSubmission: true
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

    // Sample assignments data
    setAssignments([
      {
        id: "assign-001",
        title: "İngilizce Essay: My Future Plans",
        description: "100-150 kelimelik gelecek planları hakkında kompozisyon yazın",
        className: "9-A İngilizce",
        grade: "9",
        dueDate: "2024-02-15",
        submittedCount: 15,
        totalStudents: 28,
        status: "active",
        type: "essay",
        maxScore: 100,
        createdDate: "2024-01-20"
      },
      {
        id: "assign-002",
        title: "Vocabulary Test - Unit 5",
        description: "5. ünitenin kelime testı",
        className: "9-B İngilizce",
        grade: "9",
        dueDate: "2024-01-25",
        submittedCount: 8,
        totalStudents: 25,
        status: "overdue",
        type: "quiz",
        maxScore: 50,
        createdDate: "2024-01-15"
      },
      {
        id: "assign-003",
        title: "Grammar Exercise - Present Perfect",
        description: "Present Perfect konu çalışması",
        className: "10-A İngilizce",
        grade: "10",
        dueDate: "2024-01-20",
        submittedCount: 30,
        totalStudents: 30,
        status: "completed",
        type: "homework",
        maxScore: 75,
        createdDate: "2024-01-10"
      },
      {
        id: "assign-004",
        title: "Speaking Project: Introduce Yourself",
        description: "Kendini tanıtma videosu çek (2-3 dakika)",
        className: "9-A İngilizce",
        grade: "9",
        dueDate: "2024-02-20",
        submittedCount: 5,
        totalStudents: 28,
        status: "active",
        type: "project",
        maxScore: 100,
        createdDate: "2024-01-25"
      }
    ])

    // Sample students data
    setStudents([
      { id: 1, name: "Ahmet Yılmaz", className: "9-A İngilizce" },
      { id: 2, name: "Ayşe Kaya", className: "9-A İngilizce" },
      { id: 3, name: "Mehmet Demir", className: "9-A İngilizce" },
      { id: 4, name: "Fatma Özkan", className: "9-B İngilizce" },
      { id: 5, name: "Ali Şahin", className: "10-A İngilizce" },
      { id: 6, name: "Zeynep Arslan", className: "9-B İngilizce" },
      { id: 7, name: "Burak Yıldız", className: "9-B İngilizce" },
      { id: 8, name: "Elif Çelik", className: "9-B İngilizce" },
      { id: 9, name: "Emre Kıyak", className: "10-A İngilizce" },
      { id: 10, name: "Selin Mutlu", className: "10-A İngilizce" }
    ])

    // Sample submissions data
    setSubmissions([
      {
        id: "sub-001",
        assignmentId: "assign-001",
        studentId: 1,
        studentName: "Ahmet Yılmaz",
        studentEmail: "ahmet@example.com",
        submittedDate: "2024-02-12",
        status: "submitted",
        maxScore: 100,
        submissionText: "My future plans include becoming a software engineer and working for a global technology company..."
      },
      {
        id: "sub-002",
        assignmentId: "assign-001",
        studentId: 2,
        studentName: "Ayşe Kaya",
        studentEmail: "ayse@example.com",
        submittedDate: "2024-02-10",
        status: "graded",
        score: 92,
        maxScore: 100,
        feedback: "Excellent work! Good use of future tenses and vocabulary.",
        submissionText: "In the future, I want to study medicine and help people as a doctor..."
      },
      {
        id: "sub-003",
        assignmentId: "assign-002",
        studentId: 6,
        studentName: "Zeynep Arslan",
        studentEmail: "zeynep@example.com",
        submittedDate: "2024-01-26",
        status: "late",
        maxScore: 50,
        submissionText: "Vocabulary answers: 1-A, 2-C, 3-B..."
      }
    ])
  }, [router])

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSubmissionStatusColor = (status: Submission["status"]) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "graded":
        return "bg-green-100 text-green-800"
      case "late":
        return "bg-yellow-100 text-yellow-800"
      case "missing":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: Assignment["type"]) => {
    switch (type) {
      case "essay":
        return <FileText className="w-4 h-4" />
      case "quiz":
        return <CheckCircle className="w-4 h-4" />
      case "project":
        return <Star className="w-4 h-4" />
      case "homework":
        return <Clock className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.className.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || assignment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateAssignment = () => {
    const targetStudents = newAssignment.recipients === "all" 
      ? students.filter(s => s.className === newAssignment.className)
      : students.filter(s => newAssignment.selectedStudents.includes(s.id))

    const newAssign: Assignment = {
      id: `assign-${Date.now()}`,
      title: newAssignment.title,
      description: newAssignment.description,
      className: newAssignment.className,
      grade: newAssignment.className.split('-')[0],
      dueDate: newAssignment.dueDate,
      submittedCount: 0,
      totalStudents: targetStudents.length,
      status: "active",
      type: newAssignment.type,
      maxScore: newAssignment.maxScore,
      createdDate: new Date().toISOString().split('T')[0]
    }

    setAssignments(prev => [newAssign, ...prev])
    setNewAssignment({
      title: "",
      description: "",
      className: "",
      dueDate: "",
      type: "homework",
      maxScore: 100,
      recipients: "all",
      selectedStudents: [],
      sendNotification: true,
      allowLateSubmission: true
    })
    setIsCreateDialogOpen(false)
    
    const recipientText = newAssignment.recipients === "all" 
      ? `${newAssignment.className} sınıfındaki tüm öğrencilere`
      : `${targetStudents.length} seçili öğrenciye`
    
    toast({
      title: "Ödev Oluşturuldu",
      description: `Yeni ödev ${recipientText} gönderildi.`,
    })
  }

  const handleGradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status: "graded" as const, score, feedback }
        : sub
    ))
    
    toast({
      title: "Not Verildi",
      description: "Öğrenci ödevı başarıyla notlandırıldı.",
    })
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <div className="p-6">
      <Toaster />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Ödev Kontrolü</h1>
            <p className="text-gray-600">Ödevleri yönetin ve öğrenci çalışmalarını değerlendirin</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Ödev
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Yeni Ödev Oluştur</DialogTitle>
                <DialogDescription>
                  Öğrenciler için yeni bir ödev oluşturun
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Ödev Başlığı</Label>
                    <Input
                      id="title"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ödev başlığı"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Ödev Türü</Label>
                    <Select value={newAssignment.type} onValueChange={(value: Assignment["type"]) => setNewAssignment(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homework">Ev Ödevi</SelectItem>
                        <SelectItem value="essay">Kompozisyon</SelectItem>
                        <SelectItem value="quiz">Test/Quiz</SelectItem>
                        <SelectItem value="project">Proje</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Ödev hakkında detaylı açıklama..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="className">Sınıf</Label>
                    <Select value={newAssignment.className} onValueChange={(value) => setNewAssignment(prev => ({ ...prev, className: value }))}>
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
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Teslim Tarihi</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxScore">Maksimum Puan</Label>
                    <Input
                      id="maxScore"
                      type="number"
                      value={newAssignment.maxScore}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, maxScore: parseInt(e.target.value) || 100 }))}
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* Recipients Selection */}
                <div className="space-y-4">
                  <Label>Alıcılar</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="all-students"
                        name="recipients"
                        checked={newAssignment.recipients === "all"}
                        onChange={() => setNewAssignment(prev => ({ ...prev, recipients: "all", selectedStudents: [] }))}
                        className="rounded"
                      />
                      <Label htmlFor="all-students">Tüm Sınıf</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="selected-students"
                        name="recipients"
                        checked={newAssignment.recipients === "individual"}
                        onChange={() => setNewAssignment(prev => ({ ...prev, recipients: "individual" }))}
                        className="rounded"
                      />
                      <Label htmlFor="selected-students">Seçili Öğrenciler ({newAssignment.selectedStudents.length})</Label>
                    </div>
                  </div>

                  {newAssignment.recipients === "individual" && newAssignment.className && (
                    <div className="space-y-2">
                      <Label>Öğrenci Seç</Label>
                      <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
                        {students
                          .filter(student => student.className === newAssignment.className)
                          .map((student) => (
                            <div key={student.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`student-${student.id}`}
                                checked={newAssignment.selectedStudents.includes(student.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewAssignment(prev => ({
                                      ...prev,
                                      selectedStudents: [...prev.selectedStudents, student.id]
                                    }))
                                  } else {
                                    setNewAssignment(prev => ({
                                      ...prev,
                                      selectedStudents: prev.selectedStudents.filter(id => id !== student.id)
                                    }))
                                  }
                                }}
                                className="rounded"
                              />
                              <Label htmlFor={`student-${student.id}`} className="text-sm">
                                {student.name}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Options */}
                <div className="space-y-4">
                  <Label>Ek Seçenekler</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sendNotification">Bildirim Gönder</Label>
                        <p className="text-sm text-gray-600">Öğrencilere e-posta ve sistem bildirimi gönder</p>
                      </div>
                      <input
                        type="checkbox"
                        id="sendNotification"
                        checked={newAssignment.sendNotification}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, sendNotification: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="allowLateSubmission">Geç Teslime İzin Ver</Label>
                        <p className="text-sm text-gray-600">Son tarihten sonra teslim edilebilir</p>
                      </div>
                      <input
                        type="checkbox"
                        id="allowLateSubmission"
                        checked={newAssignment.allowLateSubmission}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, allowLateSubmission: e.target.checked }))}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreateAssignment} className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Ödev Oluştur
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    İptal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assignments">Ödevler</TabsTrigger>
          <TabsTrigger value="submissions">Teslim Edilenler</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Ödev ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="overdue">Süresi Geçmiş</SelectItem>
                <SelectItem value="completed">Tamamlanmış</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {assignments.filter(a => a.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">Aktif Ödev</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {assignments.filter(a => a.status === "overdue").length}
                </div>
                <div className="text-sm text-gray-600">Süresi Geçmiş</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {assignments.filter(a => a.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600">Tamamlanmış</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {submissions.filter(s => s.status === "submitted").length}
                </div>
                <div className="text-sm text-gray-600">Kontrol Bekliyor</div>
              </CardContent>
            </Card>
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {getTypeIcon(assignment.type)}
                        {assignment.title}
                      </CardTitle>
                      <CardDescription className="mt-2">{assignment.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status === "active" && "Aktif"}
                      {assignment.status === "overdue" && "Süresi Geçmiş"}
                      {assignment.status === "completed" && "Tamamlanmış"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Sınıf: </span>
                      <span className="font-medium">{assignment.className}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Teslim: </span>
                      <span className="font-medium">
                        {new Date(assignment.dueDate).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Gönderen: </span>
                      <span className="font-medium">
                        {assignment.submittedCount}/{assignment.totalStudents}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Maks. Puan: </span>
                      <span className="font-medium">{assignment.maxScore}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Oluşturma: </span>
                      <span className="font-medium">
                        {new Date(assignment.createdDate).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab("submissions")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Gönderilenleri Gör
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      Öğrenciler
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Duyuru Gönder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-6">
          {/* Submissions List */}
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {submission.studentName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{submission.studentName}</CardTitle>
                        <CardDescription>
                          {assignments.find(a => a.id === submission.assignmentId)?.title}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getSubmissionStatusColor(submission.status)}>
                        {submission.status === "submitted" && "Teslim Edildi"}
                        {submission.status === "graded" && "Notlandırıldı"}
                        {submission.status === "late" && "Geç Teslim"}
                        {submission.status === "missing" && "Eksik"}
                      </Badge>
                      {submission.score !== undefined && (
                        <div className="text-sm text-gray-600 mt-1">
                          {submission.score}/{submission.maxScore} puan
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      <strong>Teslim Tarihi:</strong> {new Date(submission.submittedDate).toLocaleDateString('tr-TR')}
                    </div>
                    
                    {submission.submissionText && (
                      <div>
                        <Label className="text-sm font-medium">Ödev İçeriği:</Label>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                          {submission.submissionText.length > 200 
                            ? `${submission.submissionText.substring(0, 200)}...`
                            : submission.submissionText
                          }
                        </div>
                      </div>
                    )}

                    {submission.feedback && (
                      <div>
                        <Label className="text-sm font-medium">Öğretmen Yorumu:</Label>
                        <div className="mt-1 p-3 bg-green-50 rounded-lg text-sm">
                          {submission.feedback}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {submission.status === "submitted" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Notlandır
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ödev Notlandır</DialogTitle>
                              <DialogDescription>
                                {submission.studentName} adlı öğrencinin ödevini notlandırın
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="score">Puan (Max: {submission.maxScore})</Label>
                                <Input
                                  id="score"
                                  type="number"
                                  min="0"
                                  max={submission.maxScore}
                                  placeholder="Puan girin"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="feedback">Yorum</Label>
                                <Textarea
                                  id="feedback"
                                  rows={3}
                                  placeholder="Öğrenci için yorumunuz..."
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleGradeSubmission(submission.id, 85, "İyi çalışma!")}
                                  className="flex-1"
                                >
                                  Notlandır
                                </Button>
                                <Button variant="outline">İptal</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        İndir
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
          {submissions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz teslim edilmiş ödev yok</h3>
              <p className="text-gray-600">Öğrenciler ödevlerini teslim ettiğinde burada görünecek.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}