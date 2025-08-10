"use client"

import MessagesView from "@/components/messages/MessagesView"
import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/layout/PageHeader"

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
  return (
    <PageContainer>
      <PageHeader
        title="Mesajlar"
        description="Öğretmenler ve öğrencilerle iletişim kurun"
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mesajlar" },
        ]}
      />
      <MessagesView showHeader={false} />
    </PageContainer>
  )
}