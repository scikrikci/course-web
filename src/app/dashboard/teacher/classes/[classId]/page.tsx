"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { ArrowLeft, Users, MessageSquare, FileText, Calendar, BarChart, Send, Plus, Settings, Upload, Download, Eye, Share2, Clock, Trophy, Target } from "lucide-react"
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

interface Student {
  id: number
  name: string
  email: string
  attendance: number
  lastActivity: string
  grade: string
  status: "active" | "inactive" | "attention"
}

interface ClassMessage {
  id: string
  type: "announcement" | "assignment" | "material" | "reminder"
  title: string
  content: string
  author: string
  timestamp: string
  recipients: "all" | "individual" | "group"
  recipientIds?: number[]
  isRead: boolean
  priority: "low" | "medium" | "high"
}

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  submittedCount: number
  totalStudents: number
  type: "homework" | "project" | "quiz"
  status: "active" | "overdue" | "completed"
}

export default function TeacherClassDetail() {
  const [user, setUser] = useState<User | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [messages, setMessages] = useState<ClassMessage[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false)
  const [newMessage, setNewMessage] = useState({
    type: "announcement",
    title: "",
    content: "",
    recipients: "all",
    priority: "medium"
  })
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    type: "homework",
    recipients: "all"
  })
  
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const classId = params.classId as string

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

    // Sample class data based on classId
    const classData = {
      "9a-eng": {
        students: [
          { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com", attendance: 95, lastActivity: "2 saat önce", grade: "85", status: "active" as const },
          { id: 2, name: "Ayşe Kaya", email: "ayse@example.com", attendance: 92, lastActivity: "1 gün önce", grade: "92", status: "active" as const },
          { id: 3, name: "Mehmet Demir", email: "mehmet@example.com", attendance: 88, lastActivity: "3 saat önce", grade: "78", status: "attention" as const },
          { id: 4, name: "Fatma Özkan", email: "fatma@example.com", attendance: 98, lastActivity: "30 dk önce", grade: "96", status: "active" as const },
          { id: 5, name: "Ali Şahin", email: "ali@example.com", attendance: 85, lastActivity: "2 gün önce", grade: "82", status: "inactive" as const }
        ],
        messages: [
          {
            id: "msg-1",
            type: "announcement" as const,
            title: "Dönem Sonu Sınavı",
            content: "15 Aralık'ta yapılacak dönem sonu sınavına hazırlanın.",
            author: "Sarah Johnson",
            timestamp: "2024-01-20T10:30:00Z",
            recipients: "all" as const,
            isRead: false,
            priority: "high" as const
          }
        ],
        assignments: [
          {
            id: "assign-1",
            title: "Present Perfect Essay",
            description: "100-150 kelimelik kompozisyon",
            dueDate: "2024-02-15",
            submittedCount: 15,
            totalStudents: 28,
            type: "homework" as const,
            status: "active" as const
          }
        ]
      }
    }

    const currentClassData = classData[classId as keyof typeof classData] || classData["9a-eng"]
    setStudents(currentClassData.students)
    setMessages(currentClassData.messages)
    setAssignments(currentClassData.assignments)
  }, [router, classId])

  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100"
      case "inactive":
        return "text-gray-600 bg-gray-100"
      case "attention":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusText = (status: Student["status"]) => {
    switch (status) {
      case "active":
        return "Aktif"
      case "inactive":
        return "Pasif"
      case "attention":
        return "Dikkat"
      default:
        return "Bilinmiyor"
    }
  }

  const handleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const sendMessage = () => {
    const message: ClassMessage = {
      id: `msg-${Date.now()}`,
      type: newMessage.type as any,
      title: newMessage.title,
      content: newMessage.content,
      author: user?.name || "Öğretmen",
      timestamp: new Date().toISOString(),
      recipients: newMessage.recipients as any,
      recipientIds: newMessage.recipients === "individual" ? selectedStudents : undefined,
      isRead: false,
      priority: newMessage.priority as any
    }

    setMessages(prev => [message, ...prev])
    setNewMessage({
      type: "announcement",
      title: "",
      content: "",
      recipients: "all",
      priority: "medium"
    })
    setSelectedStudents([])
    setIsMessageDialogOpen(false)

    toast({
      title: "Mesaj Gönderildi",
      description: `${newMessage.recipients === "all" ? "Tüm öğrencilere" : `${selectedStudents.length} öğrenciye`} mesaj gönderildi.`,
    })
  }

  const createAssignment = () => {
    const assignment: Assignment = {
      id: `assign-${Date.now()}`,
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
      submittedCount: 0,
      totalStudents: students.length,
      type: newAssignment.type as any,
      status: "active"
    }

    setAssignments(prev => [assignment, ...prev])
    setNewAssignment({
      title: "",
      description: "",
      dueDate: "",
      type: "homework",
      recipients: "all"
    })
    setIsAssignmentDialogOpen(false)

    toast({
      title: "Ödev Oluşturuldu",
      description: "Yeni ödev başarıyla oluşturuldu ve öğrencilere gönderildi.",
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push("/dashboard/teacher/classes")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sınıflara Dön
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">9-A İngilizce Sınıfı</h1>
            <p className="text-gray-600">Sınıf yönetimi ve öğrenci takip sistemi</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Mesaj Gönder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sınıfa Mesaj Gönder</DialogTitle>
                  <DialogDescription>
                    Öğrencilerinize duyuru, hatırlatma veya özel mesaj gönderin
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="messageType">Mesaj Türü</Label>
                      <Select value={newMessage.type} onValueChange={(value) => setNewMessage(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="announcement">Duyuru</SelectItem>
                          <SelectItem value="reminder">Hatırlatma</SelectItem>
                          <SelectItem value="material">Materyal Paylaşımı</SelectItem>
                          <SelectItem value="assignment">Ödev Bildirimi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Öncelik</Label>
                      <Select value={newMessage.priority} onValueChange={(value) => setNewMessage(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Düşük</SelectItem>
                          <SelectItem value="medium">Orta</SelectItem>
                          <SelectItem value="high">Yüksek</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="messageTitle">Başlık</Label>
                    <Input
                      id="messageTitle"
                      value={newMessage.title}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Mesaj başlığı"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="messageContent">İçerik</Label>
                    <Textarea
                      id="messageContent"
                      rows={4}
                      value={newMessage.content}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Mesaj içeriği..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipients">Alıcılar</Label>
                    <Select value={newMessage.recipients} onValueChange={(value) => setNewMessage(prev => ({ ...prev, recipients: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Sınıf</SelectItem>
                        <SelectItem value="individual">Seçili Öğrenciler</SelectItem>
                        <SelectItem value="group">Grup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newMessage.recipients === "individual" && (
                    <div className="space-y-2">
                      <Label>Öğrenci Seç ({selectedStudents.length} seçili)</Label>
                      <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1">
                        {students.map((student) => (
                          <div key={student.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`student-${student.id}`}
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => handleStudentSelection(student.id)}
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

                  <div className="flex gap-3 pt-4">
                    <Button onClick={sendMessage} className="flex-1" disabled={!newMessage.title || !newMessage.content}>
                      <Send className="w-4 h-4 mr-2" />
                      Mesaj Gönder
                    </Button>
                    <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                      İptal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Ödev Ver
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Ödev Oluştur</DialogTitle>
                  <DialogDescription>
                    Sınıfınız için yeni ödev oluşturun
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignmentTitle">Ödev Başlığı</Label>
                    <Input
                      id="assignmentTitle"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ödev başlığı"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignmentDescription">Açıklama</Label>
                    <Textarea
                      id="assignmentDescription"
                      rows={4}
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Ödev detayları ve talimatları..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignmentType">Ödev Türü</Label>
                      <Select value={newAssignment.type} onValueChange={(value) => setNewAssignment(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="homework">Ev Ödevi</SelectItem>
                          <SelectItem value="project">Proje</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
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
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={createAssignment} className="flex-1" disabled={!newAssignment.title || !newAssignment.description}>
                      <Plus className="w-4 h-4 mr-2" />
                      Ödev Oluştur
                    </Button>
                    <Button variant="outline" onClick={() => setIsAssignmentDialogOpen(false)}>
                      İptal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="students">Öğrenciler</TabsTrigger>
          <TabsTrigger value="messages">Mesajlar</TabsTrigger>
          <TabsTrigger value="assignments">Ödevler</TabsTrigger>
          <TabsTrigger value="analytics">İstatistikler</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Class Stats */}
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
                  {Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)}%
                </div>
                <div className="text-sm text-gray-600">Ortalama Devam</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(students.reduce((acc, s) => acc + parseInt(s.grade), 0) / students.length)}
                </div>
                <div className="text-sm text-gray-600">Sınıf Ortalaması</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {assignments.filter(a => a.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">Aktif Ödev</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Son Aktiviteler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.slice(0, 3).map((message) => (
                  <div key={message.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{message.title}</h4>
                      <p className="text-sm text-gray-600">{message.content.substring(0, 100)}...</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{message.type}</Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* Student List */}
          <Card>
            <CardHeader>
              <CardTitle>Öğrenci Listesi</CardTitle>
              <CardDescription>
                Sınıfınızdaki tüm öğrenciler ve performans durumları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-xs text-gray-500">Son aktivite: {student.lastActivity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-sm font-medium">%{student.attendance}</div>
                        <div className="text-xs text-gray-500">Devam</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{student.grade}</div>
                        <div className="text-xs text-gray-500">Not</div>
                      </div>
                      <Badge className={getStatusColor(student.status)}>
                        {getStatusText(student.status)}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Mesaj
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Sınıf Mesajları</CardTitle>
              <CardDescription>
                Gönderilen duyurular ve mesajlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{message.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{message.type}</Badge>
                        <Badge className={message.priority === "high" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}>
                          {message.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{message.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Gönderen: {message.author}</span>
                      <span>{new Date(message.timestamp).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          {/* Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Sınıf Ödevleri</CardTitle>
              <CardDescription>
                Verilen ödevler ve teslim durumları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{assignment.title}</h4>
                      <Badge className={assignment.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{assignment.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Teslim: {assignment.submittedCount}/{assignment.totalStudents} öğrenci
                      </div>
                      <div className="text-sm text-gray-600">
                        Son tarih: {new Date(assignment.dueDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Sınıf İstatistikleri</CardTitle>
              <CardDescription>
                Detaylı performans analizi ve raporlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">İstatistikler Hazırlanıyor</h3>
                <p className="text-gray-600">Detaylı analiz raporları yakında eklenecek.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}