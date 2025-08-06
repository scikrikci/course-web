"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Settings,
  Save,
  User,
  Shield,
  Database,
  Mail,
  Bell,
  Palette,
  Globe,
  Lock,
  Server,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminUser {
  id: number
  username: string
  role: string
  level?: string
  name: string
  email: string
  avatar: string
}

interface SystemSettings {
  siteName: string
  siteDescription: string
  siteLogo: string
  allowRegistration: boolean
  requireEmailVerification: boolean
  maxFileUploadSize: number
  sessionTimeout: number
  enableNotifications: boolean
  defaultLanguage: string
  timezone: string
  maintenanceMode: boolean
  enableBackups: boolean
  backupFrequency: string
  maxStudentsPerClass: number
  enableAIFeatures: boolean
}

const defaultSettings: SystemSettings = {
  siteName: "Course Management System",
  siteDescription: "Modern eğitim yönetim platformu",
  siteLogo: "/education.svg",
  allowRegistration: true,
  requireEmailVerification: true,
  maxFileUploadSize: 10,
  sessionTimeout: 60,
  enableNotifications: true,
  defaultLanguage: "tr",
  timezone: "Europe/Istanbul",
  maintenanceMode: false,
  enableBackups: true,
  backupFrequency: "daily",
  maxStudentsPerClass: 30,
  enableAIFeatures: true
}

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      const parsedUser: AdminUser = JSON.parse(userData)
      if (parsedUser.role !== 'admin') {
        router.push('/login')
        return
      }
      setCurrentUser(parsedUser)
      setProfileData({
        ...profileData,
        name: parsedUser.name,
        email: parsedUser.email
      })
    } else {
      router.push('/login')
    }
  }, [router])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Burada API çağrısı yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      
      toast({
        title: "Ayarlar kaydedildi",
        description: "Sistem ayarları başarıyla güncellendi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ayarlar kaydedilirken bir hata oluştu.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Yeni şifreler eşleşmiyor.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      // Burada API çağrısı yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      
      // LocalStorage'ı güncelle
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          name: profileData.name,
          email: profileData.email
        }
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        setCurrentUser(updatedUser)
      }

      toast({
        title: "Profil güncellendi",
        description: "Profil bilgileriniz başarıyla güncellendi.",
      })

      // Şifre alanlarını temizle
      setProfileData({
        ...profileData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackupNow = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated backup
      toast({
        title: "Yedekleme tamamlandı",
        description: "Sistem verilerinin yedeği başarıyla alındı.",
      })
    } catch (error) {
      toast({
        title: "Yedekleme hatası",
        description: "Yedekleme işlemi sırasında bir hata oluştu.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearCache = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated cache clear
      toast({
        title: "Önbellek temizlendi",
        description: "Sistem önbelleği başarıyla temizlendi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Önbellek temizlenirken bir hata oluştu.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <div className="p-6">
      {/* Başlık */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
        <p className="text-gray-600">
          Sistem ayarlarını ve kişisel profilinizi yönetin.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="security">Güvenlik</TabsTrigger>
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
          <TabsTrigger value="system">Sistem</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="maintenance">Bakım</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Genel Sistem Ayarları
              </CardTitle>
              <CardDescription>
                Sitenin genel ayarlarını ve görünümünü yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Adı</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Varsayılan Dil</Label>
                  <Select 
                    value={settings.defaultLanguage}
                    onValueChange={(value) => setSettings({...settings, defaultLanguage: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">Türkçe</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Açıklaması</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zaman Dilimi</Label>
                  <Select 
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({...settings, timezone: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Istanbul">İstanbul (UTC+3)</SelectItem>
                      <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                      <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Sınıf Başına Max Öğrenci</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={settings.maxStudentsPerClass}
                    onChange={(e) => setSettings({...settings, maxStudentsPerClass: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Özellik Ayarları</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Kullanıcı Kaydına İzin Ver</Label>
                    <p className="text-sm text-gray-600">Yeni kullanıcıların sisteme kaydolmasına izin verir</p>
                  </div>
                  <Switch
                    checked={settings.allowRegistration}
                    onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>E-posta Doğrulama Gerektir</Label>
                    <p className="text-sm text-gray-600">Kayıt sırasında e-posta doğrulaması yapılır</p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>AI Özelliklerini Etkinleştir</Label>
                    <p className="text-sm text-gray-600">AI destekli öğrenme araçlarını aktif eder</p>
                  </div>
                  <Switch
                    checked={settings.enableAIFeatures}
                    onCheckedChange={(checked) => setSettings({...settings, enableAIFeatures: checked})}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Kaydediliyor..." : "Ayarları Kaydet"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Güvenlik Ayarları
              </CardTitle>
              <CardDescription>
                Sistem güvenliği ve erişim ayarlarını yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı (dakika)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max Dosya Boyutu (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileUploadSize}
                    onChange={(e) => setSettings({...settings, maxFileUploadSize: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Güvenlik Politikaları</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-green-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        SSL Sertifikası
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Aktif - Son güncelleme: 15 Aralık 2024</p>
                      <p className="text-xs text-green-600 mt-1">Geçerlilik: 30 Aralık 2025'e kadar</p>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        Güvenlik Taraması
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Son tarama: 14 Aralık 2024</p>
                      <p className="text-xs text-green-600 mt-1">Güvenlik skoru: A+ (98/100)</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">İşlemler</h4>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Lock className="h-4 w-4 mr-2" />
                    Tüm Oturumları Sonlandır
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    API Anahtarlarını Yenile
                  </Button>
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Kaydediliyor..." : "Güvenlik Ayarlarını Kaydet"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Bildirim Ayarları
              </CardTitle>
              <CardDescription>
                Sistem bildirimlerini ve e-posta ayarlarını yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sistem Bildirimlerini Etkinleştir</Label>
                  <p className="text-sm text-gray-600">Genel sistem bildirimleri gösterilir</p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-medium">E-posta Bildirimleri</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Yeni Kullanıcı Kaydı</Label>
                      <p className="text-sm text-gray-600">Yeni kullanıcı kaydında yöneticilere bildir</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sistem Hataları</Label>
                      <p className="text-sm text-gray-600">Kritik sistem hataları için bildirim gönder</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Güvenlik Uyarıları</Label>
                      <p className="text-sm text-gray-600">Güvenlik ihlali durumunda bildirim</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Haftalık Raporlar</Label>
                      <p className="text-sm text-gray-600">Haftalık sistem raporları e-posta ile gönderilir</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Kaydediliyor..." : "Bildirim Ayarlarını Kaydet"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Sistem Yönetimi
              </CardTitle>
              <CardDescription>
                Sistem performansı ve veri yönetimi ayarları.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Sistem Durumu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">CPU Kullanımı</span>
                        <Badge className="bg-green-100 text-green-800">%24</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">RAM Kullanımı</span>
                        <Badge className="bg-yellow-100 text-yellow-800">%67</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Disk Kullanımı</span>
                        <Badge className="bg-blue-100 text-blue-800">%45</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Uptime</span>
                        <Badge className="bg-green-100 text-green-800">99.8%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Veritabanı</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Toplam Kayıt</span>
                        <span className="text-sm font-medium">1,247,893</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Veritabanı Boyutu</span>
                        <span className="text-sm font-medium">2.3 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Son Optimizasyon</span>
                        <span className="text-sm font-medium">2 gün önce</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Yedekleme Ayarları</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Otomatik Yedekleme</Label>
                    <p className="text-sm text-gray-600">Veriler otomatik olarak yedeklenir</p>
                  </div>
                  <Switch
                    checked={settings.enableBackups}
                    onCheckedChange={(checked) => setSettings({...settings, enableBackups: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Yedekleme Sıklığı</Label>
                  <Select 
                    value={settings.backupFrequency}
                    onValueChange={(value) => setSettings({...settings, backupFrequency: value})}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Saatlik</SelectItem>
                      <SelectItem value="daily">Günlük</SelectItem>
                      <SelectItem value="weekly">Haftalık</SelectItem>
                      <SelectItem value="monthly">Aylık</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Sistem İşlemleri</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" onClick={handleBackupNow} disabled={isLoading}>
                    <Download className="h-4 w-4 mr-2" />
                    Yedek Al
                  </Button>
                  <Button variant="outline" onClick={handleClearCache} disabled={isLoading}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Önbelleği Temizle
                  </Button>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Veritabanını Optimize Et
                  </Button>
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Kaydediliyor..." : "Sistem Ayarlarını Kaydet"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil Bilgileri
              </CardTitle>
              <CardDescription>
                Kişisel bilgilerinizi ve güvenlik ayarlarınızı güncelleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-lg">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{currentUser.name}</h3>
                  <p className="text-gray-600">{currentUser.email}</p>
                  <Badge className="bg-purple-100 text-purple-800 mt-1">Yönetici</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Kişisel Bilgiler</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="profileName">Ad Soyad</Label>
                    <Input
                      id="profileName"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profileEmail">E-posta</Label>
                    <Input
                      id="profileEmail"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Şifre Değiştir</h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Yeni Şifre</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Güncelleniyor..." : "Profili Güncelle"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Bakım Modu
              </CardTitle>
              <CardDescription>
                Sistem bakım işlemleri ve acil durum ayarları.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Bakım Modu</Label>
                  <p className="text-sm text-gray-600">Sistemi geçici olarak bakım moduna alır</p>
                  {settings.maintenanceMode && (
                    <Badge className="bg-red-100 text-red-800">Aktif - Site erişime kapalı!</Badge>
                  )}
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>

              {settings.maintenanceMode && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">Bakım Modu Aktif</span>
                    </div>
                    <p className="text-sm text-red-700">
                      Site şu anda bakım modunda. Sadece yöneticiler sisteme erişebilir.
                    </p>
                  </CardContent>
                </Card>
              )}

              <Separator />

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Sistem Temizliği</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-yellow-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Geçici Dosyalar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">Son temizlik: 2 gün önce</p>
                      <p className="text-xs text-gray-500">Tahmini boyut: 147 MB</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Temizle
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Log Dosyaları</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">Son temizlik: 5 gün önce</p>
                      <p className="text-xs text-gray-500">Tahmini boyut: 89 MB</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Temizle
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Acil Durum İşlemleri</h4>
                
                <div className="flex gap-2 flex-wrap">
                  <Button variant="destructive" size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Tüm Kullanıcıları Çıkart
                  </Button>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Sistemi Kilitle
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sistemi Yeniden Başlat
                  </Button>
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Kaydediliyor..." : "Bakım Ayarlarını Kaydet"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}