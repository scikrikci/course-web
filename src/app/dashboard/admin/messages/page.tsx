"use client"

import MessagesView from "@/components/messages/MessagesView"
import PageContainer from "@/components/layout/PageContainer"
import PageHeader from "@/components/layout/PageHeader"

export default function AdminMessagesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Mesajlar"
        description="Kullanıcılar arası iletişimi yönetin"
        breadcrumb={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Mesajlar" },
        ]}
      />
      <MessagesView showHeader={false} />
    </PageContainer>
  )
}


