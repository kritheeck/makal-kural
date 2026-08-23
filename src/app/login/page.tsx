'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/language-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInWithPassword, signUpWithPassword } from '@/lib/supabase/auth';

export default function LoginPage() {
  const router = useRouter();
  const { t, isTamil } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signInWithPassword(email, password);
    setLoading(false);
    if (error) {
      setError(isTamil ? 'உள்நுழைவு தோல்வி' : 'Login failed. Please check your credentials.');
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Card className="border-navy-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">{isTamil ? 'உள்நுழைவு' : 'Sign In'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
            <Button type="submit" variant="civic" className="w-full" isLoading={loading}>
              {isTamil ? 'உள்நுழைக' : 'Sign In'}
            </Button>
            <p className="text-xs text-navy-600 text-center">
              {isTamil ? 'கணக்கில்லை?' : 'No account?'}{' '}
              <a href="/register" className="text-emerald-700 font-semibold underline">
                {isTamil ? 'பதிவு செய்யவும்' : 'Register'}
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
