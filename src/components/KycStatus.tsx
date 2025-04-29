// components/KycStatus.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Make this simple and easy to understand
export default function KycStatus({ 
  status, 
  rejectionReason 
}: { 
  status: string, 
  rejectionReason?: string 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Start the verification process
  const startVerification = async () => {
    setIsLoading(true);
    
    try {
      // Call your API to start verification
      const response = await fetch('/api/kyc/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start verification');
      }
      
      // Redirect to verification page
      router.push(`/verification?applicantId=${data.applicantId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Could not start verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-medium mb-2">Identity Verification</h3>
      
      {status === 'not_started' && (
        <>
          <p className="mb-3">Verify your identity to unlock all features.</p>
          <button
            onClick={startVerification}
            disabled={isLoading}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            {isLoading ? 'Loading...' : 'Start Verification'}
          </button>
        </>
      )}
      
      {status === 'pending' && (
        <p className="text-yellow-600">Your verification is in progress...</p>
      )}
      
      {status === 'approved' && (
        <p className="text-green-600">✓ Your identity has been verified!</p>
      )}
      
      {status === 'rejected' && (
        <>
          <p className="text-red-600 mb-2">Verification failed</p>
          {rejectionReason && <p className="mb-2">{rejectionReason}</p>}
          <button
            onClick={startVerification}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
}