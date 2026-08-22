import { Complaint, Representative, DeliveryLog, ComplaintUpdate } from '@/types/database';

export const INITIAL_REPRESENTATIVES: Representative[] = [
  {
    id: 'rep-gcc-01',
    name: 'Commissioner Office, Greater Chennai Corporation',
    role: 'Commissioner / Grievance Cell',
    organization: 'Greater Chennai Corporation (GCC)',
    category_specialty: 'Garbage, Roads, Drainage, Street Lights',
    state: 'Tamil Nadu',
    district: 'Chennai',
    constituency: 'All Constituencies',
    email: 'commissioner@chennaicorporation.gov.in',
    x_handle: 'chennaicorp',
    official_website: 'https://chennaicorporation.gov.in',
    source_url: 'https://chennaicorporation.gov.in/gcc/grievance/',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-01T10:00:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'rep-tneb-01',
    name: 'Chief Engineer (Distribution) - Chennai South',
    role: 'Chief Distribution Engineer',
    organization: 'TANGEDCO (Tamil Nadu Electricity Board)',
    category_specialty: 'Electricity',
    state: 'Tamil Nadu',
    district: 'Chennai',
    constituency: 'Mylapore, Velachery, T.Nagar, Sholinganallur',
    email: 'cedsouth@tnebnet.org',
    x_handle: 'TANGEDCO_Offcl',
    official_website: 'https://www.tangedco.gov.in',
    source_url: 'https://www.tangedco.gov.in/contactus.html',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-01T10:00:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'rep-cmwssb-01',
    name: 'Chennai Metro Water - Operations Department',
    role: 'Executive Director (Water Supply & Sewerage)',
    organization: 'Chennai Metropolitan Water Supply and Sewerage Board (CMWSSB)',
    category_specialty: 'Water, Drainage',
    state: 'Tamil Nadu',
    district: 'Chennai',
    constituency: 'All Constituencies',
    email: 'cmwssb@tn.gov.in',
    x_handle: 'CMWSSB_Official',
    official_website: 'https://chennaimetrowater.tn.gov.in',
    source_url: 'https://chennaimetrowater.tn.gov.in/grievance',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-01T10:00:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'rep-ccmc-01',
    name: 'Commissioner, Coimbatore City Municipal Corporation',
    role: 'Municipal Commissioner',
    organization: 'Coimbatore City Municipal Corporation',
    category_specialty: 'Roads, Water, Garbage, Drainage',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    constituency: 'Coimbatore South, Coimbatore North, Singanallur',
    email: 'commr.coimbatore@tn.gov.in',
    x_handle: 'CbeCityCorp',
    official_website: 'https://www.ccmc.gov.in',
    source_url: 'https://www.ccmc.gov.in/contact-us',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-05T11:30:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-05T11:30:00Z',
  },
  {
    id: 'rep-madurai-01',
    name: 'Commissioner, Madurai Municipal Corporation',
    role: 'Corporation Commissioner',
    organization: 'Madurai Municipal Corporation',
    category_specialty: 'Roads, Drainage, Water, Healthcare',
    state: 'Tamil Nadu',
    district: 'Madurai',
    constituency: 'Madurai North, Madurai South, Madurai Central, Madurai West',
    email: 'commr.madurai@tn.gov.in',
    x_handle: 'MaduraiCorp',
    official_website: 'https://www.maduraicorporation.co.in',
    source_url: 'https://www.maduraicorporation.co.in/public-grievance',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-10T09:00:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-10T09:00:00Z',
  },
  {
    id: 'rep-trichy-01',
    name: 'Commissioner, Tiruchirappalli City Corporation',
    role: 'Corporation Commissioner',
    organization: 'Tiruchirappalli City Corporation',
    category_specialty: 'Roads, Water, Garbage, Public Safety',
    state: 'Tamil Nadu',
    district: 'Tiruchirappalli',
    constituency: 'Tiruchirappalli West, Tiruchirappalli East, Srirangam',
    email: 'commr.trichy@tn.gov.in',
    x_handle: 'TrichyCorp',
    official_website: 'https://trichycorporation.gov.in',
    source_url: 'https://trichycorporation.gov.in/contact',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-12T14:20:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-12T14:20:00Z',
  },
  {
    id: 'rep-salem-01',
    name: 'Commissioner, Salem City Municipal Corporation',
    role: 'Municipal Commissioner',
    organization: 'Salem City Municipal Corporation',
    category_specialty: 'Roads, Drainage, Street Lights, Garbage',
    state: 'Tamil Nadu',
    district: 'Salem',
    constituency: 'Salem North, Salem South, Salem West',
    email: 'commr.salem@tn.gov.in',
    x_handle: 'SalemCorp',
    official_website: 'https://salemcorporation.gov.in',
    source_url: 'https://salemcorporation.gov.in/grievance',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-14T10:00:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-14T10:00:00Z',
  },
  {
    id: 'rep-tirunelveli-01',
    name: 'Commissioner, Tirunelveli City Municipal Corporation',
    role: 'Municipal Commissioner',
    organization: 'Tirunelveli Corporation',
    category_specialty: 'Roads, Water, Sanitation, Transport',
    state: 'Tamil Nadu',
    district: 'Tirunelveli',
    constituency: 'Tirunelveli, Palayamkottai',
    email: 'commr.tirunelveli@tn.gov.in',
    x_handle: 'TirunelveliCorp',
    official_website: 'https://tirunelvelicorporation.gov.in',
    source_url: 'https://tirunelvelicorporation.gov.in/contact',
    verification_status: 'NEEDS_REVIEW',
    last_verified_at: '2026-07-25T12:00:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-07-25T12:00:00Z',
  },
  {
    id: 'rep-kanchi-01',
    name: 'District Collector & Magistrate, Kanchipuram',
    role: 'District Collector',
    organization: 'Kanchipuram District Administration',
    category_specialty: 'Government Services, Transport, Environment',
    state: 'Tamil Nadu',
    district: 'Kanchipuram',
    constituency: 'Kanchipuram, Sriperumbudur, Uthiramerur',
    email: 'collr-knc@nic.in',
    x_handle: 'KanchiCollector',
    official_website: 'https://kancheepuram.nic.in',
    source_url: 'https://kancheepuram.nic.in/citizen-charter',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-15T08:30:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-15T08:30:00Z',
  },
  {
    id: 'rep-thanjavur-01',
    name: 'District Collector, Thanjavur',
    role: 'District Collector',
    organization: 'Thanjavur District Administration',
    category_specialty: 'Water, Agriculture, Roads',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    constituency: 'Thanjavur, Kumbakonam, Papanasam, Orathanadu',
    email: 'collr-tj@nic.in',
    x_handle: 'TnjCollector',
    official_website: 'https://thanjavur.nic.in',
    source_url: 'https://thanjavur.nic.in/departments',
    verification_status: 'NEEDS_REVIEW',
    last_verified_at: '2026-07-30T11:00:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-07-30T11:00:00Z',
  },
  {
    id: 'rep-minister-chennai-01',
    name: 'Hon\'ble Minister for Chennai Metropolitan Area',
    role: 'Cabinet Minister',
    organization: 'Government of Tamil Nadu',
    category_specialty: 'All Categories',
    state: 'Tamil Nadu',
    district: 'Chennai',
    constituency: 'Chennai North, Chennai South, Chennai Central, Thousand Lights',
    email: 'minister.chennai@tn.gov.in',
    x_handle: 'TNMinistryChennai',
    official_website: 'https://www.tn.gov.in',
    source_url: 'https://www.tn.gov.in/ministry-details',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T09:00:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-20T09:00:00Z',
  },
  {
    id: 'rep-mla-coimbatore-01',
    name: 'Hon\'ble MLA, Coimbatore North Constituency',
    role: 'MLA',
    organization: 'Tamil Nadu Legislative Assembly',
    category_specialty: 'Roads, Water, Infrastructure, Healthcare',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    constituency: 'Coimbatore North, Coimbatore South, Singanallur',
    email: 'mla.coimbatore-north@tn.gov.in',
    x_handle: 'MLACbeNorth',
    official_website: 'https://www.tn.gov.in',
    source_url: 'https://www.tn.gov.in/assembly-details',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-18T10:00:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-18T10:00:00Z',
  },
  {
    id: 'rep-mla-madurai-01',
    name: 'Hon\'ble MLA, Madurai Central Constituency',
    role: 'MLA',
    organization: 'Tamil Nadu Legislative Assembly',
    category_specialty: 'All Categories',
    state: 'Tamil Nadu',
    district: 'Madurai',
    constituency: 'Madurai North, Madurai South, Madurai Central, Madurai West',
    email: 'mla.madurai-central@tn.gov.in',
    x_handle: 'MLAMduCentral',
    official_website: 'https://www.tn.gov.in',
    source_url: 'https://www.tn.gov.in/assembly-details',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-19T11:00:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-19T11:00:00Z',
  },
  {
    id: 'rep-mla-trichy-01',
    name: 'Hon\'ble MLA, Tiruchirappalli West Constituency',
    role: 'MLA',
    organization: 'Tamil Nadu Legislative Assembly',
    category_specialty: 'Roads, Water, Public Safety, Electricity',
    state: 'Tamil Nadu',
    district: 'Tiruchirappalli',
    constituency: 'Tiruchirappalli West, Tiruchirappalli East, Srirangam',
    email: 'mla.trichy-west@tn.gov.in',
    x_handle: 'MLATrichyWest',
    official_website: 'https://www.tn.gov.in',
    source_url: 'https://www.tn.gov.in/assembly-details',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-21T14:00:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-21T14:00:00Z',
  },
  {
    id: 'rep-mla-salem-01',
    name: 'Hon\'ble MLA, Salem North Constituency',
    role: 'MLA',
    organization: 'Tamil Nadu Legislative Assembly',
    category_specialty: 'Roads, Drainage, Street Lights, Agriculture',
    state: 'Tamil Nadu',
    district: 'Salem',
    constituency: 'Salem North, Salem South, Salem West',
    email: 'mla.salem-north@tn.gov.in',
    x_handle: 'MLASalemNorth',
    official_website: 'https://www.tn.gov.in',
    source_url: 'https://www.tn.gov.in/assembly-details',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-22T08:00:00Z',
    active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-22T08:00:00Z',
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'complaint-sample-01',
    reference_number: 'MK-2026-104829',
    category: 'roads',
    subcategory: 'Potholes',
    title: 'Severe crater potholes on Anna Salai service lane near Thousand Lights',
    description: 'Multiple deep potholes have formed on the service lane causing severe traffic slowdowns and motorbike skidding accidents during evening peak hours.',
    original_language: 'en',
    ai_improved_title: 'Urgent Road Repair Request: Pothole Hazards on Anna Salai Service Road',
    ai_improved_description: 'Respectfully submitting a civic grievance regarding critical tarmac damage and potholes on Anna Salai service lane (Thousand Lights constituency). This poses an active road safety hazard for two-wheelers and pedestrians. Requesting immediate patching and asphalt resurfacing.',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai',
    constituency: 'Thousand Lights',
    locality: 'Anna Salai Service Lane, Near Thousand Lights Mosque',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    assigned_representative_id: 'rep-gcc-01',
    is_anonymous: false,
    submitter_name: 'Karthikeyan Ramasamy',
    submitter_email: 'karthik.r@example.com',
    submitter_phone: '9840123456',
    submitter_language: 'en',
    created_at: '2026-08-16T14:30:00Z',
    updated_at: '2026-08-17T09:15:00Z',
    updates: [
      {
        id: 'upd-01',
        complaint_id: 'complaint-sample-01',
        status: 'EMAIL_SENT',
        message: 'Official complaint dossier dispatched to Greater Chennai Corporation (GCC) Grievance Cell.',
        is_public: true,
        created_at: '2026-08-16T14:31:00Z',
      },
      {
        id: 'upd-02',
        complaint_id: 'complaint-sample-01',
        status: 'ACKNOWLEDGED',
        message: 'Zonal Executive Engineer (Zone 9) acknowledged receipt of complaint.',
        is_public: true,
        created_at: '2026-08-16T17:00:00Z',
      },
      {
        id: 'upd-03',
        complaint_id: 'complaint-sample-01',
        status: 'IN_PROGRESS',
        message: 'Road maintenance contractor scheduled asphalt cold-mix repair works.',
        is_public: true,
        created_at: '2026-08-17T09:15:00Z',
      },
    ],
    delivery_logs: [
      {
        id: 'del-01',
        complaint_id: 'complaint-sample-01',
        channel: 'EMAIL',
        recipient: 'commissioner@chennaicorporation.gov.in',
        status: 'SUCCESS',
        external_message_id: 'resend_msg_884920194',
        sent_at: '2026-08-16T14:31:00Z',
      },
    ],
  },
  {
    id: 'complaint-sample-02',
    reference_number: 'MK-2026-209144',
    category: 'water',
    subcategory: 'Pipeline Burst / Leakage',
    title: 'Drinking water pipe burst near Gandhipuram bus stand',
    description: 'Clean drinking water is overflowing on the main road for the past 2 days resulting in thousands of litres of water wastage and low water pressure for surrounding shops and households.',
    original_language: 'en',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    city: 'Coimbatore',
    constituency: 'Coimbatore North',
    locality: 'Cross Cut Road, Gandhipuram',
    severity: 'HIGH',
    status: 'RESOLVED',
    assigned_representative_id: 'rep-ccmc-01',
    is_anonymous: false,
    submitter_name: 'Soundararajan V',
    submitter_email: 'soundar.cbe@example.com',
    submitter_phone: '9789012345',
    submitter_language: 'en',
    created_at: '2026-08-14T08:00:00Z',
    updated_at: '2026-08-15T16:00:00Z',
    updates: [
      {
        id: 'upd-201',
        complaint_id: 'complaint-sample-02',
        status: 'EMAIL_SENT',
        message: 'Dispatched to Coimbatore City Municipal Corporation water works division.',
        is_public: true,
        created_at: '2026-08-14T08:02:00Z',
      },
      {
        id: 'upd-202',
        complaint_id: 'complaint-sample-02',
        status: 'RESOLVED',
        message: 'Municipal engineering team replaced faulty pipe valve section. Water supply fully restored.',
        is_public: true,
        created_at: '2026-08-15T16:00:00Z',
      }
    ],
  },
  {
    id: 'complaint-sample-03',
    reference_number: 'MK-2026-319082',
    category: 'electricity',
    subcategory: 'Dangerous Hanging Cables',
    title: 'Low hanging high-tension electric wire near Government High School',
    description: 'Due to recent wind and heavy rains, the overhead wire has loosened and is hanging dangerously low (around 7 feet above road level) right in front of the school gate.',
    original_language: 'en',
    state: 'Tamil Nadu',
    district: 'Madurai',
    city: 'Madurai',
    constituency: 'Madurai Central',
    locality: 'Simmakkal North Street',
    severity: 'URGENT',
    status: 'ACTION_TAKEN' as any,
    assigned_representative_id: 'rep-madurai-01',
    is_anonymous: false,
    submitter_name: 'Meenakshi Sundaram',
    submitter_email: 'meenakshi.mdu@example.com',
    submitter_phone: '9443012345',
    submitter_language: 'en',
    created_at: '2026-08-17T11:00:00Z',
    updated_at: '2026-08-17T13:45:00Z',
    updates: [
      {
        id: 'upd-301',
        complaint_id: 'complaint-sample-03',
        status: 'EMAIL_SENT',
        message: 'Priority urgent alert dispatched to TANGEDCO Madurai Central Division.',
        is_public: true,
        created_at: '2026-08-17T11:02:00Z',
      },
      {
        id: 'upd-302',
        complaint_id: 'complaint-sample-03',
        status: 'IN_PROGRESS',
        message: 'Emergency lineman crew dispatched to secure and tighten the line.',
        is_public: true,
        created_at: '2026-08-17T13:45:00Z',
      }
    ],
  }
];

