import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Receipt from '@/lib/models/Receipt';
import dbConnect from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { receiptId, email } = await request.json();

    if (!receiptId || !email) {
      return NextResponse.json(
        { error: 'Receipt ID and email are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const receipt = await Receipt.findOne({ receiptNumber: receiptId }).populate('userId');

    if (!receipt) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }

    // Validate that the receipt has required fields
    if (!receipt.userId || !receipt.items || receipt.items.length === 0) {
      return NextResponse.json({ error: 'Receipt data is incomplete' }, { status: 400 });
    }

    // Create email transporter (you'll need to configure this with your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('SMTP transporter verified successfully');
    } catch (error) {
      console.error('SMTP transporter verification failed:', error);
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      );
    }

    const receiptUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/receipts/${receipt.receiptNumber}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Receipt from ${(receipt.userId as { businessName?: string; name: string }).businessName || (receipt.userId as { businessName?: string; name: string }).name}</h2>
        <p>Dear Customer,</p>
        <p>Please find your receipt below:</p>

        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0;">
          <h3>Receipt #${receipt.receiptNumber}</h3>
          <p><strong>Customer:</strong> ${receipt.customerName}</p>
          <p><strong>Date:</strong> ${new Date(receipt.createdAt).toLocaleDateString()}</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="border-bottom: 2px solid #ddd;">
                <th style="text-align: left; padding: 8px;">Item</th>
                <th style="text-align: center; padding: 8px;">Qty</th>
                <th style="text-align: right; padding: 8px;">Price</th>
                <th style="text-align: right; padding: 8px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${(receipt.items as { description: string; quantity: number; price: number }[]).map((item) => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px;">${item.description || 'N/A'}</td>
                  <td style="text-align: center; padding: 8px;">${item.quantity || 0}</td>
                  <td style="text-align: right; padding: 8px;">₦${(item.price || 0).toLocaleString()}</td>
                  <td style="text-align: right; padding: 8px;">₦${((item.quantity || 0) * (item.price || 0)).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="text-align: right; margin-top: 20px;">
            <p><strong>Subtotal:</strong> ₦${(receipt.subtotal || 0).toLocaleString()}</p>
            ${receipt.vat > 0 ? `<p><strong>VAT:</strong> ₦${(receipt.vat || 0).toLocaleString()}</p>` : ''}
            <p style="font-size: 18px;"><strong>Total: ₦${(receipt.total || 0).toLocaleString()}</strong></p>
          </div>
        </div>

        <p>
          <a href="${receiptUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Full Receipt Online
          </a>
        </p>

        <p>Thank you for your business!</p>
        <p>${(receipt.userId as { businessName?: string; name: string }).businessName || (receipt.userId as { businessName?: string; name: string }).name}</p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: `Receipt #${receipt.receiptNumber} from ${(receipt.userId as { businessName?: string; name: string }).businessName || (receipt.userId as { businessName?: string; name: string }).name}`,
        html: emailHtml,
      });
    } catch (sendError) {
      console.error('Failed to send email:', sendError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Receipt sent successfully' });
  } catch (error) {
    console.error('Email receipt error:', error);
    return NextResponse.json(
      { error: 'Failed to send receipt' },
      { status: 500 }
    );
  }
}