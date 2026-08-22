import { Complaint, Representative } from '@/types/database';

export function buildXShareUrl(
  complaint: Complaint,
  representative?: Representative
): string {
  const area = complaint.locality;
  const category = complaint.category.toUpperCase();
  const ref = complaint.reference_number;
  const shortDesc = complaint.title.length > 90 
    ? complaint.title.slice(0, 87) + '...' 
    : complaint.title;

  const repHandle = representative?.x_handle ? `@${representative.x_handle.replace('@', '')}` : '';
  const appUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://makkalkural.org'}/track/${ref}`;

  const textLines = [
    `📢 Public issue reported in ${area}, ${complaint.district}.`,
    `Category: ${category}`,
    `Issue: "${shortDesc}"`,
    `Complaint Ref: #${ref}`,
    repHandle ? `Requesting official review: ${repHandle}` : 'Requesting the concerned authority to review.',
    `Track resolution: ${appUrl}`,
    `#MakkalKural #TamilNaduCivic #PublicGrievance`
  ];

  const fullText = textLines.filter(Boolean).join('\n\n');
  const encodedText = encodeURIComponent(fullText);

  return `https://x.com/intent/tweet?text=${encodedText}`;
}
