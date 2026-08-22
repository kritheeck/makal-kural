export interface AiImprovementResult {
  improvedTitle: string;
  improvedDescription: string;
  translatedDescription?: string;
  summaryBullets: string[];
  suggestedSubject: string;
  isAbusiveFiltered: boolean;
}

export function improveComplaint(
  title: string,
  description: string,
  category: string,
  locality: string,
  district: string,
  language: 'en' | 'ta' = 'en'
): AiImprovementResult {
  // Clean vulgar/unconstructive phrasing if any
  let cleanDesc = description.trim();
  let abusiveFiltered = false;

  const profaneWords = ['idiot', 'useless', 'corrupt bastard', 'scam', 'fraud'];
  profaneWords.forEach(bad => {
    const reg = new RegExp(bad, 'gi');
    if (reg.test(cleanDesc)) {
      cleanDesc = cleanDesc.replace(reg, '[concern regarding performance]');
      abusiveFiltered = true;
    }
  });

  const categoryFormatted = category.charAt(0).toUpperCase() + category.slice(1);

  if (language === 'ta') {
    const improvedTitle = `அவசர தீர்வு கோரிக்கை: ${locality}, ${district} பகுதியில் ${title}`;
    const improvedDescription = `மதிப்பிற்குரிய மக்கள் பிரதிநிதி / அரசு அலுவலர் அவர்களுக்கு,\n\n${district} மாவட்டம், ${locality} பகுதியில் நிலவும் கீழ்க்கண்ட பொதுப் பிரச்சனை குறித்து தங்களின் உடனடி கவனத்திற்கு கொண்டு வருகிறேன்:\n\n• பிரச்சனை விபரம்: ${cleanDesc}\n• பாதிக்கப்பட்ட பகுதி: ${locality}, ${district}\n• கோரிக்கை: பொதுமக்களின் பாதுகாப்பு மற்றும் நலன் கருதி இப்பிரச்சனைக்கு உரிய தீர்வு காணுமாறு பணிவுடன் கேட்டுக் கொள்கிறேன்.\n\nநன்றி,\nபொதுமக்கள் நலன் கருதி சமர்ப்பிக்கப்பட்ட மனு.`;
    
    return {
      improvedTitle,
      improvedDescription,
      translatedDescription: `Formal Civic Grievance Petition regarding ${categoryFormatted} at ${locality}, ${district}: ${cleanDesc}`,
      summaryBullets: [
        `Location: ${locality}, ${district}`,
        `Core Grievance: ${cleanDesc}`,
        `Action Requested: Urgent civic inspection and maintenance repair`,
      ],
      suggestedSubject: `[Makkal Kural] பொதுப் புகார் மனு #${categoryFormatted} — ${locality}, ${district}`,
      isAbusiveFiltered: abusiveFiltered,
    };
  }

  // English Enhancement
  const improvedTitle = `Civic Grievance: Urgent ${categoryFormatted} Maintenance Request at ${locality}, ${district}`;
  const improvedDescription = `To the Concerned Authority / Public Representative,\n\nI am submitting this formal public grievance regarding an urgent civic issue in ${locality}, ${district}.\n\nDetails of the Grievance:\n• Issue Description: ${cleanDesc}\n• Affected Area / Locality: ${locality}, ${district}\n• Impact: Causes daily inconvenience and potential hazard to residents, commuters, and pedestrians.\n\nRequested Action:\nKindly inspect the location and initiate official remedial action at the earliest convenience.\n\nRespectfully submitted on behalf of local residents.`;

  return {
    improvedTitle,
    improvedDescription,
    translatedDescription: `மதிப்பிற்குரிய அதிகாரி அவர்களுக்கு, ${district} மாவட்டம் ${locality} பகுதியில் நிலவும் ${categoryFormatted} தொடர்பான இந்த அவசர கோரிக்கையை உடனே ஆய்வு செய்து நடவடிக்கை எடுக்குமாறு கேட்டுக்கொள்கிறேன்.`,
    summaryBullets: [
      `Jurisdiction: ${locality}, ${district}`,
      `Category: ${categoryFormatted}`,
      `Summary: ${cleanDesc.length > 80 ? cleanDesc.slice(0, 80) + '...' : cleanDesc}`,
      `Desired Outcome: On-site municipal inspection and timely resolution`,
    ],
    suggestedSubject: `[Public Complaint] Urgent ${categoryFormatted} Issue — ${locality}, ${district}`,
    isAbusiveFiltered: abusiveFiltered,
  };
}
