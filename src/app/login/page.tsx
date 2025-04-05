'use client';

import React from 'react';
import Form from '@/components/auth/Form';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-hero-background flex flex-col">
      <div className="py-8 px-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <Image 
            src="/images/logos/flip logo.png" 
            alt="Flip Logo" 
            width={40} 
            height={40}
            className="w-8 h-8 object-contain"
            priority
          />
          <span className="space-grotesk text-lg font-semibold">Flip</span>
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md px-4">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome back!</h1>
          <Form isSignIn={true} />
        </div>
      </div>
    </div>
  );
} 