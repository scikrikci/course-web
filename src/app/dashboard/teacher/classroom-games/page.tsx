"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Play, Users, Settings, Plus, RefreshCw, Eye, Trash2, Copy, Timer, Trophy, Gamepad2, Dice1 } from "lucide-react"
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
  createdAt: string
  settings: any
}

interface TabuCard {
  id: string
  word: string
  forbiddenWords: string[]
  topic: string
  difficulty: "easy" | "medium" | "hard"
}

export default function ClassroomGames() {
  const [user, setUser] = useState<User | null>(null)
  const [gameRooms, setGameRooms] = useState<GameRoom[]>([])
  const [activeTab, setActiveTab] = useState("active-games")
  const [isCreatingGame, setIsCreatingGame] = useState(false)
  const [newGameSettings, setNewGameSettings] = useState({
    name: "",
    gameType: "quiz",
    topic: "",
    maxPlayers: 30,
    timeLimit: 60,
    difficulty: "medium"
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

    // Sample game rooms
    setGameRooms([
      {
        id: "room-1",
        name: "Present Perfect Quiz",
        gameType: "quiz",
        topic: "Grammar",
        code: "ABC123",
        isActive: true,
        playerCount: 12,
        maxPlayers: 30,
        createdAt: "2024-01-20T10:30:00Z",
        settings: { timeLimit: 30, questionCount: 10 }
      },
      {
        id: "room-2", 
        name: "Animal Tabu",
        gameType: "tabu",
        topic: "Vocabulary",
        code: "XYZ789",
        isActive: false,
        playerCount: 0,
        maxPlayers: 20,
        createdAt: "2024-01-19T14:20:00Z",
        settings: { timeLimit: 60, roundCount: 5 }
      }
    ])
  }, [router])

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const createGameRoom = () => {
    const newRoom: GameRoom = {
      id: `room-${Date.now()}`,
      name: newGameSettings.name,
      gameType: newGameSettings.gameType as any,
      topic: newGameSettings.topic,
      code: generateRoomCode(),
      isActive: false,
      playerCount: 0,
      maxPlayers: newGameSettings.maxPlayers,
      createdAt: new Date().toISOString(),
      settings: {
        timeLimit: newGameSettings.timeLimit,
        difficulty: newGameSettings.difficulty
      }
    }

    setGameRooms(prev => [newRoom, ...prev])
    setNewGameSettings({
      name: "",
      gameType: "quiz",
      topic: "",
      maxPlayers: 30,
      timeLimit: 60,
      difficulty: "medium"
    })
    setIsCreatingGame(false)

    toast({
      title: "Oyun Odası Oluşturuldu",
      description: `${newRoom.name} oyun odası başarıyla oluşturuldu. Kod: ${newRoom.code}`,
    })
  }

  const startGame = (roomId: string) => {
    setGameRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, isActive: true }
        : room
    ))

    toast({
      title: "Oyun Başlatıldı",
      description: "Öğrenciler artık oyuna katılabilir!",
    })
  }

  const stopGame = (roomId: string) => {
    setGameRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, isActive: false, playerCount: 0 }
        : room
    ))

    toast({
      title: "Oyun Durduruldu",
      description: "Oyun sonlandırıldı.",
    })
  }

  const deleteRoom = (roomId: string) => {
    setGameRooms(prev => prev.filter(room => room.id !== roomId))
    toast({
      title: "Oyun Odası Silindi",
      description: "Oyun odası başarıyla silindi.",
    })
  }

  const getGameTypeIcon = (gameType: string) => {
    switch (gameType) {
      case "quiz":
        return <Gamepad2 className="w-4 h-4" />
      case "tabu":
        return <Timer className="w-4 h-4" />
      case "word-guess":
        return <Dice1 className="w-4 h-4" />
      case "vocabulary-race":
        return <Trophy className="w-4 h-4" />
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
            <h1 className="text-3xl font-bold text-gray-900">Sınıf Oyunları</h1>
            <p className="text-gray-600">İnteraktif oyunlar ile dersinizi eğlenceli hale getirin</p>
          </div>
          <Dialog open={isCreatingGame} onOpenChange={setIsCreatingGame}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Oyun Odası
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Oyun Odası Oluştur</DialogTitle>
                <DialogDescription>
                  Öğrencileriniz için interaktif oyun odası kurun
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gameName">Oyun Adı</Label>
                  <Input
                    id="gameName"
                    value={newGameSettings.name}
                    onChange={(e) => setNewGameSettings(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Örn: Present Perfect Quiz"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gameType">Oyun Türü</Label>
                    <Select value={newGameSettings.gameType} onValueChange={(value) => setNewGameSettings(prev => ({ ...prev, gameType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">Quiz Oyunu</SelectItem>
                        <SelectItem value="tabu">Tabu Oyunu</SelectItem>
                        <SelectItem value="word-guess">Kelime Tahmin</SelectItem>
                        <SelectItem value="vocabulary-race">Kelime Yarışı</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic">Konu</Label>
                    <Input
                      id="topic"
                      value={newGameSettings.topic}
                      onChange={(e) => setNewGameSettings(prev => ({ ...prev, topic: e.target.value }))}
                      placeholder="Örn: Animals, Grammar"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxPlayers">Max Oyuncu</Label>
                    <Input
                      id="maxPlayers"
                      type="number"
                      value={newGameSettings.maxPlayers}
                      onChange={(e) => setNewGameSettings(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) || 30 }))}
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Süre (sn)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      value={newGameSettings.timeLimit}
                      onChange={(e) => setNewGameSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 60 }))}
                      placeholder="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Zorluk</Label>
                    <Select value={newGameSettings.difficulty} onValueChange={(value) => setNewGameSettings(prev => ({ ...prev, difficulty: value }))}>
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

                <div className="flex gap-3 pt-4">
                  <Button onClick={createGameRoom} className="flex-1" disabled={!newGameSettings.name || !newGameSettings.topic}>
                    <Plus className="w-4 h-4 mr-2" />
                    Oyun Odası Oluştur
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreatingGame(false)}>
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
          <TabsTrigger value="active-games">Aktif Oyunlar</TabsTrigger>
          <TabsTrigger value="game-library">Oyun Kütüphanesi</TabsTrigger>
          <TabsTrigger value="game-results">Sonuçlar</TabsTrigger>
        </TabsList>

        <TabsContent value="active-games" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {gameRooms.filter(room => room.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Aktif Oyun</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {gameRooms.reduce((acc, room) => acc + room.playerCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Toplam Oyuncu</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{gameRooms.length}</div>
                <div className="text-sm text-gray-600">Toplam Oda</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(gameRooms.map(room => room.gameType)).size}
                </div>
                <div className="text-sm text-gray-600">Oyun Türü</div>
              </CardContent>
            </Card>
          </div>

          {/* Game Rooms */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {gameRooms.map((room) => (
              <Card key={room.id} className={`${room.isActive ? 'border-green-300 bg-green-50' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getGameTypeIcon(room.gameType)}
                        {room.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {getGameTypeName(room.gameType)} • {room.topic}
                      </CardDescription>
                    </div>
                    <Badge className={room.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {room.isActive ? 'Aktif' : 'Beklemede'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Kod: </span>
                      <span className="font-mono font-bold text-lg">{room.code}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Oyuncu: </span>
                      <span className="font-medium">{room.playerCount}/{room.maxPlayers}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    Oluşturulma: {new Date(room.createdAt).toLocaleDateString('tr-TR')}
                  </div>

                  <div className="flex gap-2">
                    {!room.isActive ? (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => startGame(room.id)}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Başlat
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => stopGame(room.id)}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Durdur
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      İzle
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteRoom(room.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  {room.isActive && (
                    <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-green-800">
                        🎮 Oyun Aktif!
                      </div>
                      <div className="text-xs text-green-700 mt-1">
                        Öğrenciler <strong>{room.code}</strong> kodu ile katılabilir
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {gameRooms.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz oyun odası yok</h3>
                <p className="text-gray-600 mb-4">İlk oyun odanızı oluşturun ve öğrencilerinizle eğlenceli aktiviteler düzenleyin.</p>
                <Button onClick={() => setIsCreatingGame(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Oyunu Oluştur
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="game-library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Oyun Şablonları</CardTitle>
              <CardDescription>
                Hazır oyun şablonları ve özelleştirme seçenekleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Gamepad2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-medium mb-2">Hızlı Quiz</h3>
                    <p className="text-sm text-gray-600 mb-4">Anlık quiz soruları</p>
                    <Button variant="outline" size="sm">Kullan</Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-200 hover:border-green-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Timer className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-medium mb-2">Tabu Oyunu</h3>
                    <p className="text-sm text-gray-600 mb-4">Kelime anlatma oyunu</p>
                    <Button variant="outline" size="sm">Kullan</Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-medium mb-2">Kelime Yarışı</h3>
                    <p className="text-sm text-gray-600 mb-4">Hızlı kelime bulma</p>
                    <Button variant="outline" size="sm">Kullan</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="game-results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Oyun Sonuçları</CardTitle>
              <CardDescription>
                Geçmiş oyunların istatistikleri ve skorları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz tamamlanmış oyun yok</h3>
                <p className="text-gray-600">Oyunlar tamamlandığında sonuçlar burada görünecek.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}