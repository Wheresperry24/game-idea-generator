import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function GET() {
  try {
    const ideas = await prisma.idea.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await prisma.idea.deleteMany({});
    return NextResponse.json({ message: 'History cleared successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to clear history' }, { status: 500 });
  }
} 