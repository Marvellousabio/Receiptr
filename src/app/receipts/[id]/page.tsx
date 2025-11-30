'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PrinterIcon, PhoneIcon, EnvelopeIcon, LinkIcon, DocumentArrowDownIcon, PhotoIcon, QrCodeIcon, ShareIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import QRCode from 'qrcode';

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
   const [qrCodeUrl, setQrCodeUrl] = useState('');
   const [shareMenuOpen, setShareMenuOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchReceipt();
    }
  }, [params.id]);

  useEffect(() => {
    if (receipt) {
      generateQRCode();
    }
  }, [receipt]);

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

  const generateQRCode = async () => {
    try {
      const url = window.location.href;
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 128,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('receipt-content');
    if (!element) return;

    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: 1,
      filename: `receipt-${receipt?.receiptNumber}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleShareAsImage = async (platform: string) => {
    const element = document.getElementById('receipt-content');
    if (!element) return;

    const html2canvas = (await import('html2canvas')).default;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imageDataUrl = canvas.toDataURL('image/png');
      const text = `Receipt ${receipt?.receiptNumber} from ${receipt?.userId.businessName}`;

      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`);
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`);
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`);
          break;
        case 'download':
          const link = document.createElement('a');
          link.download = `receipt-${receipt?.receiptNumber}.png`;
          link.href = imageDataUrl;
          link.click();
          break;
      }
    } catch (error) {
      console.error('Failed to share as image:', error);
      alert('Failed to generate image. Please try again.');
    }
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
            aria-label='Print Receipt'
            onClick={handlePrint}
            className="bg-secondary text-primary hover:bg-primary px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <PrinterIcon className="w-5 h-5" />
            Print
          </button>
          <button
            aria-label='Download PDF'
            onClick={handleDownloadPDF}
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            PDF
          </button>
          <button
            aria-label='Download Image'
            onClick={() => handleShareAsImage('download')}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <PhotoIcon className="w-5 h-5" />
            Image
          </button>
          <div className="relative">
            <button
              aria-label='Share'
              onClick={() => setShareMenuOpen(!shareMenuOpen)}
              className="bg-secondary text-primary hover:bg-primary px-4 py-2 rounded-md font-medium flex items-center gap-2"
            >
              <ShareIcon className="w-5 h-5" />
              Share
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            {shareMenuOpen && (
              <div className="absolute top-full mt-2 bg-secondary border border-gray-300 rounded-md shadow-lg z-10 min-w-[160px]">
                <div className="py-1">
                  <button
                    onClick={() => { handleShare('whatsapp'); setShareMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-primary"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => { handleShareAsImage('facebook'); setShareMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-primary"
                  >
                    <PhotoIcon className="w-4 h-4" />
                    Facebook
                  </button>
                  <button
                    onClick={() => { handleShareAsImage('linkedin'); setShareMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-primary"
                  >
                    <PhotoIcon className="w-4 h-4" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => { handleShareAsImage('twitter'); setShareMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-primary"
                  >
                    <PhotoIcon className="w-4 h-4" />
                    Twitter
                  </button>
                  <button
                    onClick={() => { handleShare('email'); setShareMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-primary"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    Email
                  </button>
                  <button
                    onClick={() => { handleShare('copy'); setShareMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-primary"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Copy Link
                  </button>
                </div>
              </div>
            )}
          </div>
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
              <div className="mt-4 flex flex-col items-center gap-2">
                {qrCodeUrl && (
                  <div className="mb-2">
                    <p className="text-xs mb-1">Scan QR code to view online:</p>
                    <img
                      src={qrCodeUrl}
                      alt="QR Code for receipt"
                      className="w-16 h-16 mx-auto"
                    />
                  </div>
                )}
                <p className="text-xs">
                  View online: {window.location.href}
                </p>
              </div>
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