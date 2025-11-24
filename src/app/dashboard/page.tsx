'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ChartBarIcon, DocumentTextIcon, CogIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface Receipt {
  _id: string;
  receiptNumber: string;
  customerName: string;
  total: number;
  createdAt: string;
  paymentMethod: string;
}

export default function Dashboard() {
   const { data: session, status, update } = useSession();
   const router = useRouter();
   const [receipts, setReceipts] = useState<Receipt[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [dateFilter, setDateFilter] = useState('');
   const [activeTab, setActiveTab] = useState('overview');
   const [sidebarExpanded, setSidebarExpanded] = useState(false);
   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
   // Settings state
   const [businessName, setBusinessName] = useState('');
   const [address, setAddress] = useState('');
   const [phone, setPhone] = useState('');
   const [website, setWebsite] = useState('');
   const [logoUrl, setLogoUrl] = useState('');
   const [vatRate, setVatRate] = useState(0);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchReceipts();
    }
  }, [session, searchTerm, dateFilter]);

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

  const fetchReceipts = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (dateFilter) params.append('date', dateFilter);

      const response = await fetch(`/api/receipts?${params}`);
      const data = await response.json();
      if (response.ok) {
        setReceipts(data.receipts || []);
      } else {
        console.error('Failed to fetch receipts:', data.error);
        setReceipts([]);
      }
    } catch (error) {
      console.error('Failed to fetch receipts:', error);
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-secondary">
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
    <div className="min-h-screen bg-secondary">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`bg-primary shadow-sm transition-all duration-300 fixed inset-y-0 left-0 z-50 md:relative md:min-h-screen ${
            mobileSidebarOpen ? 'w-64' : 'w-0 md:w-16'
          } ${sidebarExpanded ? 'md:w-64' : 'md:w-16'}`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          <div className="p-4">
            {sidebarExpanded && (
              <h2 className="text-lg font-semibold text-primary mb-4">Dashboard</h2>
            )}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'bg-accent text-white'
                    : 'text-secondary hover:bg-secondary'
                } ${sidebarExpanded ? 'justify-start' : 'justify-center'}`}
              >
                <ChartBarIcon className="w-5 h-5" />
                {sidebarExpanded && <span className="ml-2">Overview</span>}
              </button>
              <button
                onClick={() => setActiveTab('receipts')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'receipts'
                    ? 'bg-accent text-white'
                    : 'text-secondary hover:bg-secondary'
                } ${sidebarExpanded ? 'justify-start' : 'justify-center'}`}
              >
                <DocumentTextIcon className="w-5 h-5" />
                {sidebarExpanded && <span className="ml-2">Receipts</span>}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'bg-accent text-white'
                    : 'text-secondary hover:bg-secondary'
                } ${sidebarExpanded ? 'justify-start' : 'justify-center'}`}
              >
                <CogIcon className="w-5 h-5" />
                {sidebarExpanded && <span className="ml-2">Business Settings</span>}
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {activeTab === 'overview' && 'Overview'}
                {activeTab === 'receipts' && 'Receipts'}
                {activeTab === 'settings' && 'Business Settings'}
              </h1>
              <p className="text-secondary mt-1">
                {activeTab === 'overview' && 'Manage your receipts and business profile'}
                {activeTab === 'receipts' && 'View and manage your receipts'}
                {activeTab === 'settings' && 'Update your business information'}
              </p>
            </div>
            {activeTab !== 'settings' && (
              <Link
                href="/create"
                className="bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Create New Receipt
              </Link>
            )}
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-primary p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-accent rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-secondary">Total Receipts</p>
                      <p className="text-2xl font-bold text-primary">{receipts.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-success rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-secondary">Total Revenue</p>
                      <p className="text-2xl font-bold text-primary">
                        ₦{receipts.reduce((sum, receipt) => sum + receipt.total, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary p-6 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-info rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-secondary">Business Profile</p>
                      <p className="text-lg font-semibold text-primary">{session.user.businessName || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="bg-primary p-6 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search by customer name or receipt number..."
                      className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Filter by date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Receipts List */}
              <div className="bg-primary rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-color">
                  <h2 className="text-lg font-medium text-primary">Recent Receipts</h2>
                </div>

                {receipts.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-primary">No receipts</h3>
                    <p className="mt-1 text-sm text-secondary">Get started by creating your first receipt.</p>
                    <div className="mt-6">
                      <Link
                        href="/create"
                        className="px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-accent text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Create Receipt
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-color">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                            Receipt #
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                            Payment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-primary divide-y divide-color">
                        {receipts.map((receipt) => (
                          <tr key={receipt._id} className="hover:bg-secondary">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                              {receipt.receiptNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              {receipt.customerName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              ₦{receipt.total.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              {receipt.paymentMethod}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                              {new Date(receipt.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              <Link
                                href={`/receipts/${receipt.receiptNumber}`}
                                className="text-blue-600 hover:text-blue-900"
                                target="_blank"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'receipts' && (
            <>
              {/* Search and Filter */}
              <div className="bg-primary p-6 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search by customer name or receipt number..."
                      className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Filter by date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Receipts List */}
              <div className="bg-primary rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-color">
                  <h2 className="text-lg font-medium text-primary">All Receipts</h2>
                </div>

                {receipts.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-primary">No receipts</h3>
                    <p className="mt-1 text-sm text-secondary">Get started by creating your first receipt.</p>
                    <div className="mt-6">
                      <Link
                        href="/create"
                        className="px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-accent text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Create Receipt
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-color">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                            Receipt #
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                            Payment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-primary divide-y divide-color">
                        {receipts.map((receipt) => (
                          <tr key={receipt._id} className="hover:bg-secondary">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                              {receipt.receiptNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              {receipt.customerName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              ₦{receipt.total.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              {receipt.paymentMethod}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                              {new Date(receipt.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                              <Link
                                href={`/receipts/${receipt.receiptNumber}`}
                                className="text-blue-600 hover:text-blue-900"
                                target="_blank"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
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

              <div className="bg-primary p-6 rounded-lg shadow-sm space-y-6">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter your business name"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will appear on your receipts. Leave blank to use your account name.
                  </p>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your business address"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will appear on your receipts.
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your business phone"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will appear on your receipts.
                  </p>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Optional. Your business website.
                  </p>
                </div>

                <div>
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    id="logoUrl"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL to your business logo. Recommended size: 200x200px.
                  </p>
                </div>

                <div>
                  <label htmlFor="vatRate" className="block text-sm font-medium text-gray-700 mb-1">
                    VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    id="vatRate"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-1"
                    value={vatRate}
                    onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    VAT rate to apply to your receipts (e.g., 7.5 for 7.5%).
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 bg-accent text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

