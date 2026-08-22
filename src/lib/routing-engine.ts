import { Representative } from '@/types/database';
import { getRepresentatives } from '@/lib/supabase/database';

export interface RoutingResult {
  representative?: Representative;
  isVerified: boolean;
  matchScore: number;
  routingReason: string;
}

export async function routeComplaintToRepresentative(
  category: string,
  district: string,
  constituency?: string
): Promise<RoutingResult> {
  const reps = await getRepresentatives();

  if (!district) {
    return {
      isVerified: false,
      matchScore: 0,
      routingReason: 'District not specified',
    };
  }

  const districtReps = reps.filter(
    r => r.active && r.district.toLowerCase() === district.toLowerCase()
  );

  if (districtReps.length === 0) {
    return {
      isVerified: false,
      matchScore: 0,
      routingReason: `No active municipal or departmental contact registered for district: ${district}`,
    };
  }

  const isMinisterOrMLA = (role: string) => {
    const r = role.toLowerCase();
    return r.includes('minister') || r.includes('mla') || r.includes('member of legislative') || r.includes('chief minister');
  };

  const ministerialReps = districtReps.filter(r => isMinisterOrMLA(r.role));
  const administrativeReps = districtReps.filter(r => !isMinisterOrMLA(r.role));

  const pickBest = (candidates: Representative[]) => {
    if (candidates.length === 0) return undefined;
    const verified = candidates.filter(c => c.verification_status === 'VERIFIED');
    if (verified.length === 0) return candidates[0];
    let categoryMatch = verified.find(r => {
      if (!r.category_specialty) return false;
      return r.category_specialty.toLowerCase().includes(category.toLowerCase());
    });
    if (constituency && verified.length > 1) {
      const constMatch = verified.find(r => {
        if (!r.constituency) return false;
        return (
          r.constituency.toLowerCase().includes(constituency.toLowerCase()) ||
          r.constituency.toLowerCase().includes('all constituencies')
        );
      });
      if (constMatch) categoryMatch = constMatch;
    }
    return categoryMatch || verified[0];
  };

  const candidate = pickBest(ministerialReps) || pickBest(administrativeReps);

  if (!candidate) {
    return {
      isVerified: false,
      matchScore: 0,
      routingReason: `No active contact registered for district: ${district}`,
    };
  }

  const isMinister = isMinisterOrMLA(candidate.role);
  const isVerified = candidate.verification_status === 'VERIFIED';

  return {
    representative: candidate,
    isVerified,
    matchScore: isVerified ? 100 : 50,
    routingReason: isMinister
      ? `Routed directly to ${candidate.role} (${candidate.organization}) for ${district}${constituency ? ` — ${constituency}` : ''}.`
      : `Matched verified authority (${candidate.organization}) based on ${district} & category jurisdiction.`,
  };
}
