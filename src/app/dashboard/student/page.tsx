"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Bell, Search, Settings, LogOut, Menu, X, BookOpen, FileText, Award, Calendar, MessageSquare, Brain, User, Shield, Palette, Save, Clock, Play, Pause, SkipForward, Send, Gamepad2, Users, Trophy, Target, Zap, CheckCircle, AlertCircle, Flame, Crown, Star, Medal } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { GamificationSystem } from "@/components/gamification/GameificationSystem"
import MessagesView from "@/components/messages/MessagesView"
import AttendanceCalendar, { AttendanceRecord } from "@/components/attendance/AttendanceCalendar"
import SimpleAttendanceCard from "@/components/attendance/SimpleAttendanceCard"

interface User {
  id: number
  username: string
  role: string
  level?: string
  name: string
  email: string
  avatar: string
}

interface Course {
  id: string
  title: string
  level: string
  description: string
  duration: number
  startDate: string
  endDate: string
  teacherId: string
  isActive: boolean
}

interface Enrollment {
  id: string
  userId: string
  courseId: string
  status: 'ACTIVE' | 'FROZEN' | 'COMPLETED' | 'DROPPED'
  enrolledAt: string
  completedAt?: string
  freezeCount: number
  course: Course
  freezes: CourseFreeze[]
}

interface CourseFreeze {
  id: string
  reason?: string
  frozenAt: string
  unfrozenAt?: string
  isActive: boolean
}

interface CourseProgression {
  id: string
  userId: string
  courseId: string
  nextCourseId?: string
  willContinue: boolean
  notifiedAt?: string
  course: { title: string; endDate: string }
  nextCourse?: { title: string; startDate: string }
}

interface Message {
  id: string
  senderId: string
  receiverId?: string
  courseId?: string
  subject: string
  content: string
  messageType: 'PERSONAL' | 'COURSE_ANNOUNCEMENT' | 'FREEZE_REQUEST' | 'CONTINUATION_NOTICE'
  isRead: boolean
  sentAt: string
  sender: { name: string; role: string }
}

interface MenuItem {
  id: string
  title: string
  icon: React.ReactNode
  href: string
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

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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
  }, [router])

  // URL'den ?tab=... parametresi gelirse activeTab'i senkronize et
  useEffect(() => {
    const tab = searchParams?.get('tab')
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    // MOCK: API entegrasyonu yerine örnek devam verisi
    const today = new Date()
    const records: AttendanceRecord[] = []
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const iso = d.toISOString().slice(0, 10)
      const day = d.getDay()
      if (day === 0 || day === 6) continue // hafta sonu
      const rnd = Math.random()
      const status = rnd > 0.9 ? "absent" : rnd > 0.8 ? "late" : rnd > 0.75 ? "excused" : "present"
      records.push({ date: iso, status })
    }
    setAttendanceRecords(records)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/')
  }

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      title: "Ana Sayfa",
      icon: <BookOpen className="w-5 h-5" />,
      href: "/dashboard/student"
    },
    {
      id: "courses",
      title: "Derslerim",
      icon: <BookOpen className="w-5 h-5" />,
      href: "/dashboard/student/courses"
    },
    {
      id: "assignments",
      title: "Ödevlerim",
      icon: <FileText className="w-5 h-5" />,
      href: "/dashboard/student/assignments"
    },
    {
      id: "grades",
      title: "Notlarım",
      icon: <Award className="w-5 h-5" />,
      href: "/dashboard/student/grades"
    },
    {
      id: "calendar",
      title: "Takvim",
      icon: <Calendar className="w-5 h-5" />,
      href: "/dashboard/student/calendar"
    },
    // Mesajlar menüden kaldırıldı; bildirim butonundan açılacak
    {
      id: "ai-assistant",
      title: "AI Asistan",
      icon: <Brain className="w-5 h-5" />,
      href: "/dashboard/student/ai-assistant"
    },
    {
      id: "classroom",
      title: "Sınıfım",
      icon: <User className="w-5 h-5" />,
      href: "/dashboard/student/classroom"
    },
    {
      id: "games",
      title: "Sınıf Oyunları",
      icon: <Gamepad2 className="w-5 h-5" />,
      href: "/dashboard/student/games"
    },
    {
      id: "achievements",
      title: "Başarılarım",
      icon: <Trophy className="w-5 h-5" />,
      href: "/dashboard/student/achievements"
    }
  ]

  // Tab yönetimi için state kullanıyoruz

  const getPageTitle = () => {
    if (activeTab === "messages") return "Mesajlar"
    const currentItem = menuItems.find(item => item.id === activeTab)
    return currentItem?.title || "Ana Sayfa"
  }

  const getPageDescription = () => {
    switch (activeTab) {
      case "dashboard":
        return "Öğrenci panelindesin. Derslerini takip et, ödevlerini teslim et."
      case "courses":
        return "Aldığın dersleri görüntüle ve ders materyallerine eriş."
      case "assignments":
        return "Ödevlerini görüntüle, teslim et ve geri bildirimlerini incele."
      case "grades":
        return "Not ortalamanı ve sınav sonuçlarını takip et."
      case "calendar":
        return "Ders programın ve önemli tarihleri görüntüle."
      case "messages":
        return "Öğretmenlerinden gelen mesajları oku."
      case "ai-assistant":
        return "Kişisel AI asistanınızdan öğrenme desteği alın."
      case "classroom":
        return "Sınıf içi etkinlikleri ve paylaşımları görüntüleyin."
      case "games":
        return "Öğretmeninizin oyunlarına katılın ve eğlenerek öğrenin."
      case "achievements":
        return "Başarılarınızı görüntüleyin ve hedeflerinizi takip edin."
      case "settings":
        return "Profil bilgilerini ve tercihlerini yönet."
      default:
        return "Öğrenci paneli"
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "courses":
        return <CoursesContent />
      case "assignments":
        return <AssignmentsContent />
      case "grades":
        return <GradesContent />
      case "calendar":
        return <CalendarContent />
      case "messages":
        return <MessagesView showHeader={false} />
      case "ai-assistant":
        return <AIAssistantContent />
      case "classroom":
        return <ClassroomContent />
      case "games":
        return <GamesContent />
      case "achievements":
        return <AchievementsContent />
      case "settings":
        return user ? <SettingsContent user={user} setUser={setUser} /> : <div>Yükleniyor...</div>
      default:
        return <DashboardContent setActiveTab={setActiveTab} attendanceRecords={attendanceRecords} />
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-screen overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <img src="/education.svg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl text-blue-600">Öğrenci Paneli</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 relative ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600'
                    : 'text-gray-700'
                }`}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
              >
                {item.icon}
                {item.title}
                {/* Bildirim göstergeleri */}
                {item.id === "assignments" && (
                  <Badge className="ml-auto bg-red-500 text-white text-xs">3</Badge>
                )}
                 {/* messages göstergesi kaldırıldı */}
                {item.id === "grades" && (
                  <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </button>
            ))}
            <button
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-blue-50 ${
                activeTab === "settings"
                  ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600'
                  : 'text-gray-700'
              }`}
              onClick={() => {
                setActiveTab("settings")
                setSidebarOpen(false)
              }}
            >
              <Settings className="w-5 h-5" />
              Ayarlar
            </button>
          </div>
        </nav>

        <div className="p-6 border-t bg-white shrink-0 relative space-y-3">
          {/* Bildirim Butonu - mesaj paneli buradan açılacak */}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setIsNotificationsOpen(true)}>
            <Bell className="w-4 h-4 mr-2" />
            Bildirimler
          </Button>
          
          {/* User Profile - Ayarlar'a yönlendir */}
          <button 
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            onClick={() => setActiveTab("settings")}
          >
            <Avatar>
              <AvatarFallback className="bg-blue-100 text-blue-700">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{user.name}</p>
              <Badge className="bg-blue-100 text-blue-800">Öğrenci</Badge>
              {user.level && <Badge variant="outline" className="ml-1">{user.level}</Badge>}
            </div>
          </button>
          
          {/* Çıkış Butonu */}
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen flex flex-col">
        {/* Mobile Menu Button */}
        <div className="lg:hidden p-4 bg-white border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 mr-2" />
            Menü
          </Button>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === "dashboard" ? `Hoş Geldin, ${user.name}!` : getPageTitle()}
            </h1>
            <p className="text-gray-600">
              {getPageDescription()}
            </p>
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </main>
      </div>

      {/* Notifications / Messages Panel */}
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Mesajlar ve Bildirimler</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {[ 
              { from: "Öğretmen", text: "Quiz 5 yarın yapılacak.", time: "09:12" },
              { from: "Sistem", text: "Ders materyali eklendi.", time: "Dün" },
              { from: "9-A Grubu", text: "Speaking practice 14:00'da.", time: "2 gün önce" }
            ].map((m, idx) => (
              <div key={idx} className="p-3 border rounded-lg bg-white">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{m.from}</p>
                  <span className="text-xs text-gray-500">{m.time}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{m.text}</p>
              </div>
            ))}
            <Button 
              className="w-full"
              onClick={() => {
                setIsNotificationsOpen(false)
                router.push('/dashboard/student?tab=messages')
              }}
            >
              Tüm Mesajları Gör
            </Button>
            <Button className="w-full" variant="outline" onClick={() => setIsNotificationsOpen(false)}>Kapat</Button>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Floating Action Button - Modern AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 hover:rotate-6"
          onClick={() => setActiveTab('ai-assistant')}
        >
          <Brain className="w-6 h-6 text-white" />
        </Button>
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">AI</span>
        </div>
      </div>
      
      <Toaster />
    </div>
  )
}

