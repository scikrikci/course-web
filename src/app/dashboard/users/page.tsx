"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserPlus, Edit, Trash2, Search, Filter, Mail, Phone, Calendar, BookOpen } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  level?: string
  class?: string
  joinDate: string
  lastLogin: string
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      role: "student",
      level: "B1",
      class: "9-A",
      joinDate: "2024-09-01",
      lastLogin: "2024-12-10",
      status: "active"
    },
    {
      id: 2,
      name: "Ayşe Demir",
      email: "ayse@example.com",
      role: "student",
      level: "A2",
      class: "9-B",
      joinDate: "2024-09-01",
      lastLogin: "2024-12-09",
      status: "active"
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      email: "mehmet@example.com",
      role: "teacher",
      class: "9-A, 9-B",
      joinDate: "2024-08-15",
      lastLogin: "2024-12-10",
      status: "active"
    },
    {
      id: 4,
      name: "Fatma Çelik",
      email: "fatma@example.com",
      role: "teacher",
      class: "10-A, 10-B",
      joinDate: "2024-08-15",
      lastLogin: "2024-12-08",
      status: "active"
    },
    {
      id: 5,
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      joinDate: "2024-08-01",
      lastLogin: "2024-12-10",
      status: "active"
    },
    {
      id: 6,
      name: "Zeynep Aksoy",
      email: "zeynep@example.com",
      role: "student",
      level: "B2",
      class: "10-A",
      joinDate: "2024-09-01",
      lastLogin: "2024-12-05",
      status: "inactive"
    }
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student" as const,
    level: "",
    class: "",
    status: "active" as const
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800'
      case 'teacher':
        return 'bg-green-100 text-green-800'
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student':
        return 'Öğrenci'
      case 'teacher':
        return 'Öğretmen'
      case 'admin':
        return 'Yönetici'
      default:
        return role
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif'
      case 'inactive':
        return 'Pasif'
      case 'suspended':
        return 'Askıya Alındı'
      default:
        return status
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = () => {
    const user: User = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      level: newUser.role === "student" ? newUser.level : undefined,
      class: newUser.class || undefined,
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0],
      status: newUser.status
    }

    setUsers([user, ...users])
    setNewUser({
      name: "",
      email: "",
      role: "student",
      level: "",
      class: "",
      status: "active"
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      level: user.level || "",
      class: user.class || "",
      status: user.status
    })
  }

  const handleUpdateUser = () => {
    if (!editingUser) return

    setUsers(users.map(u => 
      u.id === editingUser.id 
        ? { 
            ...u, 
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            level: newUser.role === "student" ? newUser.level : undefined,
            class: newUser.class || undefined,
            status: newUser.status
          }
        : u
    ))

    setEditingUser(null)
    setNewUser({
      name: "",
      email: "",
      role: "student",
      level: "",
      class: "",
      status: "active"
    })
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id))
  }

  const students = users.filter(u => u.role === 'student')
  const teachers = users.filter(u => u.role === 'teacher')
  const admins = users.filter(u => u.role === 'admin')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600">Kullanıcıları yönetin ve izleyin</p>
        </div>
        <Dialog open={isCreateDialogOpen || !!editingUser} onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false)
            setEditingUser(null)
            setNewUser({
              name: "",
              email: "",
              role: "student",
              level: "",
              class: "",
              status: "active"
            })
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Yeni Kullanıcı
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Oluştur"}
              </DialogTitle>
              <DialogDescription>
                Kullanıcı bilgilerini girin
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Ad soyad..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="E-posta adresi..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select value={newUser.role} onValueChange={(value: any) => setNewUser({...newUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Öğrenci</SelectItem>
                      <SelectItem value="teacher">Öğretmen</SelectItem>
                      <SelectItem value="admin">Yönetici</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Durum</Label>
                  <Select value={newUser.status} onValueChange={(value: any) => setNewUser({...newUser, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Pasif</SelectItem>
                      <SelectItem value="suspended">Askıya Alındı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newUser.role === "student" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">Seviye</Label>
                    <Select value={newUser.level} onValueChange={(value) => setNewUser({...newUser, level: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seviye seçin..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1</SelectItem>
                        <SelectItem value="A2">A2</SelectItem>
                        <SelectItem value="B1">B1</SelectItem>
                        <SelectItem value="B2">B2</SelectItem>
                        <SelectItem value="C1">C1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="class">Sınıf</Label>
                    <Select value={newUser.class} onValueChange={(value) => setNewUser({...newUser, class: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sınıf seçin..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9-A">9-A</SelectItem>
                        <SelectItem value="9-B">9-B</SelectItem>
                        <SelectItem value="10-A">10-A</SelectItem>
                        <SelectItem value="10-B">10-B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {newUser.role === "teacher" && (
                <div>
                  <Label htmlFor="teacherClass">Sınıflar</Label>
                  <Input
                    id="teacherClass"
                    value={newUser.class}
                    onChange={(e) => setNewUser({...newUser, class: e.target.value})}
                    placeholder="Örn: 9-A, 9-B"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={editingUser ? handleUpdateUser : handleCreateUser}
                  disabled={!newUser.name || !newUser.email}
                >
                  {editingUser ? "Güncelle" : "Oluştur"}
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false)
                  setEditingUser(null)
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
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                <p className="text-sm text-gray-600">Toplam Kullanıcı</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{students.length}</p>
                <p className="text-sm text-gray-600">Öğrenci</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{teachers.length}</p>
                <p className="text-sm text-gray-600">Öğretmen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{admins.length}</p>
                <p className="text-sm text-gray-600">Yönetici</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Pasif</SelectItem>
                <SelectItem value="suspended">Askıya Alındı</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcılar</CardTitle>
          <CardDescription>
            {filteredUsers.length} kullanıcı bulundu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Detaylar</TableHead>
                <TableHead>Kayıt Tarihi</TableHead>
                <TableHead>Son Giriş</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İşlemler</TableHead>
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
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.level && <p>Seviye: {user.level}</p>}
                      {user.class && <p>Sınıf: {user.class}</p>}
                    </div>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {getStatusLabel(user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}