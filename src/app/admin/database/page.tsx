'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Table, 
  FileCode, 
  RefreshCw, 
  Copy, 
  Check, 
  Server, 
  ShieldCheck,
  Building2,
  FileText,
  Send,
  Lock
} from 'lucide-react';

export default function DatabaseViewerPage() {
  const { isTamil } = useLanguage();
  const [activeTable, setActiveTable] = useState<'complaints' | 'representatives' | 'migrations'>('complaints');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [representatives, setRepresentatives] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [complaintsRes, repsRes] = await Promise.all([
        fetch('/api/complaints'),
        fetch('/api/representatives'),
      ]);
      const complaintsData = await complaintsRes.json();
      const repsData = await repsRes.json();
      setComplaints(complaintsData.data || []);
      setRepresentatives(repsData.data || []);
    } catch (e) {
      console.error('Failed to fetch database data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopyJson = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            {isTamil ? 'டேட்டாபேஸ் பார்வை & மேலாண்மை' : 'Database Inspector & Tables'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-950 font-tamil tracking-tight">
            {isTamil ? 'டேட்டாபேஸ் அட்டவணைகள் & தரவுகள்' : 'Database Tables & Live Records'}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 mt-1">
            {isTamil
              ? 'Makkal Kural தளத்தின் அனைத்து அட்டவணைகள், பதிவுகள் மற்றும் Supabase SQL கோப்புகளை இங்கு நேரடியாக பார்வையிடலாம்.'
              : 'Inspect live PostgreSQL schema, active stored rows, seeded directories, and Supabase SQL migration files.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            {isTamil ? 'புதுப்பி' : 'Refresh'}
          </Button>

          <Button
            variant="civic"
            size="sm"
            onClick={() => handleCopyJson(activeTable === 'complaints' ? complaints : representatives)}
            className="text-xs font-semibold"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied JSON' : 'Export Table JSON'}
          </Button>
        </div>
      </div>

      {/* Database Architecture Summary Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-navy-200 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-navy-500 block">
            Engine & Technology
          </span>
          <div className="text-base font-bold text-navy-950 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-600" />
            <span>Supabase PostgreSQL + Local Store</span>
          </div>
          <p className="text-[11px] text-navy-500">
            Real-time persistence with RLS security policies
          </p>
        </Card>

        <Card className="p-4 border-navy-200 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-navy-500 block">
            Total Stored Complaints
          </span>
          <div className="text-base font-bold text-navy-950 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>{complaints.length} Records</span>
          </div>
          <p className="text-[11px] text-navy-500">
            Includes reference tracking & delivery logs
          </p>
        </Card>

        <Card className="p-4 border-navy-200 bg-white space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-navy-500 block">
            Verified Representatives
          </span>
          <div className="text-base font-bold text-navy-950 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>{representatives.length} Public Offices</span>
          </div>
          <p className="text-[11px] text-navy-500">
            38 Tamil Nadu districts & municipal divisions
          </p>
        </Card>
      </div>

      {/* Table Switcher Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-navy-200 gap-2">
          <button
            onClick={() => setActiveTable('complaints')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTable === 'complaints'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-navy-600 hover:text-navy-950'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>table: complaints ({complaints.length})</span>
          </button>

          <button
            onClick={() => setActiveTable('representatives')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTable === 'representatives'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-navy-600 hover:text-navy-950'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>table: representatives ({representatives.length})</span>
          </button>

          <button
            onClick={() => setActiveTable('migrations')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTable === 'migrations'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-navy-600 hover:text-navy-950'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>SQL Schema & Migrations</span>
          </button>
        </div>

        {/* Complaints Table View */}
        {activeTable === 'complaints' && (
          <Card className="border-navy-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-navy-50/60 py-3 px-5 flex flex-row items-center justify-between">
              <span className="text-xs font-mono font-bold text-navy-800">
                SELECT * FROM complaints ORDER BY created_at DESC;
              </span>
              <span className="text-xs text-navy-500 font-mono">
                {complaints.length} rows
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono text-navy-900">
                  <thead className="bg-navy-100 text-navy-700 uppercase border-b border-navy-200">
                    <tr>
                      <th className="px-4 py-3">id</th>
                      <th className="px-4 py-3">reference_number</th>
                      <th className="px-4 py-3">category</th>
                      <th className="px-4 py-3">district</th>
                      <th className="px-4 py-3">locality</th>
                      <th className="px-4 py-3">severity</th>
                      <th className="px-4 py-3">status</th>
                      <th className="px-4 py-3">submitter_email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-navy-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-navy-500">{c.id}</td>
                        <td className="px-4 py-3 font-bold text-emerald-700">
                          <Link href={`/track/${c.reference_number}`} className="hover:underline">
                            {c.reference_number}
                          </Link>
                        </td>
                        <td className="px-4 py-3 uppercase">{c.category}</td>
                        <td className="px-4 py-3">{c.district}</td>
                        <td className="px-4 py-3 max-w-[200px] truncate">{c.locality}</td>
                        <td className="px-4 py-3 font-semibold">{c.severity}</td>
                        <td className="px-4 py-3">
                          <Badge status={c.status} className="font-mono text-[10px]">
                            {c.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-navy-600">{c.submitter_email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Representatives Table View */}
        {activeTable === 'representatives' && (
          <Card className="border-navy-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-navy-50/60 py-3 px-5 flex flex-row items-center justify-between">
              <span className="text-xs font-mono font-bold text-navy-800">
                SELECT * FROM representatives WHERE active = true;
              </span>
              <span className="text-xs text-navy-500 font-mono">
                {representatives.length} rows
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono text-navy-900">
                  <thead className="bg-navy-100 text-navy-700 uppercase border-b border-navy-200">
                    <tr>
                      <th className="px-4 py-3">name</th>
                      <th className="px-4 py-3">role</th>
                      <th className="px-4 py-3">organization</th>
                      <th className="px-4 py-3">district</th>
                      <th className="px-4 py-3">email</th>
                      <th className="px-4 py-3">verification_status</th>
                      <th className="px-4 py-3">source_url</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    {representatives.map((r) => (
                      <tr key={r.id} className="hover:bg-navy-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-navy-950">{r.name}</td>
                        <td className="px-4 py-3">{r.role}</td>
                        <td className="px-4 py-3 text-emerald-700">{r.organization}</td>
                        <td className="px-4 py-3">{r.district}</td>
                        <td className="px-4 py-3 text-navy-600">{r.email}</td>
                        <td className="px-4 py-3">
                          <Badge verification={r.verification_status} className="font-mono text-[10px]">
                            {r.verification_status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 max-w-[220px] truncate text-emerald-700">
                          <a href={r.source_url} target="_blank" rel="noreferrer" className="hover:underline">
                            {r.source_url}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SQL Schema Migrations Tab */}
        {activeTable === 'migrations' && (
          <div className="space-y-4">
            <Card className="p-6 border-navy-200 space-y-3">
              <h3 className="font-bold text-sm text-navy-950 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span>Supabase SQL Migration Files Location</span>
              </h3>
              <p className="text-xs text-navy-600">
                You can apply these migrations directly to your Supabase project in the Supabase Dashboard ➔ SQL Editor, or using the Supabase CLI:
              </p>
              <div className="space-y-2 text-xs font-mono bg-navy-950 text-emerald-400 p-4 rounded-xl">
                <div>📁 supabase/migrations/20260818000001_initial_schema.sql (Tables, Indexes, Types)</div>
                <div>📁 supabase/migrations/20260818000002_rls_policies.sql (Row Level Security Policies)</div>
                <div>📁 supabase/migrations/20260818000003_seed_data.sql (Verified TN Public Representatives)</div>
              </div>
            </Card>
          </div>
        )}
      </div>

    </div>
  );
}
