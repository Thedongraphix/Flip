import crypto from 'crypto';

// Environment variables
const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN || '';
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY || '';
const SUMSUB_BASE_URL = 'https://api.sumsub.com';

// Helper function to generate SumSub API request headers with signature
export function getRequestHeaders(method: string, url: string, body?: string): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  
  // Create the signature data using the method provided in SumSub docs
  const signingString = timestamp + method + url + (body || '');
  const signature = crypto
    .createHmac('sha256', SUMSUB_SECRET_KEY)
    .update(signingString)
    .digest('hex');
  
  // Create headers object
  const headers: Record<string, string> = {
    'X-App-Token': SUMSUB_APP_TOKEN,
    'X-App-Access-Sig': signature,
    'X-App-Access-Ts': timestamp,
  };
  
  // Add content-type for requests with body
  if (body) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
}

// Create a new applicant
export async function createApplicant(userId: string, userInfo: {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  accountType?: 'personal' | 'business';
}, levelName: string) {
  // Validate credentials
  if (!SUMSUB_APP_TOKEN || !SUMSUB_SECRET_KEY) {
    throw new Error('SumSub API credentials not configured. Please check your environment variables.');
  }

  // Prepare the URL with level name as query parameter
  const url = `/resources/applicants?levelName=${encodeURIComponent(levelName)}`;
  const method = 'POST';
  
  // Prepare the request body
  const applicantData = {
    externalUserId: userId,
    email: userInfo.email,
    phone: userInfo.phone,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    lang: 'en',
    fixedInfo: {
      userType: userInfo.accountType === 'business' ? 'company' : 'individual'
    }
  };
  
  try {
    console.log('Making SumSub API request to create applicant');
    console.log('Request URL:', `${SUMSUB_BASE_URL}${url}`);
    console.log('Request body:', JSON.stringify(applicantData));
    
    const response = await fetch(`${SUMSUB_BASE_URL}${url}`, {
      method,
      headers: getRequestHeaders(method, url, JSON.stringify(applicantData)),
      body: JSON.stringify(applicantData)
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('SumSub API error response:', responseData);
      throw new Error(`SumSub API error: ${responseData.description || response.statusText}`);
    }
    
    console.log('Applicant created successfully:', responseData.id);
    return responseData;
  } catch (error) {
    console.error('Error creating applicant:', error);
    throw error;
  }
}

// Get an existing applicant by ID
export async function getApplicant(applicantId: string) {
  if (!SUMSUB_APP_TOKEN || !SUMSUB_SECRET_KEY) {
    throw new Error('SumSub API credentials not configured');
  }
  
  const url = `/resources/applicants/${applicantId}`;
  const method = 'GET';
  
  try {
    const response = await fetch(`${SUMSUB_BASE_URL}${url}`, {
      method,
      headers: getRequestHeaders(method, url)
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('SumSub API error response:', responseData);
      throw new Error(`SumSub API error: ${responseData.description || response.statusText}`);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error getting applicant:', error);
    throw error;
  }
}

// Either create a new applicant or get an existing one
export async function getOrCreateApplicant(userId: string, userInfo: {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  accountType?: 'personal' | 'business';
}, levelName: string) {
  try {
    // First try to create a new applicant
    return await createApplicant(userId, userInfo, levelName);
  } catch (error: any) {
    // If error is "applicant already exists", get the existing applicant
    if (error.message && error.message.includes('already exists')) {
      // Extract the applicant ID from the error message
      const match = error.message.match(/already exists: ([a-f0-9]+)/);
      if (match && match[1]) {
        const applicantId = match[1];
        console.log(`Applicant already exists with ID: ${applicantId}`);
        
        // Return the existing applicant ID
        return { 
          id: applicantId,
          existing: true 
        };
      }
    }
    
    // For other errors, just rethrow
    throw error;
  }
}

// Generate an access token for the SumSub SDK
export async function generateAccessToken(applicantId: string, levelName: string) {
  if (!SUMSUB_APP_TOKEN || !SUMSUB_SECRET_KEY) {
    throw new Error('SumSub API credentials not configured');
  }
  
  const url = `/resources/accessTokens?userId=${applicantId}&levelName=${encodeURIComponent(levelName)}`;
  const method = 'POST';
  
  try {
    const response = await fetch(`${SUMSUB_BASE_URL}${url}`, {
      method,
      headers: getRequestHeaders(method, url)
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('SumSub API error response:', responseData);
      throw new Error(`SumSub API error: ${responseData.description || response.statusText}`);
    }
    
    return responseData.token;
  } catch (error) {
    console.error('Error generating access token:', error);
    throw error;
  }
}

// Verify a webhook signature
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  try {
    if (!SUMSUB_SECRET_KEY) {
      throw new Error('SumSub secret key not configured');
    }
    
    const computedSignature = crypto
      .createHmac('sha256', SUMSUB_SECRET_KEY)
      .update(payload)
      .digest('hex');
      
    return computedSignature === signature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}