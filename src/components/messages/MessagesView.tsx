"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Send,
  Search,
  Plus,
  Users,
  MessageSquare,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  senderId: number
  receiverId: number
  content: string
  timestamp: string
  isRead: boolean
  type: 'text' | 'file' | 'system'
}

interface Conversation {
  id: number
  participants: number[]
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isGroup: boolean
  groupName?: string
}

interface User {
  id: number
  name: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  avatar?: string
  isOnline: boolean
}

export default function MessagesView({ showHeader = true }: { showHeader?: boolean }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, participants: [1, 3], lastMessage: "Tamam, yarın görüşürüz!", lastMessageTime: "10:30", unreadCount: 0, isGroup: false },
    { id: 2, participants: [1, 4], lastMessage: "Ödevler için teşekkürler", lastMessageTime: "Dün", unreadCount: 2, isGroup: false },
    { id: 3, participants: [1, 2, 3, 4], lastMessage: "Ayşe: Sınav tarihi değişti mi?", lastMessageTime: "2 gün önce", unreadCount: 5, isGroup: true, groupName: "9-A Sınıfı" },
    { id: 4, participants: [1, 5], lastMessage: "Sistem bakımı yarın yapılacak", lastMessageTime: "3 gün önce", unreadCount: 0, isGroup: false },
  ])

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, senderId: 3, receiverId: 1, content: "Merhaba, dersle ilgili bir sorum olacak", timestamp: "10:15", isRead: true, type: 'text' },
    { id: 2, senderId: 1, receiverId: 3, content: "Tabii, buyurun sorunuzu sorabilirsiniz", timestamp: "10:18", isRead: true, type: 'text' },
    { id: 3, senderId: 3, receiverId: 1, content: "Unit 6'daki present perfect tense konusunu bir daha anlatabilir misiniz?", timestamp: "10:20", isRead: true, type: 'text' },
    { id: 4, senderId: 1, receiverId: 3, content: "Elbette, yarın derste detaylı olarak anlatacağım. Şimdilik şöyle açıklayayım...", timestamp: "10:25", isRead: true, type: 'text' },
    { id: 5, senderId: 3, receiverId: 1, content: "Tamam, yarın görüşürüz!", timestamp: "10:30", isRead: true, type: 'text' },
  ])

  const [users] = useState<User[]>([
    { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com", role: "student", isOnline: true },
    { id: 2, name: "Ayşe Demir", email: "ayse@example.com", role: "student", isOnline: false },
    { id: 3, name: "Mehmet Kaya", email: "mehmet@example.com", role: "teacher", isOnline: true },
    { id: 4, name: "Fatma Çelik", email: "fatma@example.com", role: "teacher", isOnline: false },
    { id: 5, name: "Admin User", email: "admin@example.com", role: "admin", isOnline: true },
  ])

  const [selectedConversation, setSelectedConversation] = useState<number>(1)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    try {
      const data = localStorage.getItem('currentUser')
      if (data) setCurrentUser(JSON.parse(data))
    } catch {}
  }, [])

  const getUserName = (userId: number) => users.find(u => u.id === userId)?.name || "Bilinmeyen Kullanıcı"
  const getUserRole = (userId: number) => users.find(u => u.id === userId)?.role || ""

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800'
      case 'teacher': return 'bg-green-100 text-green-800'
      case 'admin': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup) return conversation.groupName || "Grup Konuşması"
    const otherParticipantId = conversation.participants.find(p => p !== 1)
    return getUserName(otherParticipantId || 0)
  }

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.isGroup) return <Users className="w-6 h-6" />
    const otherParticipantId = conversation.participants.find(p => p !== 1)
    const user = users.find(u => u.id === otherParticipantId)
    return user ? user.name.charAt(0) : "?"
  }

  const filteredConversations = conversations.filter(conv => 
    getConversationName(conv).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    const message: Message = {
      id: messages.length + 1,
      senderId: 1,
      receiverId: 3,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      type: 'text'
    }
    setMessages([...messages, message])
    setNewMessage("")
    setConversations(convs => convs.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, lastMessage: newMessage, lastMessageTime: "Şimdi" }
        : conv
    ))
  }

  const currentMessages = messages.filter(msg => (msg.senderId === 1 || msg.receiverId === 1) && selectedConversation === 1)

  const role = currentUser?.role ?? 'student'
  const brand = {
    selectedBg: role === 'teacher' ? 'bg-green-50' : role === 'admin' ? 'bg-purple-50' : 'bg-blue-50',
    selectedBorder: role === 'teacher' ? 'border-l-green-500' : role === 'admin' ? 'border-l-purple-500' : 'border-l-blue-500',
    badge: role === 'teacher' ? 'bg-green-100 text-green-800' : role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800',
    bubbleSelf: role === 'teacher' ? 'bg-green-500' : role === 'admin' ? 'bg-purple-500' : 'bg-blue-500',
    button: role === 'teacher' ? 'bg-green-600 hover:bg-green-700' : role === 'admin' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col">
      {showHeader && (
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
            <p className="text-gray-600">Öğretmenler ve öğrencilerle iletişim kurun</p>
          </div>
          <Button className={brand.button}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Konuşma
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
        <Card className="md:col-span-1 border shadow-sm rounded-xl">
          <CardHeader className="pb-3 border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-t-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Konuşma ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 rounded-b-xl">
            <ScrollArea className="h-[calc(100vh-340px)] pr-2">
              <div className="space-y-1 p-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      'p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border-l-4',
                      selectedConversation === conversation.id 
                        ? `${brand.selectedBg} ${brand.selectedBorder}`
                        : 'border-l-transparent'
                    )}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {getConversationAvatar(conversation)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm truncate">{getConversationName(conversation)}</p>
                            {conversation.isGroup && (
                              <Badge variant="outline" className="text-xs mt-1">Grup</Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs mt-1">{conversation.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3 flex flex-col border shadow-sm rounded-xl">
          <CardHeader className="pb-3 border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {getConversationAvatar(conversations.find(c => c.id === selectedConversation)!)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">
                    {getConversationName(conversations.find(c => c.id === selectedConversation)!)}
                  </CardTitle>
                  <CardDescription>
                    {selectedConversation === 3 ? "4 katılımcı" : "Çevrimiçi"}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Button variant="ghost" size="sm" className="hover:text-gray-700"><Phone className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" className="hover:text-gray-700"><Video className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" className="hover:text-gray-700"><MoreVertical className="w-4 h-4" /></Button>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="flex-1 p-0 rounded-b-xl">
            <ScrollArea className="h-[calc(100vh-430px)] p-4 pr-6">
              <div className="space-y-4">
                {currentMessages.map((message) => (
                  <div key={message.id} className={cn('flex', message.senderId === 1 ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[70%]', message.senderId === 1 ? 'order-2' : 'order-1')}>
                      <div className="flex items-center gap-2 mb-1">
                        {message.senderId !== 1 && (
                          <>
                            <span className="text-xs font-medium">{getUserName(message.senderId)}</span>
                            <Badge className={cn('text-xs', getRoleColor(getUserRole(message.senderId)))}>{getUserRole(message.senderId)}</Badge>
                          </>
                        )}
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <div className={cn('p-3 rounded-2xl', message.senderId === 1 ? `${brand.bubbleSelf} text-white` : 'bg-gray-100 text-gray-900')}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>

          <Separator />

          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm"><Paperclip className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><Smile className="w-4 h-4" /></Button>
                  <Input
                    placeholder="Mesajınızı yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 rounded-full"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className={brand.button}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {currentUser?.role === 'student' && (
        <Card className="mt-6 border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className={cn('w-5 h-5', role === 'teacher' ? 'text-green-600' : role === 'admin' ? 'text-purple-600' : 'text-blue-600')} />
              Öğretmeninizle İletişim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-700">MK</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Mehmet Kaya</p>
                  <p className="text-sm text-gray-600">İngilizce Öğretmeni</p>
                </div>
              </div>
              <TeacherChatDialog />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TeacherChatDialog() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ id: number; sender: 'teacher' | 'student'; message: string; time: string }[]>([
    { id: 1, sender: 'teacher', message: 'Merhaba! Size nasıl yardımcı olabilirim?', time: '10:00' },
    { id: 2, sender: 'student', message: 'Merhaba, Unit 6 modal verbs konusunda sorum var.', time: '10:05' },
    { id: 3, sender: 'teacher', message: 'Tabii, hangi modal verb konusunda zorluk yaşıyorsunuz?', time: '10:07' }
  ])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (!newMessage.trim()) return
    setMessages(prev => ([...prev, {
      id: Date.now(),
      sender: 'student',
      message: newMessage,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }]))
    setNewMessage('')
    setTimeout(() => {
      setMessages(prev => ([...prev, {
        id: Date.now() + 1,
        sender: 'teacher',
        message: 'Mesajınızı aldım. Birazdan detaylı cevap vereceğim.',
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }]))
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Özel Mesaj
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Mehmet Kaya ile Özel Sohbet
          </DialogTitle>
          <DialogDescription>Öğretmeninizle birebir mesajlaşabilirsiniz</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded-lg p-3 h-64 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg ${msg.sender === 'student' ? 'bg-blue-500 text-white' : 'bg-green-100 text-green-800'}`}>
                  <div className="text-xs mb-1 opacity-75">
                    {msg.sender === 'student' ? 'Sen' : 'Öğretmen'} • {msg.time}
                  </div>
                  <div className="text-sm">{msg.message}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Mesajınızı yazın..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Kapat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


