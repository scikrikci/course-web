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
import { Search, Upload, FileText, Video, Download, Eye, Trash2, Edit, Plus, Filter, BookOpen, Image, Music, FileSpreadsheet } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

interface Material {
  id: string
  title: string
  description: string
  type: "pdf" | "video" | "image" | "audio" | "spreadsheet" | "presentation" | "document"
  fileSize: string
  uploadDate: string
  lastModified: string
  category: string
  grade: string
  subject: string
  downloads: number
  isPublic: boolean
  tags: string[]
}

export default function TeacherMaterials() {
  const [user, setUser] = useState<User | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    category: "",
    grade: "",
    type: "pdf" as Material["type"],
    isPublic: false,
    tags: ""
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

    // Sample materials data
    setMaterials([
      {
        id: "mat-001",
        title: "Unit 5: Present Perfect Tense",
        description: "Present Perfect konu anlatımı ve alıştırmalar",
        type: "pdf",
        fileSize: "2.5 MB",
        uploadDate: "2024-01-15",
        lastModified: "2024-01-20",
        category: "Konu Anlatımı",
        grade: "9",
        subject: "İngilizce",
        downloads: 45,
        isPublic: true,
        tags: ["grammar", "present-perfect", "tense"]
      },
      {
        id: "mat-002", 
        title: "English Conversation Practice",
        description: "Günlük konuşma pratikleri için video dersi",
        type: "video",
        fileSize: "125 MB",
        uploadDate: "2024-01-10",
        lastModified: "2024-01-10",
        category: "Video Ders",
        grade: "10",
        subject: "İngilizce",
        downloads: 78,
        isPublic: false,
        tags: ["speaking", "conversation", "practice"]
      },
      {
        id: "mat-003",
        title: "Vocabulary Worksheet - Animals",
        description: "Hayvanlar konusunda kelime çalışma sayfası",
        type: "document",
        fileSize: "1.2 MB",
        uploadDate: "2024-01-08",
        lastModified: "2024-01-12",
        category: "Çalışma Kağıdı",
        grade: "9",
        subject: "İngilizce",
        downloads: 32,
        isPublic: true,
        tags: ["vocabulary", "animals", "worksheet"]
      },
      {
        id: "mat-004",
        title: "İngilizce Telaffuz Klavuzu",
        description: "Temel telaffuz kuralları ses dosyası",
        type: "audio",
        fileSize: "15 MB",
        uploadDate: "2024-01-05",
        lastModified: "2024-01-05",
        category: "Ses Dosyası",
        grade: "9",
        subject: "İngilizce",
        downloads: 23,
        isPublic: true,
        tags: ["pronunciation", "phonetics", "audio"]
      },
      {
        id: "mat-005",
        title: "Grammar Rules Presentation",
        description: "Temel gramer kuralları sunumu",
        type: "presentation",
        fileSize: "8.7 MB",
        uploadDate: "2024-01-03",
        lastModified: "2024-01-15",
        category: "Sunum",
        grade: "10",
        subject: "İngilizce",
        downloads: 56,
        isPublic: false,
        tags: ["grammar", "rules", "presentation"]
      }
    ])
  }, [router])

  const getFileIcon = (type: Material["type"]) => {
    switch (type) {
      case "pdf":
      case "document":
        return <FileText className="w-5 h-5 text-red-600" />
      case "video":
        return <Video className="w-5 h-5 text-blue-600" />
      case "image":
        return <Image className="w-5 h-5 text-green-600" />
      case "audio":
        return <Music className="w-5 h-5 text-purple-600" />
      case "spreadsheet":
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />
      case "presentation":
        return <BookOpen className="w-5 h-5 text-orange-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: Material["type"]) => {
    switch (type) {
      case "pdf":
      case "document":
        return "bg-red-100 text-red-800"
      case "video":
        return "bg-blue-100 text-blue-800"
      case "image":
        return "bg-green-100 text-green-800"
      case "audio":
        return "bg-purple-100 text-purple-800"
      case "spreadsheet":
        return "bg-emerald-100 text-emerald-800"
      case "presentation":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === "all" || material.type === filterType
    const matchesCategory = filterCategory === "all" || material.category === filterCategory
    return matchesSearch && matchesType && matchesCategory
  })

  const handleUpload = () => {
    // Simulated upload
    const newMat: Material = {
      id: `mat-${Date.now()}`,
      title: newMaterial.title,
      description: newMaterial.description,
      type: newMaterial.type,
      fileSize: "2.1 MB", // Simulated
      uploadDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      category: newMaterial.category,
      grade: newMaterial.grade,
      subject: "İngilizce",
      downloads: 0,
      isPublic: newMaterial.isPublic,
      tags: newMaterial.tags.split(",").map(tag => tag.trim())
    }

    setMaterials(prev => [newMat, ...prev])
    setNewMaterial({
      title: "",
      description: "",
      category: "",
      grade: "",
      type: "pdf",
      isPublic: false,
      tags: ""
    })
    setIsUploadDialogOpen(false)
    
    toast({
      title: "Materyal Yüklendi",
      description: "Materyaliniz başarıyla yüklendi.",
    })
  }

  const handleDelete = (id: string) => {
    setMaterials(prev => prev.filter(mat => mat.id !== id))
    toast({
      title: "Materyal Silindi",
      description: "Materyal başarıyla silindi.",
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
            <h1 className="text-3xl font-bold text-gray-900">Materyal Yönetimi</h1>
            <p className="text-gray-600">Ders materyallerinizi yükleyin ve yönetin</p>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Materyal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Yeni Materyal Yükle</DialogTitle>
                <DialogDescription>
                  Ders materyalinizi yükleyin ve detaylarını girin
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Başlık</Label>
                    <Input
                      id="title"
                      value={newMaterial.title}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Materyal başlığı"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Dosya Tipi</Label>
                    <Select value={newMaterial.type} onValueChange={(value: Material["type"]) => setNewMaterial(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Dokument</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Resim</SelectItem>
                        <SelectItem value="audio">Ses Dosyası</SelectItem>
                        <SelectItem value="document">Döküman</SelectItem>
                        <SelectItem value="presentation">Sunum</SelectItem>
                        <SelectItem value="spreadsheet">Hesap Tablosu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Materyal hakkında kısa açıklama"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={newMaterial.category} onValueChange={(value) => setNewMaterial(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Konu Anlatımı">Konu Anlatımı</SelectItem>
                        <SelectItem value="Çalışma Kağıdı">Çalışma Kağıdı</SelectItem>
                        <SelectItem value="Video Ders">Video Ders</SelectItem>
                        <SelectItem value="Sunum">Sunum</SelectItem>
                        <SelectItem value="Ses Dosyası">Ses Dosyası</SelectItem>
                        <SelectItem value="Sınav">Sınav</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Sınıf</Label>
                    <Select value={newMaterial.grade} onValueChange={(value) => setNewMaterial(prev => ({ ...prev, grade: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9">9. Sınıf</SelectItem>
                        <SelectItem value="10">10. Sınıf</SelectItem>
                        <SelectItem value="11">11. Sınıf</SelectItem>
                        <SelectItem value="12">12. Sınıf</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Görünürlük</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={newMaterial.isPublic}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="isPublic" className="text-sm">Herkese açık</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Etiketler</Label>
                  <Input
                    id="tags"
                    value={newMaterial.tags}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Etiketleri virgül ile ayırın (örn: grammar, test, beginner)"
                  />
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Dosyayı buraya sürükleyin veya tıklayın</p>
                  <Button variant="outline" size="sm">
                    Dosya Seç
                  </Button>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleUpload} className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />
                    Yükle
                  </Button>
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    İptal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Materyal ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Tipler</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="document">Döküman</SelectItem>
              <SelectItem value="image">Resim</SelectItem>
              <SelectItem value="audio">Ses</SelectItem>
              <SelectItem value="presentation">Sunum</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              <SelectItem value="Konu Anlatımı">Konu Anlatımı</SelectItem>
              <SelectItem value="Çalışma Kağıdı">Çalışma Kağıdı</SelectItem>
              <SelectItem value="Video Ders">Video Ders</SelectItem>
              <SelectItem value="Sunum">Sunum</SelectItem>
              <SelectItem value="Ses Dosyası">Ses Dosyası</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{materials.length}</div>
              <div className="text-sm text-gray-600">Toplam Materyal</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {materials.reduce((acc, mat) => acc + mat.downloads, 0)}
              </div>
              <div className="text-sm text-gray-600">Toplam İndirme</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {materials.filter(mat => mat.isPublic).length}
              </div>
              <div className="text-sm text-gray-600">Herkese Açık</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(materials.map(mat => mat.category)).size}
              </div>
              <div className="text-sm text-gray-600">Farklı Kategori</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getFileIcon(material.type)}
                  <Badge className={getTypeColor(material.type)}>
                    {material.type.toUpperCase()}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-blue-50 hover:text-blue-700 transform hover:scale-110 transition-all duration-200 active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        alert(`${material.title} materyali önizle açılıyor...`)
                        // TODO: Materyal önizleme modal
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Önizle
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        alert(`${material.title} materyali indiriliyor...`)
                        // TODO: Dosya indirme
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      İndir
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        alert(`${material.title} materyali düzenleme açılıyor...`)
                        // TODO: Materyal düzenleme modal
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(material.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-lg leading-6">{material.title}</CardTitle>
              <CardDescription className="text-sm">{material.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Kategori:</span>
                <Badge variant="secondary">{material.category}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sınıf:</span>
                <span className="font-medium">{material.grade}. Sınıf</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Boyut:</span>
                <span className="font-medium">{material.fileSize}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">İndirme:</span>
                <span className="font-medium">{material.downloads}</span>
              </div>
              
              {material.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {material.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {material.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{material.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transform hover:scale-105 transition-all duration-200 active:scale-95"
                  onClick={() => {
                    alert(`${material.title} indiriliyor...`)
                    // TODO: Dosya indirme
                  }}
                >
                  <Download className="w-3 h-3 mr-1" />
                  İndir
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transform hover:scale-105 transition-all duration-200 active:scale-95"
                  onClick={() => {
                    alert(`${material.title} önizleme açılıyor...`)
                    // TODO: Materyal önizleme
                  }}
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </div>

              <div className="text-xs text-gray-500 border-t pt-2">
                Yükleme: {new Date(material.uploadDate).toLocaleDateString('tr-TR')}
                {material.isPublic && (
                  <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Herkese Açık</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Materyal bulunamadı</h3>
          <p className="text-gray-600 mb-4">Arama kriterlerinize uygun materyal bulunmuyor.</p>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            İlk Materyali Yükle
          </Button>
        </div>
      )}
    </div>
  )
}