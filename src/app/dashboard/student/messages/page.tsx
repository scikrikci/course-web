"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, MessageSquare, Send } from "lucide-react"

interface User {
  id: number
  username: string
  role: string
  name: string
  email: string
}

export default function StudentMessages() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      const parsedUser: User = JSON.parse(userData)
      if (parsedUser.role !== 'student') {
        router.push('/login')
        return
      }
      setUser(parsedUser)
    } else {
      router.push('/login')
    }
  }, [router])

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/dashboard/student')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfa'ya Dön
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mesajlar</h1>
            <p className="text-gray-600">Öğretmenlerinden gelen mesajları oku</p>
          </div>
        </div>
      </div>

      {/* Öğretmenle İletişim */}
      <Card>
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
    </div>
  )
}

// Öğretmen ile sohbet diyalogu
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