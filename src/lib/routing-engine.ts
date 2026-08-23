import { Representative } from '@/types/database';
import { getRepresentatives } from '@/lib/supabase/database';

export interface RoutingResult {
  representative?: Representative;
  isVerified: boolean;
  matchScore: number;
  routingReason: string;
}

const PORTFOLIO_KEYWORDS: Record<string, string[]> = {
  'roads': ['public works', 'highways', 'roads', 'infrastructure', 'buildings', 'minor ports'],
  'water': ['water resources', 'irrigation', 'water supply', 'rural development', 'municipal administration'],
  'electricity': ['energy', 'electricity', 'power', 'tangedco'],
  'health': ['health', 'medical', 'hospital', 'family welfare', 'public health'],
  'education': ['school education', 'higher education', 'technical education', 'education'],
  'agriculture': ['agriculture', 'farmers', 'crop', 'irrigation', 'farm'],
  'finance': ['finance', 'revenue', 'budget', 'tax', 'treasury', 'planning'],
  'food': ['food', 'civil supplies', 'ration', 'consumer', 'price control'],
  'law': ['law', 'courts', 'prisons', 'justice', 'legal'],
  'transport': ['transport', 'motor vehicles', 'buses', 'traffic', 'highways'],
  'housing': ['housing', 'urban development', 'town planning', 'slum'],
  'social': ['social welfare', 'women', 'child', 'orphan', 'destitutes'],
  'labour': ['labour', 'employment', 'skill development', 'workers', 'industrial training'],
  'industries': ['industries', 'investment', 'manufacturing', 'industrial estates', 'msme'],
  'environment': ['environment', 'climate', 'pollution', 'forests', 'wildlife'],
  'tourism': ['tourism', 'heritage', 'pilgrimage'],
  'minorities': ['minorities', 'wakf', 'minority education'],
  'women': ['women', 'gender', 'self-help groups', 'shg'],
  'children': ['children', 'child welfare', 'school education'],
  'dairy': ['dairy', 'milk', 'animal husbandry', 'livestock', 'poultry', 'fisheries'],
  'cooperation': ['co-operation', 'cooperative', 'cooperative societies'],
  'handlooms': ['handlooms', 'textiles', 'khadi', 'handicrafts', 'silk'],
  'backward': ['backward classes', 'most backward', 'denotified', 'reservation'],
  'adi-dravidar': ['adi dravidar', 'scheduled caste', 'scheduled tribe', 'hill tribes', 'social justice'],
  'hr': ['human resources', 'pension', 'ex-servicemen'],
  'hrce': ['hindu religious', 'charitable endowments', 'temples', 'religious'],
  'nrt': ['non-resident', 'overseas', 'emigration', 'nris'],
  'excise': ['prohibition', 'excise', 'liquor', 'narcotics'],
  'it': ['information technology', 'digital services', 'electronics', 'e-governance', 'technology'],
  'natural-resources': ['minerals', 'mines', 'geology', 'natural resources'],
  'municipal': ['municipal', 'urban', 'water supply', 'sewerage', 'garbage', 'drainage'],
  'revenue': ['revenue', 'land records', 'registration', 'disaster management', 'relief'],
};

function getCategoryScore(category: string, rep: Representative): number {
  const cat = category.toLowerCase();
  const specialty = (rep.category_specialty || '').toLowerCase();
  const role = (rep.role || '').toLowerCase();
  const org = (rep.organization || '').toLowerCase();

  let score = 0;

  if (specialty.includes(cat) || cat.includes(specialty)) {
    score += 50;
  }

  for (const keywords of Object.values(PORTFOLIO_KEYWORDS)) {
    if (keywords.some(k => cat.includes(k))) {
      if (keywords.some(k => specialty.includes(k) || role.includes(k) || org.includes(k))) {
        score += 40;
        break;
      }
    }
  }

  if (rep.verification_status === 'VERIFIED') {
    score += 10;
  }

  return score;
}

export async function routeComplaintToRepresentative(
  category: string,
  district: string,
  constituency?: string
): Promise<RoutingResult> {
  const reps = await getRepresentatives();
  const districtLower = (district || '').toLowerCase();

  if (!districtLower) {
    return {
      isVerified: false,
      matchScore: 0,
      routingReason: 'District not specified',
    };
  }

  const activeReps = reps.filter(r => r.active);

  const districtReps = activeReps.filter(r => {
    const repDistrict = (r.district || '').toLowerCase();
    const repConstituency = (r.constituency || '').toLowerCase();
    const isStateLevel = repConstituency.includes('all constituencies') || repConstituency.includes('all');
    return repDistrict === districtLower || isStateLevel;
  });

  if (districtReps.length === 0) {
    return {
      isVerified: false,
      matchScore: 0,
      routingReason: `No active contact registered for district: ${district}`,
    };
  }

  const isMinisterOrMLA = (role: string) => {
    const r = role.toLowerCase();
    return r.includes('minister') || r.includes('mla') || r.includes('member of legislative') || r.includes('chief minister');
  };

  const ministerialReps = districtReps.filter(r => isMinisterOrMLA(r.role));
  const administrativeReps = districtReps.filter(r => !isMinisterOrMLA(r.role));

  const scoreCandidates = (candidates: Representative[]) => {
    return candidates
      .map(c => ({
        rep: c,
        score: getCategoryScore(category, c),
      }))
      .sort((a, b) => b.score - a.score);
  };

  const scoredMinisterial = scoreCandidates(ministerialReps);
  const scoredAdministrative = scoreCandidates(administrativeReps);

  const bestMinisterial = scoredMinisterial[0];
  const bestAdministrative = scoredAdministrative[0];

  let candidate: Representative | undefined;
  let matchScore = 0;

  if (bestMinisterial && bestMinisterial.score >= 40) {
    candidate = bestMinisterial.rep;
    matchScore = bestMinisterial.score;
  } else if (bestAdministrative && bestAdministrative.score >= 30) {
    candidate = bestAdministrative.rep;
    matchScore = bestAdministrative.score;
  } else if (bestMinisterial) {
    candidate = bestMinisterial.rep;
    matchScore = bestMinisterial.score;
  } else if (bestAdministrative) {
    candidate = bestAdministrative.rep;
    matchScore = bestAdministrative.score;
  }

  if (!candidate) {
    return {
      isVerified: false,
      matchScore: 0,
      routingReason: `No active contact registered for district: ${district}`,
    };
  }

  const isMinister = isMinisterOrMLA(candidate.role);
  const isVerified = candidate.verification_status === 'VERIFIED';

  if (isMinister && matchScore >= 40) {
    return {
      representative: candidate,
      isVerified,
      matchScore: Math.min(matchScore + 20, 100),
      routingReason: `Routed to ${candidate.role} ${candidate.name} (${candidate.organization}) — portfolio covers ${category}. Your grievance has been escalated to the state-level authority responsible for ${category} issues in Tamil Nadu.`,
    };
  }

  return {
    representative: candidate,
    isVerified,
    matchScore: Math.min(matchScore + 10, 100),
    routingReason: `Matched verified authority (${candidate.organization}) based on ${district} & category jurisdiction.`,
  };
}
