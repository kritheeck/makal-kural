export type UserRole = 'USER' | 'ADMIN';
export type PreferredLanguage = 'en' | 'ta';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ComplaintStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'EMAIL_QUEUED' 
  | 'EMAIL_SENT' 
  | 'EMAIL_FAILED' 
  | 'ACKNOWLEDGED' 
  | 'IN_PROGRESS' 
  | 'RESOLVED' 
  | 'CLOSED';

export type VerificationStatus = 'VERIFIED' | 'NEEDS_REVIEW' | 'DISABLED';

export type DeliveryChannel = 'EMAIL' | 'X_API' | 'X_SHARE' | 'WHATSAPP' | 'SMS' | 'PORTAL';
export type DeliveryStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'QUEUED';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  preferred_language: PreferredLanguage;
  created_at: string;
  updated_at: string;
}

export interface Representative {
  id: string;
  name: string;
  role: string;
  organization: string;
  category_specialty?: string;
  state: string;
  district: string;
  constituency?: string;
  email: string;
  x_handle?: string;
  official_website?: string;
  source_url: string;
  verification_status: VerificationStatus;
  last_verified_at?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplaintAttachment {
  id: string;
  complaint_id: string;
  file_name: string;
  storage_path: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  created_at: string;
}

export interface DeliveryLog {
  id: string;
  complaint_id: string;
  channel: DeliveryChannel;
  recipient: string;
  status: DeliveryStatus;
  external_message_id?: string;
  external_url?: string;
  error_message?: string;
  sent_at: string;
}

export interface ComplaintUpdate {
  id: string;
  complaint_id: string;
  status: ComplaintStatus;
  message: string;
  is_public: boolean;
  created_by?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  reference_number: string;
  user_id?: string;
  category: string;
  subcategory: string;
  title: string;
  description: string;
  original_language: PreferredLanguage;
  ai_improved_title?: string;
  ai_improved_description?: string;
  translated_description?: string;
  state: string;
  district: string;
  city: string;
  constituency?: string;
  locality: string;
  latitude?: number;
  longitude?: number;
  severity: SeverityLevel;
  status: ComplaintStatus;
  assigned_representative_id?: string;
  assigned_representative?: Representative;
  is_anonymous: boolean;
  submitter_name: string;
  submitter_email: string;
  submitter_phone?: string;
  submitter_language?: PreferredLanguage;
  attachments?: ComplaintAttachment[];
  delivery_logs?: DeliveryLog[];
  updates?: ComplaintUpdate[];
  created_at: string;
  updated_at: string;
}
