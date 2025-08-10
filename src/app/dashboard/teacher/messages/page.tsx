"use client"

import MessagesView from "@/components/messages/MessagesView"
import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/layout/PageHeader"

export default function TeacherMessagesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Mesajlar"
        description="Öğretmenler ve öğrencilerle iletişim kurun"
        breadcrumb={[
          { label: "Öğretmen", href: "/dashboard/teacher" },
          { label: "Mesajlar" },
        ]}
      />
      <MessagesView showHeader={false} />
    </PageContainer>
  )
}


