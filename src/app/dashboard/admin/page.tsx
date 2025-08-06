"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, BarChart, FileText, Bell, Building } from "lucide-react"

interface User {
  id: number
  username: string
  role: string
  level?: string
  name: string
  email: string
  avatar: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

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

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Hoş Geldin, {user.name}!
        </h1>
        <p className="text-gray-600">
          Yönetici panelindesin. Sistemi yönet, raporları incele.
        </p>
      </div>

      {/* Sistem Durumu Özeti */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Sistem Durumu - Gerçek Zamanlı
            </div>
            <Badge className="bg-green-100 text-green-800">🟢 Tüm Sistemler Çalışıyor</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-green-600">99.8%</div>
              <div className="text-xs text-gray-600">Uptime</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-blue-600">342</div>
              <div className="text-xs text-gray-600">Aktif Kullanıcı</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-orange-600">120ms</div>
              <div className="text-xs text-gray-600">Yanıt Süresi</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-purple-600">%45</div>
              <div className="text-xs text-gray-600">Sunucu Yükü</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-lg font-bold text-green-600">0</div>
              <div className="text-xs text-gray-600">Kritik Hata</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hızlı Yönetim Aksiyonları */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card 
          className="border-l-4 border-l-green-500 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
          onClick={() => router.push('/dashboard/admin/users')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 group-hover:text-green-700">Yeni Kullanıcı</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600">Öğrenci/Öğretmen</p>
              </div>
              <Users className="w-5 h-5 text-green-600 group-hover:text-green-700 group-hover:scale-110 transition-all" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="border-l-4 border-l-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
          onClick={() => router.push('/dashboard/admin/announcements')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 group-hover:text-blue-700">Sistem Duyurusu</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600">Tüm kullanıcılara</p>
              </div>
              <Bell className="w-5 h-5 text-blue-600 group-hover:text-blue-700 group-hover:scale-110 transition-all" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="border-l-4 border-l-purple-500 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
          onClick={() => {
            // Backup başlatma simülasyonu
            alert('Sistem yedeklemesi başlatıldı! İşlem arka planda devam ediyor...')
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 group-hover:text-purple-700">Backup Başlat</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600">Manuel yedekleme</p>
              </div>
              <Shield className="w-5 h-5 text-purple-600 group-hover:text-purple-700 group-hover:scale-110 transition-all" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="border-l-4 border-l-orange-500 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
          onClick={() => router.push('/dashboard/admin/reports')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 group-hover:text-orange-700">Sistem Raporu</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600">PDF export</p>
              </div>
              <BarChart className="w-5 h-5 text-orange-600 group-hover:text-orange-700 group-hover:scale-110 transition-all" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="border-l-4 border-l-red-500 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
          onClick={() => {
            if (confirm('Sistem bakım moduna alınacak. Emin misiniz?')) {
              alert('Sistem bakım moduna alındı. Tüm kullanıcılar bilgilendirildi.')
            }
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 group-hover:text-red-700">Acil Durum</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600">Sistem bakımı</p>
              </div>
              <Building className="w-5 h-5 text-red-600 group-hover:text-red-700 group-hover:scale-110 transition-all" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Kullanıcı İstatistikleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Toplam Kullanıcı</span>
                <Badge className="bg-gray-100 text-gray-800">1,247</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Öğrenciler</span>
                <Badge className="bg-blue-100 text-blue-800">1,050</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Öğretmenler</span>
                <Badge className="bg-green-100 text-green-800">180</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Yöneticiler</span>
                <Badge className="bg-purple-100 text-purple-800">17</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              Sınıf İstatistikleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Toplam Sınıf</span>
                <Badge className="bg-gray-100 text-gray-800">45</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Aktif Sınıf</span>
                <Badge className="bg-green-100 text-green-800">42</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ortalama Öğrenci</span>
                <Badge className="bg-blue-100 text-blue-800">28</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Boş Kontenjan</span>
                <Badge className="bg-yellow-100 text-yellow-800">84</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-orange-600" />
              Sistem Performansı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Aktif Kullanıcı</span>
                <Badge className="bg-green-100 text-green-800">342</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sunucu Yükü</span>
                <Badge className="bg-blue-100 text-blue-800">%45</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Yanıt Süresi</span>
                <Badge className="bg-green-100 text-green-800">120ms</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Uptime</span>
                <Badge className="bg-green-100 text-green-800">99.8%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Güvenlik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Bugün Giriş</span>
                <Badge className="bg-green-100 text-green-800">1,024</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Başarısız Giriş</span>
                <Badge className="bg-red-100 text-red-800">7</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Aktif Oturum</span>
                <Badge className="bg-blue-100 text-blue-800">567</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Güvenlik Skoru</span>
                <Badge className="bg-green-100 text-green-800">A+</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Report Section */}
      <Card className="mt-6 border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Aylık Sistem Raporu
          </CardTitle>
          <CardDescription>Aralık 2024 performans özeti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">15,420</div>
              <div className="text-sm text-gray-600">Toplam Giriş</div>
              <div className="text-xs text-green-600 mt-1">↑ 12% geçen aya göre</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">8,920</div>
              <div className="text-sm text-gray-600">Tamamlanan Ödev</div>
              <div className="text-xs text-green-600 mt-1">↑ 8% geçen aya göre</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">2,340</div>
              <div className="text-sm text-gray-600">Oluşturulan Quiz</div>
              <div className="text-xs text-green-600 mt-1">↑ 15% geçen aya göre</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="mt-6 border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-600" />
            Son Aktiviteler ve Uyarılar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Sistem Bildirimleri</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Backup başarıyla tamamlandı</p>
                    <p className="text-xs text-gray-600">2 saat önce</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">25 yeni kullanıcı kaydı</p>
                    <p className="text-xs text-gray-600">3 saat önce</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Sunucu güncelleme planlandı</p>
                    <p className="text-xs text-gray-600">1 gün önce</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Önemli Hatırlatıcılar</h4>
              <div className="space-y-2">
                <div className="border-l-4 border-l-red-500 pl-4 py-2 bg-red-50">
                  <p className="font-medium text-sm">SSL sertifikası yenileme</p>
                  <p className="text-xs text-gray-600">Son 15 gün - 30 Aralık 2024</p>
                </div>
                <div className="border-l-4 border-l-yellow-500 pl-4 py-2 bg-yellow-50">
                  <p className="font-medium text-sm">Dönem sonu raporları</p>
                  <p className="text-xs text-gray-600">Hazırlanması gereken - 25 Aralık</p>
                </div>
                <div className="border-l-4 border-l-green-500 pl-4 py-2 bg-green-50">
                  <p className="font-medium text-sm">Yeni özellik lansmanı</p>
                  <p className="text-xs text-gray-600">AI Araçları v2.0 - Ocak 2025</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}