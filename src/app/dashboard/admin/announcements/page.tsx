"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { 
  Megaphone,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Send,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Pin,
  Filter
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

interface Announcement {
  id: string
  title: string
  content: string
  type: 'general' | 'urgent' | 'maintenance' | 'event'
  targetAudience: 'all' | 'students' | 'teachers' | 'admins'
  author: {
    id: number
    name: string
    role: string
  }
  createdAt: string
  publishedAt?: string
  expiresAt?: string
  status: 'draft' | 'published' | 'expired'
  isPinned: boolean
  readBy: number[]
  totalRecipients: number
}

// Mock data
const mockAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Sistem Bakım Bildirisi",
    content: "Sevgili kullanıcılar, sistemimiz 20 Aralık Cuma günü saat 02:00-04:00 arasında bakım nedeniyle hizmet dışı kalacaktır. Bu süre zarfında platforma erişim sağlanamayacaktır. Yaşanacak rahatsızlık için özür dileriz.",
    type: "maintenance",
    targetAudience: "all",
    author: {
      id: 1,
      name: "Admin Sistem",
      role: "admin"
    },
    createdAt: "2024-12-15T10:00:00",
    publishedAt: "2024-12-15T10:30:00",
    expiresAt: "2024-12-21T00:00:00",
    status: "published",
    isPinned: true,
    readBy: [1, 2, 3, 4, 5],
    totalRecipients: 1247
  },
  {
    id: "ann-2", 
    title: "Yeni AI Araçları Duyurusu",
    content: "Heyecan verici bir gelişme! Platformumuza yeni AI destekli öğrenme araçları eklendi. Bu araçlar sayesinde daha kişiselleştirilmiş bir öğrenme deneyimi yaşayabileceksiniz. Detaylar için AI Araçları menüsünü ziyaret edebilirsiniz.",
    type: "general",
    targetAudience: "students",
    author: {
      id: 2,
      name: "Ayşe Özkan",
      role: "admin"
    },
    createdAt: "2024-12-14T15:30:00",
    publishedAt: "2024-12-14T16:00:00",
    status: "published",
    isPinned: false,
    readBy: [1, 3, 5, 7, 9, 11],
    totalRecipients: 1050
  },
  {
    id: "ann-3",
    title: "Dönem Sonu Sınav Takvimi",
    content: "Değerli öğretmenler ve öğrenciler, dönem sonu sınavları 25-29 Aralık tarihleri arasında gerçekleştirilecektir. Sınav programını derslerinizin sayfasından kontrol edebilirsiniz.",
    type: "event",
    targetAudience: "all",
    author: {
      id: 3,
      name: "Fatma Kaya", 
      role: "admin"
    },
    createdAt: "2024-12-13T09:00:00",
    status: "draft",
    isPinned: false,
    readBy: [],
    totalRecipients: 0
  },
  {
    id: "ann-4",
    title: "Acil: Güvenlik Güncellemesi",
    content: "Güvenlik politikalarımızda yapılan değişiklikler neticesinde, tüm kullanıcıların şifrelerini güncellememeleri gerekiyor. Bu güvenlik önlemi 22 Aralık'a kadar tamamlanmalıdır.",
    type: "urgent",
    targetAudience: "all",
    author: {
      id: 1,
      name: "Admin Sistem",
      role: "admin"
    },
    createdAt: "2024-12-12T14:20:00",
    publishedAt: "2024-12-12T14:30:00",
    expiresAt: "2024-12-22T23:59:59",
    status: "published",
    isPinned: true,
    readBy: [1, 2, 4, 6, 8],
    totalRecipients: 1247
  }
]

