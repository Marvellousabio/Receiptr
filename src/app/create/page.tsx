'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Item {
  description: string;
  quantity: number;
  price: number;
}

export default function CreateReceipt() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const searchParams = useSearchParams();
   const isTryMode = searchParams.get('mode') === 'try';
   const [customerName, setCustomerName] = useState('');
   const [paymentMethod, setPaymentMethod] = useState('Cash');
   const [items, setItems] = useState<Item[]>([{ description: '', quantity: 1, price: 0 }]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [attemptCount, setAttemptCount] = useState(0);
   const [showSignupPrompt, setShowSignupPrompt] = useState(false);
   const [generatedReceipt, setGeneratedReceipt] = useState<{receiptNumber: string; customerName: string; items: Item[]; total: number; paymentMethod: string; createdAt: string} | null>(null);

  useEffect(() => {
    if (isTryMode) {
      // Anonymous mode - check attempt count
      const attempts = parseInt(localStorage.getItem('receiptAttempts') || '0');
      setAttemptCount(attempts);
      if (attempts >= 2) {
        setShowSignupPrompt(true);
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router, isTryMode]);

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

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    // For now, no VAT calculation - can be enhanced later
    return subtotal;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
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

    if (isTryMode && attemptCount >= 2) {
      setShowSignupPrompt(true);
      setLoading(false);
      return;
    }

    try {
      if (isTryMode) {
        // Anonymous mode - generate receipt locally
        const receiptNumber = `TRY-${Date.now()}`;
        const total = calculateTotal();
        const receipt = {
          receiptNumber,
          customerName,
          items,
          paymentMethod,
          total,
          createdAt: new Date().toISOString(),
        };

        // Increment attempt count
        const newAttempts = attemptCount + 1;
        localStorage.setItem('receiptAttempts', newAttempts.toString());
        setAttemptCount(newAttempts);

        setGeneratedReceipt(receipt);
        setShowSignupPrompt(true);
      } else {
        // Authenticated mode - save to database
        const response = await fetch('/api/receipts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName,
            items,
            paymentMethod,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to create receipt');
          return;
        }

        // Redirect to the receipt view
        router.push(`/receipts/${data.receipt.receiptNumber}`);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' && !isTryMode) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  if (!session && !isTryMode) {
    return null;
  }

  if (showSignupPrompt && isTryMode && attemptCount >= 2) {
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
            {isTryMode ? 'Try Receiptr Free' : 'Create New Receipt'}
          </h1>
          <p className="text-secondary mt-1">
            {isTryMode ? `Generate a receipt (attempt ${attemptCount + 1} of 2)` : 'Generate a professional receipt for your customer'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

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
                      value={item.price===0?'':item.price}
                      onChange={(e)=>{
                        const rawValue= e.target.value;
                        let newValue;

                        if (rawValue==='' || rawValue==='.'){newValue=0}
                        else { newValue= parseFloat(rawValue) || 0};
                        updateItem(index, 'price',newValue);}}
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

        {/* Generated Receipt Preview (Anonymous Mode) */}
        {generatedReceipt && (
          <div className="mt-8">
            <h2 className="text-lg font-medium text-primary mb-4">Receipt Preview</h2>
            <div className="bg-secondary shadow-lg rounded-lg overflow-hidden max-w-2xl mx-auto">
              <div className="p-8" id="try-receipt-content">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-primary mb-2">
                    Try Receiptr
                  </h1>
                  <div className="text-secondary">
                    <p>Receipt #{generatedReceipt.receiptNumber}</p>
                    <p>{new Date(generatedReceipt.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-primary mb-2">Customer</h2>
                  <p className="text-secondary">{generatedReceipt.customerName}</p>
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
                      {generatedReceipt.items.map((item: Item, index: number) => (
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
                  <div className="flex justify-between text-xl font-bold border-t border-color pt-2">
                    <span>Total:</span>
                    <span>₦{generatedReceipt.total.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 text-sm text-secondary">
                    <span>Payment Method: {generatedReceipt.paymentMethod}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-secondary">
                  <p className="mb-2">Thank you for your business!</p>
                  <p className="text-sm">This is a preview. Create an account to generate real receipts.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
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
        )}
      </div>
    </div>
  );
}