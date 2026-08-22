import React from 'react';
import { cn } from '@/lib/utils';
import { ComplaintStatus, SeverityLevel, VerificationStatus } from '@/types/database';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  status?: ComplaintStatus;
  severity?: SeverityLevel;
  verification?: VerificationStatus;
}

export function Badge({ className, variant = 'default', status, severity, verification, children, ...props }: BadgeProps) {
  let badgeStyle = 'bg-navy-100 text-navy-800 border-navy-200';

  if (verification) {
    if (verification === 'VERIFIED') {
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold';
    } else if (verification === 'NEEDS_REVIEW') {
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-300 font-medium';
    } else {
      badgeStyle = 'bg-red-50 text-red-700 border-red-300';
    }
  } else if (severity) {
    if (severity === 'URGENT') {
      badgeStyle = 'bg-red-100 text-red-800 border-red-300 font-bold animate-pulse';
    } else if (severity === 'HIGH') {
      badgeStyle = 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
    } else if (severity === 'MEDIUM') {
      badgeStyle = 'bg-blue-50 text-blue-800 border-blue-200';
    } else {
      badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
    }
  } else if (status) {
    switch (status) {
      case 'RESOLVED':
        badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
        break;
      case 'IN_PROGRESS':
        badgeStyle = 'bg-blue-100 text-blue-800 border-blue-300 font-semibold';
        break;
      case 'ACKNOWLEDGED':
        badgeStyle = 'bg-purple-100 text-purple-800 border-purple-300';
        break;
      case 'EMAIL_SENT':
        badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';
        break;
      case 'EMAIL_FAILED':
        badgeStyle = 'bg-red-100 text-red-800 border-red-300';
        break;
      case 'SUBMITTED':
      case 'EMAIL_QUEUED':
        badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
        break;
      default:
        badgeStyle = 'bg-slate-100 text-slate-800 border-slate-200';
    }
  } else {
    const variants = {
      default: 'bg-navy-100 text-navy-800 border-navy-200',
      success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      warning: 'bg-amber-50 text-amber-800 border-amber-200',
      danger: 'bg-red-50 text-red-800 border-red-200',
      info: 'bg-blue-50 text-blue-800 border-blue-200',
      neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    badgeStyle = variants[variant];
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border tracking-wide select-none',
        badgeStyle,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
