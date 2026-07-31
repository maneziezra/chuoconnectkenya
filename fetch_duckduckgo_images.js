require('dotenv').config({ path: '.env.local' });
const { image_search } = require('duckduckgo-images-api');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const universities = [
  { id: 'uon', query: 'University of Nairobi towers' },
  { id: 'jkuat', query: 'Jomo Kenyatta University of Agriculture and Technology administration block' },
  { id: 'strath', query: 'Strathmore University Nairobi campus building' },
  { id: 'ku', query: 'Kenyatta University main gate' },
  { id: 'mku', query: 'Mount Kenya University MKU main campus thika' },
  { id: 'moi', query: 'Moi University main campus eldoret administration building' },
  { id: 'usiu', query: 'USIU Africa campus building nairobi' },
  { id: 'pu', query: 'Pan Africa Christian University campus' }
];

const dir = path.join(__dirname, 'public', 'images', 'universities');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } }, (response) => {
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
    // Set timeout to 10 seconds to avoid hanging on slow image servers
    req.setTimeout(10000, () => {
        req.destroy();
        fs.unlink(dest, () => {});
        reject(new Error(`Timeout getting '${url}'`));
    });
  });
}

async function run() {
  console.log('Starting DuckDuckGo image search...');
  
  for (const uni of universities) {
    console.log(`\nSearching for: ${uni.query}`);
    try {
      const results = await image_search({ query: uni.query, moderate: true });
      if (!results || results.length === 0) {
        console.log(`No images found for ${uni.id}`);
        continue;
      }

      let downloaded = false;
      // Try up to 5 results to find one that downloads properly
      for (let i = 0; i < Math.min(5, results.length); i++) {
        const imgUrl = results[i].image;
        console.log(`Attempting to download [${i+1}]: ${imgUrl}`);
        try {
          const dest = path.join(dir, `${uni.id}.jpg`);
          await downloadImage(imgUrl, dest);
          console.log(`✅ Successfully downloaded to ${dest}`);
          
          const publicUrl = `/images/universities/${uni.id}.jpg`;
          const { error } = await supabase.from('universities').update({ image: publicUrl }).eq('id', uni.id);
          if (error) {
            console.error(`❌ DB Update Failed for ${uni.id}:`, error);
          } else {
            console.log(`✅ DB Updated for ${uni.id}`);
          }
          downloaded = true;
          break;
        } catch (e) {
          console.log(`Failed to download [${i+1}]:`, e.message);
        }
      }
      if (!downloaded) {
        console.log(`❌ All download attempts failed for ${uni.id}`);
      }
    } catch (err) {
      console.error(`Error searching for ${uni.id}:`, err);
    }
  }
  
  console.log('\nAll done!');
}

run();
