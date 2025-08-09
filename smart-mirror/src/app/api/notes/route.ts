// src/app/api/notes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Note from '@/app/lib/models/Notes';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default-user';

    const notes = await Note.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ notes });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { content, priority = 'medium', userId = 'default-user' } = body;

    const note = new Note({
      userId,
      content,
      priority,
    });

    await note.save();
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, isCompleted } = body;

    const note = await Note.findByIdAndUpdate(
      id,
      { isCompleted },
      { new: true }
    );

    return NextResponse.json({ note });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}