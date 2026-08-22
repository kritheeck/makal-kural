-- =========================================================
-- Makkal Kural (மக்கள் குரல்) — Seed Public Representatives Directory
-- =========================================================

-- Insert Initial Civic & Departmental Public Offices (Tamil Nadu)
INSERT INTO representatives (
    name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active
) VALUES
-- Chennai - Greater Chennai Corporation & TANGEDCO
(
    'Commissioner Office, Greater Chennai Corporation',
    'Commissioner / Grievance Cell',
    'Greater Chennai Corporation (GCC)',
    'Garbage, Roads, Drainage, Street Lights',
    'Tamil Nadu',
    'Chennai',
    'All Constituencies',
    'commissioner@chennaicorporation.gov.in',
    'chennaicorp',
    'https://chennaicorporation.gov.in',
    'https://chennaicorporation.gov.in/gcc/grievance/',
    'VERIFIED',
    '2026-08-01 10:00:00+00',
    TRUE
),
(
    'Chief Engineer (Distribution) - Chennai South',
    'Chief Distribution Engineer',
    'TANGEDCO (Tamil Nadu Electricity Board)',
    'Electricity',
    'Tamil Nadu',
    'Chennai',
    'Mylapore, Velachery, T.Nagar, Sholinganallur',
    'cedsouth@tnebnet.org',
    'TANGEDCO_Offcl',
    'https://www.tangedco.gov.in',
    'https://www.tangedco.gov.in/contactus.html',
    'VERIFIED',
    '2026-08-01 10:00:00+00',
    TRUE
),
(
    'Chennai Metro Water - Operations Department',
    'Executive Director (Water Supply & Sewerage)',
    'Chennai Metropolitan Water Supply and Sewerage Board (CMWSSB)',
    'Water, Drainage',
    'Tamil Nadu',
    'Chennai',
    'All Constituencies',
    'cmwssb@tn.gov.in',
    'CMWSSB_Official',
    'https://chennaimetrowater.tn.gov.in',
    'https://chennaimetrowater.tn.gov.in/grievance',
    'VERIFIED',
    '2026-08-01 10:00:00+00',
    TRUE
),
-- Coimbatore - Corporation & Water
(
    'Commissioner, Coimbatore City Municipal Corporation',
    'Municipal Commissioner',
    'Coimbatore City Municipal Corporation',
    'Roads, Water, Garbage, Drainage',
    'Tamil Nadu',
    'Coimbatore',
    'Coimbatore South, Coimbatore North, Singanallur',
    'commr.coimbatore@tn.gov.in',
    'CbeCityCorp',
    'https://www.ccmc.gov.in',
    'https://www.ccmc.gov.in/contact-us',
    'VERIFIED',
    '2026-08-05 11:30:00+00',
    TRUE
),
(
    'Superintending Engineer, TANGEDCO Coimbatore Metro',
    'Superintending Engineer',
    'TANGEDCO',
    'Electricity',
    'Tamil Nadu',
    'Coimbatore',
    'Coimbatore South, Coimbatore North, Kavundampalayam',
    'secbem@tnebnet.org',
    'TANGEDCO_Offcl',
    'https://www.tangedco.gov.in',
    'https://www.tangedco.gov.in/contactus.html',
    'VERIFIED',
    '2026-08-05 11:30:00+00',
    TRUE
),
-- Madurai - Corporation & Civic Health
(
    'Commissioner, Madurai Municipal Corporation',
    'Corporation Commissioner',
    'Madurai Municipal Corporation',
    'Roads, Drainage, Water, Healthcare',
    'Tamil Nadu',
    'Madurai',
    'Madurai North, Madurai South, Madurai Central, Madurai West',
    'commr.madurai@tn.gov.in',
    'MaduraiCorp',
    'https://www.maduraicorporation.co.in',
    'https://www.maduraicorporation.co.in/public-grievance',
    'VERIFIED',
    '2026-08-10 09:00:00+00',
    TRUE
),
-- Tiruchirappalli (Trichy) - Corporation
(
    'Commissioner, Tiruchirappalli City Corporation',
    'Corporation Commissioner',
    'Tiruchirappalli City Corporation',
    'Roads, Water, Garbage, Public Safety',
    'Tamil Nadu',
    'Tiruchirappalli',
    'Tiruchirappalli West, Tiruchirappalli East, Srirangam',
    'commr.trichy@tn.gov.in',
    'TrichyCorp',
    'https://trichycorporation.gov.in',
    'https://trichycorporation.gov.in/contact',
    'VERIFIED',
    '2026-08-12 14:20:00+00',
    TRUE
),
-- Salem - Municipal Corporation
(
    'Commissioner, Salem City Municipal Corporation',
    'Municipal Commissioner',
    'Salem City Municipal Corporation',
    'Roads, Drainage, Street Lights, Garbage',
    'Tamil Nadu',
    'Salem',
    'Salem North, Salem South, Salem West',
    'commr.salem@tn.gov.in',
    'SalemCorp',
    'https://salemcorporation.gov.in',
    'https://salemcorporation.gov.in/grievance',
    'VERIFIED',
    '2026-08-14 10:00:00+00',
    TRUE
),
-- Tirunelveli - Corporation
(
    'Commissioner, Tirunelveli City Municipal Corporation',
    'Municipal Commissioner',
    'Tirunelveli Corporation',
    'Roads, Water, Sanitation, Transport',
    'Tamil Nadu',
    'Tirunelveli',
    'Tirunelveli, Palayamkottai',
    'commr.tirunelveli@tn.gov.in',
    'TirunelveliCorp',
    'https://tirunelvelicorporation.gov.in',
    'https://tirunelvelicorporation.gov.in/contact',
    'NEEDS_REVIEW',
    '2026-07-25 12:00:00+00',
    TRUE
),
-- Kanchipuram - District Collectorate & Highways
(
    'District Collector & Magistrate, Kanchipuram',
    'District Collector',
    'Kanchipuram District Administration',
    'Government Services, Transport, Environment',
    'Tamil Nadu',
    'Kanchipuram',
    'Kanchipuram, Sriperumbudur, Uthiramerur',
    'collr-knc@nic.in',
    'KanchiCollector',
    'https://kancheepuram.nic.in',
    'https://kancheepuram.nic.in/citizen-charter',
    'VERIFIED',
    '2026-08-15 08:30:00+00',
    TRUE
),
-- Thanjavur - District Collectorate
(
    'District Collector, Thanjavur',
    'District Collector',
    'Thanjavur District Administration',
    'Water, Agriculture, Roads',
    'Tamil Nadu',
    'Thanjavur',
    'Thanjavur, Kumbakonam, Papanasam, Orathanadu',
    'collr-tj@nic.in',
    'TnjCollector',
    'https://thanjavur.nic.in',
    'https://thanjavur.nic.in/departments',
    'NEEDS_REVIEW',
    '2026-07-30 11:00:00+00',
    TRUE
);
