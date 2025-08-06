"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, Bell, Plus, Edit, Trash2, Eye, Send } from "lucide-react"

interface Announcement {
  id: number
  title: string
  content: string
  author: string
  target: 'all' | 'students' | 'teachers' | 'specific-class'
  targetClass?: string
  priority: 'low' | 'medium' | 'high'
  date: string
  isPublished: boolean
  views: number
}

interface Class {
  id: string
  name: string
  studentCount: number
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "Sınav Tarihi Değişikliği",
      content: "İngilizce B1 sınavı, talepler doğrultusunda 15 Aralık Cuma gününe ertelenmiştir. Lütfen programınızı buna göre düzenleyin.",
      author: "Ahmet Yılmaz",
      target: "students",
      priority: "high",
      date: "2024-12-10",
      isPublished: true,
      views: 45
    },
    {
      id: 2,
      title: "Yeni Ders Materyali Yüklendi",
      content: "Unit 6 için yeni ders materyalleri ve pratik çalışmaları platforma yüklendi. İnceleyebilirsiniz.",
      author: "Ayşe Demir",
      target: "specific-class",
      targetClass: "9-A",
      priority: "medium",
      date: "2024-12-09",
      isPublished: true,
      views: 28
    },
    {
      id: 3,
      title: "Ödev Teslim Hatırlatması",
      content: "Bu hafta teslim edilmesi gereken matematik ödevlerini unutmayın. Son teslim tarihi: 18 Aralık.",
      author: "Mehmet Kaya",
      target: "all",
      priority: "medium",
      date: "2024-12-08",
      isPublished: true,
      views: 120
    },
    {
      id: 4,
      title: "Quiz Sonuçları Açıklandı",
      content: "Geçen hafta yapılan fizik quiz sonuçları sistemde yüklendi. Notlarınızı kontrol edebilirsiniz.",
      author: "Zeynep Aksoy",
      target: "students",
      priority: "low",
      date: "2024-12-07",
      isPublished: true,
      views: 67
    }
  ])

  const [classes] = useState<Class[]>([
    { id: "9-a", name: "9-A Sınıfı", studentCount: 28 },
    { id: "9-b", name: "9-B Sınıfı", studentCount: 25 },
    { id: "10-a", name: "10-A Sınıfı", studentCount: 30 },
    { id: "10-b", name: "10-B Sınıfı", studentCount: 27 }
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    target: "all" as const,
    targetClass: "",
    priority: "medium" as const
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Yüksek'
      case 'medium':
        return 'Orta'
      case 'low':
        return 'Düşük'
      default:
        return priority
    }
  }

  const getTargetLabel = (target: string, targetClass?: string) => {
    switch (target) {
      case 'all':
        return 'Tüm Kullanıcılar'
      case 'students':
        return 'Tüm Öğrenciler'
      case 'teachers':
        return 'Tüm Öğretmenler'
      case 'specific-class':
        return targetClass || 'Belirli Sınıf'
      default:
        return target
    }
  }

  const handleCreateAnnouncement = () => {
    const announcement: Announcement = {
      id: announcements.length + 1,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      author: "Mevcut Kullanıcı", // This would come from the logged-in user
      target: newAnnouncement.target,
      targetClass: newAnnouncement.targetClass || undefined,
      priority: newAnnouncement.priority,
      date: new Date().toISOString().split('T')[0],
      isPublished: true,
      views: 0
    }

    setAnnouncements([announcement, ...announcements])
    setNewAnnouncement({
      title: "",
      content: "",
      target: "all",
      targetClass: "",
      priority: "medium"
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      target: announcement.target,
      targetClass: announcement.targetClass || "",
      priority: announcement.priority
    })
  }

  const handleUpdateAnnouncement = () => {
    if (!editingAnnouncement) return

    setAnnouncements(announcements.map(a => 
      a.id === editingAnnouncement.id 
        ? { ...a, ...newAnnouncement, targetClass: newAnnouncement.targetClass || undefined }
        : a
    ))

    setEditingAnnouncement(null)
    setNewAnnouncement({
      title: "",
      content: "",
      target: "all",
      targetClass: "",
      priority: "medium"
    })
  }

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id))
  }

  const publishedAnnouncements = announcements.filter(a => a.isPublished)
  const draftAnnouncements = announcements.filter(a => !a.isPublished)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Duyurular</h1>
          <p className="text-gray-600">Duyuruları yönetin ve yayınlayın</p>
        </div>
        <Dialog open={isCreateDialogOpen || !!editingAnnouncement} onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false)
            setEditingAnnouncement(null)
            setNewAnnouncement({
              title: "",
              content: "",
              target: "all",
              targetClass: "",
              priority: "medium"
            })
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Duyuru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAnnouncement ? "Duyuruyu Düzenle" : "Yeni Duyuru Oluştur"}
              </DialogTitle>
              <DialogDescription>
                Duyuru detaylarını girin ve hedef kitleyi seçin
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Başlık</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  placeholder="Duyuru başlığı..."
                />
              </div>
              
              <div>
                <Label htmlFor="content">İçerik</Label>
                <Textarea
                  id="content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  placeholder="Duyuru içeriği..."
                  className="min-h-32"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target">Hedef Kitle</Label>
                  <Select value={newAnnouncement.target} onValueChange={(value: any) => setNewAnnouncement({...newAnnouncement, target: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                      <SelectItem value="students">Tüm Öğrenciler</SelectItem>
                      <SelectItem value="teachers">Tüm Öğretmenler</SelectItem>
                      <SelectItem value="specific-class">Belirli Sınıf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Öncelik</Label>
                  <Select value={newAnnouncement.priority} onValueChange={(value: any) => setNewAnnouncement({...newAnnouncement, priority: value})}>
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
              </div>

              {newAnnouncement.target === 'specific-class' && (
                <div>
                  <Label htmlFor="class">Sınıf Seç</Label>
                  <Select value={newAnnouncement.targetClass} onValueChange={(value) => setNewAnnouncement({...newAnnouncement, targetClass: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sınıf seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name} ({cls.studentCount} öğrenci)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
                  disabled={!newAnnouncement.title || !newAnnouncement.content}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {editingAnnouncement ? "Güncelle" : "Yayınla"}
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false)
                  setEditingAnnouncement(null)
                }}>
                  İptal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{publishedAnnouncements.length}</p>
                <p className="text-sm text-gray-600">Yayınlanan Duyuru</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {announcements.reduce((sum, a) => sum + a.views, 0)}
                </p>
                <p className="text-sm text-gray-600">Toplam Görüntülenme</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{classes.length}</p>
                <p className="text-sm text-gray-600">Sınıf Sayısı</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {announcements.filter(a => a.priority === 'high').length}
                </p>
                <p className="text-sm text-gray-600">Yüksek Öncelikli</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="published" className="w-full">
        <TabsList>
          <TabsTrigger value="published">Yayınlanan ({publishedAnnouncements.length})</TabsTrigger>
          <TabsTrigger value="drafts">Taslaklar ({draftAnnouncements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="space-y-4">
          <div className="grid gap-4">
            {publishedAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {getPriorityLabel(announcement.priority)}
                        </Badge>
                      </div>
                      <CardDescription>
                        {announcement.author} • {announcement.date}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditAnnouncement(announcement)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAnnouncement(announcement.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{announcement.content}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{getTargetLabel(announcement.target, announcement.targetClass)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{announcement.views} görüntülenme</span>
                      </div>
                    </div>
                    <Badge variant="outline">Yayınlandı</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <Card>
            <CardContent className="py-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Taslak Duyuru Yok</h3>
              <p className="text-gray-600">Yeni duyuru oluşturmak için yukarıdaki butonu kullanın</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}