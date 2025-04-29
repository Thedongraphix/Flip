'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const startVerification = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Generate a truly unique ID for this verification attempt
      const userId = "test-user-" + Date.now() + "-" + Math.random().toString(36).substring(2, 10);
      
      const userData = {
        userId: userId,
        userInfo: {
          firstName: "John",
          lastName: "Doe",
          email: "test@example.com",
          phone: "+1234567890",
          accountType: "personal"
        },
        levelName: "id-and-liveness"  // Make sure this level exists in your SumSub account
      };
      
      console.log('Creating applicant with data:', userData);
      
      // Create or get applicant in SumSub
      const response = await fetch('/api/sumsub/applicant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create applicant');
      }
      
      console.log('Applicant created successfully:', data);
      setResult(data);
      
      // Get the applicant ID
      const applicantId = data.applicant.id;
      
      // Get access token for the SumSub SDK
console.log('Getting access token for applicant:', applicantId);
const tokenResponse = await fetch('/api/sumsub/access-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    applicantId,
    levelName: "id-and-liveness"
  })
});
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        throw new Error(tokenData.error || 'Failed to get access token');
      }
      
      console.log('Access token received:', tokenData.token ? 'Token received' : 'No token');

      // Store the token and applicant ID (you can use a state management solution or localStorage)
      localStorage.setItem('sumsubToken', tokenData.token);
      localStorage.setItem('sumsubApplicantId', applicantId);
      
      // Redirect to verification page or initialize SDK (depending on your implementation)
      router.push(`/verification?applicantId=${applicantId}`);
      
    } catch (err: any) {
      console.error('Error starting verification:', err);
      setError(err.message || 'Failed to start verification process');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Test SumSub Verification</h1>
      
      <button
        onClick={startVerification}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Start Verification'}
      </button>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-bold">Success:</p>
          <pre className="whitespace-pre-wrap overflow-auto max-h-60">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}