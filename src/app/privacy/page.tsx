'use client';

import React from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
  const { isTamil } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      <div className="space-y-3 pb-6 border-b border-navy-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          {isTamil ? 'குடிமக்கள் தனியுரிமைக் கொள்கை' : 'Citizen Privacy Charter'}
        </div>
        <h1 className="text-3xl font-bold text-navy-950 font-tamil tracking-tight">
          {isTamil ? 'தனியுரிமைக் கொள்கை & தரவு பாதுகாப்பு' : 'Privacy Policy & Public Transparency'}
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Last Updated: August 2026 &bull; Makkal Kural Civic Platform
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-navy-800 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy-950">1. Core Civic Purpose</h2>
          <p className="text-xs text-navy-700">
            Makkal Kural (மக்கள் குரல்) is an independent, politically neutral civic-tech platform created to facilitate direct, accountable grievance redressal between citizens of Tamil Nadu and verified public representatives and municipal authorities. We do not sell data, engage in profiling, or distribute citizen information for commercial or partisan campaign purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy-950">2. Information We Collect</h2>
          <p className="text-xs text-navy-700">
            When you raise a grievance, we collect:
          </p>
          <ul className="list-disc pl-5 text-xs text-navy-700 space-y-1">
            <li><strong>Grievance Details:</strong> Category, description, locality/street landmark, timeline, and optional photographic evidence.</li>
            <li><strong>Submitter Contact Details:</strong> Name, mobile phone number, email address, and language preference. (Exact private house numbers are not required).</li>
            <li><strong>Technical Telemetry:</strong> Optional browser-provided GPS coordinates (only when explicitly requested) and reference tracking logs.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy-950">3. How Your Contact Information Is Used</h2>
          <p className="text-xs text-navy-700">
            Your contact details are shared <strong>strictly with the verified municipal department, MLA office, or public authority</strong> assigned to investigate your complaint so that they can contact you for on-site inspection, verification, or resolution confirmation.
          </p>
        </section>

        <section className="space-y-2 p-5 bg-navy-50 rounded-2xl border border-navy-200">
          <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>4. Public Tracking Portal Privacy Masking</span>
          </h2>
          <p className="text-xs text-navy-700">
            On the public tracking portal (accessible via reference number), submitter personal identifiable information is automatically masked:
          </p>
          <div className="font-mono text-xs text-navy-900 bg-white p-3 rounded-lg border border-navy-200 space-y-1 mt-2">
            <div>Name: S*** R***</div>
            <div>Email: s***@gmail.com</div>
            <div>Phone: ******4589</div>
            <div>Locality: Street Name, Ward Area (No private house door numbers)</div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-navy-950">5. Recipient Verification & Official Sourcing</h2>
          <p className="text-xs text-navy-700">
            All public representative contact emails, phone numbers, and X accounts listed on Makkal Kural are cross-referenced with publicly available government gazettes, district collectorate web directories (.tn.gov.in, .nic.in, .gov.in), and municipal corporation portals.
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
