const https = require('https');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const universities = [
  { id: 'uon', title: 'University_of_Nairobi' },
  { id: 'jkuat', title: 'Jomo_Kenyatta_University_of_Agriculture_and_Technology' },
  { id: 'strath', title: 'Strathmore_University' },
  { id: 'ku', title: 'Kenyatta_University' },
  { id: 'mku', title: 'Mount_Kenya_University' },
  { id: 'moi', title: 'Moi_University' },
  { id: 'usiu', title: 'United_States_International_University_Africa' },
  { id: 'pu', title: 'Pan_Africa_Christian_University' }
];

const dir = path.join(__dirname, 'public', 'images', 'universities');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'ChuoConnectApp/1.0' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    req.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function fetchWikiImage(uni) {
  return new Promise((resolve) => {
    https.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${uni.title}`, {
      headers: { 'User-Agent': 'ChuoConnectApp/1.0 (admin@chuoconnect.com)' }
    }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ id: uni.id, url: json.originalimage ? json.originalimage.source : null });
        } catch(e) { resolve({ id: uni.id, url: null }); }
      });
    });
  });
}

async function run() {
  const results = await Promise.all(universities.map(fetchWikiImage));
  console.log('Wiki Results:', results);

  for (const res of results) {
    if (res.url) {
      console.log(`Downloading ${res.id} from ${res.url}...`);
      const dest = path.join(dir, `${res.id}.jpg`);
      try {
        await downloadImage(res.url, dest);
        console.log(`✅ Saved ${res.id}`);
        const publicUrl = `/images/universities/${res.id}.jpg`;
        await supabase.from('universities').update({ image: publicUrl }).eq('id', res.id);
      } catch(e) {
        console.error(`❌ Failed ${res.id}:`, e.message);
      }
    }
  }
}

run();
