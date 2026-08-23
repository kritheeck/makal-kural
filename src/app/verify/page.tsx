'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { verifyEmailToken } from '@/lib/supabase/verification';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token.');
        return;
      }
      const result = await verifyEmailToken(token);
      if (!cancelled) {
        setStatus(result.success ? 'success' : 'error');
        setMessage(result.success ? 'Email verified successfully.' : 'Invalid or expired verification token.');
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="mx-auto w-12 h-12 rounded-full bg-navy-50 border border-navy-200 flex items-center justify-center">
        {status === 'loading' && <Loader2 className="w-6 h-6 text-navy-600 animate-spin" />}
        {status === 'success' && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
        {status === 'error' && <XCircle className="w-6 h-6 text-red-600" />}
      </div>
      <h1 className="text-2xl font-bold text-navy-950">Email Verification</h1>
      <p className="text-sm text-navy-600">{message}</p>
      <div className="flex justify-center gap-3">
        <Button variant="civic" onClick={() => (window.location.href = '/track')}>
          Track Complaint
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = '/')}>
          Go Home
        </Button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-4 py-16 text-center text-sm text-navy-600">Loading verification...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
