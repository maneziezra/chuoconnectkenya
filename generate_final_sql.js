const fs = require('fs');

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

let sql = `-- Insert KUCCPS and CUE Institutions\n\n`;
sql += `INSERT INTO public.universities (id, name, abbrev, type, county, established, students, overview, image, fees, accommodation, "entryRequirements")\nVALUES\n`;

const values = uniqueNames.map(name => {
  let cleanName = name.replace(/&amp;/g, '&').replace(/&rsquo;/g, "'");
  let escapedName = cleanName.replace(/'/g, "''");
  
  let id = generateId(cleanName);
  let abbrev = getAbbrev(cleanName);
  let type = 'Public';
  let county = 'Kenya';
  let established = 2000;
  let students = '5000+';
  let overview = 'A registered institution in Kenya offering quality higher education and vocational training.';
  let image = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
  let fees = 'Contact institution for details';
  let accommodation = 'Contact institution for details';
  let entryRequirements = 'Minimum KCSE Mean Grade of C+ for degree programmes.';
  
  return `('${id}', '${escapedName}', '${abbrev}', '${type}', '${county}', ${established}, '${students}', '${overview}', '${image}', '${fees}', '${accommodation}', '${entryRequirements}')`;
});

sql += values.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n';

fs.writeFileSync('c:\\Users\\Archlord\\Downloads\\chuo connectgoogle\\chuoconnectkenya\\universities_insert.sql', sql);
console.log('SQL generated!');
