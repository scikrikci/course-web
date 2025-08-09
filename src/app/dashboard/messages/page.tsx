"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Send, 
  Search, 
  Plus, 
  Bell, 
  Users, 
  MessageSquare, 
  Paperclip, 
  Smile,
  MoreVertical,
  Phone,
  Video,
  Clock
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      participants: [1, 3],
      lastMessage: "Tamam, yarın görüşürüz!",
      lastMessageTime: "10:30",
      unreadCount: 0,
      isGroup: false
    },
    {
      id: 2,
      participants: [1, 4],
      lastMessage: "Ödevler için teşekkürler",
      lastMessageTime: "Dün",
      unreadCount: 2,
      isGroup: false
    },
    {
      id: 3,
      participants: [1, 2, 3, 4],
      lastMessage: "Ayşe: Sınav tarihi değişti mi?",
      lastMessageTime: "2 gün önce",
      unreadCount: 5,
      isGroup: true,
      groupName: "9-A Sınıfı"
    },
    {
      id: 4,
      participants: [1, 5],
      lastMessage: "Sistem bakımı yarın yapılacak",
      lastMessageTime: "3 gün önce",
      unreadCount: 0,
      isGroup: false
    }
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: 3,
      receiverId: 1,
      content: "Merhaba, dersle ilgili bir sorum olacak",
      timestamp: "10:15",
      isRead: true,
      type: 'text'
    },
    {
      id: 2,
      senderId: 1,
      receiverId: 3,
      content: "Tabii, buyurun sorunuzu sorabilirsiniz",
      timestamp: "10:18",
      isRead: true,
      type: 'text'
    },
    {
      id: 3,
      senderId: 3,
      receiverId: 1,
      content: "Unit 6'daki present perfect tense konusunu bir daha anlatabilir misiniz?",
      timestamp: "10:20",
      isRead: true,
      type: 'text'
    },
    {
      id: 4,
      senderId: 1,
      receiverId: 3,
      content: "Elbette, yarın derste detaylı olarak anlatacağım. Şimdilik şöyle açıklayayım...",
      timestamp: "10:25",
      isRead: true,
      type: 'text'
    },
    {
      id: 5,
      senderId: 3,
      receiverId: 1,
      content: "Tamam, yarın görüşürüz!",
      timestamp: "10:30",
      isRead: true,
      type: 'text'
    }
  ])

  const [users] = useState<User[]>([
    {
      id: 1,
      name: "Ahmet Yılmaz",
      email: "ahmet@example.com",
      role: "student",
      isOnline: true
    },
    {
      id: 2,
      name: "Ayşe Demir",
      email: "ayse@example.com",
      role: "student",
      isOnline: false
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      email: "mehmet@example.com",
      role: "teacher",
      isOnline: true
    },
    {
      id: 4,
      name: "Fatma Çelik",
      email: "fatma@example.com",
      role: "teacher",
      isOnline: false
    },
    {
      id: 5,
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      isOnline: true
    }
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

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : "Bilinmeyen Kullanıcı"
  }

  const getUserRole = (userId: number) => {
    const user = users.find(u => u.id === userId)
    return user ? user.role : ""
  }

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

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return conversation.groupName || "Grup Konuşması"
    }
    
    const otherParticipantId = conversation.participants.find(p => p !== 1)
    return getUserName(otherParticipantId || 0)
  }

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return <Users className="w-6 h-6" />
    }
    
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
      receiverId: 3, // This should be dynamic based on conversation
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      type: 'text'
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Update conversation last message
    setConversations(convs => convs.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, lastMessage: newMessage, lastMessageTime: "Şimdi" }
        : conv
    ))
  }

  const currentMessages = messages.filter(msg => 
    (msg.senderId === 1 || msg.receiverId === 1) && selectedConversation === 1
  )

  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
          <p className="text-gray-600">Öğretmenler ve öğrencilerle iletişim kurun</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Konuşma
        </Button>
      </div>

      {/* Öğrenci rolü için Öğretmenle İletişim kartı */}
      {currentUser?.role === 'student' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Konuşma ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="space-y-1 p-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-blue-50' : ''
                    }`}
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
                            <p className="font-medium text-sm truncate">
                              {getConversationName(conversation)}
                            </p>
                            {conversation.isGroup && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Grup
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs mt-1">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="pb-3">
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
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <Separator />

          {/* Messages */}
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[calc(100vh-450px)] p-4">
              <div className="space-y-4">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 1 ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.senderId === 1 ? 'order-2' : 'order-1'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {message.senderId !== 1 && (
                          <>
                            <span className="text-xs font-medium">
                              {getUserName(message.senderId)}
                            </span>
                            <Badge className={`text-xs ${getRoleColor(getUserRole(message.senderId))}`}>
                              {getUserRole(message.senderId)}
                            </Badge>
                          </>
                        )}
                        <span className="text-xs text-gray-500">
                          {message.timestamp}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          message.senderId === 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>

          <Separator />

          {/* Message Input */}
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Mesajınızı yazın..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TeacherChatDialog() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'teacher', message: 'Merhaba! Size nasıl yardımcı olabilirim?', time: '10:00' },
    { id: 2, sender: 'student', message: 'Merhaba, Unit 6 modal verbs konusunda sorum var.', time: '10:05' },
    { id: 3, sender: 'teacher', message: 'Tabii, hangi modal verb konusunda zorluk yaşıyorsunuz?', time: '10:07' }
  ])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        sender: 'student',
        message: newMessage,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }])
      setNewMessage('')

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'teacher',
          message: 'Mesajınızı aldım. Birazdan detaylı cevap vereceğim.',
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }])
      }, 2000)
    }
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
          <DialogDescription>
            Öğretmeninizle birebir mesajlaşabilirsiniz
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border rounded-lg p-3 h-64 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg ${
                  msg.sender === 'student' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-green-100 text-green-800'
                }`}>
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}