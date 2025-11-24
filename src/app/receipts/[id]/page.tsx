'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PrinterIcon, PhoneIcon, EnvelopeIcon, LinkIcon } from '@heroicons/react/24/outline';

interface Receipt {
  _id: string;
  receiptNumber: string;
  customerName: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  vat: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
  userId: {
    businessName: string;
    address: string;
    phone: string;
    logoUrl: string;
    vatRate: number;
  };
}

export default function ReceiptView() {
  const params = useParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchReceipt();
    }
  }, [params.id]);

  const fetchReceipt = async () => {
    try {
      const response = await fetch(`/api/receipts/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Receipt not found');
        return;
      }

      setReceipt(data.receipt);
    } catch (error) {
      setError('Failed to load receipt');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Receipt ${receipt?.receiptNumber} from ${receipt?.userId.businessName}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Receipt Not Found</h1>
          <p className="text-secondary">{error || 'The receipt you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-3 justify-center print:hidden">
          <button
            onClick={handlePrint}
            className="bg-secondary text-primary hover:bg-primary px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <PrinterIcon className="w-5 h-5" />
            Print
          </button>
          <button
            onClick={() => handleShare('whatsapp')}
            className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <PhoneIcon className="w-5 h-5" />
            WhatsApp
          </button>
          <button
            onClick={() => handleShare('email')}
            className="bg-secondary text-primary hover:bg-primary px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <EnvelopeIcon className="w-5 h-5" />
            Email
          </button>
          <button
            onClick={() => handleShare('copy')}
            className="bg-secondary text-primary hover:bg-primary px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <LinkIcon className="w-5 h-5" />
            Copy Link
          </button>
        </div>

        {/* Receipt */}
        <div className="bg-secondary shadow-lg rounded-lg overflow-hidden">
          <div className="p-8" id="receipt-content">
            {/* Header */}
            <div className="text-center mb-8">
              {receipt.userId.logoUrl && (
                <img
                  src={receipt.userId.logoUrl}
                  alt="Business Logo"
                  className="w-20 h-20 mx-auto mb-4 object-contain"
                />
              )}
              <h1 className="text-3xl font-bold text-primary mb-2">
                {receipt.userId.businessName || 'Business Name'}
              </h1>
              {receipt.userId.address && (
                <p className="text-secondary mb-1">{receipt.userId.address}</p>
              )}
              {receipt.userId.phone && (
                <p className="text-secondary mb-1">{receipt.userId.phone}</p>
              )}
              <div className="text-secondary">
                <p>Receipt #{receipt.receiptNumber}</p>
                <p>{new Date(receipt.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-primary mb-2">Customer</h2>
              <p className="text-secondary">{receipt.customerName}</p>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-color">
                    <th className="text-left py-2 font-semibold">Item</th>
                    <th className="text-center py-2 font-semibold">Qty</th>
                    <th className="text-right py-2 font-semibold">Price</th>
                    <th className="text-right py-2 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {receipt.items.map((item, index) => (
                    <tr key={index} className="border-b border-color">
                      <td className="py-2">{item.description}</td>
                      <td className="text-center py-2">{item.quantity}</td>
                      <td className="text-right py-2">₦{item.price.toLocaleString()}</td>
                      <td className="text-right py-2">₦{(item.quantity * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="border-t-2 border-color pt-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Subtotal:</span>
                <span>₦{receipt.subtotal.toLocaleString()}</span>
              </div>
              {receipt.vat > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="font-medium">VAT ({receipt.userId.vatRate}%):</span>
                  <span>₦{receipt.vat.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t border-color pt-2">
                <span>Total:</span>
                <span>₦{receipt.total.toLocaleString()}</span>
              </div>
              <div className="mt-2 text-sm text-secondary">
                <span>Payment Method: {receipt.paymentMethod}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 text-secondary">
              <p className="mb-2">Thank you for your business!</p>
              <p className="text-sm">This receipt was generated electronically and is valid without signature.</p>
              <p className="text-xs mt-4 text-secondary">
                View online: {window.location.href}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}