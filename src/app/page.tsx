'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/providers/language-provider';
import { CIVIC_CATEGORIES } from '@/lib/constants/categories';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall, 
  FileText, 
  Send, 
  Clock, 
  CheckCircle,
  HelpCircle,
  Road,
  Droplets,
  Zap,
  Waves,
  Trash2,
  Lightbulb,
  Bus,
  HeartPulse,
  GraduationCap,
  ShieldAlert,
  Shield,
  TreePine,
  Database
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Road,
  Droplets,
  Zap,
  Waves,
  Trash2,
  Lightbulb,
  Bus,
  HeartPulse,
  GraduationCap,
  ShieldAlert,
  FileText,
  Shield,
  TreePine,
  HelpCircle,
};

export default function LandingPage() {
  const { t, isTamil } = useLanguage();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION WITH IMAGE */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-20 bg-gradient-to-b from-navy-100/70 via-white to-navy-50/50 border-b border-navy-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Col: Hero Text & Actions (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-navy-200/90 shadow-2xs text-xs font-semibold text-navy-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-tamil">
                  {isTamil ? 'தமிழ்நாடு அரசு & மக்கள் பிரதிநிதிகள் இணைப்பு தளம்' : 'Tamil Nadu Citizen Grievance Redressal Network'}
                </span>
              </div>

              {/* Main Headlines */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 font-tamil tracking-tight leading-tight">
                  {t.brand.tamilName}
                </h1>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-800 tracking-tight">
                  {t.hero.titlePrefix} <span className="text-emerald-700">{t.hero.titleHighlight}</span>
                </h2>
              </div>

              <p className="text-sm sm:text-base text-navy-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t.hero.subtitle}
              </p>

              {/* Hero Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link href="/raise-complaint" className="w-full sm:w-auto">
                  <Button variant="civic" size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-emerald-700/20 text-sm">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    {t.hero.raiseBtn}
                  </Button>
                </Link>

                <Link href="/track" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm font-semibold">
                    <Search className="w-4 h-4 mr-2 text-emerald-400" />
                    {t.hero.trackBtn}
                  </Button>
                </Link>

                <Link href="/representatives" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm font-semibold bg-white">
                    <Building2 className="w-4 h-4 mr-2 text-navy-600" />
                    {t.hero.dirBtn}
                  </Button>
                </Link>
              </div>

              {/* Emergency Helpline Disclaimer */}
              <div className="pt-2">
                <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5 max-w-xl mx-auto lg:mx-0">
                  <PhoneCall className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>{t.hero.emergencyDisclaimer}</span>
                </div>
              </div>

            </div>

            {/* Right Col: Featured Civic Card with Image (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
                
                {/* Decorative Glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-3xl blur-md opacity-30 animate-pulse" />
                
                {/* Image Container Card */}
                <div className="relative rounded-2xl bg-white p-3 shadow-2xl border border-navy-200 overflow-hidden">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-navy-950">
                    <Image
                      src="/images/hero-leader.png"
                      alt="Makkal Kural Civic Voice"
                      fill
                      priority
                      className="object-cover object-top"
                    />
                  </div>

                  {/* Caption & Trust Tag */}
                  <div className="p-3.5 space-y-1 text-center bg-white">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-navy-950 font-tamil">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{isTamil ? 'மக்களின் குரல் — நேர்மையான தீர்வு' : 'Makkal Kural — Direct Civic Voice'}</span>
                    </div>
                    <p className="text-[11px] text-navy-500">
                      {isTamil 
                        ? 'உங்கள் புகார். சரியான மக்கள் பிரதிநிதி. தெளிவான குரல்.' 
                        : 'Your complaint. The right representative. A clear voice.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. LIVE IMPACT METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-navy-200/80 p-6 text-center space-y-1 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-navy-950 font-mono">1,480+</div>
            <div className="text-xs font-semibold text-navy-600 font-tamil">{t.stats.complaintsSubmitted}</div>
          </Card>

          <Card className="border-navy-200/80 p-6 text-center space-y-1 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-mono">234</div>
            <div className="text-xs font-semibold text-navy-600 font-tamil">{t.stats.verifiedReps}</div>
          </Card>

          <Card className="border-navy-200/80 p-6 text-center space-y-1 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-navy-950 font-mono">38 / 38</div>
            <div className="text-xs font-semibold text-navy-600 font-tamil">{t.stats.districtsCovered}</div>
          </Card>

          <Card className="border-navy-200/80 p-6 text-center space-y-1 shadow-sm">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-mono">92.4%</div>
            <div className="text-xs font-semibold text-navy-600 font-tamil">{t.stats.resolutionRate}</div>
          </Card>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 font-tamil tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="text-xs sm:text-sm text-navy-600">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Card className="border-navy-200 p-6 space-y-3 relative shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-navy-950 text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-base text-navy-950 font-tamil">
              {t.howItWorks.step1Title}
            </h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              {t.howItWorks.step1Desc}
            </p>
          </Card>

          <Card className="border-navy-200 p-6 space-y-3 relative shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-navy-950 text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-base text-navy-950 font-tamil">
              {t.howItWorks.step2Title}
            </h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              {t.howItWorks.step2Desc}
            </p>
          </Card>

          <Card className="border-navy-200 p-6 space-y-3 relative shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-base text-navy-950 font-tamil">
              {t.howItWorks.step3Title}
            </h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              {t.howItWorks.step3Desc}
            </p>
          </Card>

          <Card className="border-navy-200 p-6 space-y-3 relative shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-navy-950 text-white flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="font-bold text-base text-navy-950 font-tamil">
              {t.howItWorks.step4Title}
            </h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              {t.howItWorks.step4Desc}
            </p>
          </Card>

        </div>
      </section>

      {/* 4. CIVIC CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 font-tamil tracking-tight">
              {t.categories.title}
            </h2>
            <p className="text-xs sm:text-sm text-navy-600 mt-1">
              {t.categories.subtitle}
            </p>
          </div>
          <Link href="/raise-complaint">
            <Button variant="ghost" size="sm" className="text-xs text-emerald-700 font-semibold">
              <span>{t.categories.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {CIVIC_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || HelpCircle;
            return (
              <Link key={cat.id} href={`/raise-complaint`} className="group">
                <Card className="h-full border-navy-200/90 hover:border-emerald-600 hover:shadow-md transition-all p-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-800 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-navy-950 font-tamil">
                        {isTamil ? cat.nameTa : cat.nameEn}
                      </h4>
                      <p className="text-[11px] text-navy-500 line-clamp-2 mt-1">
                        {isTamil ? cat.descriptionTa : cat.descriptionEn}
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 pt-3">
                    <span>{isTamil ? 'புகார் செய்ய' : 'File Issue'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. VERIFIED RESOLUTION SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge verification="VERIFIED" className="text-xs py-0.5">
            TRANSPARENT CIVIC ACCOUNTABILITY
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 font-tamil tracking-tight">
            {isTamil ? 'தீர்வு கண்ட சமீபத்திய புகார்கள்' : 'Recent Verified Grievance Resolutions'}
          </h2>
          <p className="text-xs sm:text-sm text-navy-600">
            {isTamil 
              ? 'அதிகாரப்பூர்வமாக நடவடிக்கை எடுக்கப்பட்ட சில மாதிரி பொதுப் புகார்கள்.' 
              : 'Real examples of community grievances resolved in coordination with local departments.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-navy-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                MK-2026-209144
              </span>
              <Badge status="RESOLVED">RESOLVED</Badge>
            </div>
            <h3 className="font-bold text-base text-navy-950">
              Drinking water pipeline burst near Gandhipuram bus stand
            </h3>
            <p className="text-xs text-navy-600">
              Coimbatore Municipal Corporation water engineering team replaced faulty valve and restored normal supply pressure within 36 hours.
            </p>
            <div className="pt-3 border-t border-navy-100 flex items-center justify-between text-xs text-navy-500">
              <span>Coimbatore North</span>
              <Link href="/track/MK-2026-209144" className="text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                <span>View Timeline</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>

          <Card className="border-navy-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                MK-2026-104829
              </span>
              <Badge status="IN_PROGRESS">IN_PROGRESS</Badge>
            </div>
            <h3 className="font-bold text-base text-navy-950">
              Pothole hazards on Anna Salai service road
            </h3>
            <p className="text-xs text-navy-600">
              Greater Chennai Corporation (Zone 9) executive engineer scheduled asphalt cold-mix patching repair works.
            </p>
            <div className="pt-3 border-t border-navy-100 flex items-center justify-between text-xs text-navy-500">
              <span>Thousand Lights, Chennai</span>
              <Link href="/track/MK-2026-104829" className="text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                <span>View Timeline</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-navy-950 text-white p-8 sm:p-12 text-center space-y-6 relative overflow-hidden border border-navy-900 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-bold font-tamil tracking-tight">
              {isTamil ? 'உங்கள் பகுதியின் பிரச்சனையை இன்றே பதிவிடுங்கள்' : 'Report a Civic Grievance in Your Area Today'}
            </h2>
            <p className="text-xs sm:text-sm text-navy-300">
              {isTamil
                ? 'உங்கள் புகார் சரிபார்க்கப்பட்ட அதிகாரிக்கு முறைப்படி அனுப்பப்பட்டு கண்காணிக்கப்படும்.'
                : 'Free, transparent, and directly routed to officially verified municipal and legislative contacts.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/raise-complaint">
              <Button variant="civic" size="lg" className="font-bold text-sm shadow-md shadow-emerald-600/30">
                <PlusCircle className="w-4 h-4 mr-2" />
                {t.hero.raiseBtn}
              </Button>
            </Link>
            <Link href="/track">
              <Button variant="outline" size="lg" className="text-sm font-semibold border-navy-700 text-white hover:bg-navy-900">
                <Search className="w-4 h-4 mr-2 text-emerald-400" />
                {t.hero.trackBtn}
              </Button>
            </Link>
            <Link href="/admin/database">
              <Button variant="secondary" size="lg" className="text-sm font-semibold bg-navy-800 text-white hover:bg-navy-700 border border-navy-700">
                <Database className="w-4 h-4 mr-2 text-emerald-400" />
                {isTamil ? 'டேட்டாபேஸ் பார்க்க' : 'View Database'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
