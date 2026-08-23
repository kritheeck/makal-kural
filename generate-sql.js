const fs = require('fs');
const content = fs.readFileSync('src/lib/supabase/mock-store.ts', 'utf8');

const sqlLines = [];
sqlLines.push('-- Tamil Nadu Cabinet Ministers & Chief Minister');
sqlLines.push('-- Generated from mock-store.ts');
sqlLines.push('TRUNCATE TABLE representatives CASCADE;');
sqlLines.push('');

// Extract all minister blocks by matching the object pattern
const ministerBlocks = [];
let currentBlock = [];
for (const line of content.split('\n')) {
  if (line.includes('{') && currentBlock.length === 0 && line.trim() === '{') {
    currentBlock = [line];
  } else if (currentBlock.length > 0) {
    currentBlock.push(line);
    if (line.trim() === '},') {
      const blockStr = currentBlock.join('\n');
      if (blockStr.includes("role: 'Cabinet Minister'") || blockStr.includes("role: 'Chief Minister'")) {
        ministerBlocks.push(blockStr);
      }
      currentBlock = [];
    }
  }
}

console.log('Found minister blocks:', ministerBlocks.length);

ministerBlocks.forEach((block) => {
  const idMatch = block.match(/id: '([^']+)'/);
  const nameMatch = block.match(/name: '((?:[^'\\]|\\.)*)'/);
  const roleMatch = block.match(/role: '([^']+)'/);
  const orgMatch = block.match(/organization: '((?:[^'\\]|\\.)*)'/);
  const specialtyMatch = block.match(/category_specialty: '((?:[^'\\]|\\.)*)'/);
  const stateMatch = block.match(/state: '([^']+)'/);
  const districtMatch = block.match(/district: '([^']+)'/);
  const constituencyMatch = block.match(/constituency: '([^']+)'/);
  const emailMatch = block.match(/email: '([^']+)'/);
  const xMatch = block.match(/x_handle: '([^']+)'/);
  const websiteMatch = block.match(/official_website: '([^']+)'/);
  const sourceMatch = block.match(/source_url: '([^']+)'/);
  const verifiedMatch = block.match(/verification_status: '([^']+)'/);
  const lastVerifiedMatch = block.match(/last_verified_at: '([^']+)'/);
  const createdMatch = block.match(/created_at: '([^']+)'/);
  const updatedMatch = block.match(/updated_at: '([^']+)'/);

  const id = idMatch ? idMatch[1] : '';
  const name = nameMatch ? nameMatch[1].replace(/\\'/g, "''") : '';
  const role = roleMatch ? roleMatch[1] : '';
  const org = orgMatch ? orgMatch[1].replace(/\\'/g, "''") : 'Government of Tamil Nadu';
  const specialty = specialtyMatch ? specialtyMatch[1].replace(/\\'/g, "''") : '';
  const state = stateMatch ? stateMatch[1] : 'Tamil Nadu';
  const district = districtMatch ? districtMatch[1] : 'Chennai';
  const constituency = constituencyMatch ? constituencyMatch[1] : 'All Constituencies';
  const email = emailMatch ? emailMatch[1] : '';
  const xHandle = xMatch ? xMatch[1] : '';
  const website = websiteMatch ? websiteMatch[1] : 'https://www.tn.gov.in';
  const source = sourceMatch ? sourceMatch[1] : 'https://www.tn.gov.in/minister_list.php';
  const verified = verifiedMatch ? verifiedMatch[1] : 'VERIFIED';
  const lastVerified = lastVerifiedMatch ? lastVerifiedMatch[1] : '2026-08-23T06:00:00Z';
  const created = createdMatch ? createdMatch[1] : '2026-01-01T00:00:00Z';
  const updated = updatedMatch ? updatedMatch[1] : '2026-08-23T06:00:00Z';

  sqlLines.push(`INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (`);
  sqlLines.push(`  '${id}', '${name}', '${role}', '${org}', '${specialty}', '${state}', '${district}', '${constituency}', '${email}', '${xHandle}', '${website}', '${source}', '${verified}', '${lastVerified}', true, '${created}', '${updated}'`);
  sqlLines.push(`);`);
  sqlLines.push('');
});

fs.writeFileSync('supabase-ministers.sql', sqlLines.join('\n'));
console.log('Generated supabase-ministers.sql with', ministerBlocks.length, 'ministers');