// In-Memory & Local Storage Store Singleton for SSR/CSR
class MockDataStore {
  private complaints: Complaint[] = [...INITIAL_COMPLAINTS];
  private representatives: Representative[] = [...INITIAL_REPRESENTATIVES];

  constructor() {
    if (typeof window !== 'undefined') {
      const storedComplaints = localStorage.getItem('mk_complaints');
      if (storedComplaints) {
        try {
          this.complaints = JSON.parse(storedComplaints);
        } catch {
          // fallback to defaults
        }
      }
      const storedReps = localStorage.getItem('mk_representatives');
      if (storedReps) {
        try {
          this.representatives = JSON.parse(storedReps);
        } catch {
          // fallback to defaults
        }
      }
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mk_complaints', JSON.stringify(this.complaints));
      localStorage.setItem('mk_representatives', JSON.stringify(this.representatives));
    }
  }

  public getComplaints(): Complaint[] {
    return this.complaints;
  }

  public getComplaintByReference(ref: string): Complaint | undefined {
    return this.complaints.find(c => c.reference_number.toUpperCase() === ref.trim().toUpperCase());
  }

  public getComplaintById(id: string): Complaint | undefined {
    return this.complaints.find(c => c.id === id);
  }

  public addComplaint(complaint: Complaint): Complaint {
    this.complaints.unshift(complaint);
    this.persist();
    return complaint;
  }

