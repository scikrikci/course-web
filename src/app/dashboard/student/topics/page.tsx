"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Trophy, Clock, Target, Brain, CheckCircle, Star, Calendar, Award } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface User {
  id: number
  username: string
  role: string
  name: string
  email: string
}

interface CompletedTopic {
  id: number
  title: string
  module: string
  completedAt: string
  score: number
  difficulty: "easy" | "medium" | "hard"
  skills: string[]
  description: string
  lessonHours: number
  exercises: number
  quizScore?: number
  teacherFeedback?: string
}

export default function StudentTopics() {
  const [user, setUser] = useState<User | null>(null)
  const [completedTopics, setCompletedTopics] = useState<CompletedTopic[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedModule, setSelectedModule] = useState("all")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      const parsedUser: User = JSON.parse(userData)
      if (parsedUser.role !== 'student') {
        router.push('/login')
        return
      }
      setUser(parsedUser)
    } else {
      router.push('/login')
    }

    // Sample completed topics data
    setCompletedTopics([
      {
        id: 1,
        title: "Present Simple & Present Continuous",
        module: "Unit 1",
        completedAt: "2024-01-15",
        score: 92,
        difficulty: "easy",
        skills: ["Grammar", "Speaking", "Writing"],
        description: "Temel şimdiki zaman formları ve kullanım alanları. Günlük rutinler, alışkanlıklar ve şu anda devam eden eylemler.",
        lessonHours: 4,
        exercises: 15,
        quizScore: 92,
        teacherFeedback: "Mükemmel! Tense kullanımında çok başarılısın."
      },
      {
        id: 2,
        title: "Past Simple & Past Continuous",
        module: "Unit 2", 
        completedAt: "2024-01-22",
        score: 88,
        difficulty: "medium",
        skills: ["Grammar", "Reading", "Listening"],
        description: "Geçmiş zaman formları ve hikaye anlatımı. Regular ve irregular fiiller, geçmişte devam eden eylemler.",
        lessonHours: 5,
        exercises: 18,
        quizScore: 88,
        teacherFeedback: "İyi ilerleme! Irregular fiilleri daha çok çalışman gerekiyor."
      },
      {
        id: 3,
        title: "Future Tenses & Going to",
        module: "Unit 3",
        completedAt: "2024-01-29",
        score: 95,
        difficulty: "medium",
        skills: ["Grammar", "Speaking"],
        description: "Gelecek zaman ifadeleri. Will, going to, present continuous for future. Plan ve tahminler.",
        lessonHours: 4,
        exercises: 12,
        quizScore: 95,
        teacherFeedback: "Harika! Future forms'u çok iyi kavramışsın."
      },
      {
        id: 4,
        title: "Modal Verbs (Can, Could, Must)",
        module: "Unit 4",
        completedAt: "2024-02-05",
        score: 85,
        difficulty: "hard",
        skills: ["Grammar", "Speaking", "Writing"],
        description: "Yardımcı fiiller ve kullanım alanları. Yetenek, izin, zorunluluk ve tavsiye ifadeleri.",
        lessonHours: 6,
        exercises: 20,
        quizScore: 85,
        teacherFeedback: "Modal verbs karmaşık olabilir, ancak iyi anlıyorsun. Daha fazla pratik yap."
      },
      {
        id: 5,
        title: "Comparative & Superlative",
        module: "Unit 5", 
        completedAt: "2024-02-12",
        score: 90,
        difficulty: "medium",
        skills: ["Grammar", "Vocabulary"],
        description: "Karşılaştırma ifadeleri. Sıfatların karşılaştırmalı ve üstünlük dereceleri.",
        lessonHours: 3,
        exercises: 14,
        quizScore: 90,
        teacherFeedback: "Çok iyi! Örneklerle pratik yapmaya devam et."
      },
      {
        id: 6,
        title: "Conditional Sentences (Type 1)",
        module: "Unit 6",
        completedAt: "2024-02-19",
        score: 83,
        difficulty: "hard",
        skills: ["Grammar", "Writing", "Speaking"],
        description: "Birinci tip koşul cümleleri. Gerçek koşullar ve muhtemel sonuçlar.",
        lessonHours: 5,
        exercises: 16,
        quizScore: 83,
        teacherFeedback: "Conditionals zor bir konu. Daha çok örnekle çalışmalısın."
      },
      {
        id: 7,
        title: "Passive Voice - Present & Past",
        module: "Unit 7",
        completedAt: "2024-02-26",
        score: 87,
        difficulty: "hard",
        skills: ["Grammar", "Writing"],
        description: "Edilgen çatı yapısı. Present ve past passive formları ve kullanım alanları.",
        lessonHours: 4,
        exercises: 17,
        quizScore: 87,
        teacherFeedback: "Passive voice'u iyi kavradın. Writing'de daha çok kullanmaya çalış."
      },
      {
        id: 8,
        title: "Question Forms & Question Tags",
        module: "Unit 8",
        completedAt: "2024-03-05",
        score: 94,
        difficulty: "medium",
        skills: ["Grammar", "Speaking", "Listening"],
        description: "Soru formları ve soru kuyrukları. Wh-questions, yes/no questions ve tag questions.",
        lessonHours: 3,
        exercises: 13,
        quizScore: 94,
        teacherFeedback: "Mükemmel! Soru formlarını çok iyi kullanıyorsun."
      },
      {
        id: 9,
        title: "Reported Speech - Statements",
        module: "Unit 9",
        completedAt: "2024-03-12",
        score: 89,
        difficulty: "hard",
        skills: ["Grammar", "Writing", "Speaking"],
        description: "Dolaylı anlatım. Direct ve indirect speech, tense changes ve reporting verbs.",
        lessonHours: 5,
        exercises: 19,
        quizScore: 89,
        teacherFeedback: "Reported speech karmaşık ama iyi ilerliyorsun. Tense changes'e dikkat et."
      }
    ])
  }, [router])

  const modules = ["all", "Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6", "Unit 7", "Unit 8", "Unit 9"]
  const difficulties = ["all", "easy", "medium", "hard"]

  const filteredTopics = completedTopics.filter(topic => {
    const matchesDifficulty = selectedDifficulty === "all" || topic.difficulty === selectedDifficulty
    const matchesModule = selectedModule === "all" || topic.module === selectedModule
    return matchesDifficulty && matchesModule
  })

  const averageScore = completedTopics.length > 0 
    ? Math.round(completedTopics.reduce((sum, topic) => sum + topic.score, 0) / completedTopics.length)
    : 0

  const totalHours = completedTopics.reduce((sum, topic) => sum + topic.lessonHours, 0)
  const totalExercises = completedTopics.reduce((sum, topic) => sum + topic.exercises, 0)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "hard":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-blue-600 bg-blue-100"
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
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
            <h1 className="text-3xl font-bold text-gray-900">Tamamlanan Konular</h1>
            <p className="text-gray-600">İngilizce B1 seviyesindeki öğrenme geçmişin</p>
          </div>
        </div>

        {/* Stats Overview */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{completedTopics.length}</div>
                <div className="text-sm text-gray-600">Tamamlanan Konu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{averageScore}</div>
                <div className="text-sm text-gray-600">Ortalama Puan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalHours}h</div>
                <div className="text-sm text-gray-600">Toplam Ders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalExercises}</div>
                <div className="text-sm text-gray-600">Alıştırma</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Zaman Çizelgesi</TabsTrigger>
          <TabsTrigger value="topics">Konu Detayları</TabsTrigger>
          <TabsTrigger value="stats">İstatistikler</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modül</label>
                  <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {modules.map(module => (
                      <option key={module} value={module}>
                        {module === "all" ? "Tüm Modüller" : module}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Zorluk</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty === "all" ? "Tüm Seviyeler" : 
                         difficulty === "easy" ? "Kolay" :
                         difficulty === "medium" ? "Orta" : "Zor"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sonuçlar</label>
                  <div className="p-2 bg-gray-100 rounded-md text-center">
                    <span className="font-medium">{filteredTopics.length}</span> konu görüntüleniyor
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="space-y-4">
            {filteredTopics.map((topic, index) => (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                          <p className="text-sm text-gray-600">{topic.module} • {new Date(topic.completedAt).toLocaleDateString('tr-TR')}</p>
                        </div>
                        
                        <div className="flex flex-col gap-2 items-end">
                          <Badge className={getScoreColor(topic.score)}>
                            {topic.score}/100
                          </Badge>
                          <Badge className={getDifficultyColor(topic.difficulty)}>
                            {topic.difficulty === "easy" && "Kolay"}
                            {topic.difficulty === "medium" && "Orta"}
                            {topic.difficulty === "hard" && "Zor"}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-700">{topic.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>{topic.lessonHours} saat ders</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-600" />
                          <span>{topic.exercises} alıştırma</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-600" />
                          <span>{topic.quizScore}/100 quiz</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-600" />
                          <span>{topic.skills.join(", ")}</span>
                        </div>
                      </div>

                      {topic.teacherFeedback && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Star className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-blue-700">Öğretmen Geri Bildirimi</div>
                              <div className="text-sm text-blue-600">{topic.teacherFeedback}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTopics.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Konu bulunamadı</h3>
                <p className="text-gray-600">Seçilen filtrelere uygun tamamlanmış konu bulunmuyor</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTopics.map((topic) => (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{topic.title}</CardTitle>
                      <CardDescription>{topic.module}</CardDescription>
                    </div>
                    <Badge className={getScoreColor(topic.score)}>
                      {topic.score}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">{topic.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Skills:</span>
                      <span className="font-medium">{topic.skills.join(", ")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ders Süresi:</span>
                      <span className="font-medium">{topic.lessonHours} saat</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Alıştırma:</span>
                      <span className="font-medium">{topic.exercises} adet</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tamamlanma:</span>
                      <span className="font-medium">{new Date(topic.completedAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Badge className={getDifficultyColor(topic.difficulty)}>
                      {topic.difficulty === "easy" && "Kolay"}
                      {topic.difficulty === "medium" && "Orta"}
                      {topic.difficulty === "hard" && "Zor"}
                    </Badge>
                    
                    <Button variant="outline" size="sm">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Detaylar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Başarı Analizi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>90+ Puan:</span>
                    <span className="font-bold text-green-600">
                      {completedTopics.filter(t => t.score >= 90).length} konu
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>80-89 Puan:</span>
                    <span className="font-bold text-blue-600">
                      {completedTopics.filter(t => t.score >= 80 && t.score < 90).length} konu
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>70-79 Puan:</span>
                    <span className="font-bold text-yellow-600">
                      {completedTopics.filter(t => t.score >= 70 && t.score < 80).length} konu
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>70 Altı:</span>
                    <span className="font-bold text-red-600">
                      {completedTopics.filter(t => t.score < 70).length} konu
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">{averageScore}</div>
                    <div className="text-sm text-gray-600">Genel Ortalama</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Konu Zorluk Dağılımı
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Kolay:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(completedTopics.filter(t => t.difficulty === 'easy').length / completedTopics.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-green-600">
                        {completedTopics.filter(t => t.difficulty === 'easy').length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Orta:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(completedTopics.filter(t => t.difficulty === 'medium').length / completedTopics.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-yellow-600">
                        {completedTopics.filter(t => t.difficulty === 'medium').length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Zor:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(completedTopics.filter(t => t.difficulty === 'hard').length / completedTopics.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-red-600">
                        {completedTopics.filter(t => t.difficulty === 'hard').length}
                      </span>
                    </div>
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