import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { selectedTemplate, customTemplate } = await request.json();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { selectedTemplate, customTemplate },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Template update error:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Template fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 });
  }
}