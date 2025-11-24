import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Receipt from '@/lib/models/Receipt';
import dbConnect from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const date = searchParams.get('date');

    const query: Record<string, any> = { userId: session.user.id };

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    const receipts = await Receipt.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ receipts });
  } catch (error) {
    console.error('Get receipts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { customerName, items, paymentMethod } = await request.json();

    // Validate input
    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer name and items are required' },
        { status: 400 }
      );
    }

    // Get user VAT rate
    const User = (await import('@/lib/models/User')).default;
    const user = await User.findById(session.user.id);
    const vatRate = user?.vatRate || 0;

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
    const vat = (subtotal * vatRate) / 100;
    const total = subtotal + vat;

    // Generate receipt number
    const receiptNumber = `RC-${Date.now()}`;

    const receipt = await Receipt.create({
      userId: session.user.id,
      receiptNumber,
      customerName,
      items,
      subtotal,
      vat,
      total,
      paymentMethod: paymentMethod || 'Cash',
    });

    return NextResponse.json(
      { message: 'Receipt created successfully', receipt },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create receipt error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}