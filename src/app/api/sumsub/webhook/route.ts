import { NextRequest, NextResponse } from 'next/server';
import { generateAccessToken } from '@/utils/sumsub';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature } from '@/utils/sumsub';


// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    // Get the webhook signature and body
    const signature = req.headers.get('x-payload-digest') || '';
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);
    
    console.log('Received webhook:', body);
    
    // Verify signature
    if (!verifyWebhookSignature(bodyText, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }
    
    // Process the webhook
    await processWebhook(body);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to process webhooks by type
async function processWebhook(data: any) {
  const { type, applicantId, reviewStatus, reviewResult } = data;
  
  // Find user by applicant ID
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('kyc_applicant_id', applicantId);
  
  if (!profiles || profiles.length === 0) {
    console.error('User not found for applicant ID:', applicantId);
    throw new Error('User not found');
  }
  
  const userId = profiles[0].id;
  
  // Handle different webhook types
  switch (type) {
    case 'applicantReviewed':
      await handleApplicantReviewed(userId, reviewStatus, reviewResult);
      break;
      
    case 'applicantPending':
      await updateKycStatus(userId, 'pending');
      break;
      
    default:
      console.log('Unhandled webhook type:', type);
  }
}

// Handle applicant reviewed events
async function handleApplicantReviewed(userId: string, reviewStatus: string, reviewResult: any) {
  if (reviewStatus === 'completed') {
    const isApproved = reviewResult?.reviewAnswer === 'GREEN';
    
    await updateKycStatus(
      userId, 
      isApproved ? 'approved' : 'rejected',
      isApproved ? null : (reviewResult?.moderationComment || 'Verification was not successful')
    );
  }
}

// Update KYC status in database
async function updateKycStatus(userId: string, status: string, rejectionReason: string | null = null) {
  const updates: any = {
    kyc_status: status,
    kyc_last_updated: new Date().toISOString()
  };
  
  if (rejectionReason !== undefined) {
    updates.kyc_rejection_reason = rejectionReason;
  }
  
  await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
}