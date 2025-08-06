"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, FileText, Upload, CheckCircle, AlertCircle, Star } from "lucide-react"

interface Assignment {
  id: number
  title: string
  course: string
  instructor: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded' | 'overdue'
  grade?: number
  maxGrade: number
  description: string
  type: 'essay' | 'problem' | 'project' | 'quiz'
  attachments?: string[]
}

export default function AssignmentsPage() {
  const [assignments] = useState<Assignment[]>([
    {
      id: 1,
      title: "İngilizce Essay: Environmental Issues",
      course: "İngilizce B1",
      instructor: "Ahmet Yılmaz",
      dueDate: "2024-12-15",
      status: "pending",
      maxGrade: 100,
      description: "Environmental issues hakkında 300 kelimelik essay yazınız. Climate change, pollution ve çözüm önerilerini içermelidir.",
      type: "essay",
      attachments: ["Essay Guidelines.pdf", "Rubric.pdf"]
    },
    {
      id: 2,
      title: "Matematik: Cebir Problemleri",
      course: "Matematik: Cebir",
      instructor: "Ayşe Demir",
      dueDate: "2024-12-18",
      status: "pending",
      maxGrade: 100,
      description: "Bölüm 3'teki 1-20 arası problemleri çözünüz. Her adımı göstermeyi unutmayın.",
      type: "problem",
      attachments: ["Algebra Problems Set 3.pdf"]
    },
    {
      id: 3,
      title: "Fizik: Mekanik Projesi",
      course: "Fen Bilgisi: Fizik",
      instructor: "Mehmet Kaya",
      dueDate: "2024-12-10",
      status: "overdue",
      maxGrade: 100,
      description: "Basit makineler hakkında bir proje hazırlayın. Teorik açıklama ve pratik örnek içermelidir.",
      type: "project"
    },
    {
      id: 4,
      title: "İngilizce Vocabulary Quiz",
      course: "İngilizce B1",
      instructor: "Ahmet Yılmaz",
      dueDate: "2024-12-08",
      status: "graded",
      grade: 85,
      maxGrade: 100,
      description: "Unit 5 vocabulary kelimeleri üzerinden online quiz.",
      type: "quiz"
    },
    {
      id: 5,
      title: "Matematik: İlk Değerlendirme",
      course: "Matematik: Cebir",
      instructor: "Ayşe Demir",
      dueDate: "2024-12-05",
      status: "graded",
      grade: 92,
      maxGrade: 100,
      description: "Cebir konularını kapsayan değerlendirme sınavı.",
      type: "problem"
    }
  ])

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [submissionText, setSubmissionText] = useState("")
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800'
      case 'graded':
        return 'bg-green-100 text-green-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor'
      case 'submitted':
        return 'Teslim Edildi'
      case 'graded':
        return 'Notlandırıldı'
      case 'overdue':
        return 'Süresi Geçti'
      default:
        return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'essay':
        return <FileText className="w-4 h-4" />
      case 'problem':
        return <FileText className="w-4 h-4" />
      case 'project':
        return <FileText className="w-4 h-4" />
      case 'quiz':
        return <Star className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'essay':
        return 'Essay'
      case 'problem':
        return 'Problem Çözümü'
      case 'project':
        return 'Proje'
      case 'quiz':
        return 'Quiz'
      default:
        return type
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleSubmit = () => {
    if (!selectedAssignment) return
    
    // Simulate submission
    alert('Ödev başarıyla teslim edildi!')
    setSelectedAssignment(null)
    setSubmissionText("")
    setSubmissionFile(null)
  }

  const pendingAssignments = assignments.filter(a => a.status === 'pending' || a.status === 'overdue')
  const completedAssignments = assignments.filter(a => a.status === 'graded')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ödevler</h1>
        <p className="text-gray-600">Ödevlerinizi görüntüleyin ve teslim edin</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Bekleyen Ödevler ({pendingAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Tamamlanan ({completedAssignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {selectedAssignment ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedAssignment.title}</CardTitle>
                    <CardDescription>{selectedAssignment.course} - {selectedAssignment.instructor}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(selectedAssignment.status)}>
                    {getStatusLabel(selectedAssignment.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Son Teslim: {selectedAssignment.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {isOverdue(selectedAssignment.dueDate) 
                        ? 'Süresi geçmiş' 
                        : `${getDaysUntilDue(selectedAssignment.dueDate)} gün kaldı`
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedAssignment.type)}
                    <span className="text-sm">{getTypeLabel(selectedAssignment.type)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Max Not: {selectedAssignment.maxGrade}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Ödev Açıklaması</h4>
                  <p className="text-gray-600">{selectedAssignment.description}</p>
                </div>

                {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Ekli Dosyalar</h4>
                    <div className="space-y-2">
                      {selectedAssignment.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{attachment}</span>
                          <Button variant="outline" size="sm">İndir</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="submission">Ödev Cevabı</Label>
                    <Textarea
                      id="submission"
                      placeholder="Ödevinizi buraya yazın..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      className="min-h-32"
                    />
                  </div>

                  <div>
                    <Label htmlFor="file">Dosya Yükle (Opsiyonel)</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSubmit} className="flex-1">
                      <Upload className="w-4 h-4 mr-2" />
                      Teslim Et
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
                      İptal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingAssignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription>{assignment.course} - {assignment.instructor}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(assignment.status)}>
                        {getStatusLabel(assignment.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{assignment.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(assignment.type)}
                          <span>{getTypeLabel(assignment.type)}</span>
                        </div>
                        {assignment.status === 'overdue' && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span>Süresi geçmiş</span>
                          </div>
                        )}
                      </div>
                      <Button onClick={() => setSelectedAssignment(assignment)}>
                        {assignment.status === 'overdue' ? 'Hemen Teslim Et' : 'Başla'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {completedAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription>{assignment.course} - {assignment.instructor}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(assignment.status)}>
                        {getStatusLabel(assignment.status)}
                      </Badge>
                      {assignment.grade !== undefined && (
                        <Badge className="bg-green-100 text-green-800">
                          {assignment.grade}/{assignment.maxGrade}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Teslim: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(assignment.type)}
                        <span>{getTypeLabel(assignment.type)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-600 font-medium">Tamamlandı</span>
                    </div>
                  </div>
                  
                  {assignment.grade !== undefined && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Notunuz</span>
                        <span className="text-sm">{assignment.grade}/{assignment.maxGrade}</span>
                      </div>
                      <Progress value={(assignment.grade / assignment.maxGrade) * 100} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}