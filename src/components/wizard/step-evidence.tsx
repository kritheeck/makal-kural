'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { UploadCloud, File, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface UploadedFileMeta {
  file: File;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
}

interface StepEvidenceProps {
  attachments: UploadedFileMeta[];
  onChange: (attachments: UploadedFileMeta[]) => void;
}

export function StepEvidence({ attachments, onChange }: StepEvidenceProps) {
  const { isTamil } = useLanguage();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 5;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > maxFiles) {
      setErrorMsg(isTamil 
        ? `அதிகபட்சம் ${maxFiles} கோப்புகளை மட்டுமே இணைக்க முடியும்.` 
        : `Maximum ${maxFiles} files allowed.`);
      return;
    }

    const newAttachments: UploadedFileMeta[] = [...attachments];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate MIME
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg(isTamil 
          ? `அனுமதிக்கப்படாத கோப்பு வகை: ${file.name} (JPG, PNG, PDF மட்டுமே அனுமதிக்கப்படுகிறது).` 
          : `Invalid format: ${file.name}. Only JPG, PNG, and PDF are allowed.`);
        return;
      }

      // Validate size
      if (file.size > maxFileSize) {
        setErrorMsg(isTamil 
          ? `${file.name} கோப்பு 10MB அளவை விட அதிகமாக உள்ளது.` 
          : `File ${file.name} exceeds maximum 10MB limit.`);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      newAttachments.push({
        file,
        fileName: file.name,
        fileUrl: objectUrl,
        mimeType: file.type,
        fileSize: file.size,
      });
    }

    onChange(newAttachments);
  };

  const handleRemove = (index: number) => {
    const updated = attachments.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-bold text-navy-950 font-tamil">
          {isTamil ? '5. புகைப்படங்கள் & ஆதாரங்கள் (விருப்பமானது)' : '5. Upload Evidence & Photos (Optional)'}
        </h3>
        <p className="text-sm text-navy-600 mt-1">
          {isTamil 
            ? 'பிரச்சனையின் புகைப்படம் அல்லது ஆவணங்களை இணைப்பது தீர்வு நடவடிக்கையை விரைவுபடுத்தும்.' 
            : 'Clear photos of the pothole, water leak, or sewage issue help municipal crews verify on-site.'}
        </p>
      </div>

      {/* Drag Drop Area */}
      <div className="relative border-2 border-dashed border-navy-300 hover:border-emerald-500 rounded-2xl p-8 text-center bg-navy-50/40 hover:bg-emerald-50/20 transition-all cursor-pointer">
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          disabled={attachments.length >= maxFiles}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-white border border-navy-200 shadow-xs flex items-center justify-center text-navy-700">
            <UploadCloud className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-sm font-semibold text-navy-900">
            {isTamil ? 'புகைப்படங்களை பதிவேற்ற கிளிக் செய்யவும் அல்லது இழுத்து விடவும்' : 'Click to upload or drag & drop files here'}
          </div>
          <p className="text-xs text-navy-500">
            JPG, PNG or PDF (Max 5 files &bull; Up to 10MB each)
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-navy-700">
            {isTamil ? `இணைக்கப்பட்ட கோப்புகள் (${attachments.length}/${maxFiles})` : `Attached Evidence (${attachments.length}/${maxFiles})`}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-navy-200 bg-white shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-navy-100 flex items-center justify-center flex-shrink-0 text-navy-700">
                    {att.mimeType.startsWith('image/') ? (
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <File className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-navy-950 truncate max-w-[180px]">
                      {att.fileName}
                    </p>
                    <p className="text-[11px] text-navy-500">
                      {(att.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1 rounded-md text-navy-400 hover:text-red-600 hover:bg-navy-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
