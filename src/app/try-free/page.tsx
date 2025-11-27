'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { PrinterIcon, PhotoIcon, ShareIcon, LinkIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';

export const dynamic = 'force-dynamic';

interface Item {
  description: string;
  quantity: number;
  price: number;
}

interface Business {
  name: string;
  address: string;
  phone: string;
  website: string;
  logoUrl: string;
}

function TryFreeContent() {
  const router = useRouter();
  const [business, setBusiness] = useState<Business>({
    name: '',
    address: '',
    phone: '',
    website: '',
    logoUrl: '',
  });
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [items, setItems] = useState<Item[]>([{ description: '', quantity: 1, price: 0 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<{
    receiptNumber: string;
    business: Business;
    customerName: string;
    items: Item[];
    total: number;
    paymentMethod: string;
    createdAt: string;
  } | null>(null);

  useEffect(() => {
    // Check attempt count
    const attempts = parseInt(localStorage.getItem('tryFreeAttempts') || '0');
    setAttemptCount(attempts);
    if (attempts >= 2) {
      setShowSignupPrompt(true);
    }
  }, []);

  useEffect(() => {
    // Close share dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.share-dropdown')) {
        setShowShareOptions(false);
      }
    };

    if (showShareOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareOptions]);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const updateBusiness = (field: keyof Business, value: string) => {
    setBusiness({ ...business, [field]: value });
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    // For now, no VAT calculation - can be enhanced later
    return subtotal;
  };

  const handlePrint = () => {
    const printContent = document.getElementById('try-free-receipt-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                body { font-family: monospace; margin: 20px; }
                .receipt { max-width: 300px; margin: 0 auto; }
              </style>
            </head>
            <body>
              <div class="receipt">${printContent.innerHTML}</div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownloadImage = async () => {
    const receiptElement = document.getElementById('try-free-receipt-content');
    if (receiptElement) {
      try {
        const canvas = await html2canvas(receiptElement, {
          backgroundColor: '#ffffff',
          scale: 2,
        });
        const link = document.createElement('a');
        link.download = `receipt-${generatedReceipt?.receiptNumber || 'preview'}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this receipt from ${generatedReceipt?.business.name || 'my business'}!`);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    setShowShareOptions(false);
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setShowShareOptions(false);
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this receipt from ${generatedReceipt?.business.name || 'my business'}!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    setShowShareOptions(false);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Receipt from ${generatedReceipt?.business.name || 'my business'}`);
    const body = encodeURIComponent(`Check out this receipt!\n\n${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setShowShareOptions(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!business.name.trim() || !business.address.trim() || !business.phone.trim()) {
      setError('Business name, address, and phone are required');
      setLoading(false);
      return;
    }

    if (!customerName.trim()) {
      setError('Customer name is required');
      setLoading(false);
      return;
    }

    if (items.some(item => !item.description.trim() || item.quantity <= 0 || item.price <= 0)) {
      setError('All items must have description, quantity > 0, and price > 0');
      setLoading(false);
      return;
    }

    if (attemptCount >= 2) {
      setShowSignupPrompt(true);
      setLoading(false);
      return;
    }

    try {
      // Generate receipt locally
      const receiptNumber = `TRY-FREE-${Date.now()}`;
      const total = calculateTotal();
      const receipt = {
        receiptNumber,
        business,
        customerName,
        items,
        paymentMethod,
        total,
        createdAt: new Date().toISOString(),
      };

      // Increment attempt count
      const newAttempts = attemptCount + 1;
      localStorage.setItem('tryFreeAttempts', newAttempts.toString());
      setAttemptCount(newAttempts);

      setGeneratedReceipt(receipt);
      setShowSignupPrompt(true);
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showSignupPrompt && attemptCount >= 2) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">You&apos;ve reached the free trial limit</h2>
            <p className="text-secondary mb-6">Create an account to generate unlimited receipts and save them permanently.</p>
            <div className="space-x-4">
              <Link
                href="/register"
                className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent"
              >
                Sign Up Now
              </Link>
              <Link
                href="/login"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Try Receiptr Free
          </h1>
          <p className="text-secondary mt-1">
            Generate a receipt with your business details (attempt {attemptCount + 1} of 2)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Business Information */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-primary mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-secondary mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={business.name}
                  onChange={(e) => updateBusiness('name', e.target.value)}
                  placeholder="Enter business name"
                  required
                />
              </div>
              <div>
                <label htmlFor="businessPhone" className="block text-sm font-medium text-secondary mb-1">
                  Phone *
                </label>
                <input
                  type="text"
                  id="businessPhone"
                  className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={business.phone}
                  onChange={(e) => updateBusiness('phone', e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="businessAddress" className="block text-sm font-medium text-secondary mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  id="businessAddress"
                  className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={business.address}
                  onChange={(e) => updateBusiness('address', e.target.value)}
                  placeholder="Enter business address"
                  required
                />
              </div>
              <div>
                <label htmlFor="businessWebsite" className="block text-sm font-medium text-secondary mb-1">
                  Website
                </label>
                <input
                  type="url"
                  id="businessWebsite"
                  className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={business.website}
                  onChange={(e) => updateBusiness('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label htmlFor="businessLogo" className="block text-sm font-medium text-secondary mb-1">
                  Logo URL
                </label>
                <input
                  type="url"
                  id="businessLogo"
                  className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={business.logoUrl}
                  onChange={(e) => updateBusiness('logoUrl', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-primary mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-secondary mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  id="customerName"
                  className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-secondary mb-1">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Transfer">Bank Transfer</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-primary">Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-primary text-primary hover:bg-secondary focus:ring-2 focus:ring-accent focus:ring-offset-2 text-sm"
              >
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label htmlFor={`description-${index}`} className="block text-sm font-medium text-secondary mb-1">
                      Description *
                    </label>
                    <input
                      id={`description-${index}`}
                      type="text"
                      className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Item description"
                      required
                    />
                  </div>
                  <div className="w-full md:w-24">
                    <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-secondary mb-1">
                      Qty *
                    </label>
                    <input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      step="1"
                      className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      placeholder="1"
                      required
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <label htmlFor={`price-${index}`} className="block text-sm font-medium text-secondary mb-1">
                      Price (₦) *
                    </label>
                    <input
                      id={`price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      value={item.price === 0 ? '' : item.price}
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        let newValue;
                        if (rawValue === '' || rawValue === '.') {
                          newValue = 0;
                        } else {
                          newValue = parseFloat(rawValue) || 0;
                        }
                        updateItem(index, 'price', newValue);
                      }}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="w-full md:w-24">
                    <label className="block text-sm font-medium text-secondary mb-1">
                      Total
                    </label>
                    <div className="w-full px-3 py-2 border border-color rounded-md bg-primary">
                      ₦{(item.quantity * item.price).toLocaleString()}
                    </div>
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-primary text-red-600 hover:bg-red-50 hover:text-red-700 focus:ring-2 focus:ring-accent focus:ring-offset-2 mb-0"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-primary mb-4">Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-secondary">Subtotal:</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">VAT (0%):</span>
                <span className="font-medium">₦0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-primary text-primary hover:bg-secondary focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-accent text-primary hover:bg-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Receipt...' : 'Create Receipt'}
            </button>
          </div>

        </form>

        {/* Generated Receipt Preview */}
        {generatedReceipt && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-primary mb-4">Receipt Preview</h2>
            <div className="bg-white shadow-lg border-2 border-gray-300 overflow-hidden max-w-sm mx-auto font-mono text-sm">
              <div className="p-4" id="try-free-receipt-content">
                {/* Header */}
                <div className="text-center mb-4 border-b-2 border-dashed border-gray-400 pb-2">
                  {generatedReceipt.business.logoUrl && (
                    <img
                      src={generatedReceipt.business.logoUrl}
                      alt="Business Logo"
                      className="w-12 h-12 mx-auto mb-2 object-contain"
                    />
                  )}
                  <div className="font-bold text-lg mb-1">{generatedReceipt.business.name}</div>
                  <div className="text-xs text-gray-600 leading-tight">
                    <div>{generatedReceipt.business.address}</div>
                    <div>{generatedReceipt.business.phone}</div>
                    {generatedReceipt.business.website && (
                      <div>{generatedReceipt.business.website}</div>
                    )}
                  </div>
                </div>

                {/* Receipt Info */}
                <div className="text-center mb-4">
                  <div className="font-bold">RECEIPT</div>
                  <div className="text-xs">#{generatedReceipt.receiptNumber}</div>
                  <div className="text-xs">{new Date(generatedReceipt.createdAt).toLocaleDateString()} {new Date(generatedReceipt.createdAt).toLocaleTimeString()}</div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <div className="text-xs">
                    <span className="font-semibold">Customer:</span> {generatedReceipt.customerName}
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <div className="border-t border-b border-dashed border-gray-400 py-2">
                    {generatedReceipt.items.map((item: Item, index: number) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between text-xs">
                          <span className="flex-1">{item.description}</span>
                          <span className="ml-2">x{item.quantity}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold">
                          <span>@ ₦{item.price.toLocaleString()}</span>
                          <span>₦{(item.quantity * item.price).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t border-dashed border-gray-400 pt-2">
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>TOTAL:</span>
                    <span>₦{generatedReceipt.total.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-center mb-2">
                    Payment: {generatedReceipt.paymentMethod}
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center border-t border-dashed border-gray-400 pt-2">
                  <div className="text-xs mb-1">Thank you for your business!</div>
                  <div className="text-xs text-gray-500">This is a preview. Create an account to generate real receipts.</div>
                  <div className="text-xs mt-2">================================</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6">
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Print Receipt"
                >
                  <PrinterIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  onClick={handleDownloadImage}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Download as Image"
                >
                  <PhotoIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Download Image</span>
                </button>

                <div className="relative share-dropdown">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    title="Share Receipt"
                  >
                    <ShareIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Share</span>
                  </button>

                  {showShareOptions && (
                    <div className="absolute top-full mt-2 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-48">
                      <button
                        onClick={shareToWhatsApp}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
                      >
                        <span className="text-green-600 text-lg">📱</span>
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={shareToFacebook}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
                      >
                        <span className="text-blue-600 text-lg">📘</span>
                        <span>Facebook</span>
                      </button>
                      <button
                        onClick={shareToTwitter}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
                      >
                        <span className="text-blue-400 text-lg">🐦</span>
                        <span>Twitter</span>
                      </button>
                      <button
                        onClick={shareViaEmail}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <span className="text-gray-600 text-lg">✉️</span>
                        <span>Email</span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  title="Copy Link"
                >
                  <LinkIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Copy Link</span>
                </button>
              </div>

              <div className="text-center">
                <p className="text-secondary mb-4">Create an account to save this receipt and generate unlimited receipts.</p>
                <div className="space-x-4">
                  <Link
                    href="/register"
                    className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent"
                  >
                    Sign Up to Save
                  </Link>
                  <button
                    onClick={() => {
                      setGeneratedReceipt(null);
                      setBusiness({ name: '', address: '', phone: '', website: '', logoUrl: '' });
                      setCustomerName('');
                      setItems([{ description: '', quantity: 1, price: 0 }]);
                    }}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TryFree() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </div>
    }>
      <TryFreeContent />
    </Suspense>
  );
}