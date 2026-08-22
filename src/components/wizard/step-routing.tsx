'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { Representative } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Download,
  Calendar,
  Crown
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface StepRoutingProps {
  representative?: Representative;
  isVerified: boolean;
  routingReason: string;
  category: string;
  district: string;
  locality: string;
  title: string;
  description: string;
}

export function StepRouting({
  representative,
  isVerified,
  routingReason,
  category,
  district,
  locality,
  title,
  description,
}: StepRoutingProps) {
  const { isTamil, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const isMinisterLevel = representative?.role.toLowerCase().includes('minister') || representative?.role.toLowerCase().includes('mla') || representative?.role.toLowerCase().includes('chief minister');

  const handleCopy = () => {
    const formattedText = `PUBLIC CIVIC GRIEVANCE PETITION\n------------------------------\nCategory: ${category.toUpperCase()}\nLocation: ${locality}, ${district}\nSubject: ${title}\n\nDescription:\n${description}\n\nGenerated via Makkal Kural Civic Portal`;
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-bold text-navy-950 font-tamil">
          {isTamil ? '7. அதிகாரப்பூர்வ பெறுநர் சரிபார்ப்பு' : '7. Verified Representative Match'}
        </h3>
        <p className="text-sm text-navy-600 mt-1">
          {isTamil 
            ? 'உங்கள் பகுதிக்குரிய சரிபார்க்கப்பட்ட அரசு அதிகாரி அல்லது மக்கள் பிரதிநிதி விபரம்.' 
            : 'Review the verified public authority jurisdiction matched for this grievance.'}
        </p>
      </div>

      {representative && isVerified ? (
        /* Verified Representative Card */
        <div className={`rounded-2xl border-2 ${isMinisterLevel ? 'border-amber-500/80 bg-amber-50/30 shadow-sm shadow-amber-500/10' : 'border-emerald-500/80 bg-white shadow-sm shadow-emerald-500/10'} p-6 space-y-5`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-navy-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${isMinisterLevel ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'} flex items-center justify-center flex-shrink-0`}>
                {isMinisterLevel ? <Crown className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-base text-navy-950">
                  {representative.name}
                </h4>
                <p className="text-xs text-navy-600 font-medium">
                  {representative.role} &bull; {representative.organization}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isMinisterLevel && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-300 self-start sm:self-auto py-1 px-3">
                  <Crown className="w-3.5 h-3.5 mr-1" />
                  {isTamil ? 'மந்திரி / எம்எல்ஏ கடைசி' : 'MINISTER / MLA DIRECT'}
                </Badge>
              )}
              <Badge verification="VERIFIED" className={`self-start sm:self-auto py-1 px-3 ${isMinisterLevel ? 'bg-amber-600 text-white border-amber-700' : ''}`}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {isTamil ? 'சரிபார்க்கப்பட்ட அதிகாரி' : 'VERIFIED OFFICIAL'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-semibold uppercase tracking-wider text-navy-500 block">
                {isTamil ? 'அதிகாரப்பூர்வ மின்னஞ்சல்' : 'Official Dispatch Email'}
              </span>
              <span className="text-navy-900 font-mono font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-navy-400" />
                {representative.email}
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-semibold uppercase tracking-wider text-navy-500 block">
                {isTamil ? 'அதிகார வரம்பு / மாவட்டம்' : 'Jurisdiction & Constituency'}
              </span>
              <span className="text-navy-900 font-medium">
                {representative.district} {representative.constituency ? `(${representative.constituency})` : ''}
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-semibold uppercase tracking-wider text-navy-500 block">
                {isTamil ? 'சரிபார்க்கப்பட்ட அரசு இணையதள சான்று' : 'Verified Source URL'}
              </span>
              <a
                href={representative.source_url}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:underline flex items-center gap-1 truncate max-w-[280px]"
              >
                <span>{representative.source_url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>

            <div className="space-y-1">
              <span className="font-semibold uppercase tracking-wider text-navy-500 block">
                {isTamil ? 'கடைசியாக சரிபார்க்கப்பட்ட நாள்' : 'Last Verification Date'}
              </span>
              <span className="text-navy-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-navy-400" />
                {formatDate(representative.last_verified_at, language)}
              </span>
            </div>
          </div>

          <div className={`p-3 ${isMinisterLevel ? 'bg-amber-50/70 text-amber-900' : 'bg-emerald-50/70 text-emerald-900'} rounded-lg text-xs flex items-center gap-2`}>
            <CheckCircle2 className={`w-4 h-4 ${isMinisterLevel ? 'text-amber-600' : 'text-emerald-600'} flex-shrink-0`} />
            <span>
              {isTamil
                ? 'புகார் சமர்ப்பித்தவுடன் தானாகவே அதிகாரப்பூர்வ மின்னஞ்சல் இந்த துறைக்கு அனுப்பி வைக்கப்படும்.'
                : 'Submitting will automatically trigger an official email dispatch to this verified authority.'}
            </span>
          </div>
        </div>
      ) : (
        /* Unverified / Needs Review / No Match Notice */
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/50 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-base text-amber-950 font-tamil">
                {isTamil
                  ? 'இந்த இருப்பிடத்திற்கு இன்னும் சரிபார்க்கப்பட்ட பிரதிநிதி இணைக்கப்படவில்லை.'
                  : "We couldn't find a verified representative for this location yet."}
              </h4>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                {isTamil
                  ? 'உங்கள் புகார் எங்கள் தளத்தில் பாதுகாப்பாக சேமிக்கப்படும். எங்கள் நிர்வாகக் குழுவினர் இதனை உரிய அரசு துறைக்கு அனுப்பி வைப்பார்கள். மேலும் நீங்கள் உடனடியாக முறைப்படியான மனுவை பதிவிறக்கவோ அல்லது நகலெடுக்கவோ செய்யலாம்.'
                  : 'Your complaint will be securely stored in our system and reviewed by our administrative team. You can also download a formal petition PDF or copy the formatted text.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="bg-white text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? (isTamil ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (isTamil ? 'புகார் உரையை நகலெடு' : 'Copy Formatted Text')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="bg-white text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              {isTamil ? 'மனுவை அச்சிடு / PDF' : 'Print Formal Petition'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