// Dashboard Content Component  
function DashboardContent({ setActiveTab, attendanceRecords }: { setActiveTab: (tab: string) => void; attendanceRecords: AttendanceRecord[] }) {
  const router = useRouter()
  const [currentCourse, setCurrentCourse] = useState({
    name: "İngilizce B1",
    level: "B1",
    progress: 75,
    totalModules: 12,
    completedModules: 9,
    currentModule: "Unit 10: Present Perfect Tense",
    teacher: "Sarah Johnson",
    vocabulary: {
      learned: 420,
      total: 560,
      recent: ["achievement", "challenge", "opportunity", "responsibility", "environment"]
    }
  })

  // Gamification quick stats
  const quickStats = {
    points: 2750,
    streak: 12,
    level: 7,
    rank: 3
  }

  const [completedTopics, setCompletedTopics] = useState([
    {
      id: 1,
      title: "Present Simple & Present Continuous",
      module: "Unit 1",
      completedAt: "2024-01-15",
      score: 92,
      difficulty: "easy"
    },
    {
      id: 2,
      title: "Past Simple & Past Continuous",
      module: "Unit 2", 
      completedAt: "2024-01-22",
      score: 88,
      difficulty: "medium"
    },
    {
      id: 3,
      title: "Future Tenses & Going to",
      module: "Unit 3",
      completedAt: "2024-01-29",
      score: 95,
      difficulty: "medium"
    },
    {
      id: 4,
      title: "Modal Verbs (Can, Could, Must)",
      module: "Unit 4",
      completedAt: "2024-02-05",
      score: 85,
      difficulty: "hard"
    },
    {
      id: 5,
      title: "Comparative & Superlative",
      module: "Unit 5", 
      completedAt: "2024-02-12",
      score: 90,
      difficulty: "medium"
    },
    {
      id: 6,
      title: "Conditional Sentences (Type 1)",
      module: "Unit 6",
      completedAt: "2024-02-19",
      score: 83,
      difficulty: "hard"
    },
    {
      id: 7,
      title: "Passive Voice - Present & Past",
      module: "Unit 7",
      completedAt: "2024-02-26",
      score: 87,
      difficulty: "hard"
    },
    {
      id: 8,
      title: "Question Forms & Question Tags",
      module: "Unit 8",
      completedAt: "2024-03-05",
      score: 94,
      difficulty: "medium"
    },
    {
      id: 9,
      title: "Reported Speech - Statements",
      module: "Unit 9",
      completedAt: "2024-03-12",
      score: 89,
      difficulty: "hard"
    }
  ])

  const [levelVocabulary, setLevelVocabulary] = useState([
    { word: "achievement", meaning: "başarı, kazanım", category: "Education", learned: true },
    { word: "challenge", meaning: "zorluk, meydan okuma", category: "General", learned: true },
    { word: "opportunity", meaning: "fırsat, imkan", category: "Business", learned: true },
    { word: "responsibility", meaning: "sorumluluk", category: "Work", learned: true },
    { word: "environment", meaning: "çevre, ortam", category: "Nature", learned: true },
    { word: "consequence", meaning: "sonuç, netice", category: "General", learned: false },
    { word: "investigate", meaning: "araştırmak, incelemek", category: "Academic", learned: false },
    { word: "appreciate", meaning: "takdir etmek, değer vermek", category: "Social", learned: false },
    { word: "fundamental", meaning: "temel, esas", category: "Academic", learned: false },
    { word: "significant", meaning: "önemli, anlamlı", category: "Academic", learned: false }
  ])

  return (
    <div className="space-y-6">
      {/* Öğretmenle İletişim - öğrenci sekmesi içinde */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Öğretmeninizle İletişim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-700">MK</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Mehmet Kaya</p>
                <p className="text-sm text-gray-600">İngilizce Öğretmeni</p>
              </div>
            </div>
            <TeacherChatDialogInline />
          </div>
        </CardContent>
      </Card>
      {/* Gamification Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{quickStats.points}</p>
                <p className="text-sm text-gray-600">Toplam Puan</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{quickStats.streak}</p>
                <p className="text-sm text-gray-600">Günlük Seri</p>
              </div>
              <Flame className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{quickStats.level}</p>
                <p className="text-sm text-gray-600">Seviye</p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">#{quickStats.rank}</p>
                <p className="text-sm text-gray-600">Sıralama</p>
              </div>
              <Crown className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Günlük Hedefler ve Hızlı Aksiyonlar */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Günlük Hedef */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-green-600" />
              Bugünkü Hedefin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">30 dk ders çalış</span>
                <Badge className="bg-green-100 text-green-800">✓ Tamamlandı</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">5 kelime öğren</span>
                <Badge className="bg-yellow-100 text-yellow-800">3/5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">1 ödev teslim et</span>
                <Badge className="bg-red-100 text-red-800">Bekliyor</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bugünkü Dersler */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-blue-600" />
              Bugün
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">İngilizce B1</div>
                  <div className="text-xs text-gray-500">14:00 - 15:30</div>
                </div>
                <Badge variant="outline">2 saat</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">Grammar Quiz</div>
                  <div className="text-xs text-gray-500">Son teslim: 23:59</div>
                </div>
                <Button 
                  size="sm" 
                  className="h-6 text-xs hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-200 active:scale-95"
                  onClick={() => {
                    alert('Grammar Quiz başlatılıyor! Hazır mısın?')
                    // TODO: Quiz modülüne yönlendirme
                  }}
                >
                  Başla
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hızlı Aksiyonlar */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Play className="w-4 h-4 text-purple-600" />
              Hızlı Erişim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                size="sm" 
                className="w-full justify-start hover:bg-green-50 hover:border-green-300 hover:text-green-700 transform hover:scale-105 transition-all duration-200 active:scale-95" 
                variant="outline"
                onClick={() => setActiveTab('assignments')}
              >
                <FileText className="w-3 h-3 mr-2" />
                Ödev Teslim Et
              </Button>
              <Button 
                size="sm" 
                className="w-full justify-start hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transform hover:scale-105 transition-all duration-200 active:scale-95" 
                variant="outline"
                onClick={() => setActiveTab('messages')}
              >
                <MessageSquare className="w-3 h-3 mr-2" />
                Öğretmene Sor
              </Button>
              <Button 
                size="sm" 
                className="w-full justify-start hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transform hover:scale-105 transition-all duration-200 active:scale-95" 
                variant="outline"
                onClick={() => setActiveTab('ai-assistant')}
              >
                <Brain className="w-3 h-3 mr-2" />
                AI Yardım Al
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mevcut Kurs Bilgileri */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Mevcut Kursum: {currentCourse.name}
            <Badge className="bg-blue-100 text-blue-800 ml-2">🏆 3 gün streak</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{currentCourse.level}</div>
              <div className="text-sm text-gray-600">Seviye</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{currentCourse.progress}%</div>
              <div className="text-sm text-gray-600">Tamamlandı</div>
              <div className="text-xs text-green-600 mt-1">↑ %5 bu hafta</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{currentCourse.completedModules}/{currentCourse.totalModules}</div>
              <div className="text-sm text-gray-600">Modül</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{currentCourse.vocabulary.learned}/{currentCourse.vocabulary.total}</div>
              <div className="text-sm text-gray-600">Kelime</div>
              <div className="text-xs text-orange-600 mt-1">+15 bu hafta</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>İlerleme</span>
              <span>{currentCourse.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${currentCourse.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="font-medium text-blue-700">Şu Anda İşlenen Konu:</div>
            <div className="text-blue-600">{currentCourse.currentModule}</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* B1 Seviye Kelimeleri */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              {currentCourse.level} Seviye Kelimeler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Öğrenilen: {currentCourse.vocabulary.learned}</span>
                <span>Toplam: {currentCourse.vocabulary.total}</span>
            </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(currentCourse.vocabulary.learned / currentCourse.vocabulary.total) * 100}%` }}
                ></div>
            </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Son Öğrenilenler:</div>
                {levelVocabulary.slice(0, 5).map((vocab, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <div>
                      <span className="font-medium">{vocab.word}</span>
                      <span className="text-sm text-gray-600 ml-2">{vocab.meaning}</span>
            </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {vocab.category}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-3 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transform hover:scale-105 transition-all duration-200 active:scale-95"
                onClick={() => setActiveTab('vocabulary')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Tüm {currentCourse.level} Kelimeleri
              </Button>
          </div>
        </CardContent>
      </Card>

        {/* Tamamlanan Konular */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Tamamlanan Konular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {completedTopics.map((topic) => (
                <div key={topic.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{topic.title}</h4>
                      <p className="text-xs text-gray-600">{topic.module}</p>
                    </div>
                    <Badge 
                      className={
                        topic.score >= 90 ? "bg-green-100 text-green-800" :
                        topic.score >= 80 ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {topic.score}/100
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      {new Date(topic.completedAt).toLocaleDateString('tr-TR')}
                    </span>
                    <Badge 
                      variant="outline"
                      className={
                        topic.difficulty === "easy" ? "text-green-600 border-green-300" :
                        topic.difficulty === "medium" ? "text-yellow-600 border-yellow-300" :
                        "text-red-600 border-red-300"
                      }
                    >
                      {topic.difficulty === "easy" && "Kolay"}
                      {topic.difficulty === "medium" && "Orta"}
                      {topic.difficulty === "hard" && "Zor"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-3 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transform hover:scale-105 transition-all duration-200 active:scale-95"
              onClick={() => setActiveTab('topics')}
            >
              <Clock className="w-4 h-4 mr-2" />
              Tüm Konu Geçmişi
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Devam Durumu (Basit Kart) */}
      <SimpleAttendanceCard />

      {/* Daily Challenge - Modern Card */}
      <Card className="border-l-4 border-l-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Günlük Meydan Okuma
            </div>
            <Badge className="bg-purple-100 text-purple-800">+50 XP</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-purple-900">Kelime Ustası</h3>
              <p className="text-sm text-purple-700">5 yeni kelimeyi öğren ve kullan</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>İlerleme</span>
                <span className="font-medium">3/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: '60%' }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 active:scale-95"
                onClick={() => setActiveTab('vocabulary')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Kelimeleri Gör
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 hover:text-purple-800 transform hover:scale-105 transition-all duration-200 active:scale-95"
                onClick={() => {
                  alert('Kelime testi başlatılıyor! 5 rastgele kelime ile test edileceksin.')
                  // TODO: Vocabulary test modülüne yönlendirme
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Test Et
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Haftalık İlerleme ve Aktif Çalışmalar */}
      <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
              Bu Hafta Yapılacaklar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <div>
                  <p className="font-medium">Unit 10 Quiz</p>
                  <p className="text-sm text-gray-600">Present Perfect Tense</p>
              </div>
                <Badge className="bg-red-100 text-red-800">2 gün</Badge>
            </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                  <p className="font-medium">Vocabulary Practice</p>
                  <p className="text-sm text-gray-600">20 yeni kelime</p>
              </div>
                <Badge className="bg-green-100 text-green-800">Tamamlandı</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Speaking Exercise</p>
                  <p className="text-sm text-gray-600">Job Interview Role Play</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">4 gün</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

        <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-red-600" />
              Başarı İstatistikleri
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Genel Ortalama</span>
                  <span className="font-bold">88.5</span>
            </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '88.5%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">7</div>
                  <div className="text-xs text-gray-600">Bu Ay Quiz</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">95%</div>
                  <div className="text-xs text-gray-600">Devam Oranı</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">12h</div>
                  <div className="text-xs text-gray-600">Bu Hafta</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">3</div>
                  <div className="text-xs text-gray-600">Rank</div>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Weekly Progress Tracking - Modern Design */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Bu Hafta İlerleme Takibi
            </div>
            <Badge className="bg-indigo-100 text-indigo-800">Seviye {quickStats.level}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Study Hours */}
            <div className="text-center space-y-3">
              <div className="relative w-20 h-20 mx-auto">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.75)}`}
                    className="text-blue-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">75%</span>
                </div>
              </div>
              <div>
                <p className="font-medium text-blue-900">Çalışma Saati</p>
                <p className="text-sm text-gray-600">15h / 20h hedef</p>
              </div>
            </div>

            {/* Vocabulary */}
            <div className="text-center space-y-3">
              <div className="relative w-20 h-20 mx-auto">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.6)}`}
                    className="text-green-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">60%</span>
                </div>
              </div>
              <div>
                <p className="font-medium text-green-900">Kelime Hedefi</p>
                <p className="text-sm text-gray-600">18 / 30 kelime</p>
              </div>
            </div>

            {/* Exercises */}
            <div className="text-center space-y-3">
              <div className="relative w-20 h-20 mx-auto">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.9)}`}
                    className="text-purple-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-600">90%</span>
                </div>
              </div>
              <div>
                <p className="font-medium text-purple-900">Egzersizler</p>
                <p className="text-sm text-gray-600">9 / 10 tamamlandı</p>
              </div>
            </div>
          </div>

          {/* Weekly Overview */}
          <div className="mt-6 grid grid-cols-7 gap-2">
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-600 mb-1">{day}</div>
                <div className={`h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                  index < 5 ? 'bg-green-100 text-green-800' : 
                  index === 5 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-400'
                }`}>
                  {index < 5 ? '✓' : index === 5 ? '🎯' : '-'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Günlük Program */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Bu Haftaki Derslerim - {currentCourse.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">Pazartesi</h4>
              <div className="space-y-1">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">09:00 - Grammar</span>
                  <Badge variant="secondary">Present Perfect</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">14:00 - Speaking</span>
                  <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-purple-600">Çarşamba</h4>
              <div className="space-y-1">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">10:00 - Reading</span>
                  <Badge variant="outline">Comprehension</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium">15:00 - Vocabulary</span>
                  <Badge className="bg-orange-100 text-orange-800">B1 Words</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-red-600">Cuma</h4>
              <div className="space-y-1">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium">09:00 - Writing</span>
                  <Badge variant="destructive">Essay Practice</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="text-sm font-medium">14:00 - Quiz</span>
                  <Badge className="bg-indigo-100 text-indigo-800">Unit 10 Test</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Content Components for each tab
function CoursesContent() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)
  const [freezeReason, setFreezeReason] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [messageSubject, setMessageSubject] = useState("")
  const { toast } = useToast()

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userData = localStorage.getItem('currentUser')
    return userData ? JSON.parse(userData) : null
  }

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const user = getCurrentUser()
      if (!user) return

      const response = await fetch(`/api/enrollments?userId=${user.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setEnrollments(data.enrollments)
      } else {
        toast({
          title: "Hata",
          description: "Kurs bilgileri yüklenirken bir sorun oluştu.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFreezeCourse = async (enrollmentId: string) => {
    try {
      const user = getCurrentUser()
      if (!user) return

      const response = await fetch('/api/courses/freeze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          reason: freezeReason,
          userId: user.id
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "İstek Gönderildi",
          description: data.message,
        })
        setFreezeReason("")
        fetchEnrollments() // Refresh data
      } else {
        toast({
          title: "Hata",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error freezing course:', error)
      toast({
        title: "Hata",
        description: "Kurs dondurma isteği gönderilirken bir sorun oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async (receiverId: string, courseId: string) => {
    try {
      const user = getCurrentUser()
      if (!user) return

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId,
          courseId,
          subject: messageSubject,
          content: messageContent,
          messageType: 'PERSONAL'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Mesaj Gönderildi",
          description: data.message,
        })
        setMessageContent("")
        setMessageSubject("")
      } else {
        toast({
          title: "Hata",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Hata",
        description: "Mesaj gönderilirken bir sorun oluştu.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case 'FROZEN':
        return <Badge className="bg-blue-100 text-blue-800">Donduruldu</Badge>
      case 'COMPLETED':
        return <Badge className="bg-purple-100 text-purple-800">Tamamlandı</Badge>
      case 'DROPPED':
        return <Badge className="bg-red-100 text-red-800">Bırakıldı</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="text-center py-8">Kurs bilgileri yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Henüz kayıtlı olduğunuz bir kurs bulunmamaktadır.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    {enrollment.course.title}
                  </span>
                  {getStatusBadge(enrollment.status)}
                </CardTitle>
                <CardDescription>
                  Seviye: {enrollment.course.level} • Süre: {enrollment.course.duration} hafta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Başlangıç:</span>
                    <p className="font-medium">{formatDate(enrollment.course.startDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Bitiş:</span>
                    <p className="font-medium">{formatDate(enrollment.course.endDate)}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{enrollment.course.description}</p>
                </div>

                {enrollment.freezeCount > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Bu kursu {enrollment.freezeCount} kez dondurmuşsunuz.
                    </p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline">
                    <Play className="w-4 h-4 mr-1" />
                    Derse Katıl
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedEnrollment(enrollment)}>
                        <Pause className="w-4 h-4 mr-1" />
                        Kursu Dondur
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Kursu Dondur</DialogTitle>
                        <DialogDescription>
                          {enrollment.course.title} kursunu dondurma isteği göndermek üzeresiniz.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="reason">Dondurma Sebebi (İsteğe bağlı)</Label>
                          <Textarea
                            id="reason"
                            placeholder="Kursunuzu neden dondurmak istediğinizi belirtebilirsiniz..."
                            value={freezeReason}
                            onChange={(e) => setFreezeReason(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setFreezeReason("")}>
                          İptal
                        </Button>
                        <Button onClick={() => handleFreezeCourse(enrollment.id)}>
                          Dondurma İsteği Gönder
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedEnrollment(enrollment)}>
                        <Send className="w-4 h-4 mr-1" />
                        Mesaj Gönder
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Öğretmene Mesaj Gönder</DialogTitle>
                        <DialogDescription>
                          {enrollment.course.title} kursu hakkında öğretmeninize mesaj gönderin.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="subject">Konu</Label>
                          <Input
                            id="subject"
                            placeholder="Mesaj konusu..."
                            value={messageSubject}
                            onChange={(e) => setMessageSubject(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Mesaj</Label>
                          <Textarea
                            id="message"
                            placeholder="Mesajınızı yazın..."
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setMessageContent("")
                          setMessageSubject("")
                        }}>
                          İptal
                        </Button>
                        <Button onClick={() => handleSendMessage(enrollment.course.teacherId, enrollment.courseId)}>
                          Mesaj Gönder
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {enrollment.status === 'ACTIVE' && new Date(enrollment.course.endDate) <= new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) && (
                    <CourseProgressionDialog enrollment={enrollment} onUpdate={fetchEnrollments} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Kurs devam etme dialog componenti
function CourseProgressionDialog({ enrollment, onUpdate }: { enrollment: Enrollment, onUpdate: () => void }) {
  const [willContinue, setWillContinue] = useState(false)
  const [nextCourseId, setNextCourseId] = useState("")
  const [availableNextCourses, setAvailableNextCourses] = useState<any[]>([])
  const { toast } = useToast()

  const getCurrentUser = () => {
    const userData = localStorage.getItem('currentUser')
    return userData ? JSON.parse(userData) : null
  }

  const handleCourseProgression = async () => {
    try {
      const user = getCurrentUser()
      if (!user) return

      const response = await fetch('/api/courses/continue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: enrollment.courseId,
          nextCourseId: willContinue ? nextCourseId : null,
          willContinue
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Bildirim Gönderildi",
          description: data.message,
        })
        setAvailableNextCourses(data.availableNextCourses || [])
        onUpdate()
      } else {
        toast({
          title: "Hata",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error processing course progression:', error)
      toast({
        title: "Hata",
        description: "İstek gönderilirken bir sorun oluştu.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="default" className="bg-orange-600 hover:bg-orange-700">
          <SkipForward className="w-4 h-4 mr-1" />
          Sonraki Kurs
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kurs Tamamlanma Bildirimi</DialogTitle>
          <DialogDescription>
            {enrollment.course.title} kursunuz yakında tamamlanacak. Bir sonraki kura devam etmek istiyor musunuz?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">📅 Kurs Bitiş Tarihi</h4>
            <p className="text-sm text-yellow-700">
              {new Date(enrollment.course.endDate).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="continue-yes"
                name="continuation"
                checked={willContinue}
                onChange={() => setWillContinue(true)}
                className="w-4 h-4"
              />
              <Label htmlFor="continue-yes">Evet, bir sonraki kura devam etmek istiyorum</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="continue-no"
                name="continuation"
                checked={!willContinue}
                onChange={() => setWillContinue(false)}
                className="w-4 h-4"
              />
              <Label htmlFor="continue-no">Hayır, kursumu tamamlıyorum</Label>
            </div>
          </div>

          {willContinue && availableNextCourses.length > 0 && (
            <div className="space-y-2">
              <Label>Devam etmek istediğiniz kurs:</Label>
              <select 
                className="w-full p-2 border rounded-lg"
                value={nextCourseId}
                onChange={(e) => setNextCourseId(e.target.value)}
              >
                <option value="">Bir kurs seçin...</option>
                {availableNextCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.level}) - {new Date(course.startDate).toLocaleDateString('tr-TR')}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline">İptal</Button>
          <Button onClick={handleCourseProgression}>
            Bildirimi Gönder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AssignmentsContent() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [assignmentModal, setAssignmentModal] = useState(false)
  const [submissionText, setSubmissionText] = useState("")
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all')
  const { toast } = useToast()

  const mockAssignments = [
    {
      id: 'assign_1',
      courseId: '1',
      courseName: 'İngilizce B1',
      title: 'Essay Writing: My Future Career',
      description: 'Gelecekteki kariyeriniz hakkında 300-400 kelimelik bir kompozisyon yazın. Present Perfect ve Future tenses kullanmaya özen gösterin.',
      type: 'essay',
      skill: 'writing',
      dueDate: '2024-03-25T23:59:00Z',
      submittedAt: null,
      grade: null,
      status: 'pending',
      instructions: 'Kompozisyonunuzda şu konulara değinin:\n1. Ne iş yapmak istiyorsunuz?\n2. Bu iş için hangi becerilere ihtiyacınız var?\n3. Hedefinize ulaşmak için ne yapıyorsunuz?\n\nMinimum 300, maksimum 400 kelime kullanın.',
      maxScore: 100
    },
    {
      id: 'assign_2',
      courseId: '1',
      courseName: 'İngilizce B1',
      title: 'Listening Comprehension Quiz',
      description: 'Unit 5 listening materyallerini dinleyin ve soruları cevaplayın.',
      type: 'quiz',
      skill: 'listening',
      dueDate: '2024-03-20T23:59:00Z',
      submittedAt: null,
      grade: null,
      status: 'overdue',
      instructions: 'Video linkini izleyin ve 10 soruyu cevaplayın. Her soru 10 puan değerindedir.',
      maxScore: 100
    },
    {
      id: 'assign_3',
      courseId: '2',
      courseName: 'Almanca A2',
      title: 'Gramer Alıştırmaları: Dativ Case',
      description: 'Dativ durumu ile ilgili alıştırmaları tamamlayın.',
      type: 'exercise',
      skill: 'grammar',
      dueDate: '2024-03-28T23:59:00Z',
      submittedAt: null,
      grade: null,
      status: 'pending',
      instructions: '20 cümleyi Dativ kurallarına göre tamamlayın. Her doğru cevap 5 puan değerindedir.',
      maxScore: 100
    },
    {
      id: 'assign_4',
      courseId: '1',
      courseName: 'İngilizce B1',
      title: 'Vocabulary Test Unit 4',
      description: 'Unit 4 kelime bilgisi testi',
      type: 'test',
      skill: 'vocabulary',
      dueDate: '2024-03-10T23:59:00Z',
      submittedAt: '2024-03-09T14:30:00Z',
      grade: 85,
      status: 'completed',
      instructions: '50 kelime ve tanımını eşleştirin.',
      maxScore: 100
    }
  ]

  useEffect(() => {
    setAssignments(mockAssignments)
  }, [])

  const getStatusColor = (status: string, dueDate: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-800'
    if (status === 'overdue') return 'bg-red-100 text-red-800'
    
    const now = new Date()
    const due = new Date(dueDate)
    const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysLeft <= 1) return 'bg-red-100 text-red-800'
    if (daysLeft <= 3) return 'bg-orange-100 text-orange-800'
    return 'bg-blue-100 text-blue-800'
  }

  const getStatusText = (status: string, dueDate: string) => {
    if (status === 'completed') return 'Tamamlandı'
    if (status === 'overdue') return 'Gecikmiş'
    
    const now = new Date()
    const due = new Date(dueDate)
    const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysLeft <= 0) return 'Bugün Son Gün'
    if (daysLeft === 1) return '1 Gün Kaldı'
    return `${daysLeft} Gün Kaldı`
  }

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'writing': return '✍️'
      case 'reading': return '📖'
      case 'listening': return '👂'
      case 'speaking': return '🗣️'
      case 'grammar': return '📝'
      case 'vocabulary': return '📚'
      default: return '📋'
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true
    if (filter === 'completed') return assignment.status === 'completed'
    if (filter === 'overdue') return assignment.status === 'overdue'
    if (filter === 'pending') return assignment.status === 'pending'
    return true
  })

  const handleSubmitAssignment = () => {
    if (!submissionText.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen ödevinizi yazın.",
        variant: "destructive"
      })
      return
    }

    // Mock submission
    setAssignments(prev => prev.map(a => 
      a.id === selectedAssignment.id 
        ? { ...a, status: 'completed', submittedAt: new Date().toISOString() }
        : a
    ))

    toast({
      title: "Ödev Gönderildi",
      description: "Ödeviniz başarıyla teslim edildi."
    })

    setSubmissionText("")
    setAssignmentModal(false)
    setSelectedAssignment(null)
  }

  return (
    <div className="space-y-6">
      {/* Filtreler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Ödevlerim
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button 
              size="sm" 
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              Tümü ({assignments.length})
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
            >
              Bekleyen ({assignments.filter(a => a.status === 'pending').length})
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'overdue' ? 'default' : 'outline'}
              onClick={() => setFilter('overdue')}
            >
              Geciken ({assignments.filter(a => a.status === 'overdue').length})
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
            >
              Tamamlanan ({assignments.filter(a => a.status === 'completed').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ödev Listesi */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {filteredAssignments.map((assignment) => (
          <Card 
            key={assignment.id} 
            className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedAssignment(assignment)
              setAssignmentModal(true)
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="text-xl">{getSkillIcon(assignment.skill)}</span>
                  {assignment.title}
                </span>
                <Badge className={getStatusColor(assignment.status, assignment.dueDate)}>
                  {getStatusText(assignment.status, assignment.dueDate)}
                </Badge>
              </CardTitle>
              <CardDescription>
                {assignment.courseName} • {assignment.skill.charAt(0).toUpperCase() + assignment.skill.slice(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-3">{assignment.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Son Teslim: {new Date(assignment.dueDate).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {assignment.grade && (
                  <Badge className="bg-green-100 text-green-800">
                    {assignment.grade}/{assignment.maxScore}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ödev Detay Modal */}
      <Dialog open={assignmentModal} onOpenChange={setAssignmentModal}>
        <DialogContent className="max-w-2xl">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-xl">{getSkillIcon(selectedAssignment.skill)}</span>
                  {selectedAssignment.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedAssignment.courseName} • {selectedAssignment.skill.charAt(0).toUpperCase() + selectedAssignment.skill.slice(1)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Açıklama</h4>
                  <p className="text-sm text-gray-700">{selectedAssignment.description}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Talimatlar</h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedAssignment.instructions}</pre>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Son Teslim:</span>
                    <p className="font-medium">
                      {new Date(selectedAssignment.dueDate).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Maksimum Puan:</span>
                    <p className="font-medium">{selectedAssignment.maxScore}</p>
                  </div>
                </div>

                {selectedAssignment.status !== 'completed' && (
                  <div className="space-y-2">
                    <Label htmlFor="submission">Ödev Çözümünüz</Label>
                    <Textarea
                      id="submission"
                      placeholder="Ödevinizi buraya yazın..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      rows={8}
                    />
                  </div>
                )}

                {selectedAssignment.status === 'completed' && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-green-800">✅ Ödev Teslim Edildi</h4>
                    <p className="text-sm text-green-700">
                      Teslim Tarihi: {new Date(selectedAssignment.submittedAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {selectedAssignment.grade && (
                      <p className="text-sm text-green-700 mt-1">
                        Not: {selectedAssignment.grade}/{selectedAssignment.maxScore}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAssignmentModal(false)}>
                  Kapat
                </Button>
                {selectedAssignment.status !== 'completed' && (
                  <Button onClick={handleSubmitAssignment}>
                    Ödevi Gönder
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function GradesContent() {
  const mockGrades = [
    {
      courseId: '1',
      courseName: 'İngilizce B1',
      language: 'İngilizce',
      level: 'B1',
      exams: [
        {
          id: 'exam_1',
          name: 'Ara Sınav 1',
          date: '2024-02-15',
          skills: {
            reading: 85,
            writing: 78,
            listening: 92,
            speaking: 88
          },
          overall: 86
        },
        {
          id: 'exam_2',
          name: 'Ara Sınav 2',
          date: '2024-03-10',
          skills: {
            reading: 88,
            writing: 82,
            listening: 90,
            speaking: 85
          },
          overall: 86
        }
      ]
    },
    {
      courseId: '2',
      courseName: 'Almanca A2',
      language: 'Almanca',
      level: 'A2',
      exams: [
        {
          id: 'exam_3',
          name: 'Başlangıç Sınavı',
          date: '2024-02-20',
          skills: {
            reading: 75,
            writing: 68,
            listening: 80,
            speaking: 72
          },
          overall: 74
        }
      ]
    }
  ]

  const getSkillColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'reading': return '📖'
      case 'writing': return '✍️'
      case 'listening': return '👂'
      case 'speaking': return '🗣️'
      default: return '📝'
    }
  }

  const overallAverage = mockGrades.reduce((acc, course) => {
    const courseAvg = course.exams.reduce((sum, exam) => sum + exam.overall, 0) / course.exams.length
    return acc + courseAvg
  }, 0) / mockGrades.length

  return (
    <div className="space-y-6">
      {/* Genel İstatistikler */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-600">{overallAverage.toFixed(1)}</CardTitle>
            <CardDescription>Genel Not Ortalaması</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-600">{mockGrades.length}</CardTitle>
            <CardDescription>Aktif Dil Kursu</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-purple-600">
              {mockGrades.reduce((acc, course) => acc + course.exams.length, 0)}
            </CardTitle>
            <CardDescription>Toplam Sınav</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-600">B1</CardTitle>
            <CardDescription>En Yüksek Seviye</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Dil Bazında Notlar */}
      {mockGrades.map((course) => (
        <Card key={course.courseId} className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                {course.courseName}
              </span>
              <Badge className="bg-blue-100 text-blue-800">{course.level}</Badge>
            </CardTitle>
            <CardDescription>
              {course.language} • {course.exams.length} Sınav Tamamlandı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {course.exams.map((exam) => (
                <div key={exam.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{exam.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {new Date(exam.date).toLocaleDateString('tr-TR')}
                      </span>
                      <Badge className={`${getSkillColor(exam.overall)}`}>
                        {exam.overall}/100
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Beceri Skorları */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(exam.skills).map(([skill, score]) => (
                      <div key={skill} className="text-center p-3 bg-white rounded-lg border">
                        <div className="text-2xl mb-1">{getSkillIcon(skill)}</div>
                        <div className={`text-lg font-bold ${getSkillColor(score as number)}`}>
                          {score}/100
                        </div>
                        <div className="text-xs text-gray-600 capitalize">
                          {skill === 'reading' && 'Okuma'}
                          {skill === 'writing' && 'Yazma'}
                          {skill === 'listening' && 'Dinleme'}
                          {skill === 'speaking' && 'Konuşma'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CalendarContent() {
  const weeklySchedule = {
    'Pazartesi': [
      { time: '09:00-10:30', subject: 'Grammar Dersi', type: 'lesson', room: 'A-204', teacher: 'Mehmet Kaya' },
      { time: '14:00-15:30', subject: 'Reading Practice', type: 'practice', room: 'A-204', teacher: 'Mehmet Kaya' }
    ],
    'Salı': [
      { time: '10:00-11:30', subject: 'Vocabulary Building', type: 'lesson', room: 'A-205', teacher: 'Mehmet Kaya' }
    ],
    'Çarşamba': [
      { time: '09:00-10:30', subject: 'Listening & Speaking', type: 'practice', room: 'Language Lab', teacher: 'Mehmet Kaya' },
      { time: '15:00-16:30', subject: 'Conversation Club', type: 'speaking', room: 'B-101', teacher: 'Native Speaker' }
    ],
    'Perşembe': [
      { time: '11:00-12:30', subject: 'Writing Workshop', type: 'practice', room: 'A-204', teacher: 'Mehmet Kaya' }
    ],
    'Cuma': [
      { time: '09:00-10:30', subject: 'Weekly Review', type: 'review', room: 'A-204', teacher: 'Mehmet Kaya' },
      { time: '13:00-14:30', subject: 'Speaking Test', type: 'exam', room: 'B-102', teacher: 'Mehmet Kaya' }
    ]
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'practice': return 'bg-green-50 border-green-200 text-green-800'
      case 'speaking': return 'bg-purple-50 border-purple-200 text-purple-800'
      case 'review': return 'bg-orange-50 border-orange-200 text-orange-800'
      case 'exam': return 'bg-red-50 border-red-200 text-red-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📚'
      case 'practice': return '💪'
      case 'speaking': return '🗣️'
      case 'review': return '🔄'
      case 'exam': return '📝'
      default: return '📋'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'lesson': return 'Ders'
      case 'practice': return 'Pratik'
      case 'speaking': return 'Konuşma'
      case 'review': return 'Tekrar'
      case 'exam': return 'Sınav'
      default: return 'Etkinlik'
    }
  }

  return (
    <div className="space-y-6">
      {/* Haftalık Program Özeti */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            İngilizce B1 - Haftalık Ders Programı
          </CardTitle>
          <CardDescription>
            Kurs programınız ve ders türleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {Object.entries(weeklySchedule).map(([day, classes]) => (
              <div key={day} className="space-y-3">
                <h4 className="font-medium text-lg flex items-center gap-2">
                  📅 {day}
                  <Badge variant="outline">{classes.length} Ders</Badge>
                </h4>
                <div className="space-y-2">
                  {classes.map((classItem, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${getTypeColor(classItem.type)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(classItem.type)}</span>
                          <span className="font-medium">{classItem.subject}</span>
                        </div>
                        <Badge variant="outline" className="bg-white">
                          {getTypeText(classItem.type)}
                        </Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">🕐 {classItem.time}</span>
                          <span>🏫 {classItem.room}</span>
                        </div>
                        <div className="text-gray-600">
                          👨‍🏫 {classItem.teacher}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ders Türleri Açıklaması */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Ders Türleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium flex items-center gap-2">
                📚 Grammar Dersi
              </h5>
              <p className="text-sm text-gray-600">Gramer konularının detaylı işlendiği teorik dersler</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h5 className="font-medium flex items-center gap-2">
                💪 Practice Session
              </h5>
              <p className="text-sm text-gray-600">Öğrenilen konuların pratik edildiği alıştırma dersleri</p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <h5 className="font-medium flex items-center gap-2">
                🗣️ Konuşma Dersi
              </h5>
              <p className="text-sm text-gray-600">Speaking becerisinin geliştirildiği konuşma odaklı dersler</p>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <h5 className="font-medium flex items-center gap-2">
                🔄 Review Session
              </h5>
              <p className="text-sm text-gray-600">Haftalık konuların tekrar edildiği ve pekiştirildiği dersler</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Öğretmenle İletişim kartı Mesajlar sayfasına taşındı ve ana sayfadan kaldırıldı */}
    </div>
  )
}

// Teacher Chat Dialog Component
function TeacherChatDialogInline() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'teacher', message: 'Merhaba! Size nasıl yardımcı olabilirim?', time: '10:00' },
    { id: 2, sender: 'student', message: 'Merhaba, Unit 6 modal verbs konusunda sorum var.', time: '10:05' },
    { id: 3, sender: 'teacher', message: 'Tabii, hangi modal verb konusunda zorluk yaşıyorsunuz?', time: '10:07' }
  ])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        sender: 'student',
        message: newMessage,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }])
      setNewMessage('')

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'teacher',
          message: 'Mesajınızı aldım. Birazdan detaylı cevap vereceğim.',
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }])
      }, 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Özel Mesaj
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Mehmet Kaya ile Özel Sohbet
          </DialogTitle>
          <DialogDescription>
            Öğretmeninizle birebir mesajlaşabilirsiniz
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border rounded-lg p-3 h-64 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg ${
                  msg.sender === 'student' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  <div className="text-xs mb-1 opacity-75">
                    {msg.sender === 'student' ? 'Sen' : 'Öğretmen'} • {msg.time}
                  </div>
                  <div className="text-sm">{msg.message}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Mesajınızı yazın..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MessagesContent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const { toast } = useToast()

  const getCurrentUser = () => {
    const userData = localStorage.getItem('currentUser')
    return userData ? JSON.parse(userData) : null
  }

  useEffect(() => {
    fetchMessages()
  }, [filter])

  const fetchMessages = async () => {
    try {
      const user = getCurrentUser()
      if (!user) return

      let url = `/api/messages?userId=${user.id}`
      if (filter !== 'all') {
        url += `&type=${filter}`
      }

      const response = await fetch(url)
      const data = await response.json()
      
      if (response.ok) {
        setMessages(data.messages)
      } else {
        toast({
          title: "Hata",
          description: "Mesajlar yüklenirken bir sorun oluştu.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const user = getCurrentUser()
      if (!user) return

      const response = await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          userId: user.id
        })
      })

      if (response.ok) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        ))
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'COURSE_ANNOUNCEMENT':
        return <BookOpen className="w-4 h-4 text-blue-500" />
      case 'FREEZE_REQUEST':
        return <Pause className="w-4 h-4 text-orange-500" />
      case 'CONTINUATION_NOTICE':
        return <SkipForward className="w-4 h-4 text-green-500" />
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />
    }
  }

  const getMessageTypeBadge = (type: string) => {
    switch (type) {
      case 'COURSE_ANNOUNCEMENT':
        return <Badge className="bg-blue-100 text-blue-800">Kurs Duyurusu</Badge>
      case 'FREEZE_REQUEST':
        return <Badge className="bg-orange-100 text-orange-800">Dondurma İşlemi</Badge>
      case 'CONTINUATION_NOTICE':
        return <Badge className="bg-green-100 text-green-800">Devam Bildirimi</Badge>
      default:
        return <Badge variant="outline">Kişisel</Badge>
    }
  }

  if (loading) {
    return <div className="text-center py-8">Mesajlar yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filtre Seçenekleri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Mesajlarım
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button 
              size="sm" 
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              Tümü
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'COURSE_ANNOUNCEMENT' ? 'default' : 'outline'}
              onClick={() => setFilter('COURSE_ANNOUNCEMENT')}
            >
              Kurs Duyuruları
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'FREEZE_REQUEST' ? 'default' : 'outline'}
              onClick={() => setFilter('FREEZE_REQUEST')}
            >
              Dondurma İşlemleri
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'CONTINUATION_NOTICE' ? 'default' : 'outline'}
              onClick={() => setFilter('CONTINUATION_NOTICE')}
            >
              Devam Bildirimleri
            </Button>
          </div>

          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {filter === 'all' ? 'Henüz mesajınız bulunmamaktadır.' : 'Bu kategoride mesaj bulunmamaktadır.'}
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    !message.isRead ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => !message.isRead && markAsRead(message.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gray-100 text-gray-700">
                        {message.sender.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{message.sender.name}</h4>
                        {getMessageTypeIcon(message.messageType)}
                        {getMessageTypeBadge(message.messageType)}
                        {!message.isRead && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Yeni
                          </Badge>
                        )}
                      </div>
                      <h5 className="font-medium text-sm text-gray-900 mb-1">{message.subject}</h5>
                      <p className="text-sm text-gray-700 mb-2">{message.content}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.sentAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// AI Assistant Content
function AIAssistantContent() {
  const [selectedWeakness, setSelectedWeakness] = useState<string | null>(null)
  const [readingTexts, setReadingTexts] = useState<any[]>([])
  const [practiceQuestions, setPracticeQuestions] = useState<any[]>([])

  const mockAnalysis = {
    weaknesses: [
      {
        skill: 'writing',
        level: 'critical',
        description: 'Grammar hatalarınız sık tekrarlanıyor',
        percentage: 65,
        recommendations: [
          'Present Perfect tense alıştırmaları yapın',
          'Article (a, an, the) kullanımını pratik edin',
          'Günlük 15 dakika yazı yazma alıştırması'
        ]
      },
      {
        skill: 'listening',
        level: 'moderate',
        description: 'Hızlı konuşmalarda zorluk yaşıyorsunuz',
        percentage: 75,
        recommendations: [
          'Podcast dinleme alıştırmaları',
          'Shadowing tekniğini uygulayın',
          'Native speaker videolar izleyin'
        ]
      },
      {
        skill: 'speaking',
        level: 'minor',
        description: 'Telaffuz iyileştirme gerekli',
        percentage: 82,
        recommendations: [
          'Fonetik alıştırmaları yapın',
          'Kendizi kaydedin ve dinleyin',
          'Tongue twister pratikleri'
        ]
      }
    ],
    strengths: [
      { skill: 'reading', percentage: 88 },
      { skill: 'vocabulary', percentage: 85 }
    ]
  }

  const mockReadingTexts = [
    {
      id: 'text_1',
      title: 'Environmental Protection',
      level: 'B1',
      type: 'article',
      content: 'Climate change is one of the most pressing issues of our time...',
      questions: [
        'What is the main topic of the article?',
        'According to the text, what can individuals do to help?',
        'Explain the term "carbon footprint" mentioned in the text.'
      ],
      estimatedTime: '15 minutes'
    },
    {
      id: 'text_2', 
      title: 'Technology in Education',
      level: 'B1',
      type: 'news',
      content: 'The integration of technology in classrooms has revolutionized...',
      questions: [
        'How has technology changed education?',
        'What are the advantages mentioned?',
        'Do you agree with the author\'s viewpoint?'
      ],
      estimatedTime: '12 minutes'
    }
  ]

  const mockPracticeQuestions = [
    {
      id: 'q1',
      skill: 'grammar',
      question: 'Complete the sentence: "I ___ to London three times this year."',
      options: ['went', 'have been', 'was going', 'go'],
      correct: 1,
      explanation: 'Present Perfect tense kullanılır çünkü bu yıl içinde gerçekleşen ve şimdiki zamana etkisi olan bir durum.'
    },
    {
      id: 'q2',
      skill: 'vocabulary',
      question: 'What does "sustainable" mean?',
      options: ['expensive', 'temporary', 'environmentally friendly', 'complicated'],
      correct: 2,
      explanation: 'Sustainable = sürdürülebilir, çevre dostu anlamına gelir.'
    }
  ]

  const getWeaknessColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-500 bg-red-50'
      case 'moderate': return 'border-orange-500 bg-orange-50'  
      case 'minor': return 'border-yellow-500 bg-yellow-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Performans Analizi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Performans Analizi
          </CardTitle>
          <CardDescription>
            Son sınavlar ve ödevlerinize dayalı kişisel gelişim önerileri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-medium text-red-600">🎯 Geliştirilmesi Gereken Alanlar</h4>
            <div className="grid gap-3">
              {mockAnalysis.weaknesses.map((weakness) => (
                <div key={weakness.skill} className={`p-4 border rounded-lg ${getWeaknessColor(weakness.level)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium capitalize">{weakness.skill} - {weakness.description}</h5>
                    <Badge variant="outline">{weakness.percentage}%</Badge>
                  </div>
                  <div className="space-y-2">
                    <h6 className="text-sm font-medium">💡 AI Önerileri:</h6>
                    <ul className="text-sm space-y-1">
                      {weakness.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <h4 className="font-medium text-green-600 mt-6">✅ Güçlü Yönleriniz</h4>
            <div className="grid grid-cols-2 gap-3">
              {mockAnalysis.strengths.map((strength) => (
                <div key={strength.skill} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{strength.skill}</span>
                    <Badge className="bg-green-100 text-green-800">{strength.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Özel Okuma Metinleri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Size Özel Okuma Metinleri
          </CardTitle>
          <CardDescription>
            Seviyenize uygun ve gelişim alanlarınıza odaklı okuma materyalleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {mockReadingTexts.map((text) => (
              <Card key={text.id} className="border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">{text.title}</CardTitle>
                  <CardDescription>
                    {text.type.charAt(0).toUpperCase() + text.type.slice(1)} • {text.level} • {text.estimatedTime}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{text.content.substring(0, 100)}...</p>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Sorular:</h5>
                    <div className="text-xs space-y-1">
                      {text.questions.map((q, index) => (
                        <div key={index} className="text-gray-600">• {q}</div>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-3">Metni Oku</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pratik Sorular */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Kişiselleştirilmiş Pratik Sorular
          </CardTitle>
          <CardDescription>
            Zayıf yönlerinizi güçlendirmek için hazırlanmış sorular
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPracticeQuestions.map((question) => (
              <div key={question.id} className="p-4 border rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{question.skill}</Badge>
                    <h5 className="font-medium">{question.question}</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((option, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        size="sm"
                        className="text-left justify-start"
                      >
                        {String.fromCharCode(65 + index)}) {option}
                      </Button>
                    ))}
                  </div>
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    <strong>Açıklama:</strong> {question.explanation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Classroom Content
function ClassroomContent() {
  const [activeClassTab, setActiveClassTab] = useState('overview')

  return (
    <div className="space-y-6">
      {/* Classroom Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            İngilizce B1 Sınıfım
          </CardTitle>
          <CardDescription>
            Sınıf içi etkinlikler, paylaşımlar ve kaynaklar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button 
              size="sm" 
              variant={activeClassTab === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveClassTab('overview')}
            >
              📋 Genel Bakış
            </Button>
            <Button 
              size="sm" 
              variant={activeClassTab === 'students' ? 'default' : 'outline'}
              onClick={() => setActiveClassTab('students')}
            >
              👥 Sınıf Listesi
            </Button>
            <Button 
              size="sm" 
              variant={activeClassTab === 'materials' ? 'default' : 'outline'}
              onClick={() => setActiveClassTab('materials')}
            >
              📚 Öğretmen Paylaşımları
            </Button>
            <Button 
              size="sm" 
              variant={activeClassTab === 'notes' ? 'default' : 'outline'}
              onClick={() => setActiveClassTab('notes')}
            >
              📝 Notlarım
            </Button>
            <Button 
              size="sm" 
              variant={activeClassTab === 'chat' ? 'default' : 'outline'}
              onClick={() => setActiveClassTab('chat')}
            >
              💬 Sınıf Sohbeti
            </Button>
          </div>

          {/* Tab Content */}
          {activeClassTab === 'overview' && <ClassroomOverview />}
          {activeClassTab === 'students' && <ClassroomStudents />}
          {activeClassTab === 'materials' && <ClassroomMaterials />}
          {activeClassTab === 'notes' && <ClassroomNotes />}
          {activeClassTab === 'chat' && <ClassroomChat />}
        </CardContent>
      </Card>
    </div>
  )
}

// Classroom Sub-components
function ClassroomOverview() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">28</CardTitle>
            <CardDescription>Toplam Öğrenci</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">Unit 6</CardTitle>
            <CardDescription>Mevcut Konu</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-lg">15</CardTitle>
            <CardDescription>Paylaşılan Materyal</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-medium">📅 Bu Haftaki Konular</h4>
        <div className="space-y-2">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Modal Verbs (Can, Could, May)</span>
              <Badge>Pazartesi</Badge>
            </div>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Speaking Practice: Job Interviews</span>
              <Badge>Çarşamba</Badge>
            </div>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Unit 6 Review & Quiz</span>
              <Badge>Cuma</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ClassroomStudents() {
  const mockStudents = [
    { id: 1, name: 'Ahmet Yılmaz', level: 'B1', attendance: 95 },
    { id: 2, name: 'Ayşe Demir', level: 'B1', attendance: 88 },
    { id: 3, name: 'Mehmet Kaya', level: 'B1', attendance: 92 },
    { id: 4, name: 'Fatma Çelik', level: 'B1', attendance: 90 }
  ]

  return (
    <div className="space-y-4">
      <h4 className="font-medium">👥 Sınıf Arkadaşlarım</h4>
      <div className="grid gap-3">
        {mockStudents.map((student) => (
          <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-gray-600">Seviye: {student.level}</p>
              </div>
            </div>
            <Badge variant="outline">{student.attendance}% Devam</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

function ClassroomMaterials() {
  const mockMaterials = [
    { 
      id: 1, 
      title: 'Unit 6 Grammar Notes', 
      type: 'pdf', 
      date: '2024-03-15',
      description: 'Modal verbs detaylı açıklaması ve örnekler'
    },
    { 
      id: 2, 
      title: 'Speaking Practice Audio', 
      type: 'audio', 
      date: '2024-03-14',
      description: 'Job interview dialogs'
    },
    { 
      id: 3, 
      title: 'Vocabulary List Unit 6', 
      type: 'document', 
      date: '2024-03-13',
      description: 'İş hayatı ile ilgili kelimeler'
    }
  ]

  return (
    <div className="space-y-4">
      <h4 className="font-medium">📚 Öğretmen Paylaşımları</h4>
      <div className="space-y-3">
        {mockMaterials.map((material) => (
          <div key={material.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium">{material.title}</h5>
              <Badge variant="outline">{material.type}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{material.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(material.date).toLocaleDateString('tr-TR')}
              </span>
              <Button size="sm" variant="outline">İndir</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ClassroomNotes() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Modal Verbs Notlarım', content: 'Can - ability, Could - past ability...', date: '2024-03-15' }
  ])
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [showAddNote, setShowAddNote] = useState(false)

  const addNote = () => {
    if (newNote.title && newNote.content) {
      setNotes([...notes, {
        id: Date.now(),
        title: newNote.title,
        content: newNote.content,
        date: new Date().toISOString().split('T')[0]
      }])
      setNewNote({ title: '', content: '' })
      setShowAddNote(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">📝 Kişisel Notlarım</h4>
        <Button size="sm" onClick={() => setShowAddNote(!showAddNote)}>
          + Yeni Not
        </Button>
      </div>

      {showAddNote && (
        <div className="p-4 border border-dashed border-blue-300 rounded-lg">
          <div className="space-y-3">
            <Input
              placeholder="Not başlığı..."
              value={newNote.title}
              onChange={(e) => setNewNote({...newNote, title: e.target.value})}
            />
            <Textarea
              placeholder="Not içeriği..."
              value={newNote.content}
              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              rows={4}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addNote}>Kaydet</Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddNote(false)}>İptal</Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium">{note.title}</h5>
              <span className="text-xs text-gray-500">
                {new Date(note.date).toLocaleDateString('tr-TR')}
              </span>
            </div>
            <p className="text-sm">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ClassroomChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Öğretmen', message: 'Yarınki speaking pratiği için hazırlanmayı unutmayın!', time: '10:30' },
    { id: 2, sender: 'Ahmet', message: 'Unit 6 quiz ne zaman olacak?', time: '11:15' },
    { id: 3, sender: 'Öğretmen', message: 'Cuma günü quiz yapacağız.', time: '11:18' }
  ])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        sender: 'Ben',
        message: newMessage,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }])
      setNewMessage('')
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">💬 Sınıf Sohbeti</h4>
      
      <div className="border rounded-lg p-4 h-64 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'Ben' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${
              msg.sender === 'Ben' 
                ? 'bg-blue-500 text-white' 
                : msg.sender === 'Öğretmen'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100'
            }`}>
              <div className="font-medium text-xs mb-1">{msg.sender} • {msg.time}</div>
              <div className="text-sm">{msg.message}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Mesajınızı yazın..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage}>Gönder</Button>
      </div>
    </div>
  )
}

// Settings Content Component
function SettingsContent({ user, setUser }: { user: User, setUser: (user: User) => void }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    username: user.username,
    level: user.level || "",
    notifications: {
      assignments: true,
      grades: true,
      announcements: true,
      messages: true
    },
    privacy: {
      profileVisible: true,
      showGrades: false
    },
    appearance: {
      theme: "light",
      language: "tr"
    }
  })

  const handleSave = () => {
    try {
      // Değişiklik kontrolü
      const hasChanges = 
        formData.name !== user.name ||
        formData.email !== user.email ||
        formData.username !== user.username ||
        formData.level !== (user.level || "")

      if (!hasChanges) {
        toast({
          title: "Değişiklik Bulunamadı",
          description: "Henüz herhangi bir değişiklik yapmadınız.",
          variant: "default",
          duration: 3000,
        })
        return
      }

      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        username: formData.username,
        level: formData.level
      }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      toast({
        title: "Ayarlar Kaydedildi",
        description: "Tüm değişiklikler başarıyla kaydedildi.",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Hata Oluştu",
        description: "Ayarlar kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Profil Bilgileri */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Profil Bilgileri
            </CardTitle>
            <CardDescription>
              Kişisel bilgilerini güncelleyebilirsin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Badge className="bg-blue-100 text-blue-800">Öğrenci</Badge>
                {user.level && <Badge variant="outline" className="ml-2">{user.level}</Badge>}
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Seviye</Label>
                <Input
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({...prev, level: e.target.value}))}
                  placeholder="Başlangıç, Orta, İleri"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bildirim Ayarları */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Bildirimler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="assignments">Ödev Bildirimleri</Label>
              <Switch
                id="assignments"
                checked={formData.notifications.assignments}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    notifications: {...prev.notifications, assignments: checked}
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="grades">Not Bildirimleri</Label>
              <Switch
                id="grades"
                checked={formData.notifications.grades}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    notifications: {...prev.notifications, grades: checked}
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="announcements">Duyuru Bildirimleri</Label>
              <Switch
                id="announcements"
                checked={formData.notifications.announcements}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    notifications: {...prev.notifications, announcements: checked}
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="messages">Mesaj Bildirimleri</Label>
              <Switch
                id="messages"
                checked={formData.notifications.messages}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    notifications: {...prev.notifications, messages: checked}
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Gizlilik Ayarları */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Gizlilik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="profileVisible">Profil Görünür</Label>
              <Switch
                id="profileVisible"
                checked={formData.privacy.profileVisible}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    privacy: {...prev.privacy, profileVisible: checked}
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="showGrades">Notları Göster</Label>
              <Switch
                id="showGrades"
                checked={formData.privacy.showGrades}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({
                    ...prev,
                    privacy: {...prev.privacy, showGrades: checked}
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Görünüm Ayarları */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600" />
              Görünüm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <select 
                id="theme"
                className="w-full p-2 border rounded-lg"
                value={formData.appearance.theme}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  appearance: {...prev.appearance, theme: e.target.value}
                }))}
              >
                <option value="light">Açık</option>
                <option value="dark">Koyu</option>
                <option value="auto">Otomatik</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Dil</Label>
              <select 
                id="language"
                className="w-full p-2 border rounded-lg"
                value={formData.appearance.language}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  appearance: {...prev.appearance, language: e.target.value}
                }))}
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kaydet Butonu */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Değişiklikleri Kaydet
        </Button>
      </div>
    </div>
  )
}

// Games Content
function GamesContent() {
  const [gameCode, setGameCode] = useState("")
  const [activeGames, setActiveGames] = useState<GameRoom[]>([])
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
  const [currentGame, setCurrentGame] = useState<GameRoom | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
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
  }, [])

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

  if (currentGame) {
    return (
      <div className="space-y-6">
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
    <div className="space-y-6">
      {/* Header with Join Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sınıf Oyunları</h2>
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

      {/* Active Games */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Aktif Oyunlar</h3>
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
        <h3 className="text-xl font-bold text-gray-900 mb-4">Oyun Geçmişim</h3>
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
        <h3 className="text-xl font-bold text-gray-900 mb-4">Bekleyen Oyunlar</h3>
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
  )
}

// Achievements Content
function AchievementsContent() {
  const mockUserStats = {
    totalPoints: 2750,
    currentStreak: 12,
    longestStreak: 28,
    level: 7,
    experiencePoints: 850,
    experienceToNextLevel: 1200,
    rank: 3,
    totalUsers: 45
  }

  const mockAchievements = [
    {
      id: "first-lesson",
      title: "İlk Adım",
      description: "İlk dersini tamamladın!",
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      category: "learning" as const,
      earnedAt: "2024-12-01",
      isUnlocked: true,
      rarity: "common" as const
    },
    {
      id: "week-streak",
      title: "Haftalık Seri",
      description: "7 gün üst üste ders aldın",
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      category: "consistency" as const,
      earnedAt: "2024-12-08",
      isUnlocked: true,
      rarity: "rare" as const
    },
    {
      id: "perfect-quiz",
      title: "Mükemmel Sınav",
      description: "Bir sınavdan tam puan aldın",
      icon: <Trophy className="w-6 h-6 text-gold-500" />,
      category: "learning" as const,
      earnedAt: "2024-12-10",
      isUnlocked: true,
      rarity: "epic" as const
    },
    {
      id: "social-butterfly",
      title: "Sosyal Kelebek",
      description: "10 farklı arkadaşınla oyun oynadın",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      category: "social" as const,
      progress: 7,
      maxProgress: 10,
      isUnlocked: false,
      rarity: "rare" as const
    },
    {
      id: "month-streak",
      title: "Aylık Şampiyon",
      description: "30 gün üst üste aktif ol",
      icon: <Crown className="w-6 h-6 text-purple-500" />,
      category: "consistency" as const,
      progress: 12,
      maxProgress: 30,
      isUnlocked: false,
      rarity: "legendary" as const
    },
    {
      id: "vocabulary-master",
      title: "Kelime Uzmanı",
      description: "500 yeni kelime öğren",
      icon: <Award className="w-6 h-6 text-green-500" />,
      category: "learning" as const,
      progress: 342,
      maxProgress: 500,
      isUnlocked: false,
      rarity: "epic" as const
    }
  ]

  return (
    <div className="space-y-6">
      <GamificationSystem userStats={mockUserStats} achievements={mockAchievements} />
    </div>
  )
}