  public updateComplaintStatus(
    id: string, 
    status: any, 
    publicMessage?: string, 
    assignedRepId?: string
  ): Complaint | null {
    const complaint = this.complaints.find(c => c.id === id);
    if (!complaint) return null;

    complaint.status = status;
    complaint.updated_at = new Date().toISOString();
    if (assignedRepId) {
      complaint.assigned_representative_id = assignedRepId;
    }

    if (publicMessage) {
      if (!complaint.updates) complaint.updates = [];
      complaint.updates.unshift({
        id: 'upd-' + Date.now(),
        complaint_id: id,
        status,
        message: publicMessage,
        is_public: true,
        created_at: new Date().toISOString(),
      });
    }

    this.persist();
    return complaint;
  }

  public getRepresentatives(): Representative[] {
    return this.representatives;
  }

  public getRepresentativeById(id: string): Representative | undefined {
    return this.representatives.find(r => r.id === id);
  }

  public addRepresentative(rep: Representative): Representative {
    this.representatives.unshift(rep);
    this.persist();
    return rep;
  }

  public updateRepresentative(id: string, updates: Partial<Representative>): Representative | null {
    const rep = this.representatives.find(r => r.id === id);
    if (!rep) return null;
    Object.assign(rep, updates, { updated_at: new Date().toISOString() });
    this.persist();
    return rep;
  }
}

export const mockStore = new MockDataStore();
