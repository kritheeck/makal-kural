'use client';

import React from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { Representative, SeverityLevel, DeliveryLog } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { UploadedFileMeta } from './step-evidence';
import { ShieldCheck, Mail, MapPin, AlertCircle, FileText, CheckCircle2, Crown, MessageSquare, Smartphone, Globe } from 'lucide-react';

interface StepPreviewProps {
  category: string;
  subcategory: string;
  district: string;
  city: string;
  constituency?: string;
  locality: string;
  title: string;
  description: string;
  aiTitle?: string;
  aiDescription?: string;
  dateStarted: string;
  severity: SeverityLevel;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  attachments: UploadedFileMeta[];
  representative?: Representative;
  deliveryLogs?: DeliveryLog[];
  legalConfirmed: boolean;
  onConfirmChange: (confirmed: boolean) => void;
  error?: string;
}

export function StepPreview({
  category,
  subcategory,
  district,
  city,
  constituency,
  locality,
  title,
  description,
  aiTitle,
  aiDescription,
  dateStarted,
  severity,
  submitterName,
  submitterEmail,
  submitterPhone,
  attachments,
  representative,
  deliveryLogs,
  legalConfirmed,
  onConfirmChange,
  error,
}: StepPreviewProps) {
  const { isTamil } = useLanguage();

  const finalTitle = aiTitle || title;
  const finalDescription = aiDescription || description;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-bold text-navy-950 font-tamil">
          {isTamil ? '8. முழு ஆவண முன்னோட்டம் & உறுதிப்படுத்தல்' : '8. Complete Dossier Preview & Sign-off'}
        </h3>
        <p className="text-sm text-navy-600 mt-1">
          {isTamil 
            ? 'அரசு துறைக்கு அனுப்பப்படவுள்ள இறுதி ஆவணத்தை சரிபார்த்து உறுதி செய்யவும்.' 
            : 'Review the exact official grievance dossier before final dispatch.'}
        </p>
      </div>

      {/* Official Dossier Box */}
      <div className="rounded-2xl border border-navy-300/80 bg-white overflow-hidden shadow-sm">
        <div className="bg-navy-950 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-emerald-500">
          <div>
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              OFFICIAL CIVIC GRIEVANCE DOSSIER
            </div>
            <h4 className="text-base font-bold font-tamil mt-0.5">
              {isTamil ? 'மக்கள் குரல் புகார் மனு' : 'Makkal Kural Grievance Petition'}
            </h4>
          </div>
          <Badge severity={severity} className="py-1 px-2.5">
            {severity} URGENCY
          </Badge>
        </div>

        <div className="p-5 sm:p-6 space-y-5 text-sm">
          
          {/* Recipient */}
          <div className="pb-4 border-b border-navy-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-navy-500">
              {isTamil ? 'பெறுநர் (துறை/அதிகாரி):' : 'To (Recipient Authority):'}
            </span>
            <div className="sm:col-span-2 text-navy-950 font-medium">
              {representative ? (
                <div>
                  <strong>{representative.name}</strong> ({representative.role}) &bull; {representative.organization}
                  <div className="text-xs text-navy-500 font-mono mt-0.5">{representative.email}</div>
                </div>
              ) : (
                <span className="text-amber-800">
                  {isTamil ? 'நிர்வாக பரிசீலனைக்கு (மனுவாக சேமிக்கப்படும்)' : 'Administrative Intake Cell (To be routed)'}
                </span>
              )}
            </div>
          </div>

          {/* Delivery Channels */}
          {deliveryLogs && deliveryLogs.length > 0 && (
            <div className="pb-4 border-b border-navy-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-navy-500 block mb-2">
                {isTamil ? 'வitinது பரிமாற channels:' : 'Delivery Channels:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {deliveryLogs.map((log) => (
                  <span
                    key={log.id}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${
                      log.status === 'SUCCESS'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : log.status === 'FAILED'
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-amber-300 bg-amber-50 text-amber-700'
                    }`}
                  >
                    {log.channel === 'EMAIL' && <Mail className="w-3.5 h-3.5" />}
                    {log.channel === 'X_API' && <MessageSquare className="w-3.5 h-3.5" />}
                    {log.channel === 'WHATSAPP' && <Smartphone className="w-3.5 h-3.5" />}
                    {log.channel === 'SMS' && <Smartphone className="w-3.5 h-3.5" />}
                    {log.channel === 'PORTAL' && <Globe className="w-3.5 h-3.5" />}
                    {log.channel}
                    {log.status === 'SUCCESS' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {log.status === 'FAILED' && <AlertCircle className="w-3.5 h-3.5" />}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subject */}
          <div className="pb-4 border-b border-navy-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-navy-500">
              {isTamil ? 'மனு தலைப்பு:' : 'Subject Line:'}
            </span>
            <div className="sm:col-span-2 text-navy-950 font-semibold">
              {finalTitle}
            </div>
          </div>

          {/* Category & Location */}
          <div className="pb-4 border-b border-navy-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-navy-500 block mb-1">
                {isTamil ? 'பிரிவு / துணைப்பிரிவு:' : 'Category & Subcategory:'}
              </span>
              <span className="font-medium text-navy-900">
                {category.toUpperCase()} &bull; {subcategory}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-navy-500 block mb-1">
                {isTamil ? 'இருப்பிடம் & தொகுதி:' : 'Location & Constituency:'}
              </span>
              <span className="font-medium text-navy-900">
                {locality}, {city}, {district} {constituency ? `(${constituency})` : ''}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-navy-500 block">
              {isTamil ? 'முழு புகார் விவரம்:' : 'Grievance Description:'}
            </span>
            <div className="p-4 rounded-xl bg-navy-50/70 border border-navy-200 text-xs text-navy-900 leading-relaxed whitespace-pre-wrap">
              {finalDescription}
            </div>
          </div>

          {/* Evidence Attachments */}
          {attachments.length > 0 && (
            <div className="pt-2 border-t border-navy-100 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-navy-500 block">
                {isTamil ? `இணைக்கப்பட்ட ஆதாரங்கள் (${attachments.length}):` : `Attached Evidence (${attachments.length}):`}
              </span>
              <div className="flex flex-wrap gap-2">
                {attachments.map((att, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-navy-200 bg-white text-xs text-navy-800"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    {att.fileName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Submitter */}
          <div className="pt-3 border-t border-navy-100 text-xs text-navy-600">
            <strong>{isTamil ? 'மனுதாரர்:' : 'Submitter:'}</strong> {submitterName} &bull; {submitterEmail} &bull; {submitterPhone}
          </div>
        </div>
      </div>

      {/* Legal Acknowledgment Checkbox */}
      <div className="p-4 rounded-xl border border-navy-300 bg-navy-50/60 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={legalConfirmed}
            onChange={(e) => onConfirmChange(e.target.checked)}
            className="w-5 h-5 rounded border-navy-300 text-emerald-600 focus:ring-emerald-500 mt-0.5"
          />
          <span className="text-xs text-navy-800 font-medium leading-relaxed">
            {isTamil
              ? 'நான் சமர்ப்பிக்கும் தகவல்கள் அனைத்தும் உண்மையானவை என்றும், எவ்வித தவறான அல்லது அவதூறான கருத்துக்களும் இல்லை என்றும் உறுதியளிக்கிறேன்.'
              : 'I solemnly confirm that the information provided in this grievance is truthful and accurate to the best of my knowledge, and does not contain abusive, defamatory, or fabricated content.'}
          </span>
        </label>
        {error && (
          <p className="text-xs font-semibold text-red-600 pl-8">{error}</p>
        )}
      </div>
    </div>
  );
}
