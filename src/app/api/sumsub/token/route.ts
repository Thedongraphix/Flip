import { NextRequest, NextResponse } from 'next/server';
import { generateAccessToken } from '@/utils/sumsub';

export async function POST(req: NextRequest) {
  try {
    const { applicantId, levelName } = await req.json();
    
    if (!applicantId) {
      return NextResponse.json({ error: 'Applicant ID is required' }, { status: 400 });
    }
    
    const token = await generateAccessToken(applicantId, levelName);
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating SumSub token:', error);
    return NextResponse.json(
      { error: 'Failed to generate access token' }, 
      { status: 500 }
    );
  }
}
