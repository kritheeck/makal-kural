'use client';

import React from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  const { isTamil } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div className="space-y-3 pb-6 border-b border-navy-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-100 text-navy-800 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-navy-700" />
          {isTamil ? 'பயன்பாட்டு விதிமுறைகள்' : 'Terms of Civic Use'}
        </div>
        <h1 className="text-3xl font-bold text-navy-950 font-tamil tracking-tight">
          {isTamil ? 'பயன்பாட்டு விதிமுறைகள் & வழிகாட்டுதல்கள்' : 'Civic Usage Guidelines & Terms of Service'}
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Makkal Kural (மக்கள் குரல்) &bull; Politically Neutral Public Grievance Network
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-navy-800 space-y-6 leading-relaxed text-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-950">1. Truthful Submissions & Non-Abuse Policy</h2>
          <p>
            Citizens using Makkal Kural agree to submit factual, genuine civic issues. Submitting intentionally fabricated grievances, defamatory accusations, or abusive content is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-950">2. Emergency Disclaimer</h2>
          <p>
            Makkal Kural is a civic grievance routing platform for municipal and departmental issues (roads, water, electricity, sanitation). For immediate life-threatening emergencies (crime, medical emergencies, active fires), citizens must immediately call official helplines (112, 100, 108).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-950">3. Non-Partisan & Independent Operation</h2>
          <p>
            This platform operates independently and neutrally. We do not endorse any political party, campaign, or candidate. All routing is conducted based on official geographic and municipal jurisdictions.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-navy-200">
        <Link href="/">
          <Button variant="outline" size="sm">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
