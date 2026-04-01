// Script to extract and migrate all 131 jobs from PilotJobDatabasePage to Supabase
const fs = require('fs');
const path = require('path');

// Read the job data from the file
const filePath = path.join(__dirname, 'src/pages/PilotJobDatabasePage.tsx');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Extract the jobApplicationListings array
const jobArrayMatch = fileContent.match(/export const jobApplicationListings = \[([\s\S]*?)\];/);
if (!jobArrayMatch) {
    console.error('Could not find jobApplicationListings array');
    process.exit(1);
}

// Parse the job data (this is a simplified parser - in production you'd want a more robust solution)
const jobDataString = jobArrayMatch[0];

// Function to parse hours from string
const parseHours = (value) => {
    if (!value || value === '') return null;
    const numeric = value.replace(/[^0-9.]/g, '');
    return numeric ? parseInt(numeric, 10) : null;
};

// Function to parse boolean from string
const parseBoolean = (value) => {
    if (!value || value === '') return null;
    return value.toLowerCase() === 'yes' || value.toLowerCase() === 'required';
};

// Function to determine category
const determineCategory = (job) => {
    const role = (job.role || '').toLowerCase();
    const title = job.title.toLowerCase();
    const company = (job.company || '').toLowerCase();
    const flightHours = parseHours(job.flightTime || job.picTime);

    if (role.includes('cadet') || title.includes('cadet')) return 'cadet-program';
    if (role.includes('captain')) return 'captain';
    if (role.includes('first officer') || role.includes('fo')) return 'first-officer';
    if (role.includes('second') || role.includes('sic')) return 'second-officer';
    if (flightHours !== null && flightHours < 1000) return 'low-timer';
    if (flightHours !== null && flightHours >= 1000 && flightHours < 4000) return 'mid-timer';
    if (flightHours !== null && flightHours >= 4000) return 'high-timer';
    if (company.includes('jet') || title.includes('corporate')) return 'corporate';
    if (company.includes('air') || company.includes('airline')) return 'airline';
    return 'other';
};

