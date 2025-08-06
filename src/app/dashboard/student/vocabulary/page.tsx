"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Search, Star, Volume2, Eye, EyeOff, Filter, Gamepad2, Trophy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface User {
  id: number
  username: string
  role: string
  name: string
  email: string
}

interface VocabularyWord {
  id: string
  word: string
  meaning: string
  pronunciation: string
  category: string
  level: string
  example: string
  learned: boolean
  difficulty: "easy" | "medium" | "hard"
  addedDate: string
  lastPracticed?: string
}

export default function StudentVocabulary() {
  const [user, setUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("B1")
  const [showMeaning, setShowMeaning] = useState<{[key: string]: boolean}>({})
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([])
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

    // Sample B1 vocabulary data
    setVocabularyWords([
      {
        id: "1",
        word: "achievement",
        meaning: "başarı, kazanım",
        pronunciation: "/əˈtʃiːvmənt/",
        category: "Education",
        level: "B1",
        example: "Getting into university was a great achievement for him.",
        learned: true,
        difficulty: "medium",
        addedDate: "2024-01-15",
        lastPracticed: "2024-01-20"
      },
      {
        id: "2",
        word: "challenge",
        meaning: "zorluk, meydan okuma",
        pronunciation: "/ˈtʃæləndʒ/",
        category: "General",
        level: "B1",
        example: "Learning a new language is always a challenge.",
        learned: true,
        difficulty: "easy",
        addedDate: "2024-01-16",
        lastPracticed: "2024-01-22"
      },
      {
        id: "3",
        word: "opportunity",
        meaning: "fırsat, imkan",
        pronunciation: "/ˌɒpəˈtjuːnəti/",
        category: "Business",
        level: "B1",
        example: "This job offers great opportunities for career development.",
        learned: true,
        difficulty: "medium",
        addedDate: "2024-01-17",
        lastPracticed: "2024-01-23"
      },
      {
        id: "4",
        word: "responsibility",
        meaning: "sorumluluk",
        pronunciation: "/rɪˌspɒnsəˈbɪləti/",
        category: "Work",
        level: "B1",
        example: "As a manager, he has many responsibilities.",
        learned: true,
        difficulty: "hard",
        addedDate: "2024-01-18",
        lastPracticed: "2024-01-24"
      },
      {
        id: "5",
        word: "environment",
        meaning: "çevre, ortam",
        pronunciation: "/ɪnˈvaɪrənmənt/",
        category: "Nature",
        level: "B1",
        example: "We must protect our environment for future generations.",
        learned: true,
        difficulty: "medium",
        addedDate: "2024-01-19",
        lastPracticed: "2024-01-25"
      },
      {
        id: "6",
        word: "consequence",
        meaning: "sonuç, netice",
        pronunciation: "/ˈkɒnsɪkwəns/",
        category: "General",
        level: "B1",
        example: "He didn't study, and as a consequence, he failed the exam.",
        learned: false,
        difficulty: "medium",
        addedDate: "2024-01-20"
      },
      {
        id: "7",
        word: "investigate",
        meaning: "araştırmak, incelemek",
        pronunciation: "/ɪnˈvestɪɡeɪt/",
        category: "Academic",
        level: "B1",
        example: "The police are investigating the crime.",
        learned: false,
        difficulty: "hard",
        addedDate: "2024-01-21"
      },
      {
        id: "8",
        word: "appreciate",
        meaning: "takdir etmek, değer vermek",
        pronunciation: "/əˈpriːʃieɪt/",
        category: "Social",
        level: "B1",
        example: "I really appreciate your help with this project.",
        learned: false,
        difficulty: "medium",
        addedDate: "2024-01-22"
      },
      {
        id: "9",
        word: "fundamental",
        meaning: "temel, esas",
        pronunciation: "/ˌfʌndəˈmentl/",
        category: "Academic",
        level: "B1",
        example: "Mathematics is fundamental to science and engineering.",
        learned: false,
        difficulty: "hard",
        addedDate: "2024-01-23"
      },
      {
        id: "10",
        word: "significant",
        meaning: "önemli, anlamlı",
        pronunciation: "/sɪɡˈnɪfɪkənt/",
        category: "Academic",
        level: "B1",
        example: "There has been a significant improvement in his English.",
        learned: false,
        difficulty: "medium",
        addedDate: "2024-01-24"
      }
    ])
  }, [router])

  const categories = ["all", "Education", "General", "Business", "Work", "Nature", "Academic", "Social"]
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"]

  const filteredWords = vocabularyWords.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || word.category === selectedCategory
    const matchesLevel = word.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  const learnedWords = vocabularyWords.filter(w => w.learned && w.level === selectedLevel)
  const totalWords = vocabularyWords.filter(w => w.level === selectedLevel)
  const progressPercentage = totalWords.length > 0 ? (learnedWords.length / totalWords.length) * 100 : 0

  const toggleMeaning = (wordId: string) => {
    setShowMeaning(prev => ({
      ...prev,
      [wordId]: !prev[wordId]
    }))
  }

  const markAsLearned = (wordId: string) => {
    setVocabularyWords(prev => 
      prev.map(word => 
        word.id === wordId 
          ? { ...word, learned: true, lastPracticed: new Date().toISOString().split('T')[0] }
          : word
      )
    )
    
    toast({
      title: "Kelime Öğrenildi!",
      description: "Bu kelime öğrenilen kelimeler listesine eklendi.",
    })
  }

  const playPronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      speechSynthesis.speak(utterance)
    } else {
      toast({
        title: "Sesli Okuma Desteklenmiyor",
        description: "Tarayıcınız sesli okuma özelliğini desteklemiyor.",
        variant: "destructive"
      })
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900">{selectedLevel} Seviye Kelimeler</h1>
            <p className="text-gray-600">İngilizce kelime hazineni geliştir</p>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{learnedWords.length}</div>
                <div className="text-sm text-gray-600">Öğrenilen</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{totalWords.length}</div>
                <div className="text-sm text-gray-600">Toplam</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-gray-600">İlerleme</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{selectedLevel}</div>
                <div className="text-sm text-gray-600">Seviye</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Kelime Öğrenme İlerlemen</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="word-list">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="word-list">Kelime Listesi</TabsTrigger>
          <TabsTrigger value="learned">Öğrenilenler</TabsTrigger>
          <TabsTrigger value="practice">Pratik Yap</TabsTrigger>
        </TabsList>

        <TabsContent value="word-list" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kelime Ara</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Kelime ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Seviye</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "Tüm Kategoriler" : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sonuçlar</label>
                  <div className="p-2 bg-gray-100 rounded-md text-center">
                    <span className="font-medium">{filteredWords.length}</span> kelime bulundu
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Word Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredWords.map((word) => (
              <Card key={word.id} className={`hover:shadow-lg transition-shadow ${word.learned ? 'border-green-200 bg-green-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold">{word.word}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => playPronunciation(word.word)}
                            className="p-1 h-6 w-6"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{word.pronunciation}</p>
                      </div>
                      
                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={getDifficultyColor(word.difficulty)}>
                          {word.difficulty === "easy" && "Kolay"}
                          {word.difficulty === "medium" && "Orta"}
                          {word.difficulty === "hard" && "Zor"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {word.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMeaning(word.id)}
                          className="p-1 h-6 w-6"
                        >
                          {showMeaning[word.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <span className="text-sm font-medium">Anlam:</span>
                        {showMeaning[word.id] && (
                          <span className="text-blue-600 font-medium">{word.meaning}</span>
                        )}
                      </div>

                      <div className="p-3 bg-gray-100 rounded-lg">
                        <p className="text-sm"><strong>Örnek:</strong> {word.example}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs text-gray-500">
                        Eklendi: {new Date(word.addedDate).toLocaleDateString('tr-TR')}
                        {word.lastPracticed && (
                          <span className="ml-2">
                            • Son pratik: {new Date(word.lastPracticed).toLocaleDateString('tr-TR')}
                          </span>
                        )}
                      </div>
                      
                      {!word.learned && (
                        <Button
                          size="sm"
                          onClick={() => markAsLearned(word.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Öğrendim
                        </Button>
                      )}
                      
                      {word.learned && (
                        <Badge className="bg-green-100 text-green-800">
                          <Star className="w-3 h-3 mr-1" />
                          Öğrenildi
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredWords.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Kelime bulunamadı</h3>
                <p className="text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="learned" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Öğrenilen Kelimeler - {selectedLevel} Seviye</CardTitle>
              <CardDescription>
                {learnedWords.length} kelime öğrendiniz ({Math.round(progressPercentage)}% tamamlandı)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {learnedWords.map((word) => (
                  <div key={word.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-green-600" />
                      <div>
                        <span className="font-medium">{word.word}</span>
                        <span className="text-gray-600 ml-2">({word.meaning})</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {word.lastPracticed && `Son: ${new Date(word.lastPracticed).toLocaleDateString('tr-TR')}`}
                    </div>
                  </div>
                ))}
              </div>
              
              {learnedWords.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Henüz {selectedLevel} seviyesinde öğrenilen kelime yok.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Kelime Pratiği
              </CardTitle>
              <CardDescription>
                Öğrendiğin kelimeleri pekiştir ve yenilerini öğren
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center space-y-2">
                    <BookOpen className="w-8 h-8 text-blue-600 mx-auto" />
                    <h3 className="font-medium">Flashcard Çalışması</h3>
                    <p className="text-sm text-gray-600">Kelime kartları ile ezber yap</p>
                    <Button className="w-full">Başla</Button>
                  </div>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center space-y-2">
                    <Trophy className="w-8 h-8 text-yellow-600 mx-auto" />
                    <h3 className="font-medium">Kelime Yarışması</h3>
                    <p className="text-sm text-gray-600">Hızlı eşleştirme oyunu</p>
                    <Button className="w-full">Yarış</Button>
                  </div>
                </Card>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-700 mb-2">Günlük Hedefin</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bugün öğrenilen kelime</span>
                    <span>3/5</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  <p className="text-xs text-blue-600">2 kelime daha öğren ve günlük hedefini tamamla!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}