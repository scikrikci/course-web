import { NextRequest, NextResponse } from 'next/server';

// Mesajları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');
    const messageType = searchParams.get('type');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Mock messages data
    const messages = [
      {
        id: 'msg_1',
        senderId: 'teacher1',
        receiverId: userId,
        courseId: '1',
        subject: 'B1 Kurs Güncellemesi',
        content: 'Merhaba! B1 İngilizce kursunuz çok iyi gidiyor. Devam etmenizi tavsiye ederim.',
        messageType: 'COURSE_ANNOUNCEMENT',
        isRead: false,
        sentAt: '2024-03-10T14:30:00Z',
        sender: {
          name: 'Mehmet Kaya',
          role: 'teacher'
        }
      },
      {
        id: 'msg_2',
        senderId: 'admin1',
        receiverId: userId,
        courseId: null,
        subject: 'Kurs Dondurma İsteği Onaylandı',
        content: 'Matematik kursunuz için yaptığınız dondurma isteği onaylanmıştır. İyi günler.',
        messageType: 'FREEZE_REQUEST',
        isRead: true,
        sentAt: '2024-02-20T10:15:00Z',
        sender: {
          name: 'Admin',
          role: 'admin'
        }
      },
      {
        id: 'msg_3',
        senderId: 'system',
        receiverId: userId,
        courseId: '1',
        subject: 'B2 Kuruna Devam Hatırlatması',
        content: 'B1 kursunuz 2 hafta sonra tamamlanacak. B2 kuruna devam etmek istediğinizi belirtmiştiniz. Hazırlıklarınızı tamamlayabilirsiniz.',
        messageType: 'CONTINUATION_NOTICE',
        isRead: false,
        sentAt: '2024-03-01T09:00:00Z',
        sender: {
          name: 'Sistem',
          role: 'system'
        }
      }
    ];

    // Filter messages based on courseId and messageType if provided
    let filteredMessages = messages;
    
    if (courseId) {
      filteredMessages = filteredMessages.filter(msg => msg.courseId === courseId);
    }
    
    if (messageType) {
      filteredMessages = filteredMessages.filter(msg => msg.messageType === messageType);
    }

    return NextResponse.json({ messages: filteredMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Yeni mesaj gönder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, courseId, subject, content, messageType } = body;

    if (!senderId || !subject || !content) {
      return NextResponse.json({ error: 'Sender ID, subject and content are required' }, { status: 400 });
    }

    // Mock message creation
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      receiverId: receiverId || null,
      courseId: courseId || null,
      subject,
      content,
      messageType: messageType || 'PERSONAL',
      isRead: false,
      sentAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Mesaj başarıyla gönderildi.',
      messageData: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Mesajı okundu olarak işaretle
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, userId } = body;

    if (!messageId || !userId) {
      return NextResponse.json({ error: 'Message ID and User ID are required' }, { status: 400 });
    }

    // Mock update
    return NextResponse.json({
      success: true,
      message: 'Mesaj okundu olarak işaretlendi.',
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}