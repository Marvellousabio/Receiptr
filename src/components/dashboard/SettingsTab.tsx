'use client';

interface SettingsTabProps {
  businessName: string;
  setBusinessName: (name: string) => void;
  address: string;
  setAddress: (address: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  website: string;
  setWebsite: (website: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  vatRate: number;
  setVatRate: (rate: number) => void;
  handleSettingsSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  error: string;
  success: string;
}

export default function SettingsTab({
  businessName,
  setBusinessName,
  address,
  setAddress,
  phone,
  setPhone,
  website,
  setWebsite,
  logoUrl,
  setLogoUrl,
  vatRate,
  setVatRate,
  handleSettingsSubmit,
  saving,
  error,
  success,
}: SettingsTabProps) {
  return (
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
  );
}