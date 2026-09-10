'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/language-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const router = useRouter();
  const { t, isTamil } = useLanguage();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password, name);
      setLoading(false);
      router.push('/dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || (isTamil ? 'பதிவு தோல்வி' : 'Registration failed. Please try again.'));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Card className="border-navy-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">{isTamil ? 'பதிவு செய்யவும்' : 'Create Account'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
            <Button type="submit" variant="civic" className="w-full" isLoading={loading}>
              {isTamil ? 'பதிவு செய்யவும்' : 'Register'}
            </Button>
            <p className="text-xs text-navy-600 text-center">
              {isTamil ? 'ஏற்கனவு கணக்கு?' : 'Already have an account?'}{' '}
              <a href="/login" className="text-emerald-700 font-semibold underline">
                {isTamil ? 'உள்நுழைக' : 'Sign In'}
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
