require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const jsonPath = 'c:\\Users\\Archlord\\.gemini\\antigravity\\brain\\8fca3a8f-e23e-48b4-a30b-5661c1306c54\\scratch\\kuccps_institutions.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let uniqueNames = [...new Set(data)];
const exclude = ['Background', 'Vision, Mission, &amp; Core Values', 'Leadership', 'Secretariat', 'Organisation Structure', 'Service Charter'];
uniqueNames = uniqueNames.filter(n => n.length > 5 && !exclude.includes(n));

function generateId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 50);
}

function getAbbrev(name) {
  const match = name.match(/\(([^)]+)\)/);
  if (match) return match[1];
  const abbr = name.split(' ').map(w => w[0]).join('').toUpperCase().replace(/[^A-Z]/g, '').substring(0, 5);
  return abbr || null;
}

async function run() {
  const batch = uniqueNames.map(name => {
    let cleanName = name.replace(/&amp;/g, '&').replace(/&rsquo;/g, "'");
    return {
      id: generateId(cleanName),
      name: cleanName,
      abbrev: getAbbrev(cleanName),
      type: 'Public',
      county: 'Kenya',
      established: 2000,
      students: '5000+',
      overview: 'A registered institution in Kenya offering quality higher education and vocational training.',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.0,
      reviewCount: 0,
      facilities: [],
      programs: []
    };
  });

  console.log(`Inserting ${batch.length} institutions...`);
  
  for (let i = 0; i < batch.length; i += 50) {
    const chunk = batch.slice(i, i + 50);
    const { data, error } = await supabase.from('universities').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error('Error inserting chunk:', error);
    } else {
      console.log(`Inserted chunk ${i/50 + 1}`);
    }
  }
  console.log('Done!');
}
run();
