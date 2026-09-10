'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/language-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShieldCheck, FileSearch, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TrackSearchPage() {
  const { t, isTamil } = useLanguage();
  const router = useRouter();
  const [reference, setReference] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) {
      setError(isTamil ? 'புகார் குறிப்பு எண்ணை உள்ளிடவும்' : 'Please enter reference number');
      return;
    }
    const cleanRef = reference.trim().toUpperCase();
    router.push(`/track/${cleanRef}`);
  };

  const sampleRefs = ['MK-2026-104829', 'MK-2026-209144', 'MK-2026-319082'];

  const [userComplaints, setUserComplaints] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mk_user_complaints');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setUserComplaints(parsed.slice(0, 5));
      }
    } catch {}
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          {isTamil ? 'பொது கண்காணிப்பு தளம்' : 'Official Public Tracking'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-950 font-tamil tracking-tight">
          {t.tracking.title}
        </h1>
        <p className="text-sm text-navy-600 max-w-xl mx-auto">
          {t.tracking.subtitle}
        </p>
      </div>

      <Card className="max-w-2xl mx-auto shadow-lg border-navy-200/90 overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
                {isTamil ? 'புகார் குறிப்பு எண்' : 'Complaint Reference Number'}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. MK-2026-104829"
                  value={reference}
                  onChange={(e) => {
                    setReference(e.target.value);
                    setError(null);
                  }}
                  className="flex h-12 flex-1 rounded-lg border border-navy-300 bg-white px-4 text-base font-mono uppercase tracking-wider text-navy-950 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
                <Button type="submit" variant="civic" className="h-12 px-6 font-semibold">
                  <Search className="w-4 h-4 mr-1.5" />
                  {t.tracking.searchBtn}
                </Button>
              </div>
              {error && <p className="text-xs text-red-600 font-medium mt-1.5">{error}</p>}
            </div>
          </form>

          {/* User's recently submitted complaints */}
          {userComplaints.length > 0 && (
            <div className="mt-8 pt-6 border-t border-navy-100">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {isTamil ? 'நீங்கள் பதிவு செய்த சமீபத்திய புகார்கள்:' : 'Your Recently Submitted Grievances:'}
              </div>
              <div className="space-y-2">
                {userComplaints.map((c) => (
                  <button
                    key={c.id || c.reference_number}
                    type="button"
                    onClick={() => router.push(`/track/${c.reference_number}`)}
                    className="w-full text-left p-3 rounded-xl border border-navy-200 bg-white hover:bg-emerald-50/50 hover:border-emerald-300 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-navy-950">
                          {c.reference_number}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-navy-600 truncate mt-0.5">
                        {c.title}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-navy-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sample quick links */}
          <div className="mt-8 pt-6 border-t border-navy-100">
            <div className="text-xs font-semibold uppercase tracking-wider text-navy-500 mb-2">
              {isTamil ? 'மாதிரி புகார்களை காண கிளிக் செய்க:' : 'Demo / Sample Tracking References:'}
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleRefs.map((ref) => (
                <button
                  key={ref}
                  type="button"
                  onClick={() => router.push(`/track/${ref}`)}
                  className="px-3 py-1.5 rounded-lg border border-navy-200 bg-navy-50 hover:bg-navy-100 text-xs font-mono font-medium text-navy-800 transition-colors flex items-center gap-1.5"
                >
                  <FileSearch className="w-3 h-3 text-emerald-600" />
                  <span>{ref}</span>
                  <ArrowRight className="w-3 h-3 text-navy-400" />
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
