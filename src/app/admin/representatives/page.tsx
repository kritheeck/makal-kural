'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { Representative, VerificationStatus } from '@/types/database';
import { TAMIL_NADU_DISTRICTS } from '@/lib/constants/locations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { 
  Building2, 
  PlusCircle, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Mail, 
  RefreshCw, 
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getAdminHeaders } from '@/lib/admin-auth';

export default function AdminRepresentativesPage() {
  const { t, isTamil, language } = useLanguage();
  const [reps, setReps] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [categorySpecialty, setCategorySpecialty] = useState('');
  const [district, setDistrict] = useState('Chennai');
  const [constituency, setConstituency] = useState('');
  const [email, setEmail] = useState('');
  const [xHandle, setXHandle] = useState('');
  const [officialWebsite, setOfficialWebsite] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('VERIFIED');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadReps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/representatives');
      const json = await res.json();
      if (json.success) setReps(json.data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReps();
  }, []);

  const handleAddRepresentative = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/representatives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders(),
        },
        body: JSON.stringify({
          name,
          role,
          organization,
          categorySpecialty,
          district,
          constituency,
          email,
          xHandle,
          officialWebsite,
          sourceUrl,
          verificationStatus,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSuccessMsg('New verified representative added successfully!');
        setIsAddModalOpen(false);
        // Reset form
        setName('');
        setRole('');
        setOrganization('');
        setCategorySpecialty('');
        setEmail('');
        setSourceUrl('');
        loadReps();
      }
    } catch {
      // error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-navy-500 mb-1">
            <Link href="/admin" className="hover:underline">Admin Console</Link> &rsaquo; Representatives
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-950 font-tamil tracking-tight">
            {isTamil ? 'அரசு அதிகாரிகள் விபரம் மேலாண்மை' : 'Official Representatives Directory'}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 mt-1">
            {isTamil
              ? 'சரிபார்க்கப்பட்ட அரசு அலுவலகங்களை சேர்த்தல், அரசு இணையதள ஆதாரங்களை புதுப்பித்தல்.'
              : 'Add, verify, and maintain official departmental and MLA contact directory with government source validation.'}
          </p>
        </div>

        <Button
          variant="civic"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs font-semibold self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5 mr-1" />
          {t.admin.addRepresentative}
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Directory Table */}
      <Card className="border-navy-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-navy-800">
              <thead className="bg-navy-50 text-navy-600 uppercase font-semibold border-b border-navy-200">
                <tr>
                  <th className="px-5 py-3.5">Authority / Official Name</th>
                  <th className="px-5 py-3.5">Role & Department</th>
                  <th className="px-5 py-3.5">District & Constituency</th>
                  <th className="px-5 py-3.5">Official Email</th>
                  <th className="px-5 py-3.5">Verification</th>
                  <th className="px-5 py-3.5">Source URL</th>
                  <th className="px-5 py-3.5">Last Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {reps.map((r) => (
                  <tr key={r.id} className="hover:bg-navy-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-navy-950">
                      {r.name}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-navy-900">{r.role}</div>
                      <div className="text-[11px] text-emerald-700 font-semibold">{r.organization}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-medium text-navy-900">{r.district}</div>
                      <div className="text-[11px] text-navy-500">{r.constituency || 'All'}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-navy-700">
                      {r.email}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Badge verification={r.verification_status}>
                        {r.verification_status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 max-w-[200px] truncate">
                      <a
                        href={r.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span className="truncate">{r.source_url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </td>
                    <td className="px-5 py-4 text-navy-500 whitespace-nowrap">
                      {r.last_verified_at ? formatDate(r.last_verified_at, language).split(',')[0] : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Representative Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Verified Public Authority / Department"
        description="Every representative must have an official public email and verifiable government source URL."
        maxWidth="xl"
      >
        <form onSubmit={handleAddRepresentative} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Official / Office Name"
                placeholder="e.g. Commissioner Office"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label="Designation / Role"
                placeholder="e.g. Corporation Commissioner"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label="Organization / Department"
                placeholder="e.g. Coimbatore Municipal Corporation"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label="Category Specialty (comma separated)"
                placeholder="e.g. Roads, Water, Garbage"
                value={categorySpecialty}
                onChange={(e) => setCategorySpecialty(e.target.value)}
              />
            </div>
            <div>
              <Select
                label="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                {TAMIL_NADU_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.nameEn}>
                    {d.nameEn}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Input
                label="Constituencies / Jurisdiction"
                placeholder="e.g. All Constituencies / Mylapore"
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="email"
                label="Official Public Email"
                placeholder="commr@tn.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                label="Official X (Twitter) Handle"
                placeholder="e.g. ChennaiCorp"
                value={xHandle}
                onChange={(e) => setXHandle(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Input
              type="url"
              label="Official Source / Gazette URL (Mandatory Proof)"
              placeholder="https://chennaicorporation.gov.in/gcc/contact/"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              required
              helperText="Source must be an official .gov.in, .tn.gov.in, or nic.in portal URL."
            />
          </div>

          <div>
            <Select
              label="Verification Status"
              value={verificationStatus}
              onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
            >
              <option value="VERIFIED">VERIFIED (Eligible for automatic email dispatch)</option>
              <option value="NEEDS_REVIEW">NEEDS_REVIEW (Under administrative audit)</option>
              <option value="DISABLED">DISABLED</option>
            </Select>
          </div>

          <div className="pt-4 border-t border-navy-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="civic"
              size="sm"
              isLoading={isSaving}
              className="font-semibold"
            >
              Save Representative
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
