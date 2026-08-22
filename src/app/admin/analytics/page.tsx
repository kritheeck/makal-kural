'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Send, 
  CheckCircle2, 
  RefreshCw,
  Building2,
  FileText
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { t, isTamil } = useLanguage();
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();
      if (json.success) setStats(json.data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-navy-500 mb-1">
            <Link href="/admin" className="hover:underline">Admin Console</Link> &rsaquo; Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-950 font-tamil tracking-tight">
            {isTamil ? 'பொது நிர்வாக புள்ளிவிவரங்கள் & ஆய்வுகள்' : 'Civic Analytics & Resolution Metrics'}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 mt-1">
            {isTamil 
              ? 'தமிழ்நாடு மாவட்ட வாரியான புகார்கள், தீர்வு விகிதம் மற்றும் மின்னஞ்சல் வெற்றி அறிக்கைகள்.' 
              : 'Jurisdiction heatmaps, category volume distribution, resolution timelines, and dispatch performance.'}
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadAnalytics} className="text-xs self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          {isTamil ? 'புதுப்பி' : 'Refresh Metrics'}
        </Button>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-navy-200 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-navy-500 block">
            Total Ingested Grievances
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-navy-950">
            {stats?.totalComplaints || 0}
          </div>
        </Card>

        <Card className="border-navy-200 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block">
            Resolution Success Rate
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700">
            {stats?.resolutionRate || 0}%
          </div>
        </Card>

        <Card className="border-navy-200 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 block">
            Email Delivery Reliability
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-blue-700">
            {stats?.emailDeliveryRate || 100}%
          </div>
        </Card>

        <Card className="border-navy-200 p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-navy-700 block">
            Verified Public Offices
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-navy-950">
            {stats?.verifiedRepresentativesCount || 0}
          </div>
        </Card>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Breakdown */}
        <Card className="border-navy-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-100">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-navy-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>Grievances by Civic Category</span>
            </CardTitle>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.categoryCounts && Object.keys(stats.categoryCounts).length > 0 ? (
              Object.entries(stats.categoryCounts).map(([cat, count]: [string, any]) => {
                const pct = Math.round((count / (stats.totalComplaints || 1)) * 100);
                return (
                  <div key={cat} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-medium">
                      <span className="capitalize text-navy-800 font-semibold">{cat}</span>
                      <span className="text-navy-500 font-mono">{count} complaints ({pct}%)</span>
                    </div>
                    <div className="w-full bg-navy-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-navy-500 py-6 text-center">No category data recorded yet.</p>
            )}
          </div>
        </Card>

        {/* District Breakdown */}
        <Card className="border-navy-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-100">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-navy-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Grievances by District Jurisdiction</span>
            </CardTitle>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.districtCounts && Object.keys(stats.districtCounts).length > 0 ? (
              Object.entries(stats.districtCounts).map(([dist, count]: [string, any]) => {
                const pct = Math.round((count / (stats.totalComplaints || 1)) * 100);
                return (
                  <div key={dist} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-navy-800 font-semibold">{dist}</span>
                      <span className="text-navy-500 font-mono">{count} submissions ({pct}%)</span>
                    </div>
                    <div className="w-full bg-navy-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-navy-500 py-6 text-center">No district data recorded yet.</p>
            )}
          </div>
        </Card>

      </div>

    </div>
  );
}
