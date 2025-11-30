'use client';

import Link from 'next/link';
import { Session } from 'next-auth';

interface Receipt {
  _id: string;
  receiptNumber: string;
  customerName: string;
  total: number;
  createdAt: string;
  paymentMethod: string;
}

interface OverviewTabProps {
  receipts: Receipt[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  session: Session | null;
}

export default function OverviewTab({
  receipts,
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  session,
}: OverviewTabProps) {
  return (
    <>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-primary p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-accent rounded-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className="text-lg font-semibold text-primary">{session?.user.businessName || 'Not set'}</p>
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
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
              {receipts.map((receipt) => (
                <div key={receipt._id} className="bg-primary p-4 rounded-lg shadow-sm border border-color">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-primary">{receipt.receiptNumber}</span>
                    <span className="text-sm text-secondary">{new Date(receipt.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-1 mb-3">
                    <p className="text-sm text-primary"><span className="font-medium">Customer:</span> {receipt.customerName}</p>
                    <p className="text-sm text-primary"><span className="font-medium">Amount:</span> ₦{receipt.total.toLocaleString()}</p>
                    <p className="text-sm text-primary"><span className="font-medium">Payment:</span> {receipt.paymentMethod}</p>
                  </div>
                  <Link
                    href={`/receipts/${receipt.receiptNumber}`}
                    className="inline-block text-accent hover:text-blue-700 text-sm font-medium"
                    target="_blank"
                  >
                    View Receipt →
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
          </>
        )}
      </div>
    </>
  );
}