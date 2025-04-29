// src/app/api/sumsub/levels/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN || '';
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY || '';
const SUMSUB_BASE_URL = 'https://api.sumsub.com';

function getRequestHeaders(method: string, url: string): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const data = timestamp + method + url;
  const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY).update(data).digest('hex');
  
  return {
    'X-App-Token': SUMSUB_APP_TOKEN,
    'X-App-Access-Sig': signature,
    'X-App-Access-Ts': timestamp,
    'Accept': 'application/json',
  };
}

export async function GET() {
  try {
    const url = '/resources/levels';
    const method = 'GET';
    
    const response = await fetch(`${SUMSUB_BASE_URL}${url}`, {
      method,
      headers: getRequestHeaders(method, url)
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}