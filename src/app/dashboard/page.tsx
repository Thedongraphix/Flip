'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import Image from 'next/image';
import KycStatus from '@/components/KycStatus';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      
      // Get the current user
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.error('Error fetching user:', error);
        router.push('/login');
        return;
      }
      
      setUser(user);
      
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }
      
      setLoading(false);
    }
    
    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#001F3F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#001F3F] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image 
              src="/images/logos/flip logo.png" 
              alt="Flip Logo" 
              width={36} 
              height={36}
              className="w-9 h-9 object-contain"
            />
            <span className="space-grotesk text-xl font-semibold">Flip</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-4">
              <Link href="/dashboard" className="px-3 py-2 rounded hover:bg-[#00295B] transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/transactions" className="px-3 py-2 rounded hover:bg-[#00295B] transition-colors">
                Transactions
              </Link>
              <Link href="/dashboard/settings" className="px-3 py-2 rounded hover:bg-[#00295B] transition-colors">
                Settings
              </Link>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-semibold mb-4">Welcome back, {profile?.first_name || user?.email}</h1>
          <p className="text-gray-600">Manage your finances with ease.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Summary */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
            
            {/* KYC Status Section */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Verification Status</h3>
              {profile?.kyc_status === 'approved' ? (
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Your identity is verified!</span>
                </div>
              ) : (
                <div>
                  <p className="text-amber-600 mb-3">
                    {profile?.kyc_status === 'pending' 
                      ? 'Your verification is in progress...' 
                      : 'Please complete identity verification to access all features.'}
                  </p>
                  {profile?.kyc_status !== 'pending' && (
                    <Link
                      href="/verification"
                      className="inline-block bg-[#001F3F] hover:bg-[#00295B] text-white px-4 py-2 rounded transition-colors"
                    >
                      Complete Verification
                    </Link>
                  )}
                </div>
              )}
            </div>
            
            {/* Placeholder for dashboard data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-700">Total Balance</h4>
                <p className="text-2xl font-bold mt-2">$0.00</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-700">Recent Transactions</h4>
                <p className="text-gray-500 mt-2">No recent transactions</p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                href="/dashboard/transactions"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 p-3 rounded transition-colors"
              >
                View Transactions
              </Link>
              <Link 
                href="/dashboard/settings/profile"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 p-3 rounded transition-colors"
              >
                Update Profile
              </Link>
              {profile?.kyc_status !== 'approved' && (
                <Link 
                  href="/verification"
                  className="block w-full text-center bg-[#001F3F] hover:bg-[#00295B] text-white p-3 rounded transition-colors"
                >
                  Complete KYC
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}