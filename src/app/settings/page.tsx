'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

export default function Settings() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [vatRate, setVatRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setBusinessName(session.user.businessName || '');
      setAddress(session.user.address || '');
      setPhone(session.user.phone || '');
      setWebsite(session.user.website || '');
      setLogoUrl(session.user.logoUrl || '');
      setVatRate(session.user.vatRate || 0);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName,
          address,
          phone,
          website,
          logoUrl,
          vatRate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update settings');
        return;
      }

      // Update session
      await update({
        businessName,
        address,
        phone,
        website,
        logoUrl,
        vatRate,
      });

      setSuccess('Settings updated successfully!');
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Business Settings</h1>
          <p className="text-secondary mt-1">Update your business information and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          <div className="bg-secondary p-6 rounded-lg shadow-sm space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-secondary mb-1">
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
              />
              <p className="text-sm text-secondary mt-1">
                This will appear on your receipts. Leave blank to use your account name.
              </p>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-secondary mb-1">
                Business Address
              </label>
              <input
                type="text"
                id="address"
                className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your business address"
              />
              <p className="text-sm text-secondary mt-1">
                This will appear on your receipts.
              </p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-secondary mb-1">
                Business Phone
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your business phone"
              />
              <p className="text-sm text-secondary mt-1">
                This will appear on your receipts.
              </p>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-secondary mb-1">
                Website
              </label>
              <input
                type="url"
                id="website"
                className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
              <p className="text-sm text-secondary mt-1">
                Optional. Your business website.
              </p>
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-secondary mb-1">
                Logo URL
              </label>
              <input
                type="url"
                id="logoUrl"
                className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-sm text-secondary mt-1">
                URL to your business logo. Recommended size: 200x200px.
              </p>
            </div>

            <div>
              <label htmlFor="vatRate" className="block text-sm font-medium text-secondary mb-1">
                VAT Rate (%)
              </label>
              <input
                type="number"
                id="vatRate"
                min="0"
                max="100"
                step="0.01"
                className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                value={vatRate}
                onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
              <p className="text-sm text-secondary mt-1">
                VAT rate to apply to your receipts (e.g., 7.5 for 7.5%).
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="mt-8 bg-secondary p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-primary mb-4">Receipt Preview</h2>
          <div className="border border-color rounded-lg p-4 bg-primary">
            <div className="text-center mb-4">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Business Logo"
                  className="w-12 h-12 mx-auto mb-2 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <h3 className="font-bold text-lg">
                {businessName || session.user.name || 'Business Name'}
              </h3>
              {address && <p className="text-sm text-secondary">{address}</p>}
              {phone && <p className="text-sm text-secondary">{phone}</p>}
              {website && <p className="text-sm text-secondary">{website}</p>}
              <p className="text-sm text-secondary">VAT Rate: {vatRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}