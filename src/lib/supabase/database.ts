import { supabase, supabaseAdmin, isSupabaseConfigured } from './client';
import { mockStore } from './mock-store';
import { Complaint, Representative, ComplaintAttachment, DeliveryLog, ComplaintUpdate, AuditLog } from '@/types/database';

// Helper to get active Supabase client (service role admin client preferred on server)
function getDb() {
  return supabaseAdmin || supabase;
}

export async function getRepresentatives(filters?: { district?: string; verification?: string; search?: string }): Promise<Representative[]> {
  const client = getDb();
  if (!isSupabaseConfigured || !client) {
    return filterReps(mockStore.getRepresentatives(), filters);
  }

  try {
    let query = client.from('representatives').select('*').eq('active', true);
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
    if (error || !data || data.length === 0) {
      return filterReps(mockStore.getRepresentatives(), filters);
    }
    return data;
  } catch {
    return filterReps(mockStore.getRepresentatives(), filters);
  }
}

function filterReps(reps: Representative[], filters?: { district?: string; verification?: string; search?: string }): Representative[] {
  let list = reps.filter(r => r.active);
  if (filters?.district && filters.district !== 'all') {
    list = list.filter(r => r.district.toLowerCase() === filters.district!.toLowerCase());
  }
  if (filters?.verification && filters.verification !== 'all') {
    list = list.filter(r => r.verification_status === filters.verification);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.organization.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q) ||
      r.district.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function getRepresentativeById(id: string): Promise<Representative | null> {
  const client = getDb();
  if (!isSupabaseConfigured || !client) {
    return mockStore.getRepresentativeById(id) || null;
  }
  try {
    const { data, error } = await client.from('representatives').select('*').eq('id', id).maybeSingle();
    if (error || !data) return mockStore.getRepresentativeById(id) || null;
    return data;
  } catch {
    return mockStore.getRepresentativeById(id) || null;
  }
}

export async function createRepresentative(rep: Representative): Promise<Representative | null> {
  mockStore.addRepresentative(rep);
  const client = getDb();
  if (!isSupabaseConfigured || !client) return rep;
  try {
    const { data, error } = await client.from('representatives').insert(rep).select().single();
    if (error) {
      console.error('createRepresentative error', error);
      return rep;
    }
    return data || rep;
  } catch {
    return rep;
  }
}

export async function getComplaints(filters?: { district?: string; category?: string; status?: string; search?: string }): Promise<Complaint[]> {
  const client = getDb();
  if (!isSupabaseConfigured || !client) {
    return filterComplaints(mockStore.getComplaints(), filters);
  }
  try {
    let query = client.from('complaints').select('*');
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
    if (error || !data || data.length === 0) {
      return filterComplaints(mockStore.getComplaints(), filters);
    }
    return data;
  } catch {
    return filterComplaints(mockStore.getComplaints(), filters);
  }
}

function filterComplaints(complaints: Complaint[], filters?: { district?: string; category?: string; status?: string; search?: string }): Complaint[] {
  let list = [...complaints];
  if (filters?.district && filters.district !== 'all') {
    list = list.filter(c => c.district.toLowerCase() === filters.district!.toLowerCase());
  }
  if (filters?.category && filters.category !== 'all') {
    list = list.filter(c => c.category.toLowerCase() === filters.category!.toLowerCase());
  }
  if (filters?.status && filters.status !== 'all') {
    list = list.filter(c => c.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(c =>
      c.reference_number.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.locality.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function getComplaintByReference(ref: string): Promise<Complaint | null> {
  const client = getDb();
  if (!isSupabaseConfigured || !client) {
    return mockStore.getComplaintByReference(ref) || null;
  }
  try {
    const { data, error } = await client.from('complaints').select('*').eq('reference_number', ref).maybeSingle();
    if (error || !data) return mockStore.getComplaintByReference(ref) || null;
    return data;
  } catch {
    return mockStore.getComplaintByReference(ref) || null;
  }
}

export async function getComplaintById(id: string): Promise<Complaint | null> {
  const client = getDb();
  if (!isSupabaseConfigured || !client) {
    return mockStore.getComplaintById(id) || null;
  }
  try {
    const { data, error } = await client.from('complaints').select('*').eq('id', id).maybeSingle();
    if (error || !data) return mockStore.getComplaintById(id) || null;
    return data;
  } catch {
    return mockStore.getComplaintById(id) || null;
  }
}

export async function getComplaintWithDetails(idOrRef: string): Promise<Complaint | null> {
  const client = getDb();
  let base: Complaint | null = null;

  if (isSupabaseConfigured && client) {
    try {
      base = await getComplaintById(idOrRef);
      if (!base) base = await getComplaintByReference(idOrRef);
    } catch {
      base = null;
    }
  }

  if (!base) {
    const mock = mockStore.getComplaintByReference(idOrRef) || mockStore.getComplaintById(idOrRef);
    return mock || null;
  }

  if (!client) {
    return base;
  }

  try {
    const [updatesRes, logsRes, attsRes, repRes] = await Promise.all([
      client.from('complaint_updates').select('*').eq('complaint_id', base.id).order('created_at', { ascending: false }),
      client.from('delivery_logs').select('*').eq('complaint_id', base.id).order('sent_at', { ascending: false }),
      client.from('complaint_attachments').select('*').eq('complaint_id', base.id),
      base.assigned_representative_id ? client.from('representatives').select('*').eq('id', base.assigned_representative_id).maybeSingle() : Promise.resolve({ data: null, error: null }),
    ]);

    let attachments = attsRes.data || [];
    if (!attachments.length && attsRes.error) {
      const fallbackAtts = await client.from('attachments').select('*').eq('complaint_id', base.id);
      attachments = fallbackAtts.data || [];
    }

    const mockMatch = mockStore.getComplaintById(base.id);
    if ((!attachments || attachments.length === 0) && mockMatch?.attachments) {
      attachments = mockMatch.attachments;
    }

    const updates = updatesRes.data || [];
    const logs = logsRes.data || [];
    const representative = repRes.data || (base.assigned_representative_id ? mockStore.getRepresentativeById(base.assigned_representative_id) : undefined);

    return {
      ...base,
      updates: updates.length ? updates : (mockMatch?.updates || []),
      delivery_logs: logs.length ? logs : (mockMatch?.delivery_logs || []),
      attachments,
      assigned_representative: representative || undefined,
    };
  } catch {
    return base;
  }
}

export async function createComplaint(complaint: Complaint): Promise<Complaint | null> {
  mockStore.addComplaint(complaint);
  const client = getDb();
  if (!isSupabaseConfigured || !client) return complaint;

  try {
    const { data, error } = await client.from('complaints').insert(complaint).select().single();
    if (error) {
      console.error('createComplaint Supabase error', error);
      return complaint;
    }
    return data || complaint;
  } catch (err) {
    console.error('createComplaint exception', err);
    return complaint;
  }
}

export async function updateComplaintStatus(
  id: string,
  status: string,
  message?: string,
  isPublic = true,
  assignedRepresentativeId?: string,
  createdBy?: string
): Promise<boolean> {
  mockStore.updateComplaintStatus(id, status, message, assignedRepresentativeId);
  const client = getDb();
  if (!isSupabaseConfigured || !client) return true;

  try {
    const updatePayload: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (assignedRepresentativeId) {
      updatePayload.assigned_representative_id = assignedRepresentativeId;
    }

    const { error: updateError } = await client
      .from('complaints')
      .update(updatePayload)
      .eq('id', id);

    if (updateError) {
      console.error('updateComplaintStatus error', updateError);
      return false;
    }

    if (message) {
      const { error: insertError } = await client.from('complaint_updates').insert({
        id: crypto.randomUUID(),
        complaint_id: id,
        status,
        message,
        is_public: isPublic,
        created_by: createdBy,
        created_at: new Date().toISOString(),
      });
      if (insertError) {
        console.error('insertComplaintUpdate error', insertError);
      }
    }
    return true;
  } catch (err) {
    console.error('updateComplaintStatus exception', err);
    return false;
  }
}

export async function getComplaintAttachments(complaintId: string): Promise<ComplaintAttachment[]> {
  const client = getDb();
  if (!isSupabaseConfigured || !client) {
    const mock = mockStore.getComplaintById(complaintId);
    return mock?.attachments || [];
  }

  try {
    let { data, error } = await client.from('complaint_attachments').select('*').eq('complaint_id', complaintId);
    if (error && error.message?.includes('does not exist')) {
      const res = await client.from('attachments').select('*').eq('complaint_id', complaintId);
      data = res.data;
    }
    if (!data || data.length === 0) {
      const mock = mockStore.getComplaintById(complaintId);
      return mock?.attachments || [];
    }
    return data || [];
  } catch {
    const mock = mockStore.getComplaintById(complaintId);
    return mock?.attachments || [];
  }
}

export async function createComplaintAttachment(attachment: ComplaintAttachment): Promise<ComplaintAttachment | null> {
  const mock = mockStore.getComplaintById(attachment.complaint_id);
  if (mock) {
    if (!mock.attachments) mock.attachments = [];
    mock.attachments.push(attachment);
  }

  const client = getDb();
  if (!isSupabaseConfigured || !client) return attachment;

  try {
    let { data, error } = await client.from('complaint_attachments').insert(attachment).select().single();
    if (error && error.message?.includes('does not exist')) {
      const res = await client.from('attachments').insert(attachment).select().single();
      data = res.data;
      error = res.error;
    }
    if (error) {
      console.error('createComplaintAttachment error', error);
      return attachment;
    }
    return data || attachment;
  } catch (err) {
    console.error('createComplaintAttachment exception', err);
    return attachment;
  }
}

export async function uploadAttachment(
  file: File,
  complaintId: string
): Promise<{ path: string; url: string } | null> {
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${complaintId}/${Date.now()}_${cleanFileName}`;
  const bucketName = 'evidence';

  let buffer: Buffer;
  try {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } catch (err) {
    console.error('Failed to read file buffer', err);
    return null;
  }

  const client = getDb();
  if (!isSupabaseConfigured || !client) {
    const mime = file.type || 'image/jpeg';
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mime};base64,${base64}`;
    return { path: storagePath, url: dataUrl };
  }

  try {
    const { error: uploadError } = await client.storage
      .from(bucketName)
      .upload(storagePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('uploadAttachment storage error', uploadError);

      const isMissingBucket =
        uploadError.message?.toLowerCase().includes('bucket') ||
        (uploadError as any).statusCode === 404 ||
        (uploadError as any).statusCode === '404';

      if (isMissingBucket) {
        try {
          await client.storage.createBucket(bucketName, { public: true });
          const retry = await client.storage
            .from(bucketName)
            .upload(storagePath, buffer, {
              contentType: file.type || 'application/octet-stream',
              cacheControl: '3600',
              upsert: true,
            });

          if (!retry.error) {
            const { data: retryUrl } = client.storage.from(bucketName).getPublicUrl(storagePath);
            if (retryUrl?.publicUrl) {
              return { path: storagePath, url: retryUrl.publicUrl };
            }
          }
        } catch (createErr) {
          console.error('Failed to auto-create bucket evidence', createErr);
        }
      }

      const mime = file.type || 'image/jpeg';
      const base64 = buffer.toString('base64');
      return { path: storagePath, url: `data:${mime};base64,${base64}` };
    }

    const { data: urlData } = client.storage.from(bucketName).getPublicUrl(storagePath);
    if (!urlData?.publicUrl) {
      const mime = file.type || 'image/jpeg';
      return { path: storagePath, url: `data:${mime};base64,${buffer.toString('base64')}` };
    }

    return { path: storagePath, url: urlData.publicUrl };
  } catch (err) {
    console.error('uploadAttachment exception', err);
    const mime = file.type || 'image/jpeg';
    return { path: storagePath, url: `data:${mime};base64,${buffer.toString('base64')}` };
  }
}

export async function createDeliveryLog(log: DeliveryLog): Promise<DeliveryLog | null> {
  const client = getDb();
  if (!isSupabaseConfigured || !client) return log;
  try {
    const { data, error } = await client.from('delivery_logs').insert(log).select().single();
    if (error) { console.error('createDeliveryLog error', error); return log; }
    return data || log;
  } catch {
    return log;
  }
}

export async function createComplaintUpdate(update: ComplaintUpdate): Promise<ComplaintUpdate | null> {
  const client = getDb();
  if (!isSupabaseConfigured || !client) return update;
  try {
    const { data, error } = await client.from('complaint_updates').insert(update).select().single();
    if (error) { console.error('createComplaintUpdate error', error); return update; }
    return data || update;
  } catch {
    return update;
  }
}

export async function createAuditLog(log: AuditLog): Promise<AuditLog | null> {
  const client = getDb();
  if (!isSupabaseConfigured || !client) return log;
  try {
    const { data, error } = await client.from('audit_logs').insert(log).select().single();
    if (error) { console.error('createAuditLog error', error); return log; }
    return data || log;
  } catch {
    return log;
  }
}
