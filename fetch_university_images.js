require('dotenv').config({ path: '.env.local' });
const gis = require('g-i-s');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const universities = [
  { id: 'uon', query: 'University of Nairobi main campus tower building architecture high resolution' },
  { id: 'jkuat', query: 'Jomo Kenyatta University of Agriculture and Technology main administration block JKUAT juja high resolution' },
  { id: 'strath', query: 'Strathmore University Nairobi campus building exterior high resolution' },
  { id: 'ku', query: 'Kenyatta University main gate or administration block high resolution' },
  { id: 'mku', query: 'Mount Kenya University MKU main campus thika high resolution' },
  { id: 'moi', query: 'Moi University main campus eldoret administration building high resolution' },
  { id: 'usiu', query: 'United States International University Africa USIU campus building high resolution' },
  { id: 'pu', query: 'Pan Africa Christian University pac university nairobi campus high resolution' }
];

const dir = path.join(__dirname, 'public', 'images', 'universities');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function searchImages(query) {
  return new Promise((resolve, reject) => {
    gis(query, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    client.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Starting extreme research for university images...');
  
  for (const uni of universities) {
    console.log(`\nSearching for: ${uni.query}`);
    try {
      const results = await searchImages(uni.query);
      if (!results || results.length === 0) {
        console.log(`No images found for ${uni.id}`);
        continue;
      }

      // Try top 3 results in case one fails to download
      let downloaded = false;
      for (let i = 0; i < Math.min(3, results.length); i++) {
        const imgUrl = results[i].url;
        console.log(`Attempting to download [${i+1}]: ${imgUrl}`);
        try {
          const ext = imgUrl.split('.').pop().split('?')[0] || 'jpg';
          // Force jpg extension for simplicity, or use original
          const dest = path.join(dir, `${uni.id}.jpg`);
          await downloadImage(imgUrl, dest);
          console.log(`✅ Successfully downloaded to ${dest}`);
          
          // Update database
          const publicUrl = `/images/universities/${uni.id}.jpg`;
          const { error } = await supabase.from('universities').update({ image: publicUrl }).eq('id', uni.id);
          if (error) {
            console.error(`❌ DB Update Failed for ${uni.id}:`, error);
          } else {
            console.log(`✅ DB Updated for ${uni.id}`);
          }
          downloaded = true;
          break; // Stop trying other URLs if successful
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
