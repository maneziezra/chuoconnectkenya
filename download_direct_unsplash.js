require('dotenv').config({ path: '.env.local' });
const https = require('https');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const dir = path.join(__dirname, 'public', 'images', 'universities');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// 8 high-quality Unsplash photos that look like beautiful university campuses
const images = [
  { id: 'uon', url: 'https://images.unsplash.com/photo-1541339149448-74d1b745815f?auto=format&fit=crop&w=1600&q=80' },
  { id: 'jkuat', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80' },
  { id: 'strath', url: 'https://images.unsplash.com/photo-1562774053712-bacb40cb4cb4?auto=format&fit=crop&w=1600&q=80' },
  { id: 'ku', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80' },
  { id: 'mku', url: 'https://images.unsplash.com/photo-1498243691581-bdfc2ce144ce?auto=format&fit=crop&w=1600&q=80' },
  { id: 'moi', url: 'https://images.unsplash.com/photo-1525926578848-f86053f3e58c?auto=format&fit=crop&w=1600&q=80' },
  { id: 'usiu', url: 'https://images.unsplash.com/photo-1576495199011-1a4a700d18f6?auto=format&fit=crop&w=1600&q=80' },
  { id: 'pu', url: 'https://images.unsplash.com/photo-1592224741355-6df3abfb8653?auto=format&fit=crop&w=1600&q=80' }
];

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        fs.unlink(dest, () => {});
        return reject(new Error(`Failed ${response.statusCode}`));
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
  console.log('Downloading premium Unsplash university images...');
  
  for (let img of images) {
    const dest = path.join(dir, `${img.id}.jpg`);
    console.log(`Downloading ${img.id}...`);
    try {
      await download(img.url, dest);
      console.log(`✅ Saved ${img.id}.jpg`);
      
      const publicUrl = `/images/universities/${img.id}.jpg`;
      const { error } = await supabase.from('universities').update({ image: publicUrl }).eq('id', img.id);
      if (error) {
        console.error(`❌ DB Update Failed for ${img.id}:`, error);
      } else {
        console.log(`✅ DB Updated for ${img.id}`);
      }
    } catch (e) {
      console.error(`❌ Failed to download ${img.id}:`, e.message);
    }
  }
  
  console.log('\nAll done!');
}

run();
