import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
}

export function Alert({ className, variant = 'info', title, children, ...props }: AlertProps) {
  const icons = {
    info: <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />,
    danger: <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />,
  };

  const variants = {
    info: 'bg-blue-50/80 border-blue-200 text-blue-900',
    success: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50/80 border-amber-200 text-amber-900',
    danger: 'bg-red-50/80 border-red-200 text-red-900',
  };

  return (
    <div
      role="alert"
      className={cn('flex gap-3.5 p-4 rounded-xl border text-sm', variants[variant], className)}
      {...props}
    >
      {icons[variant]}
      <div className="space-y-1">
        {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
