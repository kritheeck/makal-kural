'use client';

import React from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SeverityLevel } from '@/types/database';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepDetailsProps {
  title: string;
  description: string;
  dateStarted: string;
  isOngoing: boolean;
  severity: SeverityLevel;
  onChange: (fields: {
    title?: string;
    description?: string;
    dateStarted?: string;
    isOngoing?: boolean;
    severity?: SeverityLevel;
  }) => void;
  errors?: Record<string, string>;
}

export function StepDetails({
  title,
  description,
  dateStarted,
  isOngoing,
  severity,
  onChange,
  errors = {},
}: StepDetailsProps) {
  const { isTamil } = useLanguage();

  const severities: { id: SeverityLevel; labelEn: string; labelTa: string; descEn: string; descTa: string; color: string }[] = [
    {
      id: 'LOW',
      labelEn: 'Low Priority',
      labelTa: 'குறைந்த அவசரம்',
      descEn: 'Minor cosmetic maintenance or non-blocking inconvenience',
      descTa: 'சாதாரண பராமரிப்பு அல்லது சிறிய சிரமங்கள்',
      color: 'border-slate-300 hover:border-slate-400',
    },
    {
      id: 'MEDIUM',
      labelEn: 'Medium (Standard)',
      labelTa: 'மிதமான அவசரம் (இயல்பு)',
      descEn: 'Standard civic grievance affecting daily commute or sanitation',
      descTa: 'தினசரி போக்குவரத்து அல்லது தூய்மைக்கு பாதிப்பு',
      color: 'border-blue-300 hover:border-blue-400',
    },
    {
      id: 'HIGH',
      labelEn: 'High Priority',
      labelTa: 'அதிக அவசரம்',
      descEn: 'Persistent issue causing health risk or vehicle breakdowns',
      descTa: 'தொடர் சுகாதாரம் அல்லது வாகன விபத்து அபாயம்',
      color: 'border-amber-300 hover:border-amber-400',
    },
    {
      id: 'URGENT',
      labelEn: 'Urgent Hazard',
      labelTa: 'மிக அவசரம் / அபாயம்',
      descEn: 'Immediate public safety risk (live wire, deep open manhole)',
      descTa: 'உடனடி ஆபத்து (மின்கம்பி அறுந்து விழுதல், திறந்த சாக்கடை)',
      color: 'border-red-400 hover:border-red-500',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-bold text-navy-950 font-tamil">
          {isTamil ? '3. புகாரின் விபரம் & அவசர நிலை' : '3. Complaint Details & Severity'}
        </h3>
        <p className="text-sm text-navy-600 mt-1">
          {isTamil 
            ? 'பிரச்சனையை தெளிவாக விவரிக்கவும். உண்மைக்கு புறம்பான அவசர நிலையை தேர்வு செய்யாதீர்கள்.' 
            : 'Describe the issue clearly. Select accurate urgency to ensure fair emergency handling.'}
        </p>
      </div>

      {/* Title */}
      <div>
        <Input
          label={isTamil ? 'புகார் தலைப்பு (சுருக்கமாக)' : 'Complaint Title (Clear & Concise)'}
          placeholder={isTamil ? 'எ.கா: பிரதான சாலையில் 2 மாதங்களாக மூடப்படாத பெரிய சாக்கடை குழி' : 'e.g. Broken water pipeline leaking on Main Road for 3 days'}
          value={title}
          error={errors.title}
          onChange={(e) => onChange({ title: e.target.value })}
          helperText={`${title.length}/150 characters`}
        />
      </div>

      {/* Description */}
      <div>
        <Textarea
          label={isTamil ? 'முழு விபரம்' : 'Detailed Description'}
          placeholder={isTamil 
            ? 'பிரச்சனை எப்போது தொடங்கியது? பொதுமக்களுக்கு என்ன பாதிப்பு ஏற்படுகிறது? என்பதை தெளிவாக எழுதவும்...' 
            : 'Explain what the issue is, exact landmark, how long it has been pending, and how it impacts local residents...'}
          value={description}
          error={errors.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={5}
          helperText={`${description.length} characters (minimum 20)`}
        />
      </div>

      {/* Date Started & Ongoing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            type="date"
            label={isTamil ? 'பிரச்சனை தொடங்கிய நாள்' : 'Date Issue Started'}
            value={dateStarted}
            error={errors.dateStarted}
            onChange={(e) => onChange({ dateStarted: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
            {isTamil ? 'தற்போது தொடர்கிறதா?' : 'Is the Issue Currently Ongoing?'}
          </label>
          <div className="flex gap-3 h-11 items-center">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-navy-800">
              <input
                type="radio"
                name="ongoing"
                checked={isOngoing === true}
                onChange={() => onChange({ isOngoing: true })}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span>{isTamil ? 'ஆம், தொடர்கிறது' : 'Yes, Ongoing'}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-navy-800 ml-4">
              <input
                type="radio"
                name="ongoing"
                checked={isOngoing === false}
                onChange={() => onChange({ isOngoing: false })}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span>{isTamil ? 'இல்லை (மீண்டும் ஏற்பட்டது)' : 'No (Recurring)'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Severity Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700">
          {isTamil ? 'அவசர நிலையை தேர்வு செய்க' : 'Select Severity Level'}
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {severities.map((s) => {
            const isSelected = severity === s.id;
            return (
              <div
                key={s.id}
                onClick={() => onChange({ severity: s.id })}
                className={cn(
                  'p-3.5 rounded-xl border cursor-pointer transition-all duration-150',
                  isSelected
                    ? s.id === 'URGENT' 
                      ? 'border-red-600 bg-red-50/60 ring-2 ring-red-600/20' 
                      : 'border-navy-950 bg-navy-50/80 ring-2 ring-navy-950/20'
                    : s.color + ' bg-white'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'font-semibold text-sm font-tamil',
                    isSelected && s.id === 'URGENT' ? 'text-red-700' : 'text-navy-950'
                  )}>
                    {isTamil ? s.labelTa : s.labelEn}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-navy-950" />
                  )}
                </div>
                <p className="text-xs text-navy-600 mt-1">
                  {isTamil ? s.descTa : s.descEn}
                </p>
              </div>
            );
          })}
        </div>

        {/* Warning about Urgent abuse */}
        {severity === 'URGENT' && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2 animate-in fade-in duration-150">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>
              {isTamil
                ? 'கவனம்: "மிக அவசரம்" என்பது நேரடி உயிராபத்து (மின்கம்பி தீப்பொறி, திறந்த சாக்கடை பள்ளம்) உள்ளவற்றிற்கு மட்டுமே உரியது. தவறாக தேர்வு செய்வது உண்மையான அவசர உதவி பணிகளை தாமதப்படுத்தும்.'
                : 'Important: "Urgent" is strictly reserved for imminent safety hazards. Falsely marking routine issues as urgent delays municipal emergency crew responses.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
