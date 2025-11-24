import { NextRequest, NextResponse } from 'next/server';
import Receipt from '@/lib/models/Receipt';
import dbConnect from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const receipt = await Receipt.findOne({ receiptNumber: id }).populate('userId', 'businessName address phone logoUrl vatRate');

    if (!receipt) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    return NextResponse.json({ receipt });
  } catch (error) {
    console.error('Get receipt error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}