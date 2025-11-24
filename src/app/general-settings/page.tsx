'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Navbar from '@/components/Navbar';
import { UserIcon, SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function GeneralSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  // No mounted state needed for theme

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

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
          <h1 className="text-3xl font-bold text-primary">General Settings</h1>
          <p className="text-secondary mt-1">Manage your account and app preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <UserIcon className="w-6 h-6 text-secondary mr-2" />
              <h2 className="text-lg font-medium text-primary">Profile</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Name
                </label>
                <p className="text-primary">{session.user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Email
                </label>
                <p className="text-primary">{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* Theme Section */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              {theme === 'light' && <SunIcon className="w-6 h-6 text-secondary mr-2" />}
              {theme === 'dark' && <MoonIcon className="w-6 h-6 text-secondary mr-2" />}
              {theme === 'system' && <ComputerDesktopIcon className="w-6 h-6 text-secondary mr-2" />}
              <h2 className="text-lg font-medium text-primary">Theme</h2>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setTheme('light')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  theme === 'light'
                    ? 'bg-accent text-primary'
                    : 'text-secondary hover:bg-primary'
                }`}
              >
                <SunIcon className="w-5 h-5 mr-2" />
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  theme === 'dark'
                    ? 'bg-accent text-primary'
                    : 'text-secondary hover:bg-primary'
                }`}
              >
                <MoonIcon className="w-5 h-5 mr-2" />
                Dark
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  theme === 'system'
                    ? 'bg-accent text-primary'
                    : 'text-secondary hover:bg-primary'
                }`}
              >
                <ComputerDesktopIcon className="w-5 h-5 mr-2" />
                System
              </button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm">
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}