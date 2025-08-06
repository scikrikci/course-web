"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  MessageSquare, 
  BookOpen, 
  Star, 
  FileText, 
  Sparkles, 
  Brain, 
  Target, 
  Lightbulb,
  Send,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface WritingFeedback {
  grammar: number
  vocabulary: number
  coherence: number
  suggestions: string[]
  overallScore: number
}

interface Recommendation {
  id: number
  title: string
  description: string
  type: 'course' | 'material' | 'practice'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
}

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("writing-assistant")
  
  // Writing Assistant State
  const [writingText, setWritingText] = useState("")
  const [writingFeedback, setWritingFeedback] = useState<WritingFeedback | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Quiz Generator State
  const [quizTopic, setQuizTopic] = useState("")
  const [quizDifficulty, setQuizDifficulty] = useState("intermediate")
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false)

  // Personal Guide State
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false)

  // Summary Tool State
  const [summaryText, setSummaryText] = useState("")
  const [summaryResult, setSummaryResult] = useState("")
  const [isSummarizing, setIsSummarizing] = useState(false)

  const handleWritingAnalysis = () => {
    if (!writingText.trim()) return

    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setWritingFeedback({
        grammar: 85,
        vocabulary: 78,
        coherence: 82,
        suggestions: [
          "More complex sentence structures could improve your writing",
          "Consider using more academic vocabulary",
          "Some grammatical errors in tense usage",
          "Good paragraph organization overall"
        ],
        overallScore: 82
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleQuizGeneration = () => {
    if (!quizTopic.trim()) return

    setIsGeneratingQuiz(true)
    
    // Simulate quiz generation
    setTimeout(() => {
      setQuizQuestions([
        {
          id: 1,
          question: `What is the main concept of ${quizTopic}?`,
          options: [
            "Concept A",
            "Concept B", 
            "Concept C",
            "Concept D"
          ],
          correctAnswer: 1,
          explanation: "Concept B is the main concept because..."
        },
        {
          id: 2,
          question: `Which of the following is NOT related to ${quizTopic}?`,
          options: [
            "Related Item 1",
            "Related Item 2",
            "Unrelated Item",
            "Related Item 3"
          ],
          correctAnswer: 2,
          explanation: "The unrelated item doesn't belong to this topic"
        },
        {
          id: 3,
          question: `How would you apply ${quizTopic} in real life?`,
          options: [
            "Application 1",
            "Application 2",
            "Application 3", 
            "Application 4"
          ],
          correctAnswer: 0,
          explanation: "Application 1 is the most practical real-world use"
        }
      ])
      setIsGeneratingQuiz(false)
    }, 3000)
  }

  const handleRecommendationGeneration = () => {
    setIsGeneratingRecommendations(true)
    
    // Simulate recommendation generation
    setTimeout(() => {
      setRecommendations([
        {
          id: 1,
          title: "Advanced Grammar Course",
          description: "Improve your grammar skills with advanced concepts and exercises",
          type: "course",
          difficulty: "advanced",
          estimatedTime: "4 weeks"
        },
        {
          id: 2,
          title: "Vocabulary Builder: Academic Words",
          description: "Expand your academic vocabulary with targeted exercises",
          type: "material",
          difficulty: "intermediate",
          estimatedTime: "2 weeks"
        },
        {
          id: 3,
          title: "Writing Practice: Essays",
          description: "Practice essay writing with personalized feedback",
          type: "practice",
          difficulty: "intermediate",
          estimatedTime: "1 week"
        },
        {
          id: 4,
          title: "Speaking Fluency Workshop",
          description: "Improve your speaking fluency with conversation practice",
          type: "course",
          difficulty: "beginner",
          estimatedTime: "3 weeks"
        }
      ])
      setIsGeneratingRecommendations(false)
    }, 2500)
  }

  const handleSummaryGeneration = () => {
    if (!summaryText.trim()) return

    setIsSummarizing(true)
    
    // Simulate summary generation
    setTimeout(() => {
      setSummaryResult(
        "This text discusses the importance of artificial intelligence in modern education. It highlights how AI tools can personalize learning experiences, provide instant feedback, and help teachers manage their workload more effectively. The author emphasizes that while AI is powerful, it should complement rather than replace human teachers."
      )
      setIsSummarizing(false)
    }, 2000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4" />
      case 'material':
        return <FileText className="w-4 h-4" />
      case 'practice':
        return <Target className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Araçları</h1>
        <p className="text-gray-600">Yapay zeka destekli öğrenme araçları ile eğitim deneyiminizi geliştirin</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="writing-assistant" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Yazım Asistanı</span>
          </TabsTrigger>
          <TabsTrigger value="quiz-generator" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <span className="hidden sm:inline">Quiz Üretici</span>
          </TabsTrigger>
          <TabsTrigger value="personal-guide" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Kişisel Rehber</span>
          </TabsTrigger>
          <TabsTrigger value="summary-tool" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Özetleme</span>
          </TabsTrigger>
        </TabsList>

        {/* Writing Assistant */}
        <TabsContent value="writing-assistant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Yazım Asistanı
              </CardTitle>
              <CardDescription>
                Metninizi analiz edin ve yapay zeka destekli geri bildirim alın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="writing-text">Metninizi Yazın</Label>
                <Textarea
                  id="writing-text"
                  placeholder="Metninizi buraya yazın veya yapıştırın..."
                  value={writingText}
                  onChange={(e) => setWritingText(e.target.value)}
                  className="min-h-32"
                />
              </div>
              
              <Button onClick={handleWritingAnalysis} disabled={!writingText.trim() || isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analiz Ediliyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analiz Et
                  </>
                )}
              </Button>

              {writingFeedback && (
                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Analiz Sonuçları</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Grammer</span>
                          <span className="text-sm">{writingFeedback.grammar}%</span>
                        </div>
                        <Progress value={writingFeedback.grammar} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Vocabulary</span>
                          <span className="text-sm">{writingFeedback.vocabulary}%</span>
                        </div>
                        <Progress value={writingFeedback.vocabulary} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Coherence</span>
                          <span className="text-sm">{writingFeedback.coherence}%</span>
                        </div>
                        <Progress value={writingFeedback.coherence} className="h-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <span className="font-medium">Overall Score</span>
                      <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                        {writingFeedback.overallScore}/100
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">İyileştirme Önerileri</h4>
                      <ul className="space-y-1">
                        {writingFeedback.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Generator */}
        <TabsContent value="quiz-generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Quiz Üretici
              </CardTitle>
              <CardDescription>
                Konu belirleyin ve yapay zeka destekli quiz oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiz-topic">Quiz Konusu</Label>
                  <Input
                    id="quiz-topic"
                    placeholder="Örn: İngilizce Grammer, Matematik..."
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quiz-difficulty">Zorluk Seviyesi</Label>
                  <Select value={quizDifficulty} onValueChange={setQuizDifficulty}>
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
              
              <Button onClick={handleQuizGeneration} disabled={!quizTopic.trim() || isGeneratingQuiz}>
                {isGeneratingQuiz ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Quiz Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Quiz Oluştur
                  </>
                )}
              </Button>

              {quizQuestions.length > 0 && (
                <Card className="bg-green-50">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Oluşturulan Quiz</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          İndir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4 mr-2" />
                          Kopyala
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {quizQuestions.map((question, index) => (
                      <div key={question.id} className="bg-white p-4 rounded-lg">
                        <h4 className="font-medium mb-3">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                optionIndex === question.correctAnswer 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'border-gray-300'
                              }`} />
                              <span className={optionIndex === question.correctAnswer ? 'font-medium text-green-700' : ''}>
                                {option}
                              </span>
                              {optionIndex === question.correctAnswer && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          ))}
                        </div>
                        <Separator className="my-3" />
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span><strong>Açıklama:</strong> {question.explanation}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Guide */}
        <TabsContent value="personal-guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Kişisel Rehber
              </CardTitle>
              <CardDescription>
                Yapay zeka destekli kişiselleştirilmiş öğrenme önerileri alın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleRecommendationGeneration} disabled={isGeneratingRecommendations}>
                {isGeneratingRecommendations ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Öneriler Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Önerilerimi Getir
                  </>
                )}
              </Button>

              {recommendations.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {recommendations.map((rec) => (
                    <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(rec.type)}
                            <CardTitle className="text-lg">{rec.title}</CardTitle>
                          </div>
                          <Badge className={getDifficultyColor(rec.difficulty)}>
                            {rec.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600">{rec.description}</p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">
                            <Target className="w-4 h-4 inline mr-1" />
                            {rec.estimatedTime}
                          </span>
                          <Button size="sm">Başla</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tool */}
        <TabsContent value="summary-tool" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Metin Özetleme
              </CardTitle>
              <CardDescription>
                Uzun metinleri yapay zeka ile özetleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="summary-text">Özetlenecek Metin</Label>
                <Textarea
                  id="summary-text"
                  placeholder="Özetlemek istediğiniz metni buraya yapıştırın..."
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  className="min-h-32"
                />
              </div>
              
              <Button onClick={handleSummaryGeneration} disabled={!summaryText.trim() || isSummarizing}>
                {isSummarizing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Özetleniyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Özetle
                  </>
                )}
              </Button>

              {summaryResult && (
                <Card className="bg-purple-50">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Özet</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4 mr-2" />
                          Kopyala
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{summaryResult}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}