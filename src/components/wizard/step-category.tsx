'use client';

import React from 'react';
import { CIVIC_CATEGORIES } from '@/lib/constants/categories';
import { useLanguage } from '@/components/providers/language-provider';
import { Card } from '@/components/ui/card';
import { 
  Road, 
  Droplets, 
  Zap, 
  Waves, 
  Trash2, 
  Lightbulb, 
  Bus, 
  HeartPulse, 
  GraduationCap, 
  ShieldAlert, 
  FileText, 
  Shield, 
  TreePine, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Road,
  Droplets,
  Zap,
  Waves,
  Trash2,
  Lightbulb,
  Bus,
  HeartPulse,
  GraduationCap,
  ShieldAlert,
  FileText,
  Shield,
  TreePine,
  HelpCircle,
};

interface StepCategoryProps {
  selectedCategory: string;
  selectedSubcategory: string;
  onSelect: (category: string, subcategory: string) => void;
}

export function StepCategory({
  selectedCategory,
  selectedSubcategory,
  onSelect,
}: StepCategoryProps) {
  const { isTamil } = useLanguage();

  const currentCategoryData = CIVIC_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-bold text-navy-950 font-tamil">
          {isTamil ? '1. புகார் பிரிவை தேர்ந்தெடுக்கவும்' : '1. Select Complaint Category'}
        </h3>
        <p className="text-sm text-navy-600 mt-1">
          {isTamil 
            ? 'உங்கள் பொதுப் பிரச்சனைக்குரிய சரியான நிர்வாக பிரிவை தேர்வு செய்யவும்.' 
            : 'Choose the appropriate civic domain for your grievance.'}
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {CIVIC_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = iconMap[cat.icon] || HelpCircle;

          return (
            <div
              key={cat.id}
              onClick={() => onSelect(cat.id, cat.subcategoriesEn[0])}
              className={cn(
                'group relative p-4 rounded-xl border cursor-pointer transition-all duration-150 text-left select-none',
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20 shadow-sm'
                  : 'border-navy-200 bg-white hover:border-navy-300 hover:bg-navy-50/60'
              )}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-navy-100 text-navy-700 group-hover:bg-navy-200'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-navy-950 truncate font-tamil">
                      {isTamil ? cat.nameTa : cat.nameEn}
                    </h4>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-1" />
                    )}
                  </div>
                  <p className="text-xs text-navy-500 line-clamp-2 mt-1 leading-relaxed">
                    {isTamil ? cat.descriptionTa : cat.descriptionEn}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subcategories Selector if Category Selected */}
      {currentCategoryData && (
        <div className="mt-6 p-5 rounded-xl border border-navy-200 bg-navy-50/70 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-navy-700">
            {isTamil ? 'குறிப்பிட்ட துணைப் பிரிவு' : 'Specific Subcategory / Issue Type'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {(isTamil ? currentCategoryData.subcategoriesTa : currentCategoryData.subcategoriesEn).map((sub, index) => {
              const engSub = currentCategoryData.subcategoriesEn[index];
              const isSubSelected = selectedSubcategory === engSub;

              return (
                <button
                  key={engSub}
                  type="button"
                  onClick={() => onSelect(selectedCategory, engSub)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                    isSubSelected
                      ? 'bg-navy-950 text-white shadow-xs'
                      : 'bg-white border border-navy-200 text-navy-700 hover:bg-navy-100'
                  )}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
