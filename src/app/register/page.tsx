'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Register() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Basic validation for step 1
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, businessName, address, phone, website, logoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Auto-login after successful registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Registration successful, but login failed. Please try logging in manually.');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipBusinessDetails = () => {
    setBusinessName('');
    setAddress('');
    setPhone('');
    setWebsite('');
    setLogoUrl('');
    handleStep2Submit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-primary">
              {step === 1 ? 'Create your account' : 'Business Information'}
            </h2>
            <p className="mt-2 text-center text-sm text-secondary">
              {step === 1 ? (
                <>
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-accent hover:text-accent"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                'Optional business details to personalize your receipts'
              )}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={step === 1 ? handleStep1Submit : handleStep2Submit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-secondary">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary">Business Information (Optional)</h3>

                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-secondary">
                    Business Name
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    autoComplete="organization"
                    className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-secondary">
                    Business Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="address-line1"
                    className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-secondary">
                    Business Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-secondary">
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    autoComplete="url"
                    className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-secondary">
                    Logo URL
                  </label>
                  <input
                    id="logoUrl"
                    name="logoUrl"
                    type="url"
                    autoComplete="url"
                    className="w-full px-3 py-2 border border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent mt-1"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-md font-medium transition-colors duration-200 border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Back to Account Details
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-accent text-primary hover:bg-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (step === 1 ? 'Processing...' : 'Creating account...') : (step === 1 ? 'Continue to Business Details' : 'Create Account')}
              </button>

              {step === 2 && (
                <button
                  type="button"
                  onClick={handleSkipBusinessDetails}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-md font-medium transition-colors duration-200 border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip Business Details
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
