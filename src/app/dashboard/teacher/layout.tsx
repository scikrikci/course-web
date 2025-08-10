"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Bell, Settings, LogOut, Menu, X, Users, FileText, BarChart, Megaphone, PlusCircle, BookOpen, Brain, Gamepad2 } from "lucide-react"

interface User {
  id: number
  username: string
  role: string
  level?: string
  name: string
  email: string
  avatar: string
}

interface MenuItem {
  id: string
  title: string
  icon: React.ReactNode
  href: string
}

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

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
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/')
  }

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      title: "Ana Sayfa",
      icon: <BarChart className="w-5 h-5" />,
      href: "/dashboard/teacher"
    },
    {
      id: "classes",
      title: "Sınıflarım",
      icon: <Users className="w-5 h-5" />,
      href: "/dashboard/teacher/classes"
    },
    {
      id: "materials",
      title: "Materyal Yönetimi",
      icon: <BookOpen className="w-5 h-5" />,
      href: "/dashboard/teacher/materials"
    },
    {
      id: "assignments",
      title: "Ödev Kontrolü",
      icon: <FileText className="w-5 h-5" />,
      href: "/dashboard/teacher/assignments"
    },
    {
      id: "announcements",
      title: "Duyurular",
      icon: <Megaphone className="w-5 h-5" />,
      href: "/dashboard/teacher/announcements"
    },
    {
      id: "quiz-creator",
      title: "Quiz Oluştur",
      icon: <PlusCircle className="w-5 h-5" />,
      href: "/dashboard/teacher/quiz-creator"
    },
    {
      id: "grades",
      title: "Not Yönetimi",
      icon: <BarChart className="w-5 h-5" />,
      href: "/dashboard/teacher/grades"
    },
    {
      id: "ai-tools",
      title: "AI Araçları",
      icon: <Brain className="w-5 h-5" />,
      href: "/dashboard/teacher/ai-tools"
    },
    {
      id: "classroom-games",
      title: "Sınıf Oyunları",
      icon: <Gamepad2 className="w-5 h-5" />,
      href: "/dashboard/teacher/classroom-games"
    }
  ]

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
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <img src="/education.svg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-lg text-green-600">Öğretmen Paneli</span>
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
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  router.push(item.href)
                  setSidebarOpen(false)
                }}
              >
                {item.icon}
                {item.title}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t bg-white shrink-0 space-y-3">
          {/* Bildirim Butonu */}
          <Button variant="outline" size="sm" className="w-full" onClick={() => setIsNotificationsOpen(true)}>
            <Bell className="w-4 h-4 mr-2" />
            Bildirimler
          </Button>
          
          {/* User Profile - Ayarlar'a yönlendir */}
          <button 
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition-colors"
            onClick={() => router.push('/dashboard/teacher/settings')}
          >
            <Avatar>
              <AvatarFallback className="bg-green-100 text-green-700">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{user.name}</p>
              <Badge className="bg-green-100 text-green-800">Öğretmen</Badge>
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
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Notifications / Messages Panel */}
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <div className="border-b px-4 py-3">
            <SheetHeader>
              <SheetTitle>Mesajlar ve Bildirimler</SheetTitle>
            </SheetHeader>
          </div>
          <div className="p-4 space-y-3">
            {/* Basit mesaj listesi örneği */
            }
            {[ 
              { from: "Ayşe Demir", text: "Ödev teslim tarihi nedir?", time: "10:12" },
              { from: "9-A Sınıfı", text: "Quiz sonuçları ne zaman açıklanacak?", time: "Dün" },
              { from: "Sistem", text: "Yeni duyuru: Materyaller yüklendi", time: "3 gün önce" }
            ].map((m, idx) => (
              <div key={idx} className="p-3 border rounded-lg bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{m.from}</p>
                  <span className="text-xs text-gray-500">{m.time}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{m.text}</p>
              </div>
            ))}
            <Button className="w-full" onClick={() => {
              setIsNotificationsOpen(false)
              router.push('/dashboard/teacher/messages')
            }}>Tüm Mesajları Gör</Button>
            <Button className="w-full" variant="outline" onClick={() => setIsNotificationsOpen(false)}>Kapat</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}