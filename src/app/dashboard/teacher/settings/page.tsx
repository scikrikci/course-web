"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Save, User, Lock, Globe, ArrowLeft, Camera, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface User {
  id: number
  username: string
  role: string
  level?: string
  name: string
  email: string
  avatar: string
}

export default function TeacherSettings() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    assignmentReminders: true,
    studentMessages: true,
    systemUpdates: false
  })
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    contactVisible: false,
    scheduleVisible: true
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)
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
      setFormData(prev => ({
        ...prev,
        name: parsedUser.name,
        email: parsedUser.email,
        subject: "İngilizce",
        bio: "Deneyimli İngilizce öğretmeni. Öğrencilerimin İngilizce sevgisi kazanmalarını hedefliyorum."
      }))
    } else {
      router.push('/login')
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }))
  }

  const handlePrivacyChange = (field: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [field]: value }))
  }

  const handleProfileSave = async () => {
    setLoading(true)
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update localStorage
      if (user) {
        const updatedUser = { ...user, name: formData.name, email: formData.email }
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        setUser(updatedUser)
      }

      toast({
        title: "Profil Güncellendi",
        description: "Profil bilgileriniz başarıyla güncellendi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Yeni şifreler eşleşmiyor.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }))

      toast({
        title: "Şifre Güncellendi",
        description: "Şifreniz başarıyla değiştirildi.",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Şifre değiştirilirken bir hata oluştu.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
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
        <div className="flex items-center gap-4 mb-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Öğretmen Ayarları</h1>
            <p className="text-gray-600">Profil bilgilerinizi ve tercihlerinizi yönetin</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profil Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profil Bilgileri
            </CardTitle>
            <CardDescription>
              Temel profil bilgilerinizi güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-green-100 text-green-700 text-2xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <Badge className="bg-green-100 text-green-800">Öğretmen</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Adınızı ve soyadınızı girin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="E-posta adresinizi girin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Telefon numaranızı girin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Branş</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Branşınızı girin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biyografi</Label>
              <Textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
              />
            </div>

            <Button onClick={handleProfileSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Güncelleniyor..." : "Profili Güncelle"}
            </Button>
          </CardContent>
        </Card>

        {/* Şifre Değiştir */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Şifre Değiştir
            </CardTitle>
            <CardDescription>
              Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mevcut Şifre</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  placeholder="Mevcut şifrenizi girin"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Yeni Şifre</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    placeholder="Yeni şifrenizi girin"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrarı</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Şifrenizi tekrar girin"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={handlePasswordChange} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Güncelleniyor..." : "Şifreyi Değiştir"}
            </Button>
          </CardContent>
        </Card>

        {/* Bildirim Ayarları */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Bildirim Tercihleri
            </CardTitle>
            <CardDescription>
              Hangi durumlarda bildirim almak istediğinizi seçin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">E-posta Bildirimleri</Label>
                  <p className="text-sm text-gray-600">Genel bildirimler e-posta ile gönderilsin</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="assignmentReminders">Ödev Hatırlatıcıları</Label>
                  <p className="text-sm text-gray-600">Kontrol edilmemiş ödevler için hatırlatma</p>
                </div>
                <Switch
                  id="assignmentReminders"
                  checked={notifications.assignmentReminders}
                  onCheckedChange={(checked) => handleNotificationChange("assignmentReminders", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="studentMessages">Öğrenci Mesajları</Label>
                  <p className="text-sm text-gray-600">Öğrencilerden gelen mesajlar için bildirim</p>
                </div>
                <Switch
                  id="studentMessages"
                  checked={notifications.studentMessages}
                  onCheckedChange={(checked) => handleNotificationChange("studentMessages", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="systemUpdates">Sistem Güncellemeleri</Label>
                  <p className="text-sm text-gray-600">Platform güncellemeleri ve duyurular</p>
                </div>
                <Switch
                  id="systemUpdates"
                  checked={notifications.systemUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("systemUpdates", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gizlilik Ayarları */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Gizlilik Ayarları
            </CardTitle>
            <CardDescription>
              Profil bilgilerinizin görünürlüğünü kontrol edin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profileVisible">Profil Görünürlüğü</Label>
                  <p className="text-sm text-gray-600">Profiliniz öğrenciler tarafından görülsün</p>
                </div>
                <Switch
                  id="profileVisible"
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => handlePrivacyChange("profileVisible", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="contactVisible">İletişim Bilgileri</Label>
                  <p className="text-sm text-gray-600">Telefon numaranız öğrenciler tarafından görülsün</p>
                </div>
                <Switch
                  id="contactVisible"
                  checked={privacy.contactVisible}
                  onCheckedChange={(checked) => handlePrivacyChange("contactVisible", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="scheduleVisible">Ders Programı</Label>
                  <p className="text-sm text-gray-600">Ders programınız öğrenciler tarafından görülsün</p>
                </div>
                <Switch
                  id="scheduleVisible"
                  checked={privacy.scheduleVisible}
                  onCheckedChange={(checked) => handlePrivacyChange("scheduleVisible", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}