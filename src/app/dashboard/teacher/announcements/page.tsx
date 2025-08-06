"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Search, Megaphone, Plus, Edit, Trash2, Eye, Calendar, Users, Send, Bell, Clock } from "lucide-react"
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

interface Announcement {
  id: string
  title: string
  content: string
  targetClass: string
  priority: "low" | "medium" | "high"
  publishDate: string
  expiryDate?: string
  isPublished: boolean
  readCount: number
  totalStudents: number
  isPinned: boolean
  category: string
  authorName: string
}

export default function TeacherAnnouncements() {
  const [user, setUser] = useState<User | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    targetClass: "",
    priority: "medium" as Announcement["priority"],
    expiryDate: "",
    isPinned: false,
    category: "",
    isPublished: true
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

    // Sample announcements data
    setAnnouncements([
      {
        id: "ann-001",
        title: "Dönem Sonu Sınavı Tarihleri",
        content: "Sevgili öğrenciler, dönem sonu İngilizce sınavımız 15 Aralık Pazartesi günü yapılacaktır. Sınav konuları: Unit 1-5 arası tüm grammar konuları ve vocabulary. Sınavda writing ve reading bölümleri bulunacaktır.",
        targetClass: "9-A İngilizce",
        priority: "high",
        publishDate: "2024-01-20",
        expiryDate: "2024-12-15",
        isPublished: true,
        readCount: 24,
        totalStudents: 28,
        isPinned: true,
        category: "Sınav",
        authorName: "Sarah Johnson"
      },
      {
        id: "ann-002",
        title: "Yeni Ders Materyalleri",
        content: "Unit 6 için yeni çalışma kağıtları ve ses dosyalarını materyal bölümüne yükledim. Ders öncesinde mutlaka inceleyin.",
        targetClass: "9-B İngilizce",
        priority: "medium",
        publishDate: "2024-01-18",
        isPublished: true,
        readCount: 18,
        totalStudents: 25,
        isPinned: false,
        category: "Materyal",
        authorName: "Sarah Johnson"
      },
      {
        id: "ann-003",
        title: "Speaking Practice Oturumu",
        content: "Gelecek hafta Çarşamba günü 14:00-15:00 arası isteğe bağlı konuşma pratiği yapacağız. Katılmak isteyenler bana bildirsin.",
        targetClass: "10-A İngilizce",
        priority: "low",
        publishDate: "2024-01-15",
        isPublished: true,
        readCount: 15,
        totalStudents: 30,
        isPinned: false,
        category: "Etkinlik",
        authorName: "Sarah Johnson"
      },
      {
        id: "ann-004",
        title: "Ödev Teslim Hatırlatması",
        content: "Essay ödevlerinizi teslim etmeyi unutmayın. Son teslim tarihi: 20 Aralık.",
        targetClass: "Tüm Sınıflar",
        priority: "medium",
        publishDate: "2024-01-22",
        isPublished: false,
        readCount: 0,
        totalStudents: 83,
        isPinned: false,
        category: "Ödev",
        authorName: "Sarah Johnson"
      }
    ])
  }, [router])

  const getPriorityColor = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityIcon = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "high":
        return <Bell className="w-4 h-4 text-red-600" />
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "low":
        return <Megaphone className="w-4 h-4 text-green-600" />
      default:
        return <Megaphone className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesStatus = true
    if (filterStatus === "published") matchesStatus = announcement.isPublished
    if (filterStatus === "draft") matchesStatus = !announcement.isPublished
    if (filterStatus === "pinned") matchesStatus = announcement.isPinned
    
    return matchesSearch && matchesStatus
  })

  const handleCreateAnnouncement = () => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      targetClass: newAnnouncement.targetClass,
      priority: newAnnouncement.priority,
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: newAnnouncement.expiryDate || undefined,
      isPublished: newAnnouncement.isPublished,
      readCount: 0,
      totalStudents: newAnnouncement.targetClass === "Tüm Sınıflar" ? 83 : 28,
      isPinned: newAnnouncement.isPinned,
      category: newAnnouncement.category,
      authorName: user?.name || "Öğretmen"
    }

    setAnnouncements(prev => [newAnn, ...prev])
    setNewAnnouncement({
      title: "",
      content: "",
      targetClass: "",
      priority: "medium",
      expiryDate: "",
      isPinned: false,
      category: "",
      isPublished: true
    })
    setIsCreateDialogOpen(false)
    
    toast({
      title: newAnn.isPublished ? "Duyuru Yayınlandı" : "Duyuru Taslak Olarak Kaydedildi",
      description: newAnn.isPublished ? "Duyuru başarıyla yayınlandı." : "Duyuru taslak olarak kaydedildi.",
    })
  }

  const handleTogglePublish = (id: string) => {
    setAnnouncements(prev => prev.map(ann => 
      ann.id === id 
        ? { ...ann, isPublished: !ann.isPublished }
        : ann
    ))
    
    const announcement = announcements.find(ann => ann.id === id)
    toast({
      title: announcement?.isPublished ? "Duyuru Yayından Kaldırıldı" : "Duyuru Yayınlandı",
      description: announcement?.isPublished ? "Duyuru yayından kaldırıldı." : "Duyuru yayınlandı.",
    })
  }

  const handleTogglePin = (id: string) => {
    setAnnouncements(prev => prev.map(ann => 
      ann.id === id 
        ? { ...ann, isPinned: !ann.isPinned }
        : ann
    ))
    
    toast({
      title: "Sabitleme Durumu Güncellendi",
      description: "Duyuru sabitleme durumu değiştirildi.",
    })
  }

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id))
    toast({
      title: "Duyuru Silindi",
      description: "Duyuru başarıyla silindi.",
    })
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
            <h1 className="text-3xl font-bold text-gray-900">Duyurular</h1>
            <p className="text-gray-600">Sınıflarınız için duyuru oluşturun ve yönetin</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Duyuru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yeni Duyuru Oluştur</DialogTitle>
                <DialogDescription>
                  Öğrencileriniz için yeni bir duyuru oluşturun
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Duyuru Başlığı</Label>
                  <Input
                    id="title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Duyuru başlığı"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">İçerik</Label>
                  <Textarea
                    id="content"
                    rows={6}
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Duyuru içeriğini buraya yazın..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetClass">Hedef Sınıf</Label>
                    <Select value={newAnnouncement.targetClass} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, targetClass: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tüm Sınıflar">Tüm Sınıflar</SelectItem>
                        <SelectItem value="9-A İngilizce">9-A İngilizce</SelectItem>
                        <SelectItem value="9-B İngilizce">9-B İngilizce</SelectItem>
                        <SelectItem value="10-A İngilizce">10-A İngilizce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Öncelik</Label>
                    <Select value={newAnnouncement.priority} onValueChange={(value: Announcement["priority"]) => setNewAnnouncement(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Düşük</SelectItem>
                        <SelectItem value="medium">Orta</SelectItem>
                        <SelectItem value="high">Yüksek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={newAnnouncement.category} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sınav">Sınav</SelectItem>
                        <SelectItem value="Ödev">Ödev</SelectItem>
                        <SelectItem value="Materyal">Materyal</SelectItem>
                        <SelectItem value="Etkinlik">Etkinlik</SelectItem>
                        <SelectItem value="Genel">Genel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Son Geçerlilik Tarihi (İsteğe bağlı)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newAnnouncement.expiryDate}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isPinned">Sabitlensin</Label>
                      <p className="text-sm text-gray-600">Duyuru listenin en üstünde görünsün</p>
                    </div>
                    <Switch
                      id="isPinned"
                      checked={newAnnouncement.isPinned}
                      onCheckedChange={(checked) => setNewAnnouncement(prev => ({ ...prev, isPinned: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isPublished">Hemen Yayınla</Label>
                      <p className="text-sm text-gray-600">Kapalıysa taslak olarak kaydedilir</p>
                    </div>
                    <Switch
                      id="isPublished"
                      checked={newAnnouncement.isPublished}
                      onCheckedChange={(checked) => setNewAnnouncement(prev => ({ ...prev, isPublished: checked }))}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreateAnnouncement} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    {newAnnouncement.isPublished ? "Yayınla" : "Taslak Kaydet"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    İptal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Duyuru ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Duyurular</SelectItem>
              <SelectItem value="published">Yayınlanmış</SelectItem>
              <SelectItem value="draft">Taslaklar</SelectItem>
              <SelectItem value="pinned">Sabitlenmiş</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {announcements.filter(a => a.isPublished).length}
              </div>
              <div className="text-sm text-gray-600">Yayınlanmış</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {announcements.filter(a => !a.isPublished).length}
              </div>
              <div className="text-sm text-gray-600">Taslak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {announcements.filter(a => a.isPinned).length}
              </div>
              <div className="text-sm text-gray-600">Sabitlenmiş</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(announcements.reduce((acc, a) => acc + (a.readCount / a.totalStudents * 100), 0) / announcements.length) || 0}%
              </div>
              <div className="text-sm text-gray-600">Ortalama Okunma</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id} className={`${announcement.isPinned ? 'border-yellow-300 bg-yellow-50' : ''} ${!announcement.isPublished ? 'border-gray-300 bg-gray-50' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getPriorityIcon(announcement.priority)}
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority === "high" && "Yüksek Öncelik"}
                      {announcement.priority === "medium" && "Orta Öncelik"}
                      {announcement.priority === "low" && "Düşük Öncelik"}
                    </Badge>
                    {announcement.category && (
                      <Badge variant="secondary">{announcement.category}</Badge>
                    )}
                    {announcement.isPinned && (
                      <Badge className="bg-yellow-100 text-yellow-800">Sabitli</Badge>
                    )}
                    {!announcement.isPublished && (
                      <Badge className="bg-gray-100 text-gray-800">Taslak</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  <CardDescription className="mt-2 text-base">
                    {announcement.content.length > 200 
                      ? `${announcement.content.substring(0, 200)}...`
                      : announcement.content
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Hedef: </span>
                  <span className="font-medium">{announcement.targetClass}</span>
                </div>
                <div>
                  <span className="text-gray-600">Yayın Tarihi: </span>
                  <span className="font-medium">
                    {new Date(announcement.publishDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Okunma: </span>
                  <span className="font-medium">
                    {announcement.readCount}/{announcement.totalStudents}
                    <span className="text-gray-500 ml-1">
                      (%{Math.round((announcement.readCount / announcement.totalStudents) * 100)})
                    </span>
                  </span>
                </div>
                {announcement.expiryDate && (
                  <div>
                    <span className="text-gray-600">Bitiş: </span>
                    <span className="font-medium">
                      {new Date(announcement.expiryDate).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTogglePublish(announcement.id)}
                >
                  {announcement.isPublished ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Yayından Kaldır
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Yayınla
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTogglePin(announcement.id)}
                >
                  {announcement.isPinned ? "Sabitlemeyi Kaldır" : "Sabitle"}
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Düzenle
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(announcement.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sil
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Okuma İstatistikleri
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12">
          <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Duyuru bulunamadı</h3>
          <p className="text-gray-600 mb-4">Arama kriterlerinize uygun duyuru bulunmuyor.</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            İlk Duyuruyu Oluştur
          </Button>
        </div>
      )}
    </div>
  )
}