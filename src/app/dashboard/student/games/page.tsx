"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Gamepad2, Users, Trophy, Clock, Target, Play, Search, Star, Zap, CheckCircle, AlertCircle } from "lucide-react"
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

interface GameRoom {
  id: string
  name: string
  gameType: "quiz" | "tabu" | "word-guess" | "vocabulary-race"
  topic: string
  code: string
  isActive: boolean
  playerCount: number
  maxPlayers: number
  teacher: string
  difficulty: "easy" | "medium" | "hard"
  duration: number
  currentQuestion?: number
  totalQuestions?: number
}

interface GameHistory {
  id: string
  gameName: string
  gameType: string
  score: number
  maxScore: number
  rank: number
  totalPlayers: number
  date: string
  duration: string
}

export default function StudentGames() {
  const [user, setUser] = useState<User | null>(null)
  const [gameCode, setGameCode] = useState("")
  const [activeGames, setActiveGames] = useState<GameRoom[]>([])
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
  const [currentGame, setCurrentGame] = useState<GameRoom | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
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

    // Sample active games (from teacher's classroom-games)
    setActiveGames([
      {
        id: "room-1",
        name: "Present Perfect Quiz",
        gameType: "quiz",
        topic: "Grammar",
        code: "ABC123",
        isActive: true,
        playerCount: 12,
        maxPlayers: 30,
        teacher: "Sarah Johnson",
        difficulty: "medium",
        duration: 30,
        currentQuestion: 3,
        totalQuestions: 10
      },
      {
        id: "room-2",
        name: "Animal Vocabulary Race",
        gameType: "vocabulary-race",
        topic: "Animals",
        code: "XYZ789",
        isActive: true,
        playerCount: 8,
        maxPlayers: 20,
        teacher: "Sarah Johnson",
        difficulty: "easy",
        duration: 15
      },
      {
        id: "room-3",
        name: "Travel Tabu Game",
        gameType: "tabu",
        topic: "Travel",
        code: "DEF456",
        isActive: false,
        playerCount: 0,
        maxPlayers: 16,
        teacher: "Sarah Johnson",
        difficulty: "hard",
        duration: 45
      }
    ])

    // Sample game history
    setGameHistory([
      {
        id: "hist-1",
        gameName: "Grammar Quiz Challenge",
        gameType: "quiz",
        score: 85,
        maxScore: 100,
        rank: 3,
        totalPlayers: 25,
        date: "2024-01-19",
        duration: "12 dk"
      },
      {
        id: "hist-2",
        gameName: "Vocabulary Tabu",
        gameType: "tabu",
        score: 92,
        maxScore: 100,
        rank: 1,
        totalPlayers: 18,
        date: "2024-01-17",
        duration: "20 dk"
      },
      {
        id: "hist-3",
        gameName: "Word Guess Challenge",
        gameType: "word-guess",
        score: 78,
        maxScore: 100,
        rank: 7,
        totalPlayers: 22,
        date: "2024-01-15",
        duration: "8 dk"
      }
    ])
  }, [router])

  const joinGameByCode = async () => {
    if (!gameCode.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir oyun kodu girin.",
        variant: "destructive"
      })
      return
    }

    setIsJoining(true)
    
    // Simulate joining game
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const game = activeGames.find(g => g.code === gameCode.toUpperCase())
    
    if (game && game.isActive) {
      setCurrentGame(game)
      setIsJoinDialogOpen(false)
      setGameCode("")
      
      toast({
        title: "Oyuna Katıldınız!",
        description: `${game.name} oyununa başarıyla katıldınız.`,
      })
      
      // Simulate game redirect
      setTimeout(() => {
        toast({
          title: "Oyun Başlayacak",
          description: "Oyun 3 saniye içinde başlayacak...",
        })
      }, 1000)
      
    } else {
      toast({
        title: "Oyun Bulunamadı",
        description: "Bu kodla aktif bir oyun bulunamadı. Kodu kontrol edin.",
        variant: "destructive"
      })
    }
    
    setIsJoining(false)
  }

  const joinGame = (game: GameRoom) => {
    if (!game.isActive) {
      toast({
        title: "Oyun Aktif Değil",
        description: "Bu oyun şu anda aktif değil.",
        variant: "destructive"
      })
      return
    }

    if (game.playerCount >= game.maxPlayers) {
      toast({
        title: "Oyun Dolu",
        description: "Bu oyun maksimum oyuncu sayısına ulaştı.",
        variant: "destructive"
      })
      return
    }

    setCurrentGame(game)
    toast({
      title: "Oyuna Katıldınız!",
      description: `${game.name} oyununa katıldınız. Öğretmen oyunu başlattığında bilgilendirileceksiniz.`,
    })
  }

  const getGameTypeIcon = (gameType: string) => {
    switch (gameType) {
      case "quiz":
        return <Gamepad2 className="w-4 h-4" />
      case "tabu":
        return <Clock className="w-4 h-4" />
      case "word-guess":
        return <Target className="w-4 h-4" />
      case "vocabulary-race":
        return <Zap className="w-4 h-4" />
      default:
        return <Play className="w-4 h-4" />
    }
  }

  const getGameTypeName = (gameType: string) => {
    switch (gameType) {
      case "quiz":
        return "Quiz Oyunu"
      case "tabu":
        return "Tabu Oyunu"
      case "word-guess":
        return "Kelime Tahmin"
      case "vocabulary-race":
        return "Kelime Yarışı"
      default:
        return "Oyun"
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

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-600 bg-yellow-100"
    if (rank <= 3) return "text-gray-600 bg-gray-100"
    if (rank <= 5) return "text-blue-600 bg-blue-100"
    return "text-gray-500 bg-gray-50"
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  if (currentGame) {
    return (
      <div className="p-6">
        <Toaster />
        
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/dashboard/student')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfa'ya Dön
          </Button>
        </div>
        
        {/* Game Waiting Room */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-blue-300 bg-blue-50">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getGameTypeIcon(currentGame.gameType)}
                <CardTitle className="text-2xl text-blue-700">{currentGame.name}</CardTitle>
              </div>
              <CardDescription className="text-blue-600">
                {getGameTypeName(currentGame.gameType)} • {currentGame.topic}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-700 mb-2">{currentGame.code}</div>
                <p className="text-blue-600">Oyun Kodu</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">{currentGame.playerCount}</div>
                  <div className="text-sm text-gray-600">Katılan Oyuncu</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">{currentGame.maxPlayers}</div>
                  <div className="text-sm text-gray-600">Maksimum Oyuncu</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Öğretmen:</span>
                  <span className="font-medium">{currentGame.teacher}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Zorluk:</span>
                  <Badge className={getDifficultyColor(currentGame.difficulty)}>
                    {currentGame.difficulty === "easy" && "Kolay"}
                    {currentGame.difficulty === "medium" && "Orta"}
                    {currentGame.difficulty === "hard" && "Zor"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Süre:</span>
                  <span className="font-medium">{currentGame.duration} dakika</span>
                </div>
              </div>

              <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-700">Oyun Bekleniyor</span>
                </div>
                <p className="text-blue-600 text-sm">
                  Öğretmeniniz oyunu başlattığında otomatik olarak yönlendirileceksiniz.
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setCurrentGame(null)}
                >
                  Oyundan Ayrıl
                </Button>
                <Button className="flex-1" disabled>
                  <Play className="w-4 h-4 mr-2" />
                  Oyun Bekleniyor...
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Toaster />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/dashboard/student')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfa'ya Dön
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Sınıf Oyunları</h1>
            <p className="text-gray-600">Öğretmeninizin oyunlarına katılın ve eğlenerek öğrenin</p>
          </div>
          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Play className="w-4 h-4 mr-2" />
                Kod ile Katıl
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Oyuna Kod ile Katıl</DialogTitle>
                <DialogDescription>
                  Öğretmeninizden aldığınız oyun kodunu girin
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="gameCode" className="text-sm font-medium">
                    Oyun Kodu
                  </label>
                  <Input
                    id="gameCode"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    className="text-center text-lg font-mono"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={joinGameByCode} 
                    className="flex-1"
                    disabled={isJoining || !gameCode.trim()}
                  >
                    {isJoining ? (
                      <>
                        <Search className="w-4 h-4 mr-2 animate-spin" />
                        Aranıyor...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Oyuna Katıl
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>
                    İptal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-8">
        {/* Active Games */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Aktif Oyunlar</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeGames.filter(game => game.isActive).map((game) => (
              <Card key={game.id} className="hover:shadow-lg transition-shadow border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getGameTypeIcon(game.gameType)}
                        {game.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {getGameTypeName(game.gameType)} • {game.topic}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Aktif
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Kod: </span>
                      <span className="font-mono font-bold text-lg">{game.code}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Oyuncu: </span>
                      <span className="font-medium">{game.playerCount}/{game.maxPlayers}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Öğretmen: </span>
                      <span className="font-medium">{game.teacher}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Süre: </span>
                      <span className="font-medium">{game.duration} dk</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Zorluk: </span>
                    <Badge className={getDifficultyColor(game.difficulty)}>
                      {game.difficulty === "easy" && "Kolay"}
                      {game.difficulty === "medium" && "Orta"}
                      {game.difficulty === "hard" && "Zor"}
                    </Badge>
                  </div>

                  {game.currentQuestion && game.totalQuestions && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-blue-700">
                        Devam Ediyor: {game.currentQuestion}/{game.totalQuestions} Soru
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => joinGame(game)} 
                    className="w-full"
                    disabled={game.playerCount >= game.maxPlayers}
                  >
                    {game.playerCount >= game.maxPlayers ? (
                      <>
                        <Users className="w-4 h-4 mr-2" />
                        Oyun Dolu
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Oyuna Katıl
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {activeGames.filter(game => game.isActive).length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Şu anda aktif oyun yok</h3>
                <p className="text-gray-600 mb-4">Öğretmeniniz oyun başlattığında burada görünecek</p>
                <Button onClick={() => setIsJoinDialogOpen(true)}>
                  <Play className="w-4 h-4 mr-2" />
                  Kod ile Katıl
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Game History */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oyun Geçmişim</h2>
          <div className="space-y-4">
            {gameHistory.map((game) => (
              <Card key={game.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getRankColor(game.rank)}`}>
                        {game.rank === 1 ? (
                          <Trophy className="w-5 h-5" />
                        ) : (
                          <span className="font-bold text-sm">#{game.rank}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{game.gameName}</h4>
                        <p className="text-sm text-gray-600">
                          {getGameTypeName(game.gameType)} • {game.date} • {game.duration}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {game.score}/{game.maxScore}
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round((game.score / game.maxScore) * 100)}% • {game.totalPlayers} oyuncu
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {gameHistory.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz oyun oynamadınız</h3>
                <p className="text-gray-600">İlk oyununuzu oynayın ve başarılarınızı burada takip edin!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Upcoming Games */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bekleyen Oyunlar</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeGames.filter(game => !game.isActive).map((game) => (
              <Card key={game.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getGameTypeIcon(game.gameType)}
                        {game.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {getGameTypeName(game.gameType)} • {game.topic}
                      </CardDescription>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">
                      Beklemede
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <span>Öğretmen: </span>
                    <span className="font-medium">{game.teacher}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Bu oyun henüz başlatılmadı. Başlatıldığında bildirim alacaksınız.
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    <Clock className="w-4 h-4 mr-2" />
                    Oyun Bekleniyor
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {activeGames.filter(game => !game.isActive).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Bekleyen oyun bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}