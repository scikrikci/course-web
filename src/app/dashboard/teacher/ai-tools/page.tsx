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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Brain, Wand2, Image, MessageSquare, Play, Users, Settings, RefreshCw, Download, Copy, Lightbulb, Target, Camera } from "lucide-react"
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
  question: string
  type: "multiple-choice" | "true-false" | "fill-blank"
  options?: string[]
  correctAnswer: string | number
  difficulty: "easy" | "medium" | "hard"
  topic: string
}

interface GeneratedContent {
  id: string
  type: "quiz" | "conversation" | "image-prompt"
  topic: string
  level: string
  content: any
  createdAt: string
}

export default function TeacherAITools() {
  const [user, setUser] = useState<User | null>(null)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("quiz-generator")
  
  // Quiz Generator State
  const [quizSettings, setQuizSettings] = useState({
    topic: "",
    level: "beginner",
    questionCount: 5,
    questionType: "mixed",
    difficulty: "medium"
  })

  // Conversation Generator State
  const [conversationSettings, setConversationSettings] = useState({
    topic: "",
    level: "beginner",
    scenario: "daily-life",
    studentCount: 2
  })

  // Image Prompt Generator State
  const [imageSettings, setImageSettings] = useState({
    topic: "",
    level: "beginner",
    type: "vocabulary",
    style: "realistic"
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

    // Sample generated content
    setGeneratedContent([
      {
        id: "gen-1",
        type: "quiz",
        topic: "Present Perfect Tense",
        level: "intermediate",
        content: {
          questions: [
            {
              id: "q1",
              question: "I ____ never ____ to Paris.",
              type: "multiple-choice",
              options: ["has / been", "have / been", "had / been", "will / be"],
              correctAnswer: 1,
              difficulty: "medium",
              topic: "Present Perfect"
            }
          ]
        },
        createdAt: "2024-01-20T10:30:00Z"
      }
    ])
  }, [router])

  const generateQuiz = async () => {
    setIsGenerating(true)
    
    // Simulated AI quiz generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const sampleQuestions: QuizQuestion[] = [
      {
        id: `q-${Date.now()}-1`,
        question: `Complete the sentence about ${quizSettings.topic}: "I have ____ this many times."`,
        type: "multiple-choice",
        options: ["do", "done", "did", "doing"],
        correctAnswer: 1,
        difficulty: quizSettings.difficulty as any,
        topic: quizSettings.topic
      },
      {
        id: `q-${Date.now()}-2`,
        question: `${quizSettings.topic} is used for actions that started in the past and continue to the present.`,
        type: "true-false",
        correctAnswer: "true",
        difficulty: quizSettings.difficulty as any,
        topic: quizSettings.topic
      },
      {
        id: `q-${Date.now()}-3`,
        question: `Fill in the blank: "She ____ lived here for five years." (${quizSettings.topic})`,
        type: "fill-blank",
        correctAnswer: "has",
        difficulty: quizSettings.difficulty as any,
        topic: quizSettings.topic
      }
    ]

    const newContent: GeneratedContent = {
      id: `gen-${Date.now()}`,
      type: "quiz",
      topic: quizSettings.topic,
      level: quizSettings.level,
      content: { questions: sampleQuestions.slice(0, quizSettings.questionCount) },
      createdAt: new Date().toISOString()
    }

    setGeneratedContent(prev => [newContent, ...prev])
    setIsGenerating(false)
    
    toast({
      title: "Quiz Oluşturuldu",
      description: `${quizSettings.topic} konusunda ${quizSettings.questionCount} soruluk quiz hazırlandı.`,
    })
  }

  const generateConversation = async () => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const conversationTopics = {
      "daily-life": [
        "What did you do yesterday?",
        "Tell me about your morning routine",
        "Describe your favorite food"
      ],
      "travel": [
        "Where would you like to travel?",
        "Describe your last vacation",
        "What's your dream destination?"
      ],
      "hobbies": [
        "What are your hobbies?",
        "How do you spend your free time?",
        "What's your favorite sport?"
      ]
    }

    const topics = conversationTopics[conversationSettings.scenario as keyof typeof conversationTopics] || conversationTopics["daily-life"]
    
    const newContent: GeneratedContent = {
      id: `gen-${Date.now()}`,
      type: "conversation",
      topic: conversationSettings.topic,
      level: conversationSettings.level,
      content: {
        scenario: conversationSettings.scenario,
        topics: topics.slice(0, 3),
        instructions: `${conversationSettings.level} seviyesinde ${conversationSettings.scenario} konulu konuşma aktivitesi`,
        duration: "15-20 dakika",
        studentCount: conversationSettings.studentCount
      },
      createdAt: new Date().toISOString()
    }

    setGeneratedContent(prev => [newContent, ...prev])
    setIsGenerating(false)
    
    toast({
      title: "Konuşma Aktivitesi Oluşturuldu",
      description: `${conversationSettings.scenario} temalı konuşma soruları hazırlandı.`,
    })
  }

  const generateImagePrompts = async () => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const imagePrompts = {
      "vocabulary": [
        `A clear, simple image showing ${imageSettings.topic} - perfect for vocabulary practice`,
        `Visual representation of ${imageSettings.topic} suitable for ${imageSettings.level} level students`,
        `Educational image focusing on ${imageSettings.topic} with clear, identifiable elements`
      ],
      "scenario": [
        `Real-life scenario depicting ${imageSettings.topic} for conversation practice`,
        `Everyday situation showing ${imageSettings.topic} that students can relate to`,
        `Cultural context image about ${imageSettings.topic} for discussion`
      ]
    }

    const prompts = imagePrompts[imageSettings.type as keyof typeof imagePrompts] || imagePrompts["vocabulary"]
    
    const newContent: GeneratedContent = {
      id: `gen-${Date.now()}`,
      type: "image-prompt",
      topic: imageSettings.topic,
      level: imageSettings.level,
      content: {
        prompts: prompts,
        type: imageSettings.type,
        style: imageSettings.style,
        suggestions: [
          "Bu görsel ile kelime öğretimi yapabilirsiniz",
          "Öğrencilere görseli tanımlatabilirsiniz", 
          "Hikaye oluşturma aktivitesi düzenleyebilirsiniz"
        ]
      },
      createdAt: new Date().toISOString()
    }

    setGeneratedContent(prev => [newContent, ...prev])
    setIsGenerating(false)
    
    toast({
      title: "Görsel Önerileri Oluşturuldu",
      description: `${imageSettings.topic} konusunda görsel önerileri hazırlandı.`,
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
            <h1 className="text-3xl font-bold text-gray-900">AI Araçları</h1>
            <p className="text-gray-600">Yapay zeka ile ders materyalleri ve aktiviteler oluşturun</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quiz-generator">Quiz Üretimi</TabsTrigger>
          <TabsTrigger value="conversation-generator">Konuşma Soruları</TabsTrigger>
          <TabsTrigger value="image-generator">Görsel Önerileri</TabsTrigger>
          <TabsTrigger value="generated-content">Oluşturulan İçerik</TabsTrigger>
        </TabsList>

        <TabsContent value="quiz-generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                AI Quiz Üretici
              </CardTitle>
              <CardDescription>
                Belirttiğiniz konuya göre otomatik quiz soruları oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Konu</Label>
                  <Input
                    id="topic"
                    value={quizSettings.topic}
                    onChange={(e) => setQuizSettings(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="Örn: Present Perfect Tense"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Seviye</Label>
                  <Select value={quizSettings.level} onValueChange={(value) => setQuizSettings(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Başlangıç</SelectItem>
                      <SelectItem value="intermediate">Orta</SelectItem>
                      <SelectItem value="advanced">İleri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="questionCount">Soru Sayısı</Label>
                  <Select value={quizSettings.questionCount.toString()} onValueChange={(value) => setQuizSettings(prev => ({ ...prev, questionCount: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Soru</SelectItem>
                      <SelectItem value="5">5 Soru</SelectItem>
                      <SelectItem value="10">10 Soru</SelectItem>
                      <SelectItem value="15">15 Soru</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="questionType">Soru Türü</Label>
                  <Select value={quizSettings.questionType} onValueChange={(value) => setQuizSettings(prev => ({ ...prev, questionType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Karışık</SelectItem>
                      <SelectItem value="multiple-choice">Çoktan Seçmeli</SelectItem>
                      <SelectItem value="true-false">Doğru/Yanlış</SelectItem>
                      <SelectItem value="fill-blank">Boşluk Doldurma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Zorluk</Label>
                  <Select value={quizSettings.difficulty} onValueChange={(value) => setQuizSettings(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Kolay</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="hard">Zor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={generateQuiz} 
                disabled={isGenerating || !quizSettings.topic}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Quiz Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Quiz Oluştur
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversation-generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                Konuşma Soruları Üretici
              </CardTitle>
              <CardDescription>
                Öğrencilerin konuşma pratiği yapabilecekleri soru ve senaryolar oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="conv-topic">Konu</Label>
                  <Input
                    id="conv-topic"
                    value={conversationSettings.topic}
                    onChange={(e) => setConversationSettings(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="Örn: Günlük Aktiviteler"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conv-level">Seviye</Label>
                  <Select value={conversationSettings.level} onValueChange={(value) => setConversationSettings(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Başlangıç</SelectItem>
                      <SelectItem value="intermediate">Orta</SelectItem>
                      <SelectItem value="advanced">İleri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scenario">Senaryo Türü</Label>
                  <Select value={conversationSettings.scenario} onValueChange={(value) => setConversationSettings(prev => ({ ...prev, scenario: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily-life">Günlük Yaşam</SelectItem>
                      <SelectItem value="travel">Seyahat</SelectItem>
                      <SelectItem value="hobbies">Hobiler</SelectItem>
                      <SelectItem value="work">İş Hayatı</SelectItem>
                      <SelectItem value="education">Eğitim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentCount">Öğrenci Sayısı</Label>
                  <Select value={conversationSettings.studentCount.toString()} onValueChange={(value) => setConversationSettings(prev => ({ ...prev, studentCount: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Kişi</SelectItem>
                      <SelectItem value="3">3 Kişi</SelectItem>
                      <SelectItem value="4">4 Kişi</SelectItem>
                      <SelectItem value="0">Sınıf Tartışması</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={generateConversation} 
                disabled={isGenerating || !conversationSettings.topic}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Konuşma Soruları Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Konuşma Soruları Oluştur
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image-generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-600" />
                Görsel Önerileri Üretici
              </CardTitle>
              <CardDescription>
                Dersleriniz için görsel materyal önerileri ve tanımları oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="img-topic">Konu</Label>
                  <Input
                    id="img-topic"
                    value={imageSettings.topic}
                    onChange={(e) => setImageSettings(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="Örn: Animals, Food, Daily Activities"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="img-level">Seviye</Label>
                  <Select value={imageSettings.level} onValueChange={(value) => setImageSettings(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Başlangıç</SelectItem>
                      <SelectItem value="intermediate">Orta</SelectItem>
                      <SelectItem value="advanced">İleri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="img-type">Görsel Türü</Label>
                  <Select value={imageSettings.type} onValueChange={(value) => setImageSettings(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vocabulary">Kelime Öğretimi</SelectItem>
                      <SelectItem value="scenario">Senaryo/Durum</SelectItem>
                      <SelectItem value="grammar">Gramer Örnekleri</SelectItem>
                      <SelectItem value="culture">Kültür</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="img-style">Stil</Label>
                  <Select value={imageSettings.style} onValueChange={(value) => setImageSettings(prev => ({ ...prev, style: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Gerçekçi</SelectItem>
                      <SelectItem value="cartoon">Çizgi Film</SelectItem>
                      <SelectItem value="illustration">İllüstrasyon</SelectItem>
                      <SelectItem value="photo">Fotoğraf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={generateImagePrompts} 
                disabled={isGenerating || !imageSettings.topic}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Görsel Önerileri Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4 mr-2" />
                    Görsel Önerileri Oluştur
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generated-content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Oluşturulan İçerikler</CardTitle>
              <CardDescription>
                AI ile oluşturduğunuz tüm materyaller
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedContent.map((content) => (
                  <Card key={content.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{content.topic}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{content.type}</Badge>
                            <Badge variant="outline">{content.level}</Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(content.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="w-3 h-3 mr-1" />
                            Kopyala
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3 mr-1" />
                            İndir
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {content.type === "quiz" && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            {content.content.questions?.length} soru içeren quiz
                          </p>
                          <div className="grid gap-2">
                            {content.content.questions?.slice(0, 2).map((q: any, index: number) => (
                              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                <strong>{index + 1}.</strong> {q.question}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {content.type === "conversation" && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            {content.content.scenario} senaryolu konuşma aktivitesi
                          </p>
                          <div className="grid gap-1">
                            {content.content.topics?.slice(0, 2).map((topic: string, index: number) => (
                              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                • {topic}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {content.type === "image-prompt" && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            {content.content.type} türünde görsel önerileri
                          </p>
                          <div className="grid gap-1">
                            {content.content.prompts?.slice(0, 1).map((prompt: string, index: number) => (
                              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                {prompt}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {generatedContent.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz içerik oluşturulmamış</h3>
                    <p className="text-gray-600">AI araçlarını kullanarak içerik oluşturmaya başlayın.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}