'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { SeverityLevel, PreferredLanguage, Representative, DeliveryLog, DeliveryChannel } from '@/types/database';
import { routeComplaintToRepresentative } from '@/lib/routing-engine';
import { buildXShareUrl } from '@/lib/x-share-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StepCategory } from '@/components/wizard/step-category';
import { StepLocation } from '@/components/wizard/step-location';
import { StepDetails } from '@/components/wizard/step-details';
import { StepAiAssistant } from '@/components/wizard/step-ai-assistant';
import { StepEvidence, UploadedFileMeta } from '@/components/wizard/step-evidence';
import { StepContact } from '@/components/wizard/step-contact';
import { StepRouting } from '@/components/wizard/step-routing';
import { StepPreview } from '@/components/wizard/step-preview';
  import { 
    ArrowLeft, 
    ArrowRight, 
    CheckCircle2, 
    Copy, 
    Check, 
    Share2, 
    Search, 
    PlusCircle, 
    Sparkles,
    ShieldCheck,
    Crown,
    AlertCircle
  } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RaiseComplaintPage() {
  const { t, isTamil, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Form State
  const [category, setCategory] = useState('roads');
  const [subcategory, setSubcategory] = useState('Potholes');
  const [district, setDistrict] = useState('Chennai');
  const [city, setCity] = useState('Chennai');
  const [constituency, setConstituency] = useState('Thousand Lights');
  const [locality, setLocality] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateStarted, setDateStarted] = useState(new Date().toISOString().split('T')[0]);
  const [isOngoing, setIsOngoing] = useState(true);
  const [severity, setSeverity] = useState<SeverityLevel>('MEDIUM');

  // AI assistant state
  const [aiTitle, setAiTitle] = useState<string | undefined>();
  const [aiDescription, setAiDescription] = useState<string | undefined>();
  const [translatedDescription, setTranslatedDescription] = useState<string | undefined>();

  // Evidence state
  const [attachments, setAttachments] = useState<UploadedFileMeta[]>([]);

  // Contact state
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [submitterPhone, setSubmitterPhone] = useState('');
  const [submitterLang, setSubmitterLang] = useState<PreferredLanguage>(language);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [legalConfirmed, setLegalConfirmed] = useState(false);

  // Flow & submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{
    referenceNumber: string;
    complaintId: string;
    assignedRep?: Representative;
    deliveryLogs?: DeliveryLog[];
    multiChannelResult?: any;
  } | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Routing preview computation
  const routing = routeComplaintToRepresentative(category, district, constituency);

  // Validation per step
  const validateCurrentStep = (): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!category) errs.category = 'Please select a category';
    } else if (currentStep === 2) {
      if (!district) errs.district = 'Please select a district';
      if (!city.trim()) errs.city = 'Please enter city or town';
      if (!locality.trim()) errs.locality = 'Please enter area / locality / landmark';
    } else if (currentStep === 3) {
      if (!title.trim() || title.length < 5) {
        errs.title = isTamil ? 'தலைப்பு குறைந்தது 5 எழுத்துக்கள் இருக்க வேண்டும்' : 'Title must be at least 5 characters';
      }
      if (!description.trim() || description.length < 20) {
        errs.description = isTamil ? 'விபரம் குறைந்தது 20 எழுத்துக்கள் இருக்க வேண்டும்' : 'Description must be at least 20 characters';
      }
      if (!dateStarted) errs.dateStarted = 'Please select date';
    } else if (currentStep === 5) {
      if (!submitterName.trim()) {
        errs.name = isTamil ? 'பெயர் தேவை' : 'Full name is required';
      }
      if (!submitterEmail.trim() || !submitterEmail.includes('@')) {
        errs.email = isTamil ? 'சரியான மின்னஞ்சல் முகவரி தேவை' : 'Valid email is required';
      }
      if (!submitterPhone.trim() || submitterPhone.length < 10) {
        errs.phone = isTamil ? '10 இலக்க கைபேசி எண் தேவை' : 'Valid 10-digit mobile number required';
      }
    } else if (currentStep === 7) {
      if (!legalConfirmed) {
        errs.legal = isTamil 
          ? 'புகார் சமர்ப்பிக்க நீங்கள் உறுதிமொழி அளிக்க வேண்டும்.' 
          : 'You must check the confirmation box before submitting.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        category,
        subcategory,
        state: 'Tamil Nadu',
        district,
        city,
        constituency,
        locality,
        latitude,
        longitude,
        title,
        description,
        aiImprovedTitle: aiTitle,
        aiImprovedDescription: aiDescription,
        translatedDescription,
        dateStarted,
        isOngoing,
        severity,
        originalLanguage: language,
        submitterName,
        submitterEmail,
        submitterPhone,
        submitterLanguage: submitterLang,
        isAnonymous,
        attachments: attachments.map(a => ({
          fileName: a.fileName,
          fileUrl: a.fileUrl,
          mimeType: a.mimeType,
          fileSize: a.fileSize,
        })),
      };

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSubmitSuccess({
          referenceNumber: json.referenceNumber,
          complaintId: json.complaintId,
          assignedRep: json.assignedRepresentative,
          deliveryLogs: json.deliveryLogs,
          multiChannelResult: json.multiChannelResult,
        });
      } else {
        setErrors({ submit: json.error || 'Failed to submit complaint' });
      }
    } catch (err: any) {
      setErrors({ submit: err.message || 'Network connection failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  // SUCCESS SCREEN
  if (submitSuccess) {
    const xShareUrl = buildXShareUrl(
      {
        id: submitSuccess.complaintId,
        reference_number: submitSuccess.referenceNumber,
        title: aiTitle || title,
        locality,
        district,
        category,
      } as any,
      submitSuccess.assignedRep
    );

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <Card className="border-2 border-emerald-500 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="bg-emerald-600 text-white p-6 sm:p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-white">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold font-tamil">
              {isTamil ? 'புகார் மனு வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Complaint Dossier Dispatched Successfully!'}
            </h2>
            <p className="text-emerald-100 text-sm max-w-md mx-auto">
              {isTamil
                ? 'உங்கள் புகார் அதிகாரப்பூர்வமாக பதிவு செய்யப்பட்டு உரிய துறைக்கு மின்னஞ்சல் வழியாக அனுப்பப்பட்டுள்ளது.'
                : 'Your complaint has been formally registered and dispatched to the designated verified authority.'}
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            
            {/* Reference Number Box */}
            <div className="p-5 rounded-2xl bg-navy-50 border border-navy-200 text-center space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                {isTamil ? 'உங்கள் அதிகாரப்பூர்வ புகார் குறிப்பு எண்' : 'Official Grievance Reference Number'}
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-navy-950 tracking-wider">
                {submitSuccess.referenceNumber}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopyReference(submitSuccess.referenceNumber)}
                className="mt-2 text-xs"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copiedRef ? (isTamil ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (isTamil ? 'எண்ணை நகலெடு' : 'Copy Reference Number')}
              </Button>
            </div>

             {/* Recipient Dispatch Summary */}
             {submitSuccess.assignedRep && (
               <div className={`p-4 rounded-xl border flex items-start gap-3 ${submitSuccess.assignedRep.role.toLowerCase().includes('minister') || submitSuccess.assignedRep.role.toLowerCase().includes('mla') || submitSuccess.assignedRep.role.toLowerCase().includes('chief minister') ? 'border-amber-300 bg-amber-50' : 'border-emerald-200 bg-emerald-50/50'}`}>
                 {submitSuccess.assignedRep.role.toLowerCase().includes('minister') || submitSuccess.assignedRep.role.toLowerCase().includes('mla') || submitSuccess.assignedRep.role.toLowerCase().includes('chief minister') ? (
                   <Crown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                 ) : (
                   <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                 )}
                 <div className="text-xs text-navy-800">
                   <strong className="text-navy-950 block mb-0.5">
                     {isTamil ? 'நேரடியாக அனுப்பப்பட்ட துறை / அதிகாரி:' : 'Directly Routed to Elected Representative / Authority:'}
                   </strong>
                   {submitSuccess.assignedRep.name} ({submitSuccess.assignedRep.role}) &bull; {submitSuccess.assignedRep.email}
                   <div className="mt-1 text-[11px] text-navy-500">
                     {isTamil ? 'இது உங்கள் மாவட்டம்/தொகுதிக்குரிய சரிபார்க்கப்பட்ட அரசு அதிகாரிக்கு நேரடியாக புகார் மனு அனுப்பப்பட்டுள்ளது.' : 'Your complaint has been directly routed to the verified representative for your district/constituency.'}
                   </div>
                 </div>
               </div>
             )}

             {/* Multi-Channel Delivery Status */}
             {submitSuccess.deliveryLogs && submitSuccess.deliveryLogs.length > 0 && (
               <div className="p-4 rounded-xl border border-navy-200 bg-navy-50/50 space-y-2">
                 <div className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                   {isTamil ? 'பரிமாற நிலைகள் (Multi-Channel Dispatch):' : 'Delivery Status (Multi-Channel Dispatch):'}
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {submitSuccess.deliveryLogs.map((log) => (
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
                       {log.channel}
                       {log.status === 'SUCCESS' && <CheckCircle2 className="w-3.5 h-3.5" />}
                       {log.status === 'FAILED' && <AlertCircle className="w-3.5 h-3.5" />}
                     </span>
                   ))}
                 </div>
               </div>
             )}

            {/* Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              {/* Track Online */}
              <Link href={`/track/${submitSuccess.referenceNumber}`} className="w-full">
                <Button variant="primary" className="w-full">
                  <Search className="w-4 h-4 mr-1.5" />
                  {isTamil ? 'புகார் நிலையை காண்க' : 'Track Grievance Online'}
                </Button>
              </Link>

              {/* Share on X */}
              <a
                href={xShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="secondary" className="w-full bg-navy-100 hover:bg-navy-200 text-navy-900 border border-navy-300">
                  <Share2 className="w-4 h-4 mr-1.5 text-navy-700" />
                  {isTamil ? 'X (Twitter)-ல் பகிர்க' : 'Share on X (Twitter)'}
                </Button>
              </a>
            </div>

            <div className="text-center pt-4 border-t border-navy-100">
              <Link
                href="/raise-complaint"
                onClick={() => setSubmitSuccess(null)}
                className="text-xs font-semibold text-emerald-700 hover:underline flex items-center justify-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {isTamil ? 'மற்றொரு புதிய புகாரை பதிவு செய்ய' : 'Raise another complaint'}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Wizard Header */}
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-950 font-tamil tracking-tight">
          {isTamil ? 'பொதுப் புகார் பதிவு செய்க' : 'Raise a Public Grievance'}
        </h1>
        <p className="text-xs sm:text-sm text-navy-600 max-w-xl mx-auto">
          {isTamil
            ? 'அரசு துறை மற்றும் மக்கள் பிரதிநிதிகளுக்கு நேரடியாக செல்லும் வெளிப்படையான புகார் படிவம்.'
            : 'Fill in the details below to route your complaint directly to the verified municipal or legislative authority.'}
        </p>

        {/* Stepper Progress Indicator */}
        <div className="pt-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2 text-xs font-semibold text-navy-600">
            <span>
              {t.wizard.stepOf
                .replace('{current}', String(currentStep))
                .replace('{total}', String(totalSteps))}
            </span>
            <span className="font-tamil">
              {currentStep === 1 && (isTamil ? 'பிரிவு தேர்வு' : 'Category')}
              {currentStep === 2 && (isTamil ? 'இருப்பிடம்' : 'Location')}
              {currentStep === 3 && (isTamil ? 'புகார் விபரம்' : 'Details')}
              {currentStep === 4 && (isTamil ? 'AI சீரமைப்பு' : 'AI Assistant')}
              {currentStep === 5 && (isTamil ? 'ஆதாரங்கள்' : 'Evidence')}
              {currentStep === 6 && (isTamil ? 'தொடர்பு விபரம்' : 'Contact')}
              {currentStep === 7 && (isTamil ? 'முன்னோட்டம்' : 'Preview & Dispatch')}
            </span>
          </div>

          <div className="w-full bg-navy-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Container Card */}
      <Card className="shadow-lg border-navy-200/90 overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          
          {currentStep === 1 && (
            <StepCategory
              selectedCategory={category}
              selectedSubcategory={subcategory}
              onSelect={(cat, sub) => {
                setCategory(cat);
                setSubcategory(sub);
              }}
            />
          )}

          {currentStep === 2 && (
            <StepLocation
              district={district}
              constituency={constituency}
              city={city}
              locality={locality}
              latitude={latitude}
              longitude={longitude}
              errors={errors}
              onChange={(fields) => {
                if (fields.district !== undefined) setDistrict(fields.district);
                if (fields.constituency !== undefined) setConstituency(fields.constituency);
                if (fields.city !== undefined) setCity(fields.city);
                if (fields.locality !== undefined) setLocality(fields.locality);
                if (fields.latitude !== undefined) setLatitude(fields.latitude);
                if (fields.longitude !== undefined) setLongitude(fields.longitude);
              }}
            />
          )}

          {currentStep === 3 && (
            <StepDetails
              title={title}
              description={description}
              dateStarted={dateStarted}
              isOngoing={isOngoing}
              severity={severity}
              errors={errors}
              onChange={(fields) => {
                if (fields.title !== undefined) setTitle(fields.title);
                if (fields.description !== undefined) setDescription(fields.description);
                if (fields.dateStarted !== undefined) setDateStarted(fields.dateStarted);
                if (fields.isOngoing !== undefined) setIsOngoing(fields.isOngoing);
                if (fields.severity !== undefined) setSeverity(fields.severity);
              }}
            />
          )}

          {currentStep === 4 && (
            <StepAiAssistant
              originalTitle={title}
              originalDescription={description}
              aiTitle={aiTitle}
              aiDescription={aiDescription}
              translatedDescription={translatedDescription}
              category={category}
              locality={locality}
              district={district}
              onApplyAi={(ait, aid, trd) => {
                setAiTitle(ait);
                setAiDescription(aid);
                setTranslatedDescription(trd);
              }}
              onRevert={() => {
                setAiTitle(undefined);
                setAiDescription(undefined);
                setTranslatedDescription(undefined);
              }}
            />
          )}

          {currentStep === 5 && (
            <StepEvidence
              attachments={attachments}
              onChange={(atts) => setAttachments(atts)}
            />
          )}

          {currentStep === 6 && (
            <StepContact
              name={submitterName}
              email={submitterEmail}
              phone={submitterPhone}
              preferredLanguage={submitterLang}
              isAnonymous={isAnonymous}
              errors={errors}
              onChange={(fields) => {
                if (fields.name !== undefined) setSubmitterName(fields.name);
                if (fields.email !== undefined) setSubmitterEmail(fields.email);
                if (fields.phone !== undefined) setSubmitterPhone(fields.phone);
                if (fields.preferredLanguage !== undefined) setSubmitterLang(fields.preferredLanguage);
                if (fields.isAnonymous !== undefined) setIsAnonymous(fields.isAnonymous);
              }}
            />
          )}

          {currentStep === 7 && (
            <div className="space-y-6">
              <StepRouting
                representative={routing.representative}
                isVerified={routing.isVerified}
                routingReason={routing.routingReason}
                category={category}
                district={district}
                locality={locality}
                title={aiTitle || title}
                description={aiDescription || description}
              />

              <StepPreview
                category={category}
                subcategory={subcategory}
                district={district}
                city={city}
                constituency={constituency}
                locality={locality}
                title={title}
                description={description}
                aiTitle={aiTitle}
                aiDescription={aiDescription}
                dateStarted={dateStarted}
                severity={severity}
                submitterName={submitterName}
                submitterEmail={submitterEmail}
                submitterPhone={submitterPhone}
                attachments={attachments}
                representative={routing.representative}
                deliveryLogs={routing.representative ? [
                  { id: 'preview-email', complaint_id: '', channel: 'EMAIL' as DeliveryChannel, status: 'PENDING' as any, recipient: routing.representative.email, sent_at: new Date().toISOString() },
                  ...(routing.representative.role.toLowerCase().includes('minister') || routing.representative.role.toLowerCase().includes('mla') || routing.representative.role.toLowerCase().includes('chief minister') ? [
                    { id: 'preview-x', complaint_id: '', channel: 'X_API' as DeliveryChannel, status: 'PENDING' as any, recipient: routing.representative.email, sent_at: new Date().toISOString() },
                    { id: 'preview-whatsapp', complaint_id: '', channel: 'WHATSAPP' as DeliveryChannel, status: 'PENDING' as any, recipient: routing.representative.email, sent_at: new Date().toISOString() },
                    { id: 'preview-sms', complaint_id: '', channel: 'SMS' as DeliveryChannel, status: 'PENDING' as any, recipient: routing.representative.email, sent_at: new Date().toISOString() },
                    { id: 'preview-portal', complaint_id: '', channel: 'PORTAL' as DeliveryChannel, status: 'PENDING' as any, recipient: routing.representative.email, sent_at: new Date().toISOString() },
                  ] : [])
                ] : undefined}
                legalConfirmed={legalConfirmed}
                onConfirmChange={(val) => setLegalConfirmed(val)}
                error={errors.legal}
              />
            </div>
          )}

          {/* Submission Global Error if any */}
          {errors.submit && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {errors.submit}
            </div>
          )}

          {/* Wizard Navigation Footer Buttons */}
          <div className="mt-8 pt-6 border-t border-navy-100 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
                className="text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                {t.wizard.back}
              </Button>
            ) : (
              <Link href="/">
                <Button type="button" variant="ghost" size="sm" className="text-xs text-navy-500">
                  {isTamil ? 'ரத்து செய்க' : 'Cancel'}
                </Button>
              </Link>
            )}

            {currentStep < totalSteps ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                className="text-xs font-semibold px-5"
              >
                {t.wizard.next}
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="civic"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                className="text-xs font-bold px-6 shadow-md shadow-emerald-700/20"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                {t.wizard.submit}
              </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
