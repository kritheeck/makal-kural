'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Complaint, DeliveryLog } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
  import { 
    FileText, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    PlusCircle, 
    Search, 
    ArrowRight,
    Printer,
    Share2,
    Building2,
    Crown
  } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function CitizenDashboardPage() {
  const { t, isTamil, language } = useLanguage();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadUserComplaints() {
      setLoading(true);
      try {
        const res = await fetch('/api/complaints');
        const json = await res.json();
        if (res.ok && json.success) {
          setComplaints(json.data);
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    loadUserComplaints();
  }, []);

  const total = complaints.length;
  const inProgress = complaints.filter(c => ['IN_PROGRESS', 'ACKNOWLEDGED'].includes(c.status)).length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
  const submitted = complaints.filter(c => ['SUBMITTED', 'EMAIL_SENT', 'EMAIL_QUEUED'].includes(c.status)).length;

  const filtered = statusFilter === 'all'
    ? complaints
    : complaints.filter(c => c.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-950 font-tamil tracking-tight">
            {isTamil ? 'குடிமக்கள் புகார் தளம்' : 'Citizen Grievance Portal'}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 mt-1">
            {user ? `Logged in as ${user.email}` : (isTamil ? 'உங்கள் அனைத்து புகார்களின் தற்போதைய தீர்வு நிலை.' : 'Overview of all your registered grievances and their live status.')}
          </p>
        </div>

        <Link href="/raise-complaint">
          <Button variant="civic" className="font-semibold shadow-sm">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            {t.nav.raiseComplaint}
          </Button>
        </Link>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-navy-200/80 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-navy-500 block">
            {isTamil ? 'மொத்த புகார்கள்' : 'Total Complaints'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-navy-950">{total}</div>
        </Card>

        <Card className="border-navy-200/80 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 block">
            {isTamil ? 'பதிவு செய்யப்பட்டவை' : 'Submitted'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-700">{submitted}</div>
        </Card>

        <Card className="border-navy-200/80 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 block">
            {isTamil ? 'நடவடிக்கையில்' : 'In Progress'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-blue-700">{inProgress}</div>
        </Card>

        <Card className="border-navy-200/80 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block">
            {isTamil ? 'தீர்க்கப்பட்டவை' : 'Resolved'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700">{resolved}</div>
        </Card>
      </div>

      {/* Filter Tabs & Complaint Cards */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 pb-2 border-b border-navy-200">
          {[
            { key: 'all', label: isTamil ? 'அனைத்தும்' : 'All Complaints' },
            { key: 'SUBMITTED', label: isTamil ? 'பதிவானவை' : 'Submitted' },
            { key: 'IN_PROGRESS', label: isTamil ? 'நடவடிக்கையில்' : 'In Progress' },
            { key: 'RESOLVED', label: isTamil ? 'தீர்க்கப்பட்டவை' : 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab.key
                  ? 'bg-navy-950 text-white'
                  : 'text-navy-600 hover:bg-navy-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-navy-500">
            {isTamil ? 'புகார்கள் பெறப்படுகின்றன...' : 'Loading grievance submissions...'}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center bg-navy-50 rounded-2xl border border-navy-200 space-y-3">
            <FileText className="w-10 h-10 text-navy-400 mx-auto" />
            <h3 className="text-sm font-semibold text-navy-900 font-tamil">
              {isTamil ? 'எந்த புகாரும் இல்லை' : 'No Complaints in this view'}
            </h3>
            <Link href="/raise-complaint">
              <Button variant="outline" size="sm" className="text-xs mt-2">
                <PlusCircle className="w-3.5 h-3.5 mr-1" />
                {t.nav.raiseComplaint}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <Card key={c.id} className="border-navy-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-navy-800 bg-navy-100 px-2 py-0.5 rounded">
                      {c.reference_number}
                    </span>
                    <Badge status={c.status} className="text-[11px]">
                      {c.status}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 block">
                      {c.category.toUpperCase()} &rsaquo; {c.subcategory}
                    </span>
                    <h3 className="font-bold text-sm text-navy-950 line-clamp-2 mt-1">
                      {c.ai_improved_title || c.title}
                    </h3>
                  </div>

                  <p className="text-xs text-navy-600 line-clamp-2 leading-relaxed">
                    {c.ai_improved_description || c.description}
                  </p>

                  {c.assigned_representative && (
                    <div className={`pt-3 border-t border-navy-100 flex items-center gap-2 text-xs ${c.assigned_representative.role.toLowerCase().includes('minister') || c.assigned_representative.role.toLowerCase().includes('mla') || c.assigned_representative.role.toLowerCase().includes('chief minister') ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {(c.assigned_representative.role.toLowerCase().includes('minister') || c.assigned_representative.role.toLowerCase().includes('mla') || c.assigned_representative.role.toLowerCase().includes('chief minister')) ? <Crown className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                      <span className="truncate">{c.assigned_representative.name}</span>
                    </div>
                  )}

                  {c.delivery_logs && c.delivery_logs.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {c.delivery_logs.map((log) => (
                        <span
                          key={log.id}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold ${
                            log.status === 'SUCCESS'
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                              : log.status === 'FAILED'
                              ? 'border-red-300 bg-red-50 text-red-700'
                              : 'border-amber-300 bg-amber-50 text-amber-700'
                          }`}
                        >
                          {log.channel}
                          {log.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3" />}
                          {log.status === 'FAILED' && <AlertCircle className="w-3 h-3" />}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-navy-100 flex items-center justify-between text-xs">
                    <span className="text-navy-500 font-medium truncate max-w-[150px]">
                      {c.locality}, {c.district}
                    </span>
                    <Link href={`/track/${c.reference_number}`}>
                      <Button variant="ghost" size="sm" className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold p-0 h-auto">
                        <span>{isTamil ? 'கண்காணி' : 'Track Status'}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
