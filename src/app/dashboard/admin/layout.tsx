"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Settings, LogOut, Menu, X, Users, Shield, BarChart, Megaphone, Building, Cog, FileText } from "lucide-react"

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      const parsedUser: User = JSON.parse(userData)
      if (parsedUser.role !== 'admin') {
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
      href: "/dashboard/admin"
    },
    {
      id: "users",
      title: "Kullanıcı Yönetimi",
      icon: <Users className="w-5 h-5" />,
      href: "/dashboard/admin/users"
    },
    {
      id: "classes",
      title: "Sınıf Yönetimi",
      icon: <Building className="w-5 h-5" />,
      href: "/dashboard/admin/classes"
    },
    {
      id: "reports",
      title: "Performans Raporları",
      icon: <FileText className="w-5 h-5" />,
      href: "/dashboard/admin/reports"
    },
    {
      id: "announcements",
      title: "Genel Duyurular",
      icon: <Megaphone className="w-5 h-5" />,
      href: "/dashboard/admin/announcements"
    },
    {
      id: "settings",
      title: "Sistem Ayarları",
      icon: <Cog className="w-5 h-5" />,
      href: "/dashboard/admin/settings"
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
            <span className="font-bold text-lg text-purple-600">Yönetici Paneli</span>
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
                    ? 'bg-purple-100 text-purple-700'
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
          <Button variant="outline" size="sm" className="w-full">
            <Bell className="w-4 h-4 mr-2" />
            Bildirimler
          </Button>
          
          {/* User Profile - Ayarlar'a yönlendir */}
          <button 
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors"
            onClick={() => router.push('/dashboard/admin/settings')}
          >
            <Avatar>
              <AvatarFallback className="bg-purple-100 text-purple-700">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{user.name}</p>
              <Badge className="bg-purple-100 text-purple-800">Yönetici</Badge>
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
    </div>
  )
}