'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <nav className="bg-primary shadow-sm border-b border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary">
              Receiptr
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-secondary h-8 w-20 rounded"></div>
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/create"
                  className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Receipt
                </Link>
                <Link
                  href="/general-settings"
                  className="text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  <span className="hidden sm:inline ml-1">Settings</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-secondary hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}