export default function AnnouncementsPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "general",
    targetAudience: "all",
    isPinned: false,
    expiresAt: ""
  })
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
    } else {
      router.push('/login')
    }
  }, [router])

  // Filtreleme işlemi
  useEffect(() => {
    let filtered = announcements

    if (searchTerm) {
      filtered = filtered.filter(ann => 
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(ann => ann.type === typeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(ann => ann.status === statusFilter)
    }

    // Sabitlenmiş duyurular üstte
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    setFilteredAnnouncements(filtered)
  }, [announcements, searchTerm, typeFilter, statusFilter])

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">Acil</Badge>
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Bakım</Badge>
      case 'event':
        return <Badge className="bg-blue-100 text-blue-800">Etkinlik</Badge>
      case 'general':
        return <Badge className="bg-green-100 text-green-800">Genel</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Yayınlandı</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Taslak</Badge>
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Süresi Doldu</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getAudienceBadge = (audience: string) => {
    switch (audience) {
      case 'all':
        return <Badge variant="outline">Tüm Kullanıcılar</Badge>
      case 'students':
        return <Badge className="bg-blue-100 text-blue-800">Öğrenciler</Badge>
      case 'teachers':
        return <Badge className="bg-green-100 text-green-800">Öğretmenler</Badge>
      case 'admins':
        return <Badge className="bg-purple-100 text-purple-800">Yöneticiler</Badge>
      default:
        return <Badge variant="outline">{audience}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getReadPercentage = (readBy: number[], total: number) => {
    if (total === 0) return 0
    return Math.round((readBy.length / total) * 100)
  }

  const handleCreateAnnouncement = () => {
    const announcement: Announcement = {
      id: `ann-${Date.now()}`,
      ...newAnnouncement,
      author: {
        id: currentUser!.id,
        name: currentUser!.name,
        role: currentUser!.role
      },
      createdAt: new Date().toISOString(),
      status: 'draft',
      readBy: [],
      totalRecipients: 0
    }

    setAnnouncements([announcement, ...announcements])
    setIsCreateModalOpen(false)
    setNewAnnouncement({
      title: "",
      content: "",
      type: "general",
      targetAudience: "all",
      isPinned: false,
      expiresAt: ""
    })
    
    toast({
      title: "Duyuru oluşturuldu",
      description: "Duyuru başarıyla taslak olarak kaydedildi.",
    })
  }

  const handlePublishAnnouncement = (id: string) => {
    setAnnouncements(announcements.map(ann => 
      ann.id === id 
        ? { 
            ...ann, 
            status: 'published' as const,
            publishedAt: new Date().toISOString(),
            totalRecipients: ann.targetAudience === 'all' ? 1247 : 
                            ann.targetAudience === 'students' ? 1050 : 
                            ann.targetAudience === 'teachers' ? 180 : 17
          }
        : ann
    ))
    
    toast({
      title: "Duyuru yayınlandı",
      description: "Duyuru tüm hedef kitleye gönderildi.",
    })
  }

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id))
    toast({
      title: "Duyuru silindi",
      description: "Duyuru başarıyla sistemden kaldırıldı.",
    })
  }

  const handleTogglePin = (id: string) => {
    setAnnouncements(announcements.map(ann => 
      ann.id === id ? { ...ann, isPinned: !ann.isPinned } : ann
    ))
  }

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <div className="p-6">
      {/* Başlık */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Genel Duyurular</h1>
        <p className="text-gray-600">
          Sistem genelinde duyuru oluşturun ve yönetin.
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Duyuru</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">
              Bu ay oluşturulan
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Duyuru</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter(a => a.status === 'published').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Şu anda yayında
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taslak</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcements.filter(a => a.status === 'draft').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Yayın bekliyor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Okunma</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                announcements
                  .filter(a => a.status === 'published')
                  .reduce((acc, ann) => acc + getReadPercentage(ann.readBy, ann.totalRecipients), 0) /
                announcements.filter(a => a.status === 'published').length || 0
              )}%
            </div>
            <p className="text-xs text-muted-foreground">
              Okunma oranı
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Araç Çubuğu */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Duyuru ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tip filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Tipler</SelectItem>
                  <SelectItem value="general">Genel</SelectItem>
                  <SelectItem value="urgent">Acil</SelectItem>
                  <SelectItem value="maintenance">Bakım</SelectItem>
                  <SelectItem value="event">Etkinlik</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Durum filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="published">Yayınlandı</SelectItem>
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="expired">Süresi Doldu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Yeni Duyuru
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Yeni Duyuru Oluştur</DialogTitle>
                  <DialogDescription>
                    Sistem genelinde bir duyuru oluşturun.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Başlık
                    </Label>
                    <Input 
                      id="title" 
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="content" className="text-right pt-2">
                      İçerik
                    </Label>
                    <Textarea 
                      id="content" 
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                      className="col-span-3 min-h-20" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Tip
                    </Label>
                    <Select 
                      value={newAnnouncement.type}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, type: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Genel</SelectItem>
                        <SelectItem value="urgent">Acil</SelectItem>
                        <SelectItem value="maintenance">Bakım</SelectItem>
                        <SelectItem value="event">Etkinlik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="audience" className="text-right">
                      Hedef Kitle
                    </Label>
                    <Select
                      value={newAnnouncement.targetAudience}
                      onValueChange={(value) => setNewAnnouncement({...newAnnouncement, targetAudience: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                        <SelectItem value="students">Öğrenciler</SelectItem>
                        <SelectItem value="teachers">Öğretmenler</SelectItem>
                        <SelectItem value="admins">Yöneticiler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="pinned" className="text-right">
                      Sabitlensin
                    </Label>
                    <Switch 
                      id="pinned"
                      checked={newAnnouncement.isPinned}
                      onCheckedChange={(checked) => setNewAnnouncement({...newAnnouncement, isPinned: checked})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    İptal
                  </Button>
                  <Button onClick={handleCreateAnnouncement}>
                    Taslak Olarak Kaydet
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Duyuru Listesi */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id} className={`${announcement.isPinned ? 'border-l-4 border-l-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    {getTypeBadge(announcement.type)}
                    {getStatusBadge(announcement.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Yazar: {announcement.author.name}</span>
                    <span>{formatDate(announcement.createdAt)}</span>
                    {getAudienceBadge(announcement.targetAudience)}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedAnnouncement(announcement)
                      setIsViewModalOpen(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePin(announcement.id)}
                  >
                    <Pin className={`h-4 w-4 ${announcement.isPinned ? 'text-blue-600' : ''}`} />
                  </Button>
                  {announcement.status === 'draft' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePublishAnnouncement(announcement.id)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedAnnouncement(announcement)
                      setIsEditModalOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{announcement.content}</p>
              {announcement.status === 'published' && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    Okunma: {announcement.readBy.length}/{announcement.totalRecipients} 
                    ({getReadPercentage(announcement.readBy, announcement.totalRecipients)}%)
                  </span>
                  {announcement.expiresAt && (
                    <span className="text-gray-600">
                      Son geçerlilik: {formatDate(announcement.expiresAt)}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Duyuru Detay Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Duyuru Detayları</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedAnnouncement.title}</h3>
                <div className="flex gap-2 mb-4">
                  {getTypeBadge(selectedAnnouncement.type)}
                  {getStatusBadge(selectedAnnouncement.status)}
                  {getAudienceBadge(selectedAnnouncement.targetAudience)}
                  {selectedAnnouncement.isPinned && <Badge className="bg-blue-100 text-blue-800">Sabitlenmiş</Badge>}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Yazar</Label>
                    <p>{selectedAnnouncement.author.name}</p>
                  </div>
                  <div>
                    <Label>Oluşturulma</Label>
                    <p>{formatDate(selectedAnnouncement.createdAt)}</p>
                  </div>
                  {selectedAnnouncement.publishedAt && (
                    <div>
                      <Label>Yayınlanma</Label>
                      <p>{formatDate(selectedAnnouncement.publishedAt)}</p>
                    </div>
                  )}
                  {selectedAnnouncement.expiresAt && (
                    <div>
                      <Label>Son Geçerlilik</Label>
                      <p>{formatDate(selectedAnnouncement.expiresAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>İçerik</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p>{selectedAnnouncement.content}</p>
                </div>
              </div>

              {selectedAnnouncement.status === 'published' && (
                <div>
                  <Label>Okunma İstatistikleri</Label>
                  <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Toplam Alıcı: {selectedAnnouncement.totalRecipients}</span>
                      <span>Okuyan: {selectedAnnouncement.readBy.length}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Okunma Oranı</span>
                        <span>{getReadPercentage(selectedAnnouncement.readBy, selectedAnnouncement.totalRecipients)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${getReadPercentage(selectedAnnouncement.readBy, selectedAnnouncement.totalRecipients)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}