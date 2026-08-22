import { z } from 'zod';

export const complaintStepCategorySchema = z.object({
  category: z.string().min(1, 'Please select a complaint category'),
  subcategory: z.string().min(1, 'Please select a subcategory'),
});

export const complaintStepLocationSchema = z.object({
  state: z.string().default('Tamil Nadu'),
  district: z.string().min(1, 'Please select your district'),
  city: z.string().min(2, 'City / Town name is required'),
  constituency: z.string().optional(),
  locality: z.string().min(3, 'Area / Locality / Street name is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const complaintStepDetailsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150, 'Title cannot exceed 150 characters'),
  description: z.string().min(20, 'Please provide a detailed description (minimum 20 characters)'),
  dateStarted: z.string().min(1, 'Please indicate when the issue began'),
  isOngoing: z.boolean().default(true),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  originalLanguage: z.enum(['en', 'ta']).default('en'),
});

export const complaintStepContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9+ -]{10,15}$/, 'Please enter a valid 10-digit mobile number'),
  preferredLanguage: z.enum(['en', 'ta']).default('en'),
  isAnonymous: z.boolean().default(false),
  legalConfirmed: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm that the complaint details are truthful' }),
  }),
});

export const fullComplaintSubmissionSchema = z.object({
  category: z.string().min(1),
  subcategory: z.string().min(1),
  state: z.string().default('Tamil Nadu'),
  district: z.string().min(1),
  city: z.string().min(1),
  constituency: z.string().optional(),
  locality: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  title: z.string().min(5),
  description: z.string().min(20),
  aiImprovedTitle: z.string().optional(),
  aiImprovedDescription: z.string().optional(),
  translatedDescription: z.string().optional(),
  dateStarted: z.string(),
  isOngoing: z.boolean().default(true),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  originalLanguage: z.enum(['en', 'ta']).default('en'),
  assignedRepresentativeId: z.string().optional(),
  submitterName: z.string().min(2),
  submitterEmail: z.string().email(),
  submitterPhone: z.string(),
  submitterLanguage: z.enum(['en', 'ta']).default('en'),
  isAnonymous: z.boolean().default(false),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileUrl: z.string(),
    mimeType: z.string(),
    fileSize: z.number(),
  })).optional(),
});
