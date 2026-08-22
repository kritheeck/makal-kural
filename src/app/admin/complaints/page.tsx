'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { Complaint, ComplaintStatus, Representative } from '@/types/database';
import { TAMIL_NADU_DISTRICTS } from '@/lib/constants/locations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { 
  Search, 
  Filter, 
  Send, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  FileText, 
  RefreshCw,
  Building2,
  ExternalLink,
  Eye
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminComplaintsPage() {
  const { t, isTamil, language } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('IN_PROGRESS');
  const [publicMessage, setPublicMessage] = useState('');
  const [assignedRepId, setAssignedRepId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Resend Email State
  const [isResending, setIsResending] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resC, resR] = await Promise.all([
        fetch('/api/complaints'),
        fetch('/api/representatives'),
      ]);
      const jsonC = await resC.json();
      const jsonR = await resR.json();
      if (jsonC.success) setComplaints(jsonC.data);
      if (jsonR.success) setRepresentatives(jsonR.data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = complaints.filter(c => {
    if (districtFilter !== 'all' && c.district.toLowerCase() !== districtFilter.toLowerCase()) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.reference_number.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.locality.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenUpdateModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setNewStatus(c.status);
    setAssignedRepId(c.assigned_representative_id || '');
    setPublicMessage('');
    setIsUpdateModalOpen(true);
    setActionSuccessMsg(null);
  };

  const handleSaveUpdate = async () => {
    if (!selectedComplaint) return;
    setIsUpdating(true);
    setActionSuccessMsg(null);

    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          publicMessage: publicMessage.trim() || undefined,
          assignedRepresentativeId: assignedRepId || undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setActionSuccessMsg('Complaint status updated successfully!');
        setIsUpdateModalOpen(false);
        loadData();
      }
    } catch {
      // error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResendEmail = async (complaintId: string) => {
    setIsResending(true);
    setActionSuccessMsg(null);
    try {
      const res = await fetch(`/api/complaints/${complaintId}/email`, {
        method: 'POST',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setActionSuccessMsg('Official email re-dispatched to department successfully!');
        loadData();
      }
    } catch {
      // error
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-navy-500 mb-1">
            <Link href="/admin" className="hover:underline">Admin Console</Link> &rsaquo; Complaints
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-950 font-tamil tracking-tight">
            {isTamil ? 'அரசுப் புகார்கள் மேலாண்மை' : 'Civic Grievance Manager'}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 mt-1">
            {isTamil 
              ? 'புகார்களை ஆய்வு செய்தல், தீர்வு நிலை மாற்றுதல் மற்றும் அரசு துறைக்கு அனுப்புதல்.' 
              : 'Search, filter, assign representatives, update public resolution timelines, and re-dispatch emails.'}
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadData} className="text-xs self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          {isTamil ? 'புதுப்பி' : 'Refresh Data'}
        </Button>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <Card className="border-navy-200 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-navy-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Search reference, title, area..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full pl-9 pr-3 rounded-lg border border-navy-300 bg-white text-xs text-navy-950 shadow-xs focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <Select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="h-11 text-xs"
            >
              <option value="all">All Districts</option>
              {TAMIL_NADU_DISTRICTS.map((d) => (
                <option key={d.id} value={d.nameEn}>
                  {d.nameEn}
                </option>
              ))}
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="EMAIL_SENT">EMAIL_SENT</option>
              <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card className="border-navy-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-navy-800">
              <thead className="bg-navy-50 text-navy-600 uppercase font-semibold border-b border-navy-200">
                <tr>
                  <th className="px-5 py-3.5">Reference</th>
                  <th className="px-5 py-3.5">Category & Title</th>
                  <th className="px-5 py-3.5">Jurisdiction</th>
                  <th className="px-5 py-3.5">Severity</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Submitter Info</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-navy-500 text-xs">
                      No complaints matched the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-navy-50/50 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-navy-950 whitespace-nowrap">
                        <Link href={`/track/${c.reference_number}`} className="text-emerald-700 hover:underline">
                          {c.reference_number}
                        </Link>
                      </td>
                      <td className="px-5 py-4 max-w-[280px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                          {c.category} &rsaquo; {c.subcategory}
                        </span>
                        <div className="font-semibold text-navy-950 truncate mt-0.5">
                          {c.ai_improved_title || c.title}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-medium text-navy-900">{c.locality}</div>
                        <div className="text-[11px] text-navy-500">{c.district}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Badge severity={c.severity}>
                          {c.severity}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Badge status={c.status}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-navy-900">{c.submitter_name}</div>
                        <div className="text-[11px] text-navy-500 font-mono">{c.submitter_email}</div>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenUpdateModal(c)}
                          className="text-xs py-1 px-2.5 h-8 bg-navy-100 hover:bg-navy-200"
                        >
                          <Edit3 className="w-3.5 h-3.5 mr-1" />
                          Update
                        </Button>
                        <Link href={`/track/${c.reference_number}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs py-1 px-2.5 h-8"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Status Update & Assign Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title={`Update Complaint #${selectedComplaint.reference_number}`}
          description="Modify official status, assign representative authority, or add public timeline log."
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div>
              <Select
                label="Complaint Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
              >
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="EMAIL_SENT">EMAIL_SENT (Dispatched to official)</option>
                <option value="ACKNOWLEDGED">ACKNOWLEDGED (Official reviewed)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Maintenance crew assigned)</option>
                <option value="RESOLVED">RESOLVED (Issue fixed)</option>
                <option value="CLOSED">CLOSED</option>
              </Select>
            </div>

            <div>
              <Select
                label="Assigned Representative / Department"
                value={assignedRepId}
                onChange={(e) => setAssignedRepId(e.target.value)}
              >
                <option value="">-- No Representative Assigned --</option>
                {representatives.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.role}) - {r.organization} [{r.district}]
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Textarea
                label="Public Resolution Update Message"
                placeholder="e.g. Zonal engineering team dispatched cold-mix asphalt patch unit to repair road."
                value={publicMessage}
                onChange={(e) => setPublicMessage(e.target.value)}
                rows={3}
                helperText="This message will appear on the citizen's public tracking timeline."
              />
            </div>

            <div className="pt-4 border-t border-navy-100 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleResendEmail(selectedComplaint.id)}
                isLoading={isResending}
                className="text-xs"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                {t.admin.resendEmail}
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="civic"
                  size="sm"
                  onClick={handleSaveUpdate}
                  isLoading={isUpdating}
                  className="font-semibold"
                >
                  Save Status Update
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
