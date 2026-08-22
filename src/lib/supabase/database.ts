import { supabase, isSupabaseConfigured } from './client';
import { Complaint, Representative, ComplaintAttachment, DeliveryLog, ComplaintUpdate, AuditLog } from '@/types/database';

export async function getRepresentatives(filters?: { district?: string; verification?: string; search?: string }): Promise<Representative[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  let query = supabase.from('representatives').select('*').eq('active', true);
  if (filters?.district && filters.district !== 'all') {
    query = query.ilike('district', filters.district);
  }
  if (filters?.verification && filters.verification !== 'all') {
    query = query.eq('verification_status', filters.verification);
  }
  if (filters?.search) {
    const q = `%${filters.search}%`;
    query = query.or(`name.ilike.${q},organization.ilike.${q},role.ilike.${q},district.ilike.${q}`);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) { console.error('getRepresentatives error', error); return []; }
  return data || [];
}

export async function getRepresentativeById(id: string): Promise<Representative | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('representatives').select('*').eq('id', id).maybeSingle();
  if (error) { console.error('getRepresentativeById error', error); return null; }
  return data;
}

export async function createRepresentative(rep: Representative): Promise<Representative | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('representatives').insert(rep).select().single();
  if (error) { console.error('createRepresentative error', error); return null; }
  return data;
}

export async function getComplaints(filters?: { district?: string; category?: string; status?: string; search?: string }): Promise<Complaint[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  let query = supabase.from('complaints').select('*');
  if (filters?.district && filters.district !== 'all') {
    query = query.ilike('district', filters.district);
  }
  if (filters?.category && filters.category !== 'all') {
    query = query.ilike('category', filters.category);
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.search) {
    const q = `%${filters.search}%`;
    query = query.or(`reference_number.ilike.${q},title.ilike.${q},locality.ilike.${q},district.ilike.${q}`);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) { console.error('getComplaints error', error); return []; }
  return data || [];
}

export async function getComplaintByReference(ref: string): Promise<Complaint | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('complaints').select('*').eq('reference_number', ref).maybeSingle();
  if (error) { console.error('getComplaintByReference error', error); return null; }
  return data;
}

export async function getComplaintById(id: string): Promise<Complaint | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('complaints').select('*').eq('id', id).maybeSingle();
  if (error) { console.error('getComplaintById error', error); return null; }
  return data;
}

export async function getComplaintWithDetails(idOrRef: string): Promise<Complaint | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  let base = await getComplaintById(idOrRef);
  if (!base) base = await getComplaintByReference(idOrRef);
  if (!base) return null;

  const [updatesRes, logsRes, attachmentsRes, repRes] = await Promise.all([
    supabase.from('complaint_updates').select('*').eq('complaint_id', base.id).order('created_at', { ascending: false }),
    supabase.from('delivery_logs').select('*').eq('complaint_id', base.id).order('sent_at', { ascending: false }),
    supabase.from('complaint_attachments').select('*').eq('complaint_id', base.id),
    base.assigned_representative_id ? supabase.from('representatives').select('*').eq('id', base.assigned_representative_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  const updates = updatesRes.data || [];
  const logs = logsRes.data || [];
  const attachments = attachmentsRes.data || [];
  const representative = repRes.data;

  return {
    ...base,
    updates,
    delivery_logs: logs,
    attachments,
    assigned_representative: representative || undefined,
  };
}

export async function createComplaint(complaint: Complaint): Promise<Complaint | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('complaints').insert(complaint).select().single();
  if (error) { console.error('createComplaint error', error); return null; }
  return data;
}

export async function updateComplaintStatus(id: string, status: string, message?: string, isPublic = true, createdBy?: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error: updateError } = await supabase.from('complaints').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  if (updateError) { console.error('updateComplaintStatus error', updateError); return false; }
  if (message) {
    const { error: insertError } = await supabase.from('complaint_updates').insert({
      id: crypto.randomUUID(),
      complaint_id: id,
      status,
      message,
      is_public: isPublic,
      created_by: createdBy,
      created_at: new Date().toISOString(),
    });
    if (insertError) { console.error('insertComplaintUpdate error', insertError); return false; }
  }
  return true;
}

export async function getComplaintAttachments(complaintId: string): Promise<ComplaintAttachment[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from('complaint_attachments').select('*').eq('complaint_id', complaintId);
  if (error) { console.error('getComplaintAttachments error', error); return []; }
  return data || [];
}

export async function createComplaintAttachment(attachment: ComplaintAttachment): Promise<ComplaintAttachment | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('complaint_attachments').insert(attachment).select().single();
  if (error) { console.error('createComplaintAttachment error', error); return null; }
  return data;
}

export async function uploadAttachment(file: File, complaintId: string): Promise<{ path: string; url: string } | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const fileName = `${Date.now()}_${file.name}`;
  const storagePath = `evidence/${complaintId}/${fileName}`;
  const { error: uploadError } = await supabase.storage.from('evidence').upload(storagePath, file, { cacheControl: '3600', upsert: false });
  if (uploadError) { console.error('uploadAttachment error', uploadError); return null; }
  const { data: urlData } = supabase.storage.from('evidence').getPublicUrl(storagePath);
  if (!urlData?.publicUrl) return null;
  return { path: storagePath, url: urlData.publicUrl };
}

export async function createDeliveryLog(log: DeliveryLog): Promise<DeliveryLog | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('delivery_logs').insert(log).select().single();
  if (error) { console.error('createDeliveryLog error', error); return null; }
  return data;
}

export async function createComplaintUpdate(update: ComplaintUpdate): Promise<ComplaintUpdate | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('complaint_updates').insert(update).select().single();
  if (error) { console.error('createComplaintUpdate error', error); return null; }
  return data;
}

export async function createAuditLog(log: AuditLog): Promise<AuditLog | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('audit_logs').insert(log).select().single();
  if (error) { console.error('createAuditLog error', error); return null; }
  return data;
}
