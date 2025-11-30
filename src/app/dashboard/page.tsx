'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Sidebar from '@/components/dashboard/Sidebar';
import OverviewTab from '@/components/dashboard/OverviewTab';
import ReceiptsTab from '@/components/dashboard/ReceiptsTab';
import TemplatesTab from '@/components/dashboard/TemplatesTab';
import SettingsTab from '@/components/dashboard/SettingsTab';

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
   // Templates state
   const [selectedTemplate, setSelectedTemplate] = useState('classic');
   const [customColors, setCustomColors] = useState({
     primary: '#1f2937',
     secondary: '#6b7280',
     accent: '#3b82f6'
   });
   const [customFont, setCustomFont] = useState('inter');
   const [showAdvanced, setShowAdvanced] = useState(false);

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
      setSelectedTemplate(session.user.selectedTemplate || 'classic');
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

  const handleTemplateSubmit = async () => {
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
          selectedTemplate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update template');
        return;
      }

      // Update session
      await update({
        selectedTemplate,
      });

      setSuccess('Template updated successfully!');
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
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
        {/* Mobile Sidebar Backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                {activeTab === 'overview' && 'Overview'}
                {activeTab === 'receipts' && 'Receipts'}
                {activeTab === 'templates' && 'Templates'}
                {activeTab === 'settings' && 'Business Settings'}
              </h1>
              <p className="text-secondary mt-1 text-sm sm:text-base">
                {activeTab === 'overview' && 'Manage your receipts and business profile'}
                {activeTab === 'receipts' && 'View and manage your receipts'}
                {activeTab === 'templates' && 'Choose and customize receipt templates'}
                {activeTab === 'settings' && 'Update your business information'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="md:hidden p-2 rounded-md text-primary hover:bg-secondary"
                aria-label="Toggle sidebar"
              >
                <Bars3Icon className="w-4 h-4" />
              </button>
              {activeTab !== 'settings' && (
                <Link
                  href="/create"
                  className="bg-accent text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  Create New Receipt
                </Link>
              )}
            </div>
          </div>

          {activeTab === 'overview' && (
            <OverviewTab
              receipts={receipts}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              session={session}
            />
          )}

          {activeTab === 'receipts' && (
            <ReceiptsTab
              receipts={receipts}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
          )}

          {activeTab === 'templates' && (
            <TemplatesTab
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              customColors={customColors}
              setCustomColors={setCustomColors}
              customFont={customFont}
              setCustomFont={setCustomFont}
              showAdvanced={showAdvanced}
              setShowAdvanced={setShowAdvanced}
              handleTemplateSubmit={handleTemplateSubmit}
              saving={saving}
              error={error}
              success={success}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              businessName={businessName}
              setBusinessName={setBusinessName}
              address={address}
              setAddress={setAddress}
              phone={phone}
              setPhone={setPhone}
              website={website}
              setWebsite={setWebsite}
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
              vatRate={vatRate}
              setVatRate={setVatRate}
              handleSettingsSubmit={handleSettingsSubmit}
              saving={saving}
              error={error}
              success={success}
            />
          )}
        </div>
      </div>
    </div>
  );
}

