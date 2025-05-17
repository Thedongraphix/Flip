'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import Image from 'next/image';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
        setFirstName(profileData.first_name || '');
        setLastName(profileData.last_name || '');
        setPhone(profileData.phone || '');
      }
      
      setLoading(false);
    }
    
    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
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
              <Link href="/dashboard/settings" className="px-3 py-2 rounded bg-[#00295B] transition-colors">
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-800">Account Settings</h1>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sidebar Navigation */}
              <div className="space-y-2">
                <Link 
                  href="/dashboard/settings" 
                  className="block w-full p-3 rounded-lg bg-[#001F3F] text-white font-medium"
                >
                  Profile Information
                </Link>
                <Link 
                  href="/dashboard/settings/security" 
                  className="block w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Security
                </Link>
                <Link 
                  href="/dashboard/settings/notifications" 
                  className="block w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Notifications
                </Link>
                
                {/* KYC Status */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-medium mb-2">Verification Status</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {profile?.kyc_status === 'approved' ? (
                      <div className="flex items-center text-green-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Verified</span>
                      </div>
                    ) : profile?.kyc_status === 'pending' ? (
                      <div className="text-amber-600">Verification in progress</div>
                    ) : (
                      <div>
                        <div className="text-amber-600 mb-2">Not verified</div>
                        <Link 
                          href="/verification" 
                          className="inline-block bg-[#001F3F] hover:bg-[#00295B] text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                          Complete Verification
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="md:col-span-2">
                <form onSubmit={handleSaveProfile}>
                  {message && (
                    <div className="mb-6 p-4 bg-green-50 rounded-lg">
                      <p className="text-green-700">{message}</p>
                    </div>
                  )}
                  
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 rounded-lg">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-gray-700 mb-1 text-sm font-medium">
                            First Name
                          </label>
                          <input 
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#001F3F] focus:border-[#001F3F]"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1 text-sm font-medium">
                            Last Name
                          </label>
                          <input 
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#001F3F] focus:border-[#001F3F]"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-medium">
                          Email Address
                        </label>
                        <input 
                          type="email"
                          value={user?.email}
                          disabled
                          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                        />
                        <span className="text-xs text-gray-500 mt-1">
                          Email address cannot be changed
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-medium">
                          Phone Number
                        </label>
                        <input 
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#001F3F] focus:border-[#001F3F]"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-medium">
                          Account Type
                        </label>
                        <input 
                          type="text"
                          value={profile?.account_type === 'individual' ? 'Individual Account' : 'Business Account'}
                          disabled
                          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#001F3F] hover:bg-[#00295B] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}