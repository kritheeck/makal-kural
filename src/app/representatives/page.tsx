'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { Representative } from '@/types/database';
import { TAMIL_NADU_DISTRICTS } from '@/lib/constants/locations';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Search, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  PlusCircle,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function RepresentativesDirectoryPage() {
  const { t, isTamil, language } = useLanguage();
  const [reps, setReps] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');

  useEffect(() => {
    async function loadReps() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (districtFilter !== 'all') query.set('district', districtFilter);
        if (verificationFilter !== 'all') query.set('verification', verificationFilter);
        if (search) query.set('search', search);

        const res = await fetch(`/api/representatives?${query.toString()}`);
        const json = await res.json();
        if (res.ok && json.success) {
          setReps(json.data);
        }
      } catch {
        // error handling
      } finally {
        setLoading(false);
      }
    }
    loadReps();
  }, [districtFilter, verificationFilter, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-navy-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {isTamil ? 'அதிகாரப்பூர்வ மக்கள் பிரதிநிதிகள் பட்டியல்' : 'Verified Public Directory'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-950 font-tamil tracking-tight">
            {isTamil ? 'சரிபார்க்கப்பட்ட அரசு அதிகாரிகள் & மக்கள் பிரதிநிதிகள்' : 'Public Representatives & Departmental Offices'}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 mt-1 max-w-2xl">
            {isTamil
              ? 'தமிழ்நாடு முழுவதும் உள்ள மாநகராட்சி, நகராட்சி, மின்வாரியம் மற்றும் மாவட்ட நிர்வாகத்தின் சரிபார்க்கப்பட்ட தொடர்பு விவரங்கள்.'
              : 'Public directory of municipal commissioners, TANGEDCO, CMWSSB, and district administrations with official verification source links.'}
          </p>
        </div>

        <Link href="/raise-complaint">
          <Button variant="civic" className="font-semibold shadow-sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            {t.nav.raiseComplaint}
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <Card className="border-navy-200 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-navy-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder={isTamil ? 'அதிகாரி அல்லது துறை பெயர் தேடுக...' : 'Search officer, department, or area...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full pl-9 pr-3 rounded-lg border border-navy-300 bg-white text-xs text-navy-950 shadow-xs focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>

            {/* District Filter */}
            <Select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="h-11 text-xs"
            >
              <option value="all">{isTamil ? 'அனைத்து மாவட்டங்கள் (All Districts)' : 'All Districts'}</option>
              {TAMIL_NADU_DISTRICTS.map((d) => (
                <option key={d.id} value={d.nameEn}>
                  {isTamil ? `${d.nameTa} (${d.nameEn})` : d.nameEn}
                </option>
              ))}
            </Select>

            {/* Verification Filter */}
            <Select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="h-11 text-xs"
            >
              <option value="all">{isTamil ? 'அனைத்து நிலைகள் (All Status)' : 'All Verification States'}</option>
              <option value="VERIFIED">{isTamil ? 'சரிபார்க்கப்பட்டவை (VERIFIED)' : 'Verified Only'}</option>
              <option value="NEEDS_REVIEW">{isTamil ? 'பரிசீலனையில் உள்ளவை (NEEDS_REVIEW)' : 'Needs Review'}</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Directory Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-navy-500">
            {isTamil ? 'அதிகாரிகள் விபரம் ஏற்றப்படுகிறது...' : 'Loading representative directory...'}
          </p>
        </div>
      ) : reps.length === 0 ? (
        <div className="py-16 text-center space-y-2 bg-navy-50 rounded-2xl border border-navy-200">
          <Building2 className="w-10 h-10 text-navy-400 mx-auto" />
          <h3 className="text-base font-semibold text-navy-900 font-tamil">
            {isTamil ? 'அதிகாரிகள் எதுவும் கிடைக்கவில்லை' : 'No Representatives Matched'}
          </h3>
          <p className="text-xs text-navy-500">
            {isTamil ? 'வேறு மாவட்டத்தை அல்லது தேடல் வார்த்தையை மாற்றிப் பார்க்கவும்.' : 'Try adjusting your district or search keyword.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reps.map((rep) => (
            <Card key={rep.id} className="border-navy-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                
                {/* Header & Verification Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center text-navy-800 flex-shrink-0">
                    <Building2 className="w-5 h-5 text-emerald-700" />
                  </div>
                  <Badge verification={rep.verification_status} className="text-[11px] py-0.5">
                    {rep.verification_status}
                  </Badge>
                </div>

                {/* Name & Role */}
                <div>
                  <h3 className="font-bold text-base text-navy-950 line-clamp-1">
                    {rep.name}
                  </h3>
                  <p className="text-xs text-navy-600 font-medium mt-0.5">
                    {rep.role}
                  </p>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                    {rep.organization}
                  </p>
                </div>

                {/* Specialty & Jurisdiction */}
                <div className="space-y-1.5 text-xs text-navy-600 pt-2 border-t border-navy-100">
                  <div>
                    <span className="font-semibold text-navy-800">{isTamil ? 'மாவட்டம்:' : 'District:'} </span>
                    <span>{rep.district} {rep.constituency ? `(${rep.constituency})` : ''}</span>
                  </div>
                  {rep.category_specialty && (
                    <div>
                      <span className="font-semibold text-navy-800">{isTamil ? 'துறை நிபுணத்துவம்:' : 'Domain:'} </span>
                      <span>{rep.category_specialty}</span>
                    </div>
                  )}
                  <div className="truncate font-mono text-navy-700 flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3 text-navy-400" />
                    <span>{rep.email}</span>
                  </div>
                </div>

                {/* Verification Source Link */}
                <div className="pt-3 border-t border-navy-100 flex items-center justify-between text-[11px]">
                  <a
                    href={rep.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline flex items-center gap-1 font-medium truncate max-w-[200px]"
                  >
                    <span>{isTamil ? 'அரசு இணையதள சான்று' : 'Verified Source URL'}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                  {rep.last_verified_at && (
                    <span className="text-navy-400">
                      {formatDate(rep.last_verified_at, language).split(',')[0]}
                    </span>
                  )}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
