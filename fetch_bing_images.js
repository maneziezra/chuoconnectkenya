require('dotenv').config({ path: '.env.local' });
const puppeteer = require('puppeteer');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const universities = [
  { id: 'uon', query: 'University of Nairobi main campus tower building' },
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
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (response) => {
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
    req.setTimeout(10000, () => {
        req.destroy();
        fs.unlink(dest, () => {});
        reject(new Error(`Timeout getting '${url}'`));
    });
  });
}

async function run() {
  console.log('Launching browser to scrape Bing Images...');
  const browser = await puppeteer.launch({ headless: 'new' });
  
  for (const uni of universities) {
    console.log(`\nSearching for: ${uni.query}`);
    try {
      const page = await browser.newPage();
      await page.goto(`https://www.bing.com/images/search?q=${encodeURIComponent(uni.query)}&FORM=HDRSC3`, { waitUntil: 'domcontentloaded' });
      
      // Extract high-res image URLs from Bing's m="" attribute
      const imageUrls = await page.evaluate(() => {
        const els = document.querySelectorAll('a.iusc');
        const urls = [];
        for (let el of els) {
          const m = el.getAttribute('m');
          if (m) {
            try {
              const data = JSON.parse(m);
              if (data.murl) urls.push(data.murl);
            } catch(e) {}
          }
        }
        return urls;
      });
      
      await page.close();

      if (!imageUrls || imageUrls.length === 0) {
        console.log(`❌ No images found for ${uni.id}`);
        continue;
      }

      let downloaded = false;
      // Try top 5 results
      for (let i = 0; i < Math.min(5, imageUrls.length); i++) {
        const imgUrl = imageUrls[i];
        console.log(`Attempting to download [${i+1}]: ${imgUrl}`);
        try {
          const dest = path.join(dir, `${uni.id}.jpg`);
          await downloadImage(imgUrl, dest);
          
          // Verify file is not empty or tiny (like a 1kb HTML file)
          const stats = fs.statSync(dest);
          if (stats.size < 5000) {
              throw new Error("File too small, likely an error page.");
          }

          console.log(`✅ Successfully downloaded to ${dest}`);
          
          const publicUrl = `/images/universities/${uni.id}.jpg`;
          const { error } = await supabase.from('universities').update({ image: publicUrl }).eq('id', uni.id);
          if (error) {
            console.error(`❌ DB Update Failed for ${uni.id}:`, error);
          } else {
            console.log(`✅ DB Updated for ${uni.id}`);
          }
          downloaded = true;
          break; // Stop after success
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
  
  await browser.close();
  console.log('\nAll done! Extreme research complete.');
}

run();
