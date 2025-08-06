"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Edit, Trash2, Eye, Play, Copy, Share, PlusCircle, CheckCircle, X, Clock, FileText } from "lucide-react"
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

interface QuizQuestion {
  id: string
  type: "multiple-choice" | "true-false" | "fill-blank" | "short-answer"
  question: string
  options?: string[]
  correctAnswer: string | number
  points: number
  explanation?: string
}

interface Quiz {
  id: string
  title: string
  description: string
  subject: string
  grade: string
  duration: number // minutes
  totalPoints: number
  questionsCount: number
  questions: QuizQuestion[]
  createdDate: string
  isPublished: boolean
  isTimeLimited: boolean
  showResults: boolean
  randomizeQuestions: boolean
  attemptsAllowed: number
  passScore: number
  targetClasses: string[]
  status: "draft" | "published" | "completed"
  attempts: number
}

export default function TeacherQuizCreator() {
  const [user, setUser] = useState<User | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [activeTab, setActiveTab] = useState("my-quizzes")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [newQuiz, setNewQuiz] = useState<Partial<Quiz>>({
    title: "",
    description: "",
    subject: "İngilizce",
    grade: "",
    duration: 30,
    isTimeLimited: true,
    showResults: true,
    randomizeQuestions: false,
    attemptsAllowed: 1,
    passScore: 60,
    targetClasses: [],
    questions: []
  })
  const [newQuestion, setNewQuestion] = useState<Partial<QuizQuestion>>({
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 10,
    explanation: ""
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

    // Sample quiz data
    setQuizzes([
      {
        id: "quiz-001",
        title: "Unit 5: Present Perfect Quiz",
        description: "Present Perfect tense konusunda 20 soruluk test",
        subject: "İngilizce",
        grade: "9",
        duration: 30,
        totalPoints: 100,
        questionsCount: 10,
        questions: [
          {
            id: "q1",
            type: "multiple-choice",
            question: "I ____ never ____ to Paris.",
            options: ["has / been", "have / been", "had / been", "will / be"],
            correctAnswer: 1,
            points: 10,
            explanation: "Present Perfect tense: Subject + have/has + past participle"
          }
        ],
        createdDate: "2024-01-20",
        isPublished: true,
        isTimeLimited: true,
        showResults: true,
        randomizeQuestions: false,
        attemptsAllowed: 2,
        passScore: 70,
        targetClasses: ["9-A İngilizce", "9-B İngilizce"],
        status: "published",
        attempts: 45
      },
      {
        id: "quiz-002",
        title: "Vocabulary Test - Animals",
        description: "Hayvanlar konusunda kelime bilgisi testi",
        subject: "İngilizce",
        grade: "9",
        duration: 15,
        totalPoints: 50,
        questionsCount: 15,
        questions: [],
        createdDate: "2024-01-18",
        isPublished: false,
        isTimeLimited: true,
        showResults: true,
        randomizeQuestions: true,
        attemptsAllowed: 1,
        passScore: 60,
        targetClasses: ["9-A İngilizce"],
        status: "draft",
        attempts: 0
      },
      {
        id: "quiz-003",
        title: "Grammar Review - Tenses",
        description: "Genel tense konularında karma test",
        subject: "İngilizce",
        grade: "10",
        duration: 45,
        totalPoints: 120,
        questionsCount: 12,
        questions: [],
        createdDate: "2024-01-15",
        isPublished: true,
        isTimeLimited: false,
        showResults: false,
        randomizeQuestions: true,
        attemptsAllowed: 3,
        passScore: 80,
        targetClasses: ["10-A İngilizce"],
        status: "completed",
        attempts: 30
      }
    ])
  }, [router])

  const getStatusColor = (status: Quiz["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateQuiz = () => {
    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: newQuiz.title || "",
      description: newQuiz.description || "",
      subject: newQuiz.subject || "İngilizce",
      grade: newQuiz.grade || "",
      duration: newQuiz.duration || 30,
      totalPoints: 0,
      questionsCount: 0,
      questions: [],
      createdDate: new Date().toISOString().split('T')[0],
      isPublished: false,
      isTimeLimited: newQuiz.isTimeLimited || true,
      showResults: newQuiz.showResults || true,
      randomizeQuestions: newQuiz.randomizeQuestions || false,
      attemptsAllowed: newQuiz.attemptsAllowed || 1,
      passScore: newQuiz.passScore || 60,
      targetClasses: newQuiz.targetClasses || [],
      status: "draft",
      attempts: 0
    }

    setQuizzes(prev => [quiz, ...prev])
    setEditingQuiz(quiz)
    setActiveTab("editor")
    setIsCreateDialogOpen(false)
    
    toast({
      title: "Quiz Oluşturuldu",
      description: "Yeni quiz taslağı oluşturuldu. Şimdi soru ekleyebilirsiniz.",
    })
  }

  const handleAddQuestion = () => {
    if (!editingQuiz) return

    const question: QuizQuestion = {
      id: `q-${Date.now()}`,
      type: newQuestion.type || "multiple-choice",
      question: newQuestion.question || "",
      options: newQuestion.type === "multiple-choice" ? newQuestion.options : undefined,
      correctAnswer: newQuestion.correctAnswer || "",
      points: newQuestion.points || 10,
      explanation: newQuestion.explanation || ""
    }

    const updatedQuiz = {
      ...editingQuiz,
      questions: [...editingQuiz.questions, question],
      questionsCount: editingQuiz.questions.length + 1,
      totalPoints: editingQuiz.totalPoints + question.points
    }

    setEditingQuiz(updatedQuiz)
    setQuizzes(prev => prev.map(q => q.id === editingQuiz.id ? updatedQuiz : q))
    
    // Reset form
    setNewQuestion({
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 10,
      explanation: ""
    })

    toast({
      title: "Soru Eklendi",
      description: "Yeni soru başarıyla eklendi.",
    })
  }

  const handleDeleteQuestion = (questionId: string) => {
    if (!editingQuiz) return

    const questionToDelete = editingQuiz.questions.find(q => q.id === questionId)
    if (!questionToDelete) return

    const updatedQuiz = {
      ...editingQuiz,
      questions: editingQuiz.questions.filter(q => q.id !== questionId),
      questionsCount: editingQuiz.questions.length - 1,
      totalPoints: editingQuiz.totalPoints - questionToDelete.points
    }

    setEditingQuiz(updatedQuiz)
    setQuizzes(prev => prev.map(q => q.id === editingQuiz.id ? updatedQuiz : q))

    toast({
      title: "Soru Silindi",
      description: "Soru başarıyla silindi.",
    })
  }

  const handlePublishQuiz = (quizId: string) => {
    setQuizzes(prev => prev.map(q => 
      q.id === quizId 
        ? { ...q, isPublished: !q.isPublished, status: q.isPublished ? "draft" : "published" as const }
        : q
    ))

    const quiz = quizzes.find(q => q.id === quizId)
    toast({
      title: quiz?.isPublished ? "Quiz Yayından Kaldırıldı" : "Quiz Yayınlandı",
      description: quiz?.isPublished ? "Quiz taslak olarak kaydedildi." : "Quiz öğrenciler için yayınlandı.",
    })
  }

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== quizId))
    if (editingQuiz?.id === quizId) {
      setEditingQuiz(null)
      setActiveTab("my-quizzes")
    }
    
    toast({
      title: "Quiz Silindi",
      description: "Quiz başarıyla silindi.",
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
            <h1 className="text-3xl font-bold text-gray-900">Quiz Oluşturucu</h1>
            <p className="text-gray-600">İnteraktif quizler oluşturun ve yönetin</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Quiz
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Yeni Quiz Oluştur</DialogTitle>
                <DialogDescription>
                  Öğrencileriniz için yeni bir quiz oluşturun
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Quiz Başlığı</Label>
                    <Input
                      id="title"
                      value={newQuiz.title}
                      onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Quiz başlığı"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Sınıf</Label>
                    <Select value={newQuiz.grade} onValueChange={(value) => setNewQuiz(prev => ({ ...prev, grade: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9">9. Sınıf</SelectItem>
                        <SelectItem value="10">10. Sınıf</SelectItem>
                        <SelectItem value="11">11. Sınıf</SelectItem>
                        <SelectItem value="12">12. Sınıf</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={newQuiz.description}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Quiz hakkında kısa açıklama..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Süre (dakika)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newQuiz.duration}
                      onChange={(e) => setNewQuiz(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attempts">Deneme Hakkı</Label>
                    <Input
                      id="attempts"
                      type="number"
                      value={newQuiz.attemptsAllowed}
                      onChange={(e) => setNewQuiz(prev => ({ ...prev, attemptsAllowed: parseInt(e.target.value) || 1 }))}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passScore">Geçme Notu (%)</Label>
                    <Input
                      id="passScore"
                      type="number"
                      value={newQuiz.passScore}
                      onChange={(e) => setNewQuiz(prev => ({ ...prev, passScore: parseInt(e.target.value) || 60 }))}
                      placeholder="60"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isTimeLimited">Süre Sınırı</Label>
                    <Switch
                      id="isTimeLimited"
                      checked={newQuiz.isTimeLimited}
                      onCheckedChange={(checked) => setNewQuiz(prev => ({ ...prev, isTimeLimited: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showResults">Sonuçları Göster</Label>
                    <Switch
                      id="showResults"
                      checked={newQuiz.showResults}
                      onCheckedChange={(checked) => setNewQuiz(prev => ({ ...prev, showResults: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="randomizeQuestions">Soruları Karıştır</Label>
                    <Switch
                      id="randomizeQuestions"
                      checked={newQuiz.randomizeQuestions}
                      onCheckedChange={(checked) => setNewQuiz(prev => ({ ...prev, randomizeQuestions: checked }))}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreateQuiz} className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Quiz Oluştur
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-quizzes">Quizlerim</TabsTrigger>
          <TabsTrigger value="editor">Quiz Editörü</TabsTrigger>
          <TabsTrigger value="analytics">İstatistikler</TabsTrigger>
        </TabsList>

        <TabsContent value="my-quizzes" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{quizzes.length}</div>
                <div className="text-sm text-gray-600">Toplam Quiz</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {quizzes.filter(q => q.status === "published").length}
                </div>
                <div className="text-sm text-gray-600">Yayınlanmış</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {quizzes.filter(q => q.status === "draft").length}
                </div>
                <div className="text-sm text-gray-600">Taslak</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {quizzes.reduce((acc, q) => acc + q.attempts, 0)}
                </div>
                <div className="text-sm text-gray-600">Toplam Deneme</div>
              </CardContent>
            </Card>
          </div>

          {/* Quiz List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <Badge className={getStatusColor(quiz.status)}>
                      {quiz.status === "published" && "Yayınlanmış"}
                      {quiz.status === "draft" && "Taslak"}
                      {quiz.status === "completed" && "Tamamlanmış"}
                    </Badge>
                  </div>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Sınıf: </span>
                      <span className="font-medium">{quiz.grade}. Sınıf</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Süre: </span>
                      <span className="font-medium">{quiz.duration} dk</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Soru: </span>
                      <span className="font-medium">{quiz.questionsCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Puan: </span>
                      <span className="font-medium">{quiz.totalPoints}</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-600">Deneme: </span>
                    <span className="font-medium">{quiz.attempts}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingQuiz(quiz)
                        setActiveTab("editor")
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Düzenle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePublishQuiz(quiz.id)}
                    >
                      {quiz.isPublished ? (
                        <>
                          <X className="w-3 h-3 mr-1" />
                          Gizle
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          Yayınla
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 border-t pt-2">
                    Oluşturma: {new Date(quiz.createdDate).toLocaleDateString('tr-TR')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          {editingQuiz ? (
            <>
              {/* Quiz Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Editörü: {editingQuiz.title}</CardTitle>
                  <CardDescription>
                    Soru ekleme ve düzenleme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Toplam Soru: </span>
                      <span className="font-medium">{editingQuiz.questionsCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Toplam Puan: </span>
                      <span className="font-medium">{editingQuiz.totalPoints}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Süre: </span>
                      <span className="font-medium">{editingQuiz.duration} dakika</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Durum: </span>
                      <Badge className={getStatusColor(editingQuiz.status)}>
                        {editingQuiz.status === "published" && "Yayınlanmış"}
                        {editingQuiz.status === "draft" && "Taslak"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add Question Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="w-5 h-5" />
                    Yeni Soru Ekle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="questionType">Soru Tipi</Label>
                      <Select 
                        value={newQuestion.type} 
                        onValueChange={(value: QuizQuestion["type"]) => setNewQuestion(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Çoktan Seçmeli</SelectItem>
                          <SelectItem value="true-false">Doğru/Yanlış</SelectItem>
                          <SelectItem value="fill-blank">Boşluk Doldurma</SelectItem>
                          <SelectItem value="short-answer">Kısa Cevap</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="points">Puan</Label>
                      <Input
                        id="points"
                        type="number"
                        value={newQuestion.points}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question">Soru</Label>
                    <Textarea
                      id="question"
                      rows={3}
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                      placeholder="Soruyu buraya yazın..."
                    />
                  </div>

                  {newQuestion.type === "multiple-choice" && (
                    <div className="space-y-2">
                      <Label>Seçenekler</Label>
                      <div className="space-y-2">
                        {newQuestion.options?.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(newQuestion.options || [])]
                                newOptions[index] = e.target.value
                                setNewQuestion(prev => ({ ...prev, options: newOptions }))
                              }}
                              placeholder={`Seçenek ${index + 1}`}
                            />
                            <input
                              type="radio"
                              name="correct"
                              checked={newQuestion.correctAnswer === index}
                              onChange={() => setNewQuestion(prev => ({ ...prev, correctAnswer: index }))}
                            />
                            <Label className="text-sm">Doğru</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(newQuestion.type === "true-false" || newQuestion.type === "fill-blank" || newQuestion.type === "short-answer") && (
                    <div className="space-y-2">
                      <Label htmlFor="correctAnswer">Doğru Cevap</Label>
                      <Input
                        id="correctAnswer"
                        value={newQuestion.correctAnswer as string}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                        placeholder="Doğru cevabı girin"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="explanation">Açıklama (İsteğe bağlı)</Label>
                    <Textarea
                      id="explanation"
                      rows={2}
                      value={newQuestion.explanation}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                      placeholder="Soru için açıklama..."
                    />
                  </div>

                  <Button onClick={handleAddQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Soru Ekle
                  </Button>
                </CardContent>
              </Card>

              {/* Questions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Soruları ({editingQuiz.questionsCount})</CardTitle>
                </CardHeader>
                <CardContent>
                  {editingQuiz.questions.length > 0 ? (
                    <div className="space-y-4">
                      {editingQuiz.questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">
                              {index + 1}. {question.question}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{question.points} puan</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {question.type === "multiple-choice" && question.options && (
                            <div className="space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                    question.correctAnswer === optIndex ? 'bg-green-100 border-green-500' : 'border-gray-300'
                                  }`}>
                                    {question.correctAnswer === optIndex && (
                                      <CheckCircle className="w-3 h-3 text-green-600" />
                                    )}
                                  </div>
                                  <span className={question.correctAnswer === optIndex ? 'font-medium text-green-700' : ''}>
                                    {option}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {question.type !== "multiple-choice" && (
                            <div className="text-sm">
                              <span className="text-gray-600">Doğru cevap: </span>
                              <span className="font-medium text-green-700">{question.correctAnswer}</span>
                            </div>
                          )}

                          {question.explanation && (
                            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              <strong>Açıklama:</strong> {question.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Henüz soru eklenmemiş. Yukarıdaki formu kullanarak soru ekleyin.
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Quiz seçin</h3>
                <p className="text-gray-600 mb-4">Düzenlemek için bir quiz seçin veya yeni quiz oluşturun.</p>
                <Button onClick={() => setActiveTab("my-quizzes")}>
                  Quizlerime Dön
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz İstatistikleri</CardTitle>
              <CardDescription>Quiz performansı ve öğrenci katılımı</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                İstatistik verileri henüz mevcut değil.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}