import { Complaint, Representative } from '@/types/database';

export function buildXShareUrl(
  complaint: Complaint,
  representative?: Representative
): string {
  const area = complaint.locality;
  const category = complaint.category.toUpperCase();
  const ref = complaint.reference_number;
  const shortDesc = complaint.title.length > 100 
    ? complaint.title.slice(0, 97) + '...' 
    : complaint.title;

  const repHandle = representative?.x_handle ? `@${representative.x_handle.replace('@', '')}` : '';
  const repName = representative?.name || '';
  const appUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://makkalkural.org'}/track/${ref}`;

  const tagLine = repHandle 
    ? `Requesting ${repHandle} (${repName}) to review this urgently.` 
    : 'Requesting the concerned authority to review this urgently.';

  const textLines = [
    `📢 Public Issue Alert: ${shortDesc}`,
    `📍 ${area}, ${complaint.district}`,
    `🏷️ ${category}`,
    `🔗 Complaint Ref: #${ref}`,
    ``,
    tagLine,
    ``,
    `Track & update: ${appUrl}`,
    ``,
    `#MakkalKural #TamilNaduCivic #PublicGrievance #CivicAccountability`
  ];

  const fullText = textLines.filter(line => line !== undefined).join('\n');
  const encodedText = encodeURIComponent(fullText);

  return `https://x.com/intent/tweet?text=${encodedText}`;
}

export function buildXOfficialReplyUrl(
  complaint: Complaint,
  representative?: Representative
): string {
  const ref = complaint.reference_number;
  const repHandle = representative?.x_handle ? `@${representative.x_handle.replace('@', '')}` : '';
  const appUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://makkalkural.org'}/track/${ref}`;

  if (!repHandle || !representative) {
    return buildXShareUrl(complaint, representative);
  }

  const textLines = [
    `${repHandle} A public grievance has been filed regarding "${complaint.title.slice(0, 80)}${complaint.title.length > 80 ? '...' : ''}" in ${complaint.locality}, ${complaint.district}.`,
    ``,
    `Category: ${complaint.category.toUpperCase()}`,
    `Complaint Ref: #${ref}`,
    ``,
    `Citizens are awaiting your response. Please review and take necessary action.`,
    ``,
    `Track: ${appUrl}`,
    ``,
    `#MakkalKural #TamilNaduCivic #PublicGrievance`
  ];

  const fullText = textLines.filter(line => line !== undefined).join('\n');
  const encodedText = encodeURIComponent(fullText);

  return `https://x.com/intent/tweet?text=${encodedText}`;
}
