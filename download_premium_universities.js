require('dotenv').config({ path: '.env.local' });
const https = require('https');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Create universities directory if it doesn't exist
const dir = path.join(__dirname, 'public', 'images', 'universities');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Unsplash collection IDs or search terms that yield premium university buildings
const queries = [
  'nairobi university',
  'university architecture',
  'modern campus building',
  'university gate',
  'lecture hall exterior',
  'beautiful university campus',
  'university library exterior',
  'university tower'
];

const universities = ['uon', 'jkuat', 'strath', 'ku', 'mku', 'moi', 'usiu', 'pu'];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
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
  console.log('Downloading premium university images from Unsplash...');
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  for (let i = 0; i < universities.length; i++) {
    const uniId = universities[i];
    const query = queries[i];
    
    // Using source.unsplash.com with specific dimensions and query
    // 1600x900 for high resolution 16:9 ratio suitable for covers/cards
    const url = `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`;
    const dest = path.join(dir, `${uniId}.jpg`);
    
    console.log(`Downloading ${uniId}.jpg (Query: ${query})...`);
    try {
      await downloadImage(url, dest);
      console.log(`✅ Saved ${uniId}.jpg`);
      
      const publicUrl = `/images/universities/${uniId}.jpg`;
      const { error } = await supabase.from('universities').update({ image: publicUrl }).eq('id', uniId);
      if (error) {
        console.error(`❌ Failed to update DB for ${uniId}:`, error);
      } else {
        console.log(`✅ Updated DB for ${uniId} -> ${publicUrl}`);
      }
      
      // Wait a bit to avoid rate limits
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`❌ Failed to download ${uniId}:`, err.message);
    }
  }
  console.log('\nAll done! Extreme research complete.');
}

run();
