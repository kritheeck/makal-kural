'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/language-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { t, isTamil } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, 'USER');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-navy-950 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-navy-950 font-tamil">
            {isTamil ? 'குடிமக்கள் புதிய பதிவு' : 'Create Citizen Account'}
          </h1>
          <p className="text-xs text-navy-600">
            {isTamil 
              ? 'உங்கள் அனைத்து பொது புகார்களையும் ஒரே இடத்தில் கண்காணிக்கவும்.' 
              : 'Track all your civic submissions in one unified portal.'}
          </p>
        </div>

        <Card className="shadow-lg border-navy-200/90">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  label={isTamil ? 'முழு பெயர்' : 'Full Name'}
                  placeholder="e.g. Anbarasan K"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  type="email"
                  label={isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                  placeholder="citizen@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  label={isTamil ? 'கடவுச்சொல்' : 'Create Password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="civic" className="w-full h-11 font-semibold text-xs mt-2">
                <UserPlus className="w-4 h-4 mr-1.5" />
                {t.nav.register}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-navy-100 text-center text-xs text-navy-500">
              <p>
                {isTamil ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?'}{' '}
                <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
                  {t.nav.login}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
