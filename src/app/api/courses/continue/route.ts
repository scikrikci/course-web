import { NextRequest, NextResponse } from 'next/server';

// Kurs tamamlandığında bir sonraki kura devam etme isteği
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId, nextCourseId, willContinue } = body;

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'User ID and Course ID are required' }, { status: 400 });
    }

    // Mock işlem - gerçek uygulamada database güncellemesi yapılacak
    const progression = {
      id: `prog_${Date.now()}`,
      userId,
      courseId,
      nextCourseId: nextCourseId || null,
      willContinue: willContinue || false,
      notifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Mock available next courses
    const availableNextCourses = [
      {
        id: 'next_course_1',
        title: 'İngilizce B2 Seviyesi',
        level: 'B2',
        startDate: '2024-05-01T09:00:00Z',
        duration: 14
      },
      {
        id: 'next_course_2',
        title: 'İngilizce C1 Seviyesi',
        level: 'C1',
        startDate: '2024-06-01T09:00:00Z',
        duration: 16
      },
      {
        id: 'next_course_3',
        title: 'Fransızca A1 Seviyesi',
        level: 'A1',
        startDate: '2024-05-15T09:00:00Z',
        duration: 12
      },
      {
        id: 'next_course_4',
        title: 'Almanca B1 Seviyesi',
        level: 'B1',
        startDate: '2024-06-01T09:00:00Z',
        duration: 14
      }
    ];

    return NextResponse.json({
      success: true,
      message: willContinue 
        ? 'Bir sonraki kura devam etme isteğiniz kaydedildi.' 
        : 'Kurs tamamlama bildirimi alındı.',
      progression,
      availableNextCourses: willContinue ? availableNextCourses : []
    });
  } catch (error) {
    console.error('Error processing course continuation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Öğrencinin devam etme tercihlerini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Mock data
    const progressions = [
      {
        id: 'prog_1',
        userId,
        courseId: '1',
        nextCourseId: 'next_course_1',
        willContinue: true,
        notifiedAt: '2024-03-15T10:00:00Z',
        course: {
          title: 'İngilizce B1 Seviyesi',
          endDate: '2024-04-15T18:00:00Z'
        },
        nextCourse: {
          title: 'İngilizce B2 Seviyesi',
          startDate: '2024-05-01T09:00:00Z'
        }
      }
    ];

    return NextResponse.json({ progressions });
  } catch (error) {
    console.error('Error fetching course progressions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}