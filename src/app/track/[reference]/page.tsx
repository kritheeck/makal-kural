'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { Complaint, ComplaintStatus, ComplaintAttachment } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { buildXShareUrl, buildXOfficialReplyUrl } from '@/lib/x-share-service';
import { formatDate } from '@/lib/utils';
import { ComplaintMap } from '@/components/maps/complaint-map';
import { exportComplaintPDF, exportComplaintsCSV } from '@/lib/export-service';
import { 
  CheckCircle2, 
  Clock, 
  Send, 
  Building2, 
  Share2, 
  Printer, 
  ShieldCheck, 
  ArrowLeft, 
  ExternalLink,
  Lock,
  FileCheck,
  Map,
  Download,
  FileText,
  Image as ImageIcon,
  FileArchive
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TrackDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = use(params);
  const { t, isTamil, language } = useLanguage();
  const [complaint, setComplaint] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComplaint() {
      setLoading(true);
      setError(null);

      // 1. Try server API
      try {
        const res = await fetch(`/api/track?ref=${encodeURIComponent(reference)}`);
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          setComplaint(json.data);
          setLoading(false);
          return;
        }
      } catch {
        // Continue to local fallbacks
      }

      // 2. Client-side localStorage fallback (for instant persistence in demo/serverless)
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('mk_complaints');
          if (stored) {
            const list = JSON.parse(stored);
            const found = list.find((c: any) =>
              c.reference_number?.toUpperCase() === reference.trim().toUpperCase() ||
              c.id === reference.trim()
            );
            if (found) {
              setComplaint(found);
              setLoading(false);
              return;
            }
          }
        } catch {
          // Ignore parse errors
        }
      }

      // 3. Built-in initial grievance showcase fallback (for demo resolutions)
      try {
        const { INITIAL_COMPLAINTS } = await import('@/lib/supabase/mock-store');
        const fallbackMatch = INITIAL_COMPLAINTS.find((c: any) =>
          c.reference_number?.toUpperCase() === reference.trim().toUpperCase() ||
          c.id === reference.trim()
        );
        if (fallbackMatch) {
          setComplaint(fallbackMatch);
          setLoading(false);
          return;
        }
      } catch {
        // Ignore
      }

      setError('Complaint not found');
      setLoading(false);
    }

    fetchComplaint();
  }, [reference]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-navy-600 font-medium">
          {isTamil ? 'புகார் விபரங்கள் பெறப்படுகின்றன...' : 'Retrieving official grievance record...'}
        </p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 rounded-full bg-red-100 text-red-600 w-16 h-16 mx-auto flex items-center justify-center">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-navy-950 font-tamil">
          {isTamil ? 'புகார் மனு கிடைக்கவில்லை' : 'Complaint Not Found'}
        </h2>
        <p className="text-sm text-navy-600">
          {t.tracking.notFound.replace('{ref}', reference)}
        </p>
        <div className="pt-4">
          <Link href="/track">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              {isTamil ? 'மீண்டும் தேட' : 'Search Another Reference'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const stepsList: { key: ComplaintStatus; labelEn: string; labelTa: string }[] = [
    { key: 'SUBMITTED', labelEn: 'Submitted', labelTa: 'பதிவு செய்யப்பட்டது' },
    { key: 'EMAIL_SENT', labelEn: 'Sent to Official', labelTa: 'அதிகாரிக்கு அனுப்பப்பட்டது' },
    { key: 'ACKNOWLEDGED', labelEn: 'Acknowledged', labelTa: 'ஏற்றுக்கொள்ளப்பட்டது' },
    { key: 'IN_PROGRESS', labelEn: 'Under Action', labelTa: 'நடவடிக்கையில் உள்ளது' },
    { key: 'RESOLVED', labelEn: 'Resolved', labelTa: 'தீர்க்கப்பட்டது' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
      case 'EMAIL_QUEUED':
        return 0;
      case 'EMAIL_SENT':
      case 'EMAIL_FAILED':
        return 1;
      case 'ACKNOWLEDGED':
        return 2;
      case 'IN_PROGRESS':
        return 3;
      case 'RESOLVED':
      case 'CLOSED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(complaint.status);
   const xShareUrl = buildXShareUrl(complaint, complaint.assigned_representative);
   const xOfficialReplyUrl = buildXOfficialReplyUrl(complaint, complaint.assigned_representative);

   const getFileIcon = (mimeType?: string) => {
     if (!mimeType) return <FileText className="w-4 h-4 text-navy-500" />;
     if (mimeType.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-emerald-600" />;
     if (mimeType.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
     if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return <FileArchive className="w-4 h-4 text-amber-600" />;
     return <FileText className="w-4 h-4 text-navy-500" />;
   };

   const formatFileSize = (bytes?: number) => {
     if (!bytes) return '';
     const kb = bytes / 1024;
     const mb = kb / 1024;
     if (mb >= 1) return `${mb.toFixed(1)} MB`;
     return `${kb.toFixed(1)} KB`;
   };

   const handleDownload = async (url: string, fileName: string) => {
     try {
       const response = await fetch(url);
       const blob = await response.blob();
       const blobUrl = URL.createObjectURL(blob);
       const link = document.createElement('a');
       link.href = blobUrl;
       link.download = fileName;
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       URL.revokeObjectURL(blobUrl);
     } catch {
       window.open(url, '_blank', 'noopener,noreferrer');
     }
   };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Top Header & Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-navy-500">
              GRIEVANCE REFERENCE
            </span>
            <Badge status={complaint.status} className="font-semibold text-xs">
              {complaint.status}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-navy-950 tracking-wide mt-1">
            {complaint.reference_number}
          </h1>
          <p className="text-xs text-navy-500 mt-0.5">
            {isTamil ? 'பதிவு செய்த நாள்:' : 'Registered Date:'} {formatDate(complaint.created_at, language)}
          </p>
        </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              {t.tracking.downloadReceipt}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                exportComplaintPDF({
                  reference_number: complaint.reference_number,
                  category: complaint.category,
                  subcategory: complaint.subcategory,
                  title: complaint.ai_improved_title || complaint.title,
                  description: complaint.ai_improved_description || complaint.description,
                  locality: complaint.locality,
                  district: complaint.district,
                  state: complaint.state,
                  constituency: complaint.constituency,
                  severity: complaint.severity,
                  status: complaint.status,
                  submitter_name: complaint.submitter_name,
                  submitter_email: complaint.submitter_email,
                  submitter_phone: complaint.submitter_phone,
                  created_at: complaint.created_at,
                  updated_at: complaint.updated_at,
                })
              }
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              PDF
            </Button>

            <a href={xShareUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" className="text-xs bg-navy-100 text-navy-900">
                <Share2 className="w-3.5 h-3.5 mr-1" />
                {isTamil ? 'X-ல் பகிர்' : 'Share on X'}
              </Button>
            </a>

            {complaint.assigned_representative?.x_handle && (
              <a href={xOfficialReplyUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="civic" size="sm" className="text-xs bg-emerald-600 text-white hover:bg-emerald-700">
                  <Send className="w-3.5 h-3.5 mr-1" />
                  {isTamil ? 'அதிகாரியை குறிப்பிடுக' : 'Tag Officer'}
                </Button>
              </a>
            )}
          </div>
      </div>

      {/* Visual Timeline Stepper */}
      <Card className="border-navy-200 shadow-sm p-6 overflow-hidden">
        <div className="text-xs font-bold uppercase tracking-wider text-navy-500 mb-6">
          {isTamil ? 'தீர்வு முன்னேற்ற நிலை' : 'Resolution Progress Timeline'}
        </div>

        <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-0">
          {stepsList.map((step, idx) => {
            const isDone = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.key} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 relative text-left md:text-center">
                {/* Connecting Line (Desktop) */}
                {idx < stepsList.length - 1 && (
                  <div
                    className={cn(
                      'hidden md:block absolute top-4 left-1/2 w-full h-1 -z-0',
                      idx < currentStepIdx ? 'bg-emerald-600' : 'bg-navy-200'
                    )}
                  />
                )}

                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all shadow-xs',
                    isDone
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : 'bg-navy-100 text-navy-400 border border-navy-300'
                  )}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div>
                  <div className={cn(
                    'text-xs font-semibold font-tamil',
                    isCurrent ? 'text-emerald-700 font-bold' : isDone ? 'text-navy-900' : 'text-navy-400'
                  )}>
                    {isTamil ? step.labelTa : step.labelEn}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Complaint Dossier */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-navy-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  {complaint.category.toUpperCase()} &rsaquo; {complaint.subcategory}
                </span>
                <Badge severity={complaint.severity}>
                  {complaint.severity}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-2">
                {complaint.ai_improved_title || complaint.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <span className="font-semibold uppercase tracking-wider text-navy-500 block mb-1">
                  {isTamil ? 'புகார் விபரம்' : 'Grievance Description'}
                </span>
                <div className="p-4 rounded-xl bg-navy-50/70 text-navy-900 leading-relaxed whitespace-pre-wrap border border-navy-200">
                  {complaint.ai_improved_description || complaint.description}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="font-semibold uppercase tracking-wider text-navy-500 block mb-0.5">
                    {isTamil ? 'அதிகார வரம்பு / பகுதி' : 'Jurisdiction Area'}
                  </span>
                  <span className="text-navy-900 font-medium">
                    {complaint.locality}, {complaint.city}, {complaint.district}
                  </span>
                </div>
                <div>
                  <span className="font-semibold uppercase tracking-wider text-navy-500 block mb-0.5">
                    {isTamil ? 'சட்டமன்ற தொகுதி' : 'Constituency'}
                  </span>
                  <span className="text-navy-900 font-medium">
                    {complaint.constituency || 'All Constituencies'}
                  </span>
                </div>
              </div>

               <div className="pt-2">
                 <span className="font-semibold uppercase tracking-wider text-navy-500 block mb-1.5">
                   {isTamil ? 'இருப்பிட வரைபடம்' : 'Location Map'}
                 </span>
                 <ComplaintMap
                   latitude={complaint.latitude}
                   longitude={complaint.longitude}
                   locality={complaint.locality}
                   district={complaint.district}
                   height={280}
                 />
               </div>

               {complaint.attachments && complaint.attachments.length > 0 && (
                 <div className="pt-2">
                   <span className="font-semibold uppercase tracking-wider text-navy-500 block mb-1.5">
                     {isTamil ? 'ஆதாரங்கள் / இணைப்புகள்' : 'Evidence / Attachments'}
                   </span>
                   <div className="flex flex-wrap gap-2">
                      {complaint.attachments.map((att: ComplaintAttachment) => (
                        <button
                          key={att.id}
                          onClick={() => handleDownload(att.file_url, att.file_name)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-navy-200 bg-white text-xs text-navy-800 hover:bg-navy-50 hover:border-navy-300 transition-colors"
                        >
                          {getFileIcon(att.mime_type)}
                          <div className="flex flex-col items-start">
                            <span className="font-medium text-navy-900 max-w-[200px] truncate">{att.file_name}</span>
                            <span className="text-[10px] text-navy-500">{formatFileSize(att.file_size)}</span>
                          </div>
                          <Download className="w-3.5 h-3.5 text-navy-400 ml-1" />
                        </button>
                      ))}
                   </div>
                 </div>
               )}
            </CardContent>
          </Card>

          {/* Timeline & Resolution Updates */}
          <Card className="border-navy-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-navy-700">
                {isTamil ? 'நடவடிக்கை பதிவுகள்' : 'Official Action & Update Log'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {complaint.updates && complaint.updates.length > 0 ? (
                <div className="space-y-4 border-l-2 border-emerald-500 pl-4 ml-2">
                  {complaint.updates.map((upd: any, idx: number) => (
                    <div key={idx} className="space-y-1 relative">
                      <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-navy-900">
                          {upd.status}
                        </span>
                        <span className="text-[11px] text-navy-500 font-mono">
                          {formatDate(upd.created_at, language)}
                        </span>
                      </div>
                      <p className="text-xs text-navy-700 leading-relaxed bg-navy-50/60 p-2.5 rounded-lg border border-navy-100">
                        {upd.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-navy-500">
                  {isTamil ? 'இன்னும் கூடுதல் பதிவுகள் எதுவும் இல்லை.' : 'No follow-up updates recorded yet.'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Assigned Official & Masked Privacy */}
        <div className="space-y-6">
          
          {/* Official Recipient Box */}
          <Card className="border-navy-200 shadow-sm">
            <CardHeader className="bg-navy-50/60">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <CardTitle className="text-sm">
                  {isTamil ? 'பொறுப்பு அதிகாரி / துறை' : 'Assigned Authority'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs">
              {complaint.assigned_representative ? (
                <>
                  <div>
                    <h5 className="font-bold text-navy-950 text-sm">
                      {complaint.assigned_representative.name}
                    </h5>
                    <p className="text-navy-600">
                      {complaint.assigned_representative.role}
                    </p>
                    <p className="text-navy-500 font-medium">
                      {complaint.assigned_representative.organization}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-navy-100">
                    <Badge verification={complaint.assigned_representative.verification_status}>
                      {complaint.assigned_representative.verification_status}
                    </Badge>
                  </div>

                  {complaint.assigned_representative.source_url && (
                    <div className="pt-1">
                      <a
                        href={complaint.assigned_representative.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <span>Official Source Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-navy-600">
                  {isTamil ? 'நிர்வாக பரிசீலனையில் உள்ளது' : 'Under administrative intake review'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Masked Citizen Information Card */}
          <Card className="border-navy-200 shadow-sm bg-navy-50/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-navy-500" />
                <CardTitle className="text-xs uppercase tracking-wider text-navy-700">
                  {isTamil ? 'பாதுகாக்கப்பட்ட மனுதாரர் விபரம்' : 'Masked Citizen Privacy'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-2 text-xs text-navy-700">
              <div>
                <span className="font-medium text-navy-500">Name: </span>
                <span className="font-semibold text-navy-900">{complaint.submitter_masked_name}</span>
              </div>
              <div>
                <span className="font-medium text-navy-500">Email: </span>
                <span className="font-mono text-navy-900">{complaint.submitter_masked_email}</span>
              </div>
              <div>
                <span className="font-medium text-navy-500">Phone: </span>
                <span className="font-mono text-navy-900">{complaint.submitter_masked_phone}</span>
              </div>
              <p className="text-[11px] text-navy-500 pt-2 border-t border-navy-200 leading-normal">
                {t.tracking.privacyProtected}
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
