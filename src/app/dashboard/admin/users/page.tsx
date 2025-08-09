"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  UserCheck, 
  UserX, 
  MoreHorizontal,
  Download,
  Upload
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import PageHeader from "@/components/layout/PageHeader"
import PageContainer from "@/components/layout/PageContainer"

interface User {
  id: number
  username: string
  role: string
  level?: string
  name: string
  email: string
  avatar: string
  status: 'active' | 'inactive' | 'suspended'
  lastLogin?: string
  joinedAt: string
}

interface AdminUser {
  id: number
  username: string
  role: string
  level?: string
  name: string
  email: string
  avatar: string
}

// Mock data - gerçek uygulamada API'den gelecek
const mockUsers: User[] = [
  {
    id: 1,
    username: "ahmet.yilmaz",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    role: "student",
    level: "A1",
    avatar: "",
    status: "active",
    lastLogin: "2024-12-15T10:30:00",
    joinedAt: "2024-09-01T00:00:00"
  },
  {
    id: 2,
    username: "fatma.kaya",
    name: "Fatma Kaya",
    email: "fatma@example.com",
    role: "teacher",
    avatar: "",
    status: "active",
    lastLogin: "2024-12-15T09:15:00",
    joinedAt: "2024-08-15T00:00:00"
  },
  {
    id: 3,
    username: "mehmet.demir",
    name: "Mehmet Demir",
    email: "mehmet@example.com",
    role: "student",
    level: "B2",
    avatar: "",
    status: "inactive",
    lastLogin: "2024-12-10T16:45:00",
    joinedAt: "2024-10-01T00:00:00"
  },
  {
    id: 4,
    username: "ayse.ozkan",
    name: "Ayşe Özkan",
    email: "ayse@example.com",
    role: "admin",
    avatar: "",
    status: "active",
    lastLogin: "2024-12-15T11:20:00",
    joinedAt: "2024-07-01T00:00:00"
  }
]

export default function UsersPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
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
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800">Yönetici</Badge>
      case 'teacher':
        return <Badge className="bg-green-100 text-green-800">Öğretmen</Badge>
      case 'student':
        return <Badge className="bg-blue-100 text-blue-800">Öğrenci</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case 'inactive':
        return <Badge className="bg-yellow-100 text-yellow-800">Pasif</Badge>
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Askıda</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId))
    toast({
      title: "Kullanıcı silindi",
      description: "Kullanıcı başarıyla sistemden kaldırıldı.",
    })
  }

  const handleStatusChange = (userId: number, newStatus: 'active' | 'inactive' | 'suspended') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
    toast({
      title: "Durum güncellendi",
      description: `Kullanıcı durumu ${newStatus === 'active' ? 'aktif' : newStatus === 'inactive' ? 'pasif' : 'askıya alındı'} olarak değiştirildi.`,
    })
  }

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <PageContainer>
      <PageHeader
        title="Kullanıcı Yönetimi"
        description="Sistemdeki tüm kullanıcıları görüntüleyip yönetin."
        breadcrumb={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Kullanıcılar" },
        ]}
      />

      {/* İstatistik Kartları */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% geçen aya göre
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Kullanıcı</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Öğrenci</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'student').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Toplam öğrenci sayısı
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Öğretmen</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'teacher').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Toplam öğretmen sayısı
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
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Rol filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Roller</SelectItem>
                  <SelectItem value="student">Öğrenci</SelectItem>
                  <SelectItem value="teacher">Öğretmen</SelectItem>
                  <SelectItem value="admin">Yönetici</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Durum filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                  <SelectItem value="suspended">Askıda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Dışa Aktar
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                İçe Aktar
              </Button>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Yeni Kullanıcı
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
                    <DialogDescription>
                      Sisteme yeni bir kullanıcı ekleyin.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Ad Soyad
                      </Label>
                      <Input id="name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        E-mail
                      </Label>
                      <Input id="email" type="email" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Rol
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Rol seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Öğrenci</SelectItem>
                          <SelectItem value="teacher">Öğretmen</SelectItem>
                          <SelectItem value="admin">Yönetici</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsCreateModalOpen(false)}>
                      Kaydet
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Kullanıcı Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcılar ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Son Giriş</TableHead>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                    {user.level && (
                      <Badge variant="outline" className="ml-2">
                        {user.level}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Hiç giriş yapmamış'}
                  </TableCell>
                  <TableCell>{formatDate(user.joinedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsViewModalOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsEditModalOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.status === 'active' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(user.id, 'active')}
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Kullanıcı Detay Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kullanıcı Detayları</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Rol</Label>
                  <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                </div>
                <div>
                  <Label>Durum</Label>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
                {selectedUser.level && (
                  <div>
                    <Label>Seviye</Label>
                    <div className="mt-1">
                      <Badge variant="outline">{selectedUser.level}</Badge>
                    </div>
                  </div>
                )}
                <div>
                  <Label>Kayıt Tarihi</Label>
                  <p className="mt-1 text-sm">{formatDate(selectedUser.joinedAt)}</p>
                </div>
                <div>
                  <Label>Son Giriş</Label>
                  <p className="mt-1 text-sm">
                    {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Hiç giriş yapmamış'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}