import { NextRequest, NextResponse } from 'next/server';
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
    
    // Verify signature
    if (!verifyWebhookSignature(bodyText, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }
    
    const body = JSON.parse(bodyText);
    console.log('Received webhook:', body);
    
    // Process the webhook
    const { type, applicantId, reviewStatus, reviewResult, errorCode } = body;
    
    // Find user by applicant ID
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('kyc_applicant_id', applicantId);
    
    if (!profiles || profiles.length === 0) {
      console.error('User not found for applicant ID:', applicantId);
      // Return 200 even if user not found to acknowledge receipt
      return NextResponse.json({ success: true });
    }
    
    const userId = profiles[0].id;
    
    // Handle different webhook types
    switch (type) {
      case 'applicantReviewed':
        if (reviewStatus === 'completed') {
          const isApproved = reviewResult?.reviewAnswer === 'GREEN';
          
          await supabase
            .from('profiles')
            .update({
              kyc_status: isApproved ? 'approved' : 'rejected',
              kyc_rejection_reason: isApproved ? null : (reviewResult?.moderationComment || 'Verification was not successful'),
              kyc_last_updated: new Date().toISOString()
            })
            .eq('id', userId);
        }
        break;
        
      case 'applicantPending':
        await supabase
          .from('profiles')
          .update({
            kyc_status: 'pending',
            kyc_last_updated: new Date().toISOString()
          })
          .eq('id', userId);
        break;
        
      case 'applicantCreated':
        // Just log this event
        console.log('Applicant created:', applicantId);
        break;
        
      case 'idDocReviewed':
        console.log('ID document reviewed for applicant:', applicantId);
        break;
        
      case 'applicantOnHold':
        await supabase
          .from('profiles')
          .update({
            kyc_status: 'on_hold',
            kyc_last_updated: new Date().toISOString(),
            kyc_rejection_reason: errorCode || 'Verification on hold'
          })
          .eq('id', userId);
        break;
        
      default:
        console.log('Unhandled webhook type:', type);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    // Return 200 even on error to acknowledge receipt
    return NextResponse.json({ success: true });
  }
}