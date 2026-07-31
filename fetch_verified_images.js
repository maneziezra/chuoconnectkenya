/**
 * FINAL APPROACH: Use Wikimedia Commons imageinfo API with VERIFIED filenames
 * from actual API searches, then download the real campus photos.
 */
require('dotenv').config({ path: '.env.local' });
const https = require('https');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const dir = path.join(__dirname, 'public', 'images', 'universities');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'ChuoConnectBot/1.0 (https://chuoconnect.com; admin@chuoconnect.com)',
        'Accept': 'application/json, image/*'
      }
    }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        httpsGet(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

async function getImageUrl(filename) {
  const encoded = encodeURIComponent(filename);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encoded}&prop=imageinfo&iiprop=url&format=json`;
  const res = await httpsGet(url);
  if (res.statusCode !== 200) throw new Error(`API ${res.statusCode}`);
  const json = JSON.parse(res.data.toString());
  const pages = json.query.pages;
  const page = Object.values(pages)[0];
  if (page.missing) throw new Error(`File missing: ${filename}`);
  if (!page.imageinfo?.[0]?.url) throw new Error(`No URL for ${filename}`);
  return page.imageinfo[0].url;
}

async function downloadImage(url, dest) {
  const res = await httpsGet(url);
  if (res.statusCode !== 200) throw new Error(`HTTP ${res.statusCode}`);
  const ct = res.headers['content-type'] || '';
  if (ct.includes('text/html')) throw new Error(`Got HTML not image`);
  if (res.data.length < 15000) throw new Error(`Too small: ${res.data.length} bytes`);
  fs.writeFileSync(dest, res.data);
  return res.data.length;
}

// VERIFIED filenames from actual Wikimedia Commons API searches
const UNIVERSITIES = [
  {
    id: 'uon',
    name: 'University of Nairobi',
    // Verified from Wikimedia Commons search results
    files: [
      'University of Nairobi Mahatma Gandhi Memorial Library.jpg',
      'University of Nairobi Main Campus.jpg',
      'Tower of University of Nairobi.jpg',
    ]
  },
  {
    id: 'jkuat',
    name: 'JKUAT',
    files: [
      'JKUAT Towers, 2025 (01).jpg',
      'Jomo Kenyatta University Juja Campus Main Library.JPG',
    ]
  },
  {
    id: 'strath',
    name: 'Strathmore University',
    // Already successfully downloaded - 337KB aerial campus photo
    files: [
      'An_aerial_view_of_Strathmore-University_Keri_campus.jpg',
    ],
    alreadyDone: true
  },
  {
    id: 'ku',
    name: 'Kenyatta University',
    files: [
      'Kenyatta University Mombasa Campus, 2025 (01).jpg',
      'Kenyatta University, Nairobi, Kenya.jpg',
    ]
  },
  {
    id: 'mku',
    name: 'Mount Kenya University',
    // Already successfully downloaded - 180KB
    files: [
      'Mount_Kenya_University,_Nakuru.jpg',
    ],
    alreadyDone: true
  },
  {
    id: 'moi',
    name: 'Moi University',
    files: [
      'Moi University Graduation, Kenya.jpg',
      'Moi University Kenya.jpg',
      'MoiUniversity main campus.jpg',
    ]
  },
  {
    id: 'usiu',
    name: 'USIU Africa',
    files: [
      'United States International University-Africa.jpg',
      'USIU-Africa campus Nairobi.jpg',
      'USIU Africa campus.jpg',
    ]
  },
  {
    id: 'pu',
    name: 'Pan Africa Christian University',
    files: [
      'Pan Africa Christian University.jpg',
      'PAC University Nairobi Kenya.jpg',
      'Pan-Africa Christian University campus.jpg',
    ]
  }
];

async function run() {
  console.log('🎯 Using verified Wikimedia Commons filenames\n');

  for (const uni of UNIVERSITIES) {
    if (uni.alreadyDone) {
      const dest = path.join(dir, `${uni.id}.jpg`);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 50000) {
        console.log(`✅ [${uni.id}] Already have good image (${(fs.statSync(dest).size/1024).toFixed(1)}KB), skipping`);
        continue;
      }
    }

    console.log(`\n========== ${uni.id.toUpperCase()} - ${uni.name} ==========`);
    const dest = path.join(dir, `${uni.id}.jpg`);
    let downloaded = false;

    for (const filename of uni.files) {
      try {
        console.log(`🔍 Looking up: "${filename}"`);
        const imgUrl = await getImageUrl(filename);
        console.log(`📥 URL: ${imgUrl}`);
        await sleep(500);

        const size = await downloadImage(imgUrl, dest);
        console.log(`✅ SUCCESS! ${(size/1024).toFixed(1)}KB`);

        const publicUrl = `/images/universities/${uni.id}.jpg`;
        const { error } = await supabase.from('universities').update({ image: publicUrl }).eq('id', uni.id);
        if (error) console.error(`  DB error: ${error.message}`);
        else console.log(`  ✅ DB updated → ${publicUrl}`);

        downloaded = true;
        break;
      } catch(e) {
        console.log(`  ❌ ${e.message}`);
      }
      await sleep(1000);
    }

    if (!downloaded) {
      console.log(`❌ All files failed for ${uni.id}`);
    }
    await sleep(1500);
  }

  console.log('\n\n📁 Files in public/images/universities/:');
  fs.readdirSync(dir).forEach(f => {
    const stats = fs.statSync(path.join(dir, f));
    console.log(`   ${f}: ${(stats.size/1024).toFixed(1)}KB`);
  });
}

run().catch(console.error);
