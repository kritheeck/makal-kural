'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, RotateCcw, Languages, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepAiAssistantProps {
  originalTitle: string;
  originalDescription: string;
  aiTitle?: string;
  aiDescription?: string;
  translatedDescription?: string;
  category: string;
  locality: string;
  district: string;
  onApplyAi: (aiTitle: string, aiDescription: string, translatedDesc?: string) => void;
  onRevert: () => void;
}

export function StepAiAssistant({
  originalTitle,
  originalDescription,
  aiTitle,
  aiDescription,
  translatedDescription,
  category,
  locality,
  district,
  onApplyAi,
  onRevert,
}: StepAiAssistantProps) {
  const { isTamil, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'original' | 'improved'>('improved');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isApplied = Boolean(aiTitle && aiDescription);

  const handleImprove = async () => {
    if (!originalTitle || !originalDescription) {
      setErrorMsg(isTamil ? 'முதலில் தலைப்பு மற்றும் விபரத்தை எழுதவும்.' : 'Please enter title and description first.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: originalTitle,
          description: originalDescription,
          category,
          locality,
          district,
          language,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        onApplyAi(
          json.data.improvedTitle,
          json.data.improvedDescription,
          json.data.translatedDescription
        );
        setActiveTab('improved');
      } else {
        setErrorMsg(json.error || 'Failed to improve text');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            {isTamil ? 'செயற்கை நுண்ணறிவு உதவி' : 'Civic AI Helper'}
          </span>
        </div>
        <h3 className="text-xl font-bold text-navy-950 font-tamil mt-1">
          {isTamil ? '4. புகாரை AI மூலம் சீரமைக்க (விருப்பமானது)' : '4. AI Complaint Assistant (Optional)'}
        </h3>
        <p className="text-sm text-navy-600 mt-1">
          {isTamil 
            ? 'அரசு அதிகாரிகள் உடனடியாக நடவடிக்கை எடுக்க ஏதுவாக, உங்கள் புகாரை தெளிவான ஆவண நடையாக மாற்றலாம்.' 
            : 'Enhance your draft: fixes grammar, creates a professional subject line, structures key points, and ensures civic tone.'}
        </p>
      </div>

      {/* AI Trigger Action Card */}
      <div className="p-5 rounded-xl border border-emerald-200/80 bg-emerald-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-navy-950 font-tamil">
            {isTamil ? 'ஒரே கிளிக்கில் புகாரை முறைப்படுத்தலாம்' : 'Enhance Clarity & Structure with AI'}
          </h4>
          <p className="text-xs text-navy-600">
            {isTamil 
              ? 'உங்கள் அசல் எழுத்து எப்போதும் மாற்றப்படாமல் பாதுகாக்கப்படும்.' 
              : 'Never invents facts. Original submission is always preserved.'}
          </p>
        </div>

        <Button
          type="button"
          variant="civic"
          onClick={handleImprove}
          isLoading={loading}
          className="shadow-sm"
        >
          <Sparkles className="w-4 h-4 mr-1.5 text-emerald-200" />
          {isTamil ? 'AI மூலம் சீரமைக்க' : 'Improve My Complaint'}
        </Button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Comparison View */}
      {isApplied && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-navy-200 pb-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('improved')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  activeTab === 'improved'
                    ? 'bg-navy-950 text-white'
                    : 'text-navy-600 hover:bg-navy-100'
                )}
              >
                {isTamil ? 'AI சீரமைத்த வடிவம்' : 'AI Enhanced Version'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('original')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  activeTab === 'original'
                    ? 'bg-navy-950 text-white'
                    : 'text-navy-600 hover:bg-navy-100'
                )}
              >
                {isTamil ? 'அசல் வடிவம்' : 'Original Draft'}
              </button>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRevert}
              className="text-xs text-navy-500 hover:text-red-600"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              {isTamil ? 'அசல் நிலைக்கு திரும்பு' : 'Revert to Original'}
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-navy-200 bg-white space-y-3">
            <div className="text-xs text-navy-500 font-semibold uppercase tracking-wider">
              {activeTab === 'improved' ? (isTamil ? 'சீரமைக்கப்பட்ட தலைப்பு' : 'Enhanced Subject / Title') : (isTamil ? 'அசல் தலைப்பு' : 'Original Title')}
            </div>
            <div className="text-sm font-semibold text-navy-950">
              {activeTab === 'improved' ? aiTitle : originalTitle}
            </div>

            <div className="text-xs text-navy-500 font-semibold uppercase tracking-wider pt-2 border-t border-navy-100">
              {activeTab === 'improved' ? (isTamil ? 'சீரமைக்கப்பட்ட விபரம்' : 'Enhanced Formal Text') : (isTamil ? 'அசல் விபரம்' : 'Original Description')}
            </div>
            <div className="text-xs text-navy-800 whitespace-pre-wrap leading-relaxed bg-navy-50/60 p-3 rounded-lg border border-navy-100">
              {activeTab === 'improved' ? aiDescription : originalDescription}
            </div>

            {activeTab === 'improved' && translatedDescription && (
              <div className="pt-2 border-t border-navy-100">
                <div className="text-xs text-navy-500 font-semibold uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Languages className="w-3 h-3 text-emerald-600" />
                  {isTamil ? 'ஆங்கில மொழிபெயர்ப்பு சுருக்கம்' : 'Bilingual Reference Summary'}
                </div>
                <p className="text-xs text-navy-700 italic bg-white p-2.5 rounded border border-navy-100">
                  {translatedDescription}
                </p>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              {isTamil
                ? 'AI-உதவி மூலம் உருவாக்கப்பட்ட வடிவம் உறுதி செய்யப்பட்டுள்ளது. அடுத்த படிக்கு தொடரலாம்.'
                : 'AI-enhanced text is currently active for this complaint submission.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
