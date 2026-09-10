'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  FileText, 
  Building2, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Send, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getAdminHeaders } from '@/lib/admin-auth';

export default function AdminOverviewPage() {
  const { t, isTamil, language } = useLanguage();
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<any | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resStats, resComplaints] = await Promise.all([
        fetch('/api/analytics', { headers: getAdminHeaders() }),
        fetch('/api/complaints'),
      ]);

      const dataStats = await resStats.json();
      const dataComplaints = await resComplaints.json();

      if (dataStats.success) setStats(dataStats.data);
      if (dataComplaints.success) setComplaints(dataComplaints.data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-100 text-navy-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5 text-navy-700" />
            {isTamil ? 'அரசு நிர்வாக கட்டுப்பாட்டு அறை' : 'Civic Administration Console'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-950 font-tamil tracking-tight">
            {t.admin.title}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 mt-1">
            {isTamil
              ? 'அனைத்து மாவட்டங்களின் பொதுப் புகார்கள், சரிபார்க்கப்பட்ட அதிகாரிகள் மற்றும் தீர்வு அறிக்கைகள்.'
              : 'Master administrative intake, status management, official directory verification, and analytics.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadData} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            {isTamil ? 'புதுப்பி' : 'Refresh'}
          </Button>

          <Link href="/admin/complaints">
            <Button variant="primary" size="sm" className="text-xs font-semibold">
              <FileText className="w-3.5 h-3.5 mr-1" />
              {isTamil ? 'புகார்கள் நிர்வாகம்' : 'Manage Complaints'}
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-navy-200/80 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-navy-500 block">
            {t.admin.totalComplaints}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-navy-950">
            {stats?.totalComplaints || 0}
          </div>
        </Card>

        <Card className="border-navy-200/80 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 block">
            {t.admin.pendingReview}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-700">
            {stats?.inProgressComplaints + stats?.submittedComplaints || 0}
          </div>
        </Card>

        <Card className="border-navy-200/80 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block">
            {t.admin.resolvedComplaints}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700">
            {stats?.resolvedComplaints || 0}
          </div>
        </Card>

        <Card className="border-navy-200/80 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 block">
            {t.admin.deliveryRate}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-blue-700">
            {stats?.emailDeliveryRate || 100}%
          </div>
        </Card>
      </div>

      {/* Admin Modules Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link href="/admin/complaints" className="group">
          <Card className="border-navy-200 group-hover:border-navy-950 transition-all p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center text-navy-800 group-hover:bg-navy-950 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-navy-950">
              {isTamil ? 'புகார்கள் மேலாண்மை' : 'Complaints Console'}
            </h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              {isTamil 
                ? 'புகார்களை தேடுதல், தீர்வு நிலை மாற்றுதல் மற்றும் அதிகாரிகளுக்கு மீண்டும் அனுப்புதல்.' 
                : 'Filter, search, assign official representatives, update resolution timeline, and view evidence.'}
            </p>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 pt-2">
              <span>Open Complaints Manager</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Card>
        </Link>

        <Link href="/admin/representatives" className="group">
          <Card className="border-navy-200 group-hover:border-navy-950 transition-all p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center text-navy-800 group-hover:bg-navy-950 group-hover:text-white transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-navy-950">
              {isTamil ? 'அதிகாரிகள் விபரம் மேலாண்மை' : 'Representative Directory'}
            </h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              {isTamil 
                ? 'புதிய அதிகாரிகளை சேர்த்தல், அரசு இணையதள சான்றை சரிபார்த்தல் மற்றும் திருத்துதல்.' 
                : 'Add verified municipal officers, MLAs, update government source URLs, and manage active status.'}
            </p>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 pt-2">
              <span>Open Representative Manager</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Card>
        </Link>

        <Link href="/admin/analytics" className="group">
          <Card className="border-navy-200 group-hover:border-navy-950 transition-all p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center text-navy-800 group-hover:bg-navy-950 group-hover:text-white transition-colors">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-navy-950">
              {isTamil ? 'புள்ளிவிவரங்கள் & அறிக்கைகள்' : 'Analytics & Insights'}
            </h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              {isTamil 
                ? 'மாவட்ட வாரியான மற்றும் துறை வாரியான தீர்வு விகித புள்ளிவிவரங்கள்.' 
                : 'District breakdown, category distribution, resolution timelines, and email delivery reports.'}
            </p>
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 pt-2">
              <span>Open Analytics Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Card>
        </Link>

      </div>

      {/* Recent Submissions Table */}
      <Card className="border-navy-200 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold">
            {isTamil ? 'சமீபத்திய புகார்கள்' : 'Recent Civic Submissions'}
          </CardTitle>
          <Link href="/admin/complaints">
            <Button variant="ghost" size="sm" className="text-xs text-emerald-700">
              {isTamil ? 'அனைத்தையும் காண்க' : 'View All'}
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-navy-800">
              <thead className="bg-navy-50 text-navy-600 uppercase font-semibold border-y border-navy-200">
                <tr>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Title & Area</th>
                  <th className="px-6 py-3">Severity</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {complaints.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-navy-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-navy-950">
                      <Link href={`/track/${c.reference_number}`} className="hover:underline text-emerald-700">
                        {c.reference_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 uppercase font-semibold text-navy-600">
                      {c.category}
                    </td>
                    <td className="px-6 py-4 max-w-[260px]">
                      <div className="font-semibold text-navy-900 truncate">
                        {c.ai_improved_title || c.title}
                      </div>
                      <div className="text-[11px] text-navy-500 truncate">
                        {c.locality}, {c.district}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge severity={c.severity}>
                        {c.severity}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={c.status}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-navy-500 whitespace-nowrap">
                      {formatDate(c.created_at, language).split(',')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
