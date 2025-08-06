import { NextRequest, NextResponse } from 'next/server';

// Kurs dondurma işlemi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enrollmentId, reason, userId } = body;

    if (!enrollmentId || !userId) {
      return NextResponse.json({ error: 'Enrollment ID and User ID are required' }, { status: 400 });
    }

    // Mock işlem - gerçek uygulamada database güncellemesi yapılacak
    const freezeRequest = {
      id: `freeze_${Date.now()}`,
      enrollmentId,
      reason: reason || 'Kişisel sebeplerden dolayı',
      frozenAt: new Date().toISOString(),
      unfrozenAt: null,
      isActive: true,
      status: 'PENDING' // Admin onayı bekliyor
    };

    // Mock response
    return NextResponse.json({
      success: true,
      message: 'Kurs dondurma isteğiniz alındı. Admin onayından sonra kursunuz dondurulacaktır.',
      freezeRequest
    });
  } catch (error) {
    console.error('Error freezing course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Kurs dondurma işlemini geri alma
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const freezeId = searchParams.get('freezeId');
    const userId = searchParams.get('userId');

    if (!freezeId || !userId) {
      return NextResponse.json({ error: 'Freeze ID and User ID are required' }, { status: 400 });
    }

    // Mock işlem - gerçek uygulamada database güncellemesi yapılacak
    return NextResponse.json({
      success: true,
      message: 'Kurs dondurma işlemi başarıyla geri alındı. Kursunuz aktif duruma getirildi.',
      unfrozenAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error unfreezing course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}