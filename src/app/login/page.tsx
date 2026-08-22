'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/language-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const { t, isTamil } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, role);
    if (role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-navy-950 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-navy-950 font-tamil">
            {isTamil ? 'குடிமக்கள் உள்நுழைவு' : 'Sign in to Makkal Kural'}
          </h1>
          <p className="text-xs text-navy-600">
            {isTamil 
              ? 'உங்கள் புகார்களை நிர்வகிக்கவும், புதிய மனுக்களை பதிவு செய்யவும்.' 
              : 'Manage submitted grievances and access your citizen portal.'}
          </p>
        </div>

        <Card className="shadow-lg border-navy-200/90">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Role Toggle for Quick Demo / Admin Access */}
              <div className="flex rounded-lg border border-navy-200 p-1 bg-navy-50">
                <button
                  type="button"
                  onClick={() => setRole('USER')}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    role === 'USER' ? 'bg-white text-navy-950 shadow-xs' : 'text-navy-500 hover:text-navy-800'
                  }`}
                >
                  {isTamil ? 'குடிமகன் (Citizen)' : 'Citizen Login'}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    role === 'ADMIN' ? 'bg-navy-950 text-white shadow-xs' : 'text-navy-500 hover:text-navy-800'
                  }`}
                >
                  {isTamil ? 'நிர்வாகி (Admin)' : 'Admin Console'}
                </button>
              </div>

              <div>
                <Input
                  type="email"
                  label={isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                  placeholder={role === 'ADMIN' ? 'admin@makkalkural.gov.in' : 'citizen@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  label={isTamil ? 'கடவுச்சொல்' : 'Password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" variant="primary" className="w-full h-11 font-semibold text-xs mt-2">
                <UserCheck className="w-4 h-4 mr-1.5" />
                {role === 'ADMIN' ? 'Enter Admin Console' : t.nav.login}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-navy-100 text-center text-xs text-navy-500 space-y-2">
              <p>
                {isTamil ? 'புதிய கணக்கு துவங்க வேண்டுமா?' : "Don't have an account yet?"}{' '}
                <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
                  {t.nav.register}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