// Generate SQL INSERT statements
const generateSQL = (jobs) => {
    const sqlStatements = [];
    
    jobs.forEach((job, index) => {
        const jobId = `JOB_${String(index + 1).padStart(4, '0')}`;
        const category = determineCategory(job);
        const postedDate = job.posted ? `'${job.posted}T00:00:00Z'` : 'NOW()';
        
        // Parse aircraft types
        const aircraftTypes = job.aircraft ? 
            job.aircraft.split('/').map(a => a.trim()).filter(a => a) : 
            [];
        
        // Parse compensation
        const compensation = job.compensation ? `'${job.compensation.replace(/'/g, "''")}'` : 'NULL';
        
        const sql = `
INSERT INTO job_opportunities (
    job_id, title, company, location, job_type, aircraft_types, 
    external_url, posted_date, status, flight_hours_required, 
    license_required, visa_sponsorship, pic_hours_required, 
    pic_in_type_hours, type_rating_required, medical_class_required, 
    icao_elp_level, compensation, category, priority_level, is_active
) VALUES (
    '${jobId}',
    '${job.title.replace(/'/g, "''")}',
    '${job.company.replace(/'/g, "''")}',
    '${job.location.replace(/'/g, "''")}',
    '${job.role.replace(/'/g, "''")}',
    ARRAY[${aircraftTypes.map(a => `'${a.replace(/'/g, "''")}'`).join(', ')}],
    '${job.url}',
    ${postedDate},
    '${job.status || 'active'}',
    ${parseHours(job.flightTime) || 'NULL'},
    '${job.license || ''}',
    ${parseBoolean(job.visaSponsorship)},
    ${parseHours(job.picTime) || 'NULL'},
    ${parseHours(job.picInTypeTime) || 'NULL'},
    ${parseBoolean(job.typeRating)},
    '${job.medicalClass || ''}',
    '${job.icaoElpLevel || ''}',
    ${compensation},
    '${category}',
    CASE 
        WHEN '${category}' = 'cadet-program' THEN 1
        WHEN '${category}' = 'captain' THEN 1
        WHEN '${category}' = 'first-officer' THEN 2
        ELSE 3
    END,
    true
);`;
        
        sqlStatements.push(sql);
    });
    
    return sqlStatements.join('\n');
};

// Extract jobs using regex (simplified approach)
const extractJobs = () => {
    const jobRegex = /{\s*title:\s*['"`]([^'"`]+)['"`],\s*company:\s*['"`]([^'"`]+)['"`],\s*aircraft:\s*['"`]([^'"`]+)['"`],\s*location:\s*['"`]([^'"`]+)['"`],\s*role:\s*['"`]([^'"`]+)['"`],\s*url:\s*['"`]([^'"`]+)['"`],\s*posted:\s*['"`]([^'"`]+)['"`],\s*status:\s*['"`]([^'"`]+)['"`],\s*applicationUrl:\s*['"`]([^'"`]*)['"`],\s*flightTime:\s*['"`]([^'"`]*)['"`],\s*license:\s*['"`]([^'"`]*)['"`],\s*visaSponsorship:\s*['"`]([^'"`]*)['"`],\s*picTime:\s*['"`]([^'"`]*)['"`],\s*picInTypeTime:\s*['"`]([^'"`]*)['"`],\s*typeRating:\s*['"`]([^'"`]*)['"`],\s*medicalClass:\s*['"`]([^'"`]*)['"`],\s*icaoElpLevel:\s*['"`]([^'"`]*)['"`],\s*compensation:\s*['"`]([^'"`]*)['"`]\s*}/g;
    
    const matches = fileContent.match(jobRegex);
    if (!matches) {
        console.error('Could not extract jobs using regex');
        return [];
    }
    
    const jobs = matches.map(match => {
        const jobMatch = match.match(/title:\s*['"`]([^'"`]+)['"`],\s*company:\s*['"`]([^'"`]+)['"`],\s*aircraft:\s*['"`]([^'"`]+)['"`],\s*location:\s*['"`]([^'"`]+)['"`],\s*role:\s*['"`]([^'"`]+)['"`],\s*url:\s*['"`]([^'"`]+)['"`],\s*posted:\s*['"`]([^'"`]+)['"`],\s*status:\s*['"`]([^'"`]+)['"`],\s*applicationUrl:\s*['"`]([^'"`]*)['"`],\s*flightTime:\s*['"`]([^'"`]*)['"`],\s*license:\s*['"`]([^'"`]*)['"`],\s*visaSponsorship:\s*['"`]([^'"`]*)['"`],\s*picTime:\s*['"`]([^'"`]*)['"`],\s*picInTypeTime:\s*['"`]([^'"`]*)['"`],\s*typeRating:\s*['"`]([^'"`]*)['"`],\s*medicalClass:\s*['"`]([^'"`]*)['"`],\s*icaoElpLevel:\s*['"`]([^'"`]*)['"`],\s*compensation:\s*['"`]([^'"`]*)['"`]/);
        
        if (jobMatch) {
            return {
                title: jobMatch[1],
                company: jobMatch[2],
                aircraft: jobMatch[3],
                location: jobMatch[4],
                role: jobMatch[5],
                url: jobMatch[6],
                posted: jobMatch[7],
                status: jobMatch[8],
                applicationUrl: jobMatch[9],
                flightTime: jobMatch[10],
                license: jobMatch[11],
                visaSponsorship: jobMatch[12],
                picTime: jobMatch[13],
                picInTypeTime: jobMatch[14],
                typeRating: jobMatch[15],
                medicalClass: jobMatch[16],
                icaoElpLevel: jobMatch[17],
                compensation: jobMatch[18]
            };
        }
        return null;
    }).filter(job => job !== null);
    
    return jobs;
};

// Main execution
const jobs = extractJobs();
console.log(`Found ${jobs.length} jobs to migrate`);

if (jobs.length > 0) {
    const sql = generateSQL(jobs);
    
    // Write SQL to file
    fs.writeFileSync('migrate_all_jobs.sql', sql);
    console.log(`Generated SQL for ${jobs.length} jobs in migrate_all_jobs.sql`);
    
    // Display sample of jobs
    console.log('\nSample jobs:');
    jobs.slice(0, 5).forEach((job, index) => {
        console.log(`${index + 1}. ${job.title} - ${job.company} - ${job.location}`);
    });
} else {
    console.error('No jobs found to migrate');
}
