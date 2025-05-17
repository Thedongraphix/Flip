// src/app/api/sumsub/applicant/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createApplicant, getOrCreateApplicant } from '@/utils/sumsub';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    // Verify environment variables are set
    if (!process.env.SUMSUB_APP_TOKEN || !process.env.SUMSUB_SECRET_KEY) {
      console.error('Missing Sumsub API credentials');
      return NextResponse.json({ 
        error: 'API configuration missing' 
      }, { status: 500 });
    }
    
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ 
        error: 'Invalid JSON in request body' 
      }, { status: 400 });
    }
    
    console.log("Received request body:", body);
    
    const { userId, userInfo, levelName = 'id-and-liveness' } = body;
    
    // Validate required fields
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
      
    if (!userInfo) {
      return NextResponse.json({ error: 'User info is required' }, { status: 400 });
    }
     
    // Validate minimum required user info
    if (!userInfo.firstName || !userInfo.lastName) {
      return NextResponse.json({ 
        error: 'First name and last name are required' 
      }, { status: 400 });
    }
    
    // Get or create the applicant
    const applicant = await getOrCreateApplicant(userId, {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email || '',
      phone: userInfo.phone || '',
      accountType: userInfo.accountType || 'personal'
    }, levelName);
    
    // Update user profile if we have authentication (optional)
    try {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        
        if (!authError && user) {
          await supabase
            .from('profiles')
            .update({
              kyc_status: 'pending',
              kyc_applicant_id: applicant.id,
              kyc_last_updated: new Date().toISOString()
            })
            .eq('id', user.id);
        }
      }
    } catch (profileError) {
      console.error('Error updating profile (non-fatal):', profileError);
      // Continue without failing - this is just a bonus step
    }
    
    return NextResponse.json({ applicant });
  } catch (error: any) {
    console.error('Error creating SumSub applicant:', error);
    
    // Handle specific SumSub errors
    if (error.message && error.message.includes('already exists')) {
      return NextResponse.json({
        error: 'Applicant already exists',
        details: error.message
      }, { status: 409 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create applicant' }, 
      { status: 500 }
    );
  }
}