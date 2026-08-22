'use client';

import React from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Lock } from 'lucide-react';
import { PreferredLanguage } from '@/types/database';

interface StepContactProps {
  name: string;
  email: string;
  phone: string;
  preferredLanguage: PreferredLanguage;
  isAnonymous: boolean;
  onChange: (fields: {
    name?: string;
    email?: string;
    phone?: string;
    preferredLanguage?: PreferredLanguage;
    isAnonymous?: boolean;
  }) => void;
  errors?: Record<string, string>;
}

export function StepContact({
  name,
  email,
  phone,
  preferredLanguage,
  isAnonymous,
  onChange,
  errors = {},
}: StepContactProps) {
  const { isTamil } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-bold text-navy-950 font-tamil">
          {isTamil ? '6. உங்கள் தொடர்பு விவரங்கள்' : '6. Submitter Contact Details'}
        </h3>
        <p className="text-sm text-navy-600 mt-1">
          {isTamil 
            ? 'புகார் நிலை மற்றும் அதிகாரியின் நேரடி ஆய்வு விபரங்கள் உங்களுக்கு கிடைக்க தொடர்பு விவரங்களை உள்ளிடவும்.' 
            : 'Required for official acknowledgment and SMS/Email status updates from the department.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <Input
            label={isTamil ? 'உங்கள் முழு பெயர்' : 'Full Name'}
            placeholder={isTamil ? 'எ.கா: சுந்தர் ராமன்' : 'e.g. Sundar Raman'}
            value={name}
            error={errors.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div>
          <Input
            type="email"
            label={isTamil ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
            placeholder="citizen@example.com"
            value={email}
            error={errors.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </div>

        {/* Phone */}
        <div>
          <Input
            type="tel"
            label={isTamil ? 'கைபேசி எண்' : 'Mobile Phone Number'}
            placeholder="9876543210"
            value={phone}
            error={errors.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </div>

        {/* Language Preference */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
            {isTamil ? 'தொடர்பு மொழி விருப்பம்' : 'Preferred Communication Language'}
          </label>
          <div className="flex gap-2 h-11 items-center">
            <button
              type="button"
              onClick={() => onChange({ preferredLanguage: 'ta' })}
              className={`flex-1 h-full rounded-lg text-xs font-medium border transition-all ${
                preferredLanguage === 'ta'
                  ? 'bg-navy-950 text-white border-navy-950'
                  : 'bg-white text-navy-700 border-navy-300 hover:bg-navy-50'
              }`}
            >
              தமிழ் (Tamil)
            </button>
            <button
              type="button"
              onClick={() => onChange({ preferredLanguage: 'en' })}
              className={`flex-1 h-full rounded-lg text-xs font-medium border transition-all ${
                preferredLanguage === 'en'
                  ? 'bg-navy-950 text-white border-navy-950'
                  : 'bg-white text-navy-700 border-navy-300 hover:bg-navy-50'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-xl bg-navy-50 border border-navy-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-navy-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isTamil ? 'குடிமக்கள் தனியுரிமை பாதுகாப்பு' : 'Strict Citizen Privacy Protection'}</span>
        </div>
        <p className="text-xs text-navy-600 leading-relaxed">
          {isTamil
            ? 'உங்கள் தொடர்பு விவரங்கள் அதிகாரப்பூர்வ விசாரணைக்காக துறைக்கு மட்டுமே அனுப்பப்படும். பொது கண்காணிப்பு தளத்தில் உங்கள் தொலைபேசி மற்றும் மின்னஞ்சல் எப்போதும் மறைக்கப்பட்டிருக்கும் (Masked).'
            : 'Your contact details are shared exclusively with the verified department for investigation. On the public tracking portal, your phone and email are fully masked.'}
        </p>
      </div>
    </div>
  );
}
