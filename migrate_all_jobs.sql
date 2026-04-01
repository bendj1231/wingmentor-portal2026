
INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0001',
    'Captain - A320 family',
    'Etihad',
    'United Arab Emirates (UAE) | Abu Dhabi',
    'Captain',
    ARRAY['A320 family'],
    'https://pilotsglobal.com/job/A320-family-captain-etihad-AE-81Oyt9ulnn',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    5500,
    'ATP / ATPL',
    true,
    2500,
    1500,
    true,
    'Class 1',
    '4',
    'Up to AED 637,304 (USD 171,589) per year',
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0002',
    'Captain - Citation III / VI / VII',
    'SXM Airways',
    'Sint Maarten | Philipsburg',
    'Captain',
    ARRAY['Citation III', 'VI', 'VII'],
    'https://pilotsglobal.com/job/Citation-III-VI-VII-captain-sxm_airways-SX-bfwTt3048n',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    3000,
    'ATP / ATPL',
    true,
    1500,
    50,
    true,
    'Class 1',
    '4',
    'Competitive package with benefits',
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0003',
    'First Officer - A320 family',
    'Etihad',
    'United Arab Emirates (UAE) | Abu Dhabi',
    'First Officer',
    ARRAY['A320 family'],
    'https://pilotsglobal.com/job/A320-family-first-officer-etihad-AE-Cm8ut9ulzu',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    2000,
    'ATP-qualified / fATPL / IATRA,IR,ME',
    true,
    NULL,
    NULL,
    true,
    'Class 1',
    '4',
    'Up to AED 513,732 (USD 138,318) per year',
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0004',
    'Captain - A320 family',
    'Air Astana',
    'Kazakhstan | Almaty',
    'Captain',
    ARRAY['A320 family'],
    'https://pilotsglobal.com/job/A320-family-captain-air_astana-KZ-bd8b243d49',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    4500,
    'ATP / ATPL',
    true,
    1000,
    500,
    true,
    'Class 1',
    '4',
    'Competitive salary with housing allowance',
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0005',
    'Captain - Challenger CL-30',
    'Executive Jet Management (EJM)',
    'United States | Cincinnati',
    'Captain',
    ARRAY['Challenger CL-30'],
    'https://pilotsglobal.com/job/Challenger-CL-30-captain-executive_jet_management_ejm-US-2aaca6a488',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    3500,
    'ATP / ATPL',
    false,
    2000,
    NULL,
    true,
    'Class 1',
    '',
    'Competitive pay with comprehensive benefits',
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0006',
    'Pilot Cadet - Various Aircraft',
    'Envoy Air',
    'United States | Home-Based',
    'Pilot Cadet',
    ARRAY['Various Aircraft'],
    'https://pilotsglobal.com/job/Various-Aircraft-pilot-cadet-envoy_air-US-0f69556e44',
    '2025-03-19T00:00:00Z',
    'Accepting Apps',
    40,
    'CPL',
    false,
    NULL,
    NULL,
    false,
    'Class 1',
    '',
    'Financial assistance and guaranteed path to First Officer',
    'cadet-program',
    CASE 
        WHEN 'cadet-program' = 'cadet-program' THEN 1
        WHEN 'cadet-program' = 'captain' THEN 1
        WHEN 'cadet-program' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0007',
    'Captain - G650',
    'Jet Aviation',
    'United States | Van Nuys',
    'Captain',
    ARRAY['G650'],
    'https://pilotsglobal.com/job/G650-captain-jet_aviation-US-3bcda382f3',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    3500,
    'ATP / ATPL',
    false,
    1500,
    NULL,
    true,
    'Class 1',
    '',
    'Competitive benefit package with 401(k) and insurance',
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0008',
    'Corporate Pilot - Falcon 2000',
    'Davinci Jets',
    'United States | Concord (NC)',
    'Corporate Pilot',
    ARRAY['Falcon 2000'],
    'https://pilotsglobal.com/job/Falcon-2000-corporate-pilot-davinci_jets-US-tJNhtbbrbp',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    'ATP / ATPL',
    false,
    NULL,
    NULL,
    false,
    'Class 1',
    '',
    'Performance-based compensation package',
    'corporate',
    CASE 
        WHEN 'corporate' = 'cadet-program' THEN 1
        WHEN 'corporate' = 'captain' THEN 1
        WHEN 'corporate' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0009',
    'Second in Command - Learjet LR-45',
    'Jett Aircraft',
    'United States | Fayetteville (AR)',
    'Second in Command',
    ARRAY['Learjet LR-45'],
    'https://pilotsglobal.com/job/Learjet-LR-45-second-in-command-jett_aircraft-US-keyQsa04e5',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    500,
    'ATP / ATPL',
    false,
    NULL,
    NULL,
    false,
    'Class 2',
    '',
    'Base Salary: $39,550.00 + Total Yearly Salary: $79,000.00',
    'second-officer',
    CASE 
        WHEN 'second-officer' = 'cadet-program' THEN 1
        WHEN 'second-officer' = 'captain' THEN 1
        WHEN 'second-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0010',
    'Captain - ERJ family EMB-145',
    'Hendrick Motorsports',
    'United States | Concord',
    'Captain',
    ARRAY['ERJ family EMB-145'],
    'https://pilotsglobal.com/job/ERJ-family-EMB-145-captain-hendrick_motorsports-US-BG1ys74dgv',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    3000,
    'ATP / ATPL',
    false,
    1500,
    NULL,
    false,
    'Class 1',
    '',
    'Competitive salary with comprehensive benefits',
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0011',
    'Corporate Pilot - Global Express',
    'PrivateFlite Aviation',
    'United States | Louisville',
    'Corporate Pilot',
    ARRAY['Global Express'],
    'https://pilotsglobal.com/job/Global-Express-corporate-pilot-privateflite_aviation-US-SsIvtb0vh2',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    2000,
    'ATP / ATPL',
    false,
    NULL,
    NULL,
    false,
    'Class 1',
    '',
    'Salary: $130,000-$175,000 with signing bonus',
    'mid-timer',
    CASE 
        WHEN 'mid-timer' = 'cadet-program' THEN 1
        WHEN 'mid-timer' = 'captain' THEN 1
        WHEN 'mid-timer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0012',
    'Check Airman - ERJ family EMB-145',
    'Contour Aviation',
    'United States | Houston',
    'Check Airman',
    ARRAY['ERJ family EMB-145'],
    'https://pilotsglobal.com/job/ERJ-family-EMB-145-check-airman-contour_aviation-US-cmEdtc2id1',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    'ATP / ATPL',
    false,
    NULL,
    NULL,
    true,
    'Class 1',
    '',
    'Competitive salary with 401(k) match up to 6%',
    'other',
    CASE 
        WHEN 'other' = 'cadet-program' THEN 1
        WHEN 'other' = 'captain' THEN 1
        WHEN 'other' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0013',
    'First Officer - CRJ Series',
    'GoJet Airlines',
    'United States | Newark',
    'First Officer',
    ARRAY['CRJ Series'],
    'https://pilotsglobal.com/job/CRJ-Series-first-officer-gojet_airlines-US-45a2f4d32c',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    750,
    'ATP-qualified / fATPL / IATRA',
    false,
    NULL,
    NULL,
    false,
    'Class 1',
    '',
    'Starting pay: $92.72 per flight hour + Per Diem: $2.05',
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0014',
    'Pilot in Command - Various Business Jet',
    'Wing Aviation',
    'United States | Houston',
    'Pilot in Command',
    ARRAY['Various Business Jet'],
    'https://pilotsglobal.com/job/Various-Business-Jet-pilot-in-command-wing_aviation-US-PAfOsgp2fs',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    3500,
    'ATP / ATPL',
    false,
    1500,
    250,
    true,
    'Class 1',
    '',
    'Competitive compensation package',
    'mid-timer',
    CASE 
        WHEN 'mid-timer' = 'cadet-program' THEN 1
        WHEN 'mid-timer' = 'captain' THEN 1
        WHEN 'mid-timer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0015',
    'Captain - GVII / G500-G650',
    'Solairus Aviation',
    'United States | Teterboro',
    'Captain',
    ARRAY['GVII', 'G500-G650'],
    'https://pilotsglobal.com/job/GVII-G500-G650-captain-solairus_aviation-US-g713t0ms4g',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    3000,
    'ATP / ATPL',
    false,
    1500,
    NULL,
    true,
    'Class 1',
    '',
    'Competitive salary with comprehensive benefits',
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0016',
    'Captain - Citation I / I/SP',
    'Jet Air',
    'United States | Galesburg',
    'Captain',
    ARRAY['Citation I', 'I', 'SP'],
    'https://pilotsglobal.com/job/Citation-I-I-SP-captain-jet_air-US-nYjSsm5cni',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    3000,
    'ATP / ATPL',
    false,
    1500,
    NULL,
    false,
    'Class 1',
    '',
    'Health / Life Insurance, 401(k), Profit Sharing',
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0017',
    'Director of Flight Operations - King Air',
    'Freeman Jet Center',
    'United States | Abilene',
    'Director of Flight Operations',
    ARRAY['King Air'],
    'https://pilotsglobal.com/job/King-Air-director-of-flight-operations-freeman_jet_center-US-CPV0t04wn8',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    3000,
    'ATP / ATPL',
    false,
    1200,
    NULL,
    false,
    'Class 2',
    '',
    'Comprehensive package with 401(k) and PTO',
    'mid-timer',
    CASE 
        WHEN 'mid-timer' = 'cadet-program' THEN 1
        WHEN 'mid-timer' = 'captain' THEN 1
        WHEN 'mid-timer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0018',
    'Pilot in Command - Various Business Jet',
    'Talon Air',
    'United States | Farmingdale',
    'Pilot in Command',
    ARRAY['Various Business Jet'],
    'https://pilotsglobal.com/job/Various-Business-Jet-pilot-in-command-talon_air-US-SpyZt31e0s',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    3500,
    'ATP / ATPL',
    false,
    2000,
    NULL,
    true,
    'Class 1',
    '',
    'Very competitive benefits with sign-on bonuses',
    'mid-timer',
    CASE 
        WHEN 'mid-timer' = 'cadet-program' THEN 1
        WHEN 'mid-timer' = 'captain' THEN 1
        WHEN 'mid-timer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0019',
    'Line Pilot - PA-31 Navajo',
    'EagleView Technologies',
    'United States | Home-Based',
    'Line Pilot',
    ARRAY['PA-31 Navajo'],
    'https://pilotsglobal.com/job/PA-31-Navajo-line-pilot-eagleview_technologies-US-e0e24edc85',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    400,
    'CPL,ME',
    false,
    NULL,
    NULL,
    false,
    'Class 2',
    '',
    'Base salary of $31,616 per year + full benefits',
    'low-timer',
    CASE 
        WHEN 'low-timer' = 'cadet-program' THEN 1
        WHEN 'low-timer' = 'captain' THEN 1
        WHEN 'low-timer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0020',
    'Instructor Pilot - Various Business Jet',
    'Northern Jet',
    'United States | Orlando',
    'Instructor Pilot',
    ARRAY['Various Business Jet'],
    'https://pilotsglobal.com/job/Various-Business-Jet-instructor-pilot-northern_jet-US-oB19t9ybr7',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    'ATP / ATPL',
    false,
    NULL,
    NULL,
    false,
    'Class 1',
    '',
    'Salary: $25.00 Hourly with comprehensive benefits',
    'corporate',
    CASE 
        WHEN 'corporate' = 'cadet-program' THEN 1
        WHEN 'corporate' = 'captain' THEN 1
        WHEN 'corporate' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0021',
    'Second in Command - Citation Sovereign',
    'Executive Jet Management (EJM)',
    'United States | St. Louis',
    'Second in Command',
    ARRAY['Citation Sovereign'],
    'https://pilotsglobal.com/job/Citation-Sovereign-second-in-command-executive_jet_management_ejm-US-2aP8sxc5vp',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    2500,
    'ATP / ATPL',
    false,
    500,
    NULL,
    false,
    'Class 1',
    '',
    'Competitive pay with 67% 401(k) match',
    'second-officer',
    CASE 
        WHEN 'second-officer' = 'cadet-program' THEN 1
        WHEN 'second-officer' = 'captain' THEN 1
        WHEN 'second-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0022',
    'Pilot in Command - Learjet LR-JET',
    'PlaneSmart Aviation',
    'United States | Addison',
    'Pilot in Command',
    ARRAY['Learjet LR-JET'],
    'https://pilotsglobal.com/job/Learjet-LR-JET-pilot-in-command-planesmart_aviation-US-J1GXtc2k7r',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    2000,
    'ATP / ATPL',
    false,
    1000,
    100,
    false,
    'Class 1',
    '',
    'Competitive compensation package',
    'mid-timer',
    CASE 
        WHEN 'mid-timer' = 'cadet-program' THEN 1
        WHEN 'mid-timer' = 'captain' THEN 1
        WHEN 'mid-timer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0023',
    'Pilot in Command - 208B Grand Caravan Amphibian',
    'Island Air Service',
    'United States | Kodiak',
    'Pilot in Command',
    ARRAY['208B Grand Caravan Amphibian'],
    'https://pilotsglobal.com/job/208B-Grand-Caravan-Amphibian-pilot-in-command-island_air_service-US-e788ac3c60',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    1500,
    'CPL',
    false,
    NULL,
    NULL,
    false,
    'Class 1',
    '',
    'Competitive pay with housing provided',
    'mid-timer',
    CASE 
        WHEN 'mid-timer' = 'cadet-program' THEN 1
        WHEN 'mid-timer' = 'captain' THEN 1
        WHEN 'mid-timer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0024',
    'Captain - Citation M2/CJ series',
    'FlyUSA',
    'United States | Tampa',
    'Captain',
    ARRAY['Citation M2', 'CJ series'],
    'https://pilotsglobal.com/job/Citation-M2-CJ-series-captain-flyusa-US-iAtjshgrpl',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    3000,
    'ATP / ATPL',
    false,
    2000,
    200,
    true,
    'Class 1',
    '',
    'Comprehensive benefits with 401(k) match',
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0025',
    'Pilot in Command - Citation M2/CJ series',
    'Eagle Air Aviation',
    'United States | Harrisburg',
    'Pilot in Command',
    ARRAY['Citation M2', 'CJ series'],
    'https://pilotsglobal.com/job/Citation-M2-CJ-series-pilot-in-command-eagle_air_aviation-US-TGbgt18qxi',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    3000,
    'ATP / ATPL',
    false,
    1500,
    NULL,
    false,
    'Class 1',
    '',
    'Competitive salary with sign-on bonus',
    'mid-timer',
    CASE 
        WHEN 'mid-timer' = 'cadet-program' THEN 1
        WHEN 'mid-timer' = 'captain' THEN 1
        WHEN 'mid-timer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0026',
    'First Officer --- Pilatus PC24 - Campbell River BC',
    'Avalo Air Inc.',
    'Campbell River BC',
    'First Officer',
    ARRAY['Pilatus PC24'],
    'https://pilotcareercenter.com/Pilot-Job-Posting-Pilot-Opening-Pilot-Job/23470/Canada/F-O/PC24---CYBL/Avalo-Air-Inc.?NextJobMode=GlobalHomepage',
    '2025-03-19T00:00:00Z',
    'Accepting Apps',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0027',
    'Type Rated First Officer --- Cessna CJ - Stuttgart DE',
    'E-Aviation',
    'Stuttgart - DE',
    'First Officer',
    ARRAY['Cessna CJ'],
    'https://pilotcareercenter.com/Pilot-Job-Posting-Pilot-Opening-Pilot-Job/23469/Europe-UK/TR-F-O/Cessna-CJ---EDDS/E-Aviation?NextJobMode=GlobalHomepage',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0028',
    'Type Rated Captain --- Challenger 350 - Europe',
    'Avcon Jet AG',
    'Europe',
    'Captain',
    ARRAY['Challenger 350'],
    'https://pilotcareercenter.com/Pilot-Job-Posting-Pilot-Opening-Pilot-Job/23468/Europe-UK/TR-CAPT/CL350---Europe/Avcon-Jet?NextJobMode=GlobalHomepage',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0029',
    'First Officers --- Dash 8 Q400 - Bolzano - IT',
    'SkyAlps',
    'Bolzano - IT',
    'First Officer',
    ARRAY['Dash 8'],
    'https://pilotcareercenter.com/Pilot-Job-Posting-Pilot-Opening-Pilot-Job/23467/Europe-UK/F-O%27s/Q400---Bolzano/SkyAlps?NextJobMode=GlobalHomepage',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0030',
    'Captain --- Dash 8 Q400 - Bolzano - IT',
    'SkyAlps',
    'Bolzano - IT',
    'Captain',
    ARRAY['Dash 8'],
    'https://pilotcareercenter.com/Pilot-Job-Posting-Pilot-Opening-Pilot-Job/23466/Europe-UK/CAPT/Q400---Bolzano/SkyAlps?NextJobMode=GlobalHomepage',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0031',
    'Captain --- ERJ145 Regional Jet - Zurich',
    'Travelcoup Schweiz AG',
    'Zurich',
    'Captain',
    ARRAY['ERJ145'],
    'https://pilotcareercenter.com/Pilot-Job-Posting-Pilot-Opening-Pilot-Job/23465/Europe-UK/CAPT/ERJ145---Zurich/Travelcoup-Schweiz?NextJobMode=GlobalHomepage',
    '2025-03-19T00:00:00Z',
    'Accepting Apps',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0032',
    'Captain --- Legacy 600 - Europe',
    'Air X Charter Ltd.',
    'Europe',
    'Captain',
    ARRAY['Legacy 600'],
    'https://pilotcareercenter.com/Pilot-Job-Posting-Pilot-Opening-Pilot-Job/23463/Europe-UK/CAPT/Legacy-600---Europe/Air-X?NextJobMode=GlobalHomepage',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0033',
    'First Officer --- Airbus A340 - Europe',
    'Air X Charter Ltd.',
    'Europe',
    'First Officer',
    ARRAY['Airbus A330'],
    'https://pilotcareercenter.com/Pilot-Job-Posting-Pilot-Opening-Pilot-Job/23464/Europe-UK/F-O/A340---Europe/Air-X?NextJobMode=GlobalHomepage',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0034',
    'Copiloto --- Boeing 737 - Sao Paulo',
    'GOL Linhas Aéreas Inteligentes',
    'Sao Paulo',
    'First Officer',
    ARRAY['Boeing 737'],
    'https://pilotcareercenter.com/Pilot-Job-Posting-Pilot-Opening-Pilot-Job/23446/Latin-America-%E2%88%95-the-Caribbean/Copiloto/Boeing-737---GRU/GOL?NextJobMode=GlobalHomepage',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0035',
    'First Officer --- Phenom 300 - Calgary',
    'Flightpath',
    'Calgary',
    'First Officer',
    ARRAY['Phenom 300'],
    'https://pilotcareercenter.com/Pilot-Job-Posting-Pilot-Opening-Pilot-Job/18748/Canada/F-O/Phenom-300---Calgary/Flightpath?NextJobMode=GlobalHomepage',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0036',
    'Captain --- Phenom 300 - Calgary',
    'Flightpath',
    'Calgary',
    'Captain',
    ARRAY['Phenom 300'],
    'https://pilotcareercenter.com/Pilot-Job-Posting-Pilot-Opening-Pilot-Job/23458/Canada/CAPT/Phenom-300---Calgary/Flightpath?NextJobMode=GlobalHomepage',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0037',
    'Type Rated First Officer --- Pilatus PC24 - Geneva',
    'Global Jet',
    'Geneva',
    'First Officer',
    ARRAY['Pilatus PC24'],
    'https://pilotcareercenter.com/Pilot-Job-Posting-Pilot-Opening-Pilot-Job/23455/Europe-UK/TR-F-O/PC24---Geneva/Global-Jet?NextJobMode=GlobalHomepage',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0038',
    'Phenom 300E (EMB505) Captain Based at Zürich / 8 ON / 6 OFF',
    'Haute Aviation',
    'Switzerland',
    'Captain',
    ARRAY['Embraer Phenom 300', '300E'],
    'https://www.latestpilotjobs.com/jobs/view/id/19700.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0039',
    'A320 First Officer Experience or Employment for Low Time Non-Type Rated EASA Pilots',
    'Eagle Jet International, Inc.',
    'Europe',
    'First Officer',
    ARRAY['Airbus 320'],
    'https://www.latestpilotjobs.com/jobs/view/id/18174.html',
    '2025-03-12T00:00:00Z',
    'Accepting Apps',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0040',
    'Upgrade to B777 PIC',
    'Root Aviation',
    'Asia',
    'Captain',
    ARRAY['Boeing 777'],
    'https://www.latestpilotjobs.com/jobs/view/id/19683.html',
    '2025-03-17T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0041',
    'Captain (m/f/d)',
    'SkyAlps',
    'Italy',
    'Captain',
    ARRAY['All Pilot'],
    'https://www.latestpilotjobs.com/jobs/view/id/18908.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0042',
    'First Officer (m/f/d)',
    'SkyAlps',
    'Italy',
    'First Officer',
    ARRAY['All Pilot'],
    'https://www.latestpilotjobs.com/jobs/view/id/17300.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0043',
    'Experienced A320/B737 Pilots -- Online Open Day',
    'Getjet Airlines',
    'Lithuania',
    'All Pilot',
    ARRAY['Airbus 320, Boeing 737 - 6', '7', '8', '900 NG'],
    'https://www.latestpilotjobs.com/jobs/view/id/19479.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'corporate',
    CASE 
        WHEN 'corporate' = 'cadet-program' THEN 1
        WHEN 'corporate' = 'captain' THEN 1
        WHEN 'corporate' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0044',
    'DHC8 TRI/SFI Instructors',
    'BAA Training',
    'Spain',
    'Type Rating Instructor (TRI)',
    ARRAY['DHC - 8 Dash 8'],
    'https://www.latestpilotjobs.com/jobs/view/id/17486.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'other',
    CASE 
        WHEN 'other' = 'cadet-program' THEN 1
        WHEN 'other' = 'captain' THEN 1
        WHEN 'other' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0045',
    'First Officer G7500 - Open Base',
    'Globaljet',
    'Europe',
    'First Officer',
    ARRAY['Global 7500'],
    'https://www.latestpilotjobs.com/jobs/view/id/17737.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0046',
    'Second-In Command CL30 -- Challenger 300',
    'Gary Jet Center',
    'INDIANA',
    'First Officer',
    ARRAY['Challenger 300'],
    'https://www.latestpilotjobs.com/jobs/view/id/17155.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0047',
    'Theoretical Knowledge Instructor M/F',
    'Astonfly',
    'France',
    'Flight/Ground Instructor',
    ARRAY['All Pilot'],
    'https://www.latestpilotjobs.com/jobs/view/id/15971.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'other',
    CASE 
        WHEN 'other' = 'cadet-program' THEN 1
        WHEN 'other' = 'captain' THEN 1
        WHEN 'other' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0048',
    'Flight Instructor H/F',
    'Astonfly',
    'France',
    'Flight/Ground Instructor',
    ARRAY['All Pilot'],
    'https://www.latestpilotjobs.com/jobs/view/id/15784.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'other',
    CASE 
        WHEN 'other' = 'cadet-program' THEN 1
        WHEN 'other' = 'captain' THEN 1
        WHEN 'other' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0049',
    'First Officer A320 (m/w/d)',
    'K5 Aviation',
    'Germany',
    'First Officer',
    ARRAY['Airbus 320'],
    'https://www.latestpilotjobs.com/jobs/view/id/16182.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0050',
    'B757/B767 to B777 Captains',
    'Root Aviation',
    'Asia',
    'Captain',
    ARRAY['Boeing 757, Boeing 767, Boeing 777'],
    'https://www.latestpilotjobs.com/jobs/view/id/19692.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0051',
    'Captain Citation C525 *NEW TERMS INCLUDING SIGN ON BONUS OF 10.000€ AND UPDATED SALARY PACKAGE*',
    'Excellent Air GmbH',
    'Europe',
    'Captain',
    ARRAY['Citation 525A CJ1', 'CJ2'],
    'https://www.latestpilotjobs.com/jobs/view/id/18981.html',
    '2025-03-16T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0052',
    'B747 to B777 PIC',
    'Root Aviation',
    'Asia',
    'Captain',
    ARRAY['Boeing 747 - 400, Boeing 777'],
    'https://www.latestpilotjobs.com/jobs/view/id/19691.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0053',
    'Upgrade to B777 PIC',
    'Root Aviation',
    'Asia',
    'Captain',
    ARRAY['Boeing 777'],
    'https://www.latestpilotjobs.com/jobs/view/id/19690.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0054',
    'Chief Flight Instructor',
    'SKIES AVIATION ACADEMY',
    'Greece',
    'Flight/Ground Instructor',
    ARRAY['All Pilot'],
    'https://www.latestpilotjobs.com/jobs/view/id/18989.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'other',
    CASE 
        WHEN 'other' = 'cadet-program' THEN 1
        WHEN 'other' = 'captain' THEN 1
        WHEN 'other' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0055',
    'Flight Instructor',
    'SKIES AVIATION ACADEMY',
    'Europe',
    'Flight/Ground Instructor',
    ARRAY['All Pilot'],
    'https://www.latestpilotjobs.com/jobs/view/id/19686.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'other',
    CASE 
        WHEN 'other' = 'cadet-program' THEN 1
        WHEN 'other' = 'captain' THEN 1
        WHEN 'other' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0056',
    'Upgrade to B777 PIC',
    'Root Aviation Ltd',
    'Asia',
    'Captain',
    ARRAY['Boeing 747 - 400, Boeing 757, Boeing 767, Boeing 777'],
    'https://www.latestpilotjobs.com/jobs/view/id/19581.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0057',
    'B757/B767 to B777 Captains',
    'Root Aviation Ltd',
    'Asia',
    'Captain',
    ARRAY['Boeing 747 - 400, Boeing 757, Boeing 767, Boeing 777'],
    'https://www.latestpilotjobs.com/jobs/view/id/19647.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0058',
    'A320 Captains (EASA/ICAO)',
    'WingJet Aviation',
    'Europe',
    'Captain',
    ARRAY['Airbus 320'],
    'https://www.latestpilotjobs.com/jobs/view/id/19674.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0059',
    'Class Rating Instructor (DA42 Greece)',
    '(MEMBERS ONLY)',
    'Greece',
    'Flight/Ground Instructor',
    ARRAY['Diamond DA42'],
    'https://www.latestpilotjobs.com/jobs/view/id/19687.html',
    '2025-03-18T00:00:00Z',
    'Accepting Apps',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'other',
    CASE 
        WHEN 'other' = 'cadet-program' THEN 1
        WHEN 'other' = 'captain' THEN 1
        WHEN 'other' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0060',
    'CAPTAIN FOR CHALLENGER 601/604',
    '(MEMBERS ONLY)',
    'All Pilot',
    'Captain',
    ARRAY['Challenger 600', '601, Challenger 604', '605'],
    'https://www.latestpilotjobs.com/jobs/view/id/19344.html',
    '2025-03-18T00:00:00Z',
    'Accepting Apps',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0061',
    'Direct Entry Captain A320 in London',
    'Scandinavian Airlines',
    'United Kingdom',
    'Captain',
    ARRAY['Airbus 320'],
    'https://www.latestpilotjobs.com/jobs/view/id/18168.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0062',
    'First Officer - Lineage 1000 (EMB170/190)',
    'AirX Charter Ltd',
    'Europe',
    'First Officer',
    ARRAY['Embraer E-170', '190'],
    'https://www.latestpilotjobs.com/jobs/view/id/19489.html',
    '2025-03-12T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0063',
    'Captains & First Officers - Various types',
    'AeroProfessional Ltd',
    'Angola',
    'Captain, First Officer',
    ARRAY['All Airbus 220'],
    'https://www.latestpilotjobs.com/jobs/view/id/19696.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0064',
    'Typed/Current Hawker 800XP PIC',
    'Jet Access',
    'FLORIDA',
    'Captain',
    ARRAY['Hawker 800XP'],
    'https://www.latestpilotjobs.com/jobs/view/id/19328.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0065',
    'First Officer PC24 - Geneva Area',
    'Globaljet',
    'Europe',
    'First Officer',
    ARRAY['Pilatus PC24'],
    'https://www.latestpilotjobs.com/jobs/view/id/17008.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0066',
    'First Officer - CRJ-200',
    'Air Wisconsin',
    'WISCONSIN',
    'First Officer',
    ARRAY['CRJ 200', '900'],
    'https://www.latestpilotjobs.com/jobs/view/id/17414.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0067',
    'Captain / Commander A320 - 100%',
    'Chair Airlines',
    'Switzerland',
    'Captain',
    ARRAY['Airbus 320'],
    'https://www.latestpilotjobs.com/jobs/view/id/17483.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0068',
    'BA Cityflyer Direct Entry Captain',
    'BA Cityflyer',
    'United Kingdom',
    'Captain',
    ARRAY['All Pilot'],
    'https://www.latestpilotjobs.com/jobs/view/id/17697.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0069',
    'Captain Falcon 7X - Oxford, Connecticut',
    'Jet Aviation',
    'CONNECTICUT',
    'Captain',
    ARRAY['Falcon 7X'],
    'https://www.latestpilotjobs.com/jobs/view/id/17103.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0070',
    'Captain PC-24 - Cannes',
    'Fly 7',
    'France',
    'Captain',
    ARRAY['Pilatus PC24'],
    'https://www.latestpilotjobs.com/jobs/view/id/16484.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0071',
    'First Officer PC-24 - Cannes',
    'Fly 7',
    'France',
    'First Officer',
    ARRAY['Pilatus PC24'],
    'https://www.latestpilotjobs.com/jobs/view/id/17130.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0072',
    'B747/757/767 to B777 PIC',
    'Root Aviation',
    'Asia',
    'Captain',
    ARRAY['Boeing 747 - 400, Boeing 757, Boeing 767, Boeing 777'],
    'https://www.latestpilotjobs.com/jobs/view/id/19698.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0073',
    'Global Express XRS Captain Home Base: Payerne, Switzerland (LSMP)',
    'Haute Aviation',
    'Switzerland',
    'Captain',
    ARRAY['Global Express'],
    'https://www.latestpilotjobs.com/jobs/view/id/19699.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0074',
    'B777 PIC with China Southern',
    'Root Aviation',
    'Asia',
    'Captain',
    ARRAY['Boeing 777'],
    'https://www.latestpilotjobs.com/jobs/view/id/19697.html',
    '2025-03-18T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0075',
    'Skyflyers Aviation is Hiring A320 Captains (EASA /ICAO Holders)!',
    'SKYFLYERS AVIATION',
    'Europe',
    'Captain',
    ARRAY['Airbus 320'],
    'https://www.latestpilotjobs.com/jobs/view/id/19673.html',
    '2025-03-17T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0076',
    'A320 Captain (type-rated)',
    '(MEMBERS ONLY)',
    'All Pilot',
    'Captain',
    ARRAY['Airbus 320'],
    'https://www.latestpilotjobs.com/jobs/view/id/19428.html',
    '2025-03-17T00:00:00Z',
    'Accepting Apps',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0077',
    'EMB190 E1 EASA Type Rated First Officers',
    '(MEMBERS ONLY)',
    'All Pilot',
    'First Officer',
    ARRAY['Embraer E-170', '190'],
    'https://www.latestpilotjobs.com/jobs/view/id/19682.html',
    '2025-03-17T00:00:00Z',
    'Accepting Apps',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0078',
    'EMB190 E1 EASA Type Rated Captains',
    '(MEMBERS ONLY)',
    'All Pilot',
    'Captain',
    ARRAY['Embraer E-170', '190'],
    'https://www.latestpilotjobs.com/jobs/view/id/19681.html',
    '2025-03-17T00:00:00Z',
    'Accepting Apps',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0079',
    'Pilot - Lear 60 SIC',
    'FlightWorks',
    'GEORGIA',
    'First Officer',
    ARRAY['Learjet 60'],
    'https://www.latestpilotjobs.com/jobs/view/id/18486.html',
    '2025-03-17T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0080',
    'First Officer (m/f/d)',
    'K5-Aviation',
    'Germany',
    'First Officer',
    ARRAY['All Pilot'],
    'https://www.latestpilotjobs.com/jobs/view/id/18182.html',
    '2025-03-17T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0081',
    'Pilatus PC-24 Second-in-Command (SIC)',
    'flyADVANCED',
    'DELAWARE',
    'First Officer',
    ARRAY['Pilatus PC24'],
    'https://www.latestpilotjobs.com/jobs/view/id/17085.html',
    '2025-03-17T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'first-officer',
    CASE 
        WHEN 'first-officer' = 'cadet-program' THEN 1
        WHEN 'first-officer' = 'captain' THEN 1
        WHEN 'first-officer' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0082',
    'ICAO PIC/SIC CL850 24 - 26 March',
    '(MEMBERS ONLY)',
    'All Pilot',
    'Captain, First Officer',
    ARRAY['Challenger 850'],
    'https://www.latestpilotjobs.com/jobs/view/id/19695.html',
    '2025-03-17T00:00:00Z',
    'Accepting Apps',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0083',
    'Wizz Air UK is looking for First Officers and Captains',
    'Wizz Air UK',
    'United Kingdom',
    'Captain, First Officer',
    ARRAY['All Pilot'],
    'https://www.latestpilotjobs.com/jobs/view/id/19685.html',
    '2025-03-17T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'captain',
    CASE 
        WHEN 'captain' = 'cadet-program' THEN 1
        WHEN 'captain' = 'captain' THEN 1
        WHEN 'captain' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);

INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    'JOB_0084',
    'Senior Flight Dispatcher',
    'Pegasus Airlines',
    'Turkey',
    'Other',
    ARRAY['No Type Rating'],
    'https://www.latestpilotjobs.com/jobs/view/id/17496.html',
    '2025-03-19T00:00:00Z',
    'Hiring Now!',
    NULL,
    '',
    null,
    NULL,
    NULL,
    null,
    '',
    '',
    NULL,
    'airline',
    CASE 
        WHEN 'airline' = 'cadet-program' THEN 1
        WHEN 'airline' = 'captain' THEN 1
        WHEN 'airline' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);