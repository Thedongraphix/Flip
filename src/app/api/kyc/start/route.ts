// src/app/api/kyc/start/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createApplicant } from '@/utils/sumsub';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    // Get user session
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, kyc_status, email, phone')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    
    // Check if verification is already in progress or completed
    if (profile.kyc_status === 'pending' || profile.kyc_status === 'approved') {
      return NextResponse.json(
        { error: 'Verification already in progress or completed' }, 
        { status: 400 }
      );
    }
    
    // Create SumSub applicant
    const externalUserId = `user-${user.id}-${Date.now()}`;
    const applicant = await createApplicant(
      externalUserId,
      {
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || user.email,
        phone: profile.phone || '',
        accountType: 'personal'
      },
      'id-and-liveness' // Your verified level name
    );
    
    // Update user profile with applicant ID
    await supabase
      .from('profiles')
      .update({
        kyc_status: 'pending',
        kyc_applicant_id: applicant.id,
        kyc_last_updated: new Date().toISOString()
      })
      .eq('id', user.id);
    
    return NextResponse.json({ 
      success: true,
      applicantId: applicant.id
    });
  } catch (error: any) {
    console.error('Error starting verification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to start verification' }, 
      { status: 500 }
    );
  }
}