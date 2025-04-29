import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Environment variables
const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN || '';
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY || '';
const SUMSUB_BASE_URL = 'https://api.sumsub.com';

// Helper function to generate SumSub API request headers with signature
function getRequestHeaders(method: string, url: string, body?: string): Record<string, string> {
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

// Generate an access token for the SumSub SDK
async function generateAccessToken(applicantId: string, levelName: string) {
  if (!SUMSUB_APP_TOKEN || !SUMSUB_SECRET_KEY) {
    throw new Error('SumSub API credentials not configured');
  }
  
  const url = `/resources/accessTokens?userId=${applicantId}&levelName=${encodeURIComponent(levelName)}`;
  const method = 'POST';
  
  try {
    console.log('Generating access token for applicant:', applicantId);
    console.log('Request URL:', `${SUMSUB_BASE_URL}${url}`);
    
    const response = await fetch(`${SUMSUB_BASE_URL}${url}`, {
      method,
      headers: getRequestHeaders(method, url)
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('SumSub API error response:', responseData);
      throw new Error(`SumSub API error: ${responseData.description || response.statusText}`);
    }
    
    console.log('Access token generated successfully');
    return responseData.token;
  } catch (error) {
    console.error('Error generating access token:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received access token request:", body);
    
    const { applicantId, levelName } = body;
    
    if (!applicantId) {
      return NextResponse.json({ error: 'Applicant ID is required' }, { status: 400 });
    }
    
    // Generate access token for SumSub SDK
    const accessToken = await generateAccessToken(
      applicantId, 
      levelName || 'id-and-liveness' // Default to your valid level name
    );
    
    return NextResponse.json({ token: accessToken });
  } catch (error: any) {
    console.error('Error generating access token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate token' }, 
      { status: 500 }
    );
  }
}