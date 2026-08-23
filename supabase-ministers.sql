-- Tamil Nadu Cabinet Ministers & Chief Minister
-- Generated from mock-store.ts

-- Ensure columns can hold long values
ALTER TABLE representatives ALTER COLUMN category_specialty TYPE TEXT;
ALTER TABLE representatives ALTER COLUMN name TYPE TEXT;
ALTER TABLE representatives ALTER COLUMN organization TYPE TEXT;

TRUNCATE TABLE representatives CASCADE;

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '69e8ac91-a5ab-48ae-ab7f-ec677ce3bb82', 'Hon''ble Chief Minister C. Joseph Vijay', 'Chief Minister', 'Government of Tamil Nadu', 'Public, Home, General Administration, Municipal Administration, Urban and Water Supply, Police, IAS, IPS, IFS, Special Programme Implementation, Poverty Alleviation, Youth Welfare, Welfare of Children, Aged, Differently Abled Persons', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'cmo@tn.gov.in', 'CMOTamilNadu', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '29154109-2819-48f2-9715-529bd5a6d94b', 'Hon''ble Minister N. Anand', 'Cabinet Minister', 'Government of Tamil Nadu', 'Rural Development, Panchayats, Rural Indebtedness, Irrigation, Water Resources, Small Irrigation', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_wrd@tn.gov.in', 'TNRuralDevMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '42d46043-82b9-43c4-afa6-70d65a46c37b', 'Hon''ble Minister Aadhav Arjuna', 'Cabinet Minister', 'Government of Tamil Nadu', 'Public Works, Buildings, Highways, Minor Ports, Sports Development', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_pwd@tn.gov.in', 'TNPWDMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'f72eeaca-58e2-4025-b38d-32ddc6d1d739', 'Hon''ble Minister Dr. K.G. Arunraj', 'Cabinet Minister', 'Government of Tamil Nadu', 'Health, Medical Education, Family Welfare, Hospitals, Public Health', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_health@tn.gov.in', 'TNHealthMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '63998466-4e30-4a31-af06-7008dbc569a7', 'Hon''ble Minister K.A. Sengottaiyan', 'Cabinet Minister', 'Government of Tamil Nadu', 'Revenue, Disaster Management, Relief, Land Records, Registration', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_revenue@tn.gov.in', 'TNRevenueMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '57696daa-514b-4686-8687-4c29ecd0e2cf', 'Hon''ble Minister P. Venkataramanan', 'Cabinet Minister', 'Government of Tamil Nadu', 'Food and Civil Supplies, Consumer Protection, Price Control, Ration Shops', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_food@tn.gov.in', 'TNFoodMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'd973af9e-c727-499b-8dc8-283cfc27138e', 'Hon''ble Minister R. Nirmalkumar', 'Cabinet Minister', 'Government of Tamil Nadu', 'Energy Resources, Electricity, Law, Courts, Prisons, Prevention of Corruption', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_energy@tn.gov.in', 'TNEnergyMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'ee2b9331-785b-4387-b9d6-87e15c6afad0', 'Hon''ble Minister Rajmohan', 'Cabinet Minister', 'Government of Tamil Nadu', 'School Education, Tamil Development, Information and Publicity, Film Technology, Newsprint Control', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_schedu@tn.gov.in', 'TNSchoolEduMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'db10f799-b75c-4ce6-8ae1-424b5fb702ba', 'Hon''ble Minister T.K. Prabhu', 'Cabinet Minister', 'Government of Tamil Nadu', 'Natural Resources, Minerals, Mines, Geology', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_natural@tn.gov.in', 'TNNaturalResMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'b43ee7e0-2e7c-48a6-a549-a124d3e83d48', 'Hon''ble Minister Dr. T.R.B. Rajaa', 'Cabinet Minister', 'Government of Tamil Nadu', 'Industries, Investment Promotion, Manufacturing, Industrial Estates', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_industry@tn.gov.in', 'TNIndustryMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '9d8e5ae3-3c8e-43c8-8fc8-6dd2feacf110', 'Hon''ble Minister P. Viswanathan', 'Cabinet Minister', 'Government of Tamil Nadu', 'Higher Education, Technical Education, Electronics, Science and Technology, Research', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_hredu@tn.gov.in', 'TNHigherEduMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'e1afdb53-a71d-48f1-b8f5-bf064a95a692', 'Hon''ble Minister S. Rajesh Kumar', 'Cabinet Minister', 'Government of Tamil Nadu', 'Tourism, Tourism Development Corporation, Heritage, Pilgrimage', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_tourism@tn.gov.in', 'TNTourismMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '80a19d9a-dadf-46b5-b57d-1695b10255f7', 'Hon''ble Minister A.M. Shahjahan', 'Cabinet Minister', 'Government of Tamil Nadu', 'Minorities Welfare, Wakf Board, Minority Education, Urdu', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_mw@tn.gov.in', 'TNMinorityMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'a4a0149b-ec97-438b-bb0a-afaa96f3903d', 'Hon''ble Minister Vanni Arasu', 'Cabinet Minister', 'Government of Tamil Nadu', 'Social Justice, Adi Dravidar Welfare, Hill Tribes, SC/ST Welfare', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_sj@tn.gov.in', 'TNSocialJusticeMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '530f81fb-842b-472a-928a-47b72b70e3ae', 'Hon''ble Minister A. Vijay Tamilan Parthiban', 'Cabinet Minister', 'Government of Tamil Nadu', 'Transport, Motor Vehicles, National Highways, Road Transport, Public Transport', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_transport@tn.gov.in', 'TNTransportMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'd2ba57fb-f051-4657-9a2a-231226abfb1b', 'Hon''ble Minister B. Rajkumar', 'Cabinet Minister', 'Government of Tamil Nadu', 'Housing, Urban Development, Town Planning, Slum Clearance', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_housing@tn.gov.in', 'TNHousingMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '196069b4-f6f8-4f6e-a6d5-074159f1445f', 'Hon''ble Minister V. Sampath Kumar', 'Cabinet Minister', 'Government of Tamil Nadu', 'Backward Classes Welfare, Most Backward Classes, De-notified Communities, Reservation', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_bcmw@tn.gov.in', 'TNBCMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '0ebd3087-ad0a-4d76-bc8c-2cbb0fd401e9', 'Hon''ble Minister M. Vijay Balaji', 'Cabinet Minister', 'Government of Tamil Nadu', 'Handlooms, Textiles, Khadi, Handicrafts, Silk', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_textiles@tn.gov.in', 'TNTextilesMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'd70d963e-e57a-40e4-8f55-917e0c6b8326', 'Hon''ble Minister K. Vignesh', 'Cabinet Minister', 'Government of Tamil Nadu', 'Prohibition, Excise, Liquor Control, Narcotics', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_excise@tn.gov.in', 'TNProhibitionMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '16c9193b-f478-4933-99c3-5bd931819d08', 'Hon''ble Minister K. Thennarasu', 'Cabinet Minister', 'Government of Tamil Nadu', 'Non-Resident Tamils Welfare, Overseas Indians, Emigration', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_nrt@tn.gov.in', 'TN_NRTMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '7bfb04bc-6b82-4755-95b7-71e9eeb2b396', 'Hon''ble Minister J. Mohamed Farvas', 'Cabinet Minister', 'Government of Tamil Nadu', 'Labour Welfare, Skill Development, Employment, Industrial Training, Workers Rights', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_labour@tn.gov.in', 'TNLabourMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '0cde03c1-f5aa-4e2b-821b-e8e11c870424', 'Hon''ble Minister V. Gandhiraj', 'Cabinet Minister', 'Government of Tamil Nadu', 'Co-operation, Cooperative Societies, Cooperative Banks', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_coop@tn.gov.in', 'TNCoopMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '6d9b2d80-9f5c-4418-88a9-68fc183267f1', 'Hon''ble Minister Jagadeshwari K.', 'Cabinet Minister', 'Government of Tamil Nadu', 'Social Welfare, Women Empowerment, Child Welfare, Orphanages, Destitutes', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_sw@tn.gov.in', 'TNSocialWelfareMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '5db643bc-72bc-4843-977a-580b458f37c4', 'Hon''ble Minister R. Vinoth', 'Cabinet Minister', 'Government of Tamil Nadu', 'Agriculture, Farmers Welfare, Crop Insurance, Agricultural Marketing', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_agri@tn.gov.in', 'TNAgriMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '54f3ac61-e829-4de0-9451-88f05b7b7e86', 'Hon''ble Minister C. Vijayalakshmi', 'Cabinet Minister', 'Government of Tamil Nadu', 'Milk and Dairy Development, Dairy Cooperatives, Animal Products', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_mdd@tn.gov.in', 'TNDairyMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'a7fbeec8-a206-498c-9f5f-67f0990d015f', 'Hon''ble Minister D. Sarathkumar', 'Cabinet Minister', 'Government of Tamil Nadu', 'Human Resources Management, Ex-Servicemen Welfare, Pension', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_hr@tn.gov.in', 'TNHRMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '61c833f2-cbc0-4a90-8973-989e9dd492ca', 'Hon''ble Minister Ramesh', 'Cabinet Minister', 'Government of Tamil Nadu', 'Hindu Religious and Charitable Endowments, Temples, Religious Institutions', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_hrce@tn.gov.in', 'TNHRCEMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'e91ace03-fbde-456d-9e49-9e101e7092cf', 'Hon''ble Minister P. Mathan Raja', 'Cabinet Minister', 'Government of Tamil Nadu', 'Micro, Small and Medium Enterprises, MSME, Entrepreneurship, Startups', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_msme@tn.gov.in', 'TNMSMEMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  '68aa13bf-79b5-4500-9dfd-aac08429fde7', 'Hon''ble Minister N. Marie Wilson', 'Cabinet Minister', 'Government of Tamil Nadu', 'Finance, Planning and Development, Budget, Treasury, Economics', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_finance@tn.gov.in', 'TNFinanceMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'a626e3a1-f26c-4a3e-87a6-d2b6d11d33eb', 'Hon''ble Minister A. Srinath', 'Cabinet Minister', 'Government of Tamil Nadu', 'Fisheries, Fishermen Welfare, Aquaculture, Fishing Harbours', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_fisheries@tn.gov.in', 'TNFisheriesMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'd69cb7d5-35fe-491b-9937-792a06c75579', 'Hon''ble Minister S. Kamali', 'Cabinet Minister', 'Government of Tamil Nadu', 'Animal Husbandry, Veterinary Services, Livestock, Poultry', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_ah@tn.gov.in', 'TNAHMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'e7ab641b-adc5-4202-97fe-e93128bc7286', 'Hon''ble Minister R. Kumar', 'Cabinet Minister', 'Government of Tamil Nadu', 'Artificial Intelligence, IT and Digital Services, Electronics, E-Governance, Technology', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_it@tn.gov.in', 'TNITMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'f8f13ba3-e98d-4d57-8937-cbb6d0839bcf', 'Hon''ble Minister R.V. Ranjithkumar', 'Cabinet Minister', 'Government of Tamil Nadu', 'Forests, Wildlife, Environment, Afforestation, Forest Conservation', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_forests@tn.gov.in', 'TNForestMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'd6b67552-f8b4-46f6-bbd7-fb7c6a40a84a', 'Hon''ble Minister D. Logesh Tamilselvan', 'Cabinet Minister', 'Government of Tamil Nadu', 'Commercial Taxes and Registration, GST, Stamp Duty, Registration', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_ctax@tn.gov.in', 'TNCTaxMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);

INSERT INTO representatives (id, name, role, organization, category_specialty, state, district, constituency, email, x_handle, official_website, source_url, verification_status, last_verified_at, active, created_at, updated_at) VALUES (
  'cac3e4cb-2638-41e3-93d2-058f0f32ad96', 'Hon''ble Minister V.K. Rajeev', 'Cabinet Minister', 'Government of Tamil Nadu', 'Environment and Climate Change, Pollution Control, Climate Action', 'Tamil Nadu', 'Chennai', 'All Constituencies', 'minister_env@tn.gov.in', 'TNEnvMin', 'https://www.tn.gov.in', 'https://www.tn.gov.in/minister_list.php', 'VERIFIED', '2026-08-23T06:00:00Z', true, '2026-01-01T00:00:00Z', '2026-08-23T06:00:00Z'
);
