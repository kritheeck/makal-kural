'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { ShieldCheck, PhoneCall, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-950 text-white border-t border-navy-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Neutrality Statement */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight font-tamil">
                {t.brand.tamilName}
              </span>
            </div>
            <p className="text-xs text-navy-400 leading-relaxed">
              {t.brand.shortDesc}
            </p>
            <div className="p-3 bg-navy-900/80 rounded-lg border border-navy-800 text-[11px] text-navy-300">
              <span className="font-semibold text-emerald-400 block mb-1">
                {t.footer.neutralityTitle}
              </span>
              {t.footer.neutralityDesc}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-300">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-navy-400">
              <li>
                <Link href="/raise-complaint" className="hover:text-emerald-400 transition-colors">
                  {t.nav.raiseComplaint}
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-emerald-400 transition-colors">
                  {t.nav.track}
                </Link>
              </li>
              <li>
                <Link href="/representatives" className="hover:text-emerald-400 transition-colors">
                  {t.nav.representatives}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  {t.nav.dashboard}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors">
                  {t.nav.admin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-300">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-xs text-navy-400">
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <a
                  href="https://tnega.tn.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                >
                  <span>TNeGA Portal</span>
                  <ExternalLink className="w-3 h-3 text-navy-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://cmhelpline.tnega.org"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                >
                  <span>CM Helpline (1100)</span>
                  <ExternalLink className="w-3 h-3 text-navy-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency & Helplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-navy-300 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              {t.footer.helpline}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-navy-900 border border-navy-800">
                <span className="text-red-400 font-bold block">{t.footer.emergency}</span>
                <span className="text-navy-400 text-[11px]">All Emergency Services (Fire, Ambulance, Police)</span>
              </div>
              <div className="p-2.5 rounded bg-navy-900 border border-navy-800">
                <span className="text-emerald-400 font-bold block">{t.footer.cmHelpline}</span>
                <span className="text-navy-400 text-[11px]">Tamil Nadu Government Grievance Redressal</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-navy-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-navy-500 gap-4">
          <p>© {new Date().getFullYear()} Makkal Kural (மக்கள் குரல்). {t.footer.rights}</p>
          <div className="flex items-center gap-1">
            <span>Built for public civic good</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
