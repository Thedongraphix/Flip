import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateApplicant } from '@/utils/sumsub';

export async function POST(req: NextRequest) {
  try {
    // Check environment variables
    console.log('Environment variables check:');
    console.log('SUMSUB_APP_TOKEN exists:', !!process.env.SUMSUB_APP_TOKEN);
    console.log('SUMSUB_SECRET_KEY exists:', !!process.env.SUMSUB_SECRET_KEY);
    
    // Parse request body
    const body = await req.json();
    console.log("Received request body:", body);
    
    const { userId, userInfo, levelName } = body;
    
    // Validate required fields
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    if (!userInfo) {
      return NextResponse.json({ error: 'User info is required' }, { status: 400 });
    }
    
    if (!levelName) {
      return NextResponse.json({ error: 'Level name is required' }, { status: 400 });
    }
    
    // Get or create the applicant
    const applicant = await getOrCreateApplicant(userId, userInfo, levelName);
    
    return NextResponse.json({ applicant });
  } catch (error: any) {
    console.error('Error creating SumSub applicant:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create applicant' }, 
      { status: 500 }
    );
  }
}