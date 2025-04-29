import { NextRequest, NextResponse } from 'next/server';
import { getApplicant } from '@/utils/sumsub';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const applicantId = searchParams.get('applicantId');
    
    if (!applicantId) {
      return NextResponse.json({ error: 'Applicant ID is required' }, { status: 400 });
    }
    
    const applicant = await getApplicant(applicantId);
    
    return NextResponse.json({ applicant });
  } catch (error) {
    console.error('Error getting applicant status:', error);
    return NextResponse.json(
      { error: 'Failed to get applicant status' }, 
      { status: 500 }
    );
  }
}