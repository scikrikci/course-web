import { NextRequest, NextResponse } from 'next/server';

// Öğrencinin kayıtlı olduğu kursları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Mock data - gerçek uygulamada database'den gelecek
    const enrollments = [
      {
        id: '1',
        userId: userId,
        courseId: '1',
        status: 'ACTIVE',
        enrolledAt: '2024-01-15T09:00:00Z',
        completedAt: null,
        freezeCount: 0,
        course: {
          id: '1',
          title: 'İngilizce B1 Seviyesi',
          level: 'B1',
          description: 'Orta seviye İngilizce kursu. Grammar, vocabulary ve speaking becerilerini geliştirin.',
          duration: 12, // hafta
          startDate: '2024-01-15T09:00:00Z',
          endDate: '2024-04-15T18:00:00Z',
          teacherId: 'teacher1',
          isActive: true
        },
        freezes: [] // Aktif dondurma işlemi yok
      },
              {
          id: '2',
          userId: userId,
          courseId: '2',
          status: 'ACTIVE',
          enrolledAt: '2024-02-01T09:00:00Z',
          completedAt: null,
          freezeCount: 1,
          course: {
            id: '2',
            title: 'Almanca A2 Seviyesi',
            level: 'A2',
            description: 'Başlangıç seviyesi Almanca kursu. Temel gramer yapıları ve günlük konuşma becerilerini geliştirin.',
            duration: 10, // hafta
            startDate: '2024-02-01T09:00:00Z',
            endDate: '2024-04-10T18:00:00Z',
            teacherId: 'teacher2',
            isActive: true
          },
          freezes: [
            {
              id: 'freeze1',
              reason: 'Kişisel sebeplerden dolayı',
              frozenAt: '2024-02-15T10:00:00Z',
              unfrozenAt: '2024-02-22T10:00:00Z',
              isActive: false
            }
          ]
        }
    ];

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}