const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { rejectUnauthorized: false }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
};

const universities = [
  { id: 'uon', query: 'University of Nairobi main campus building photo site:uonbi.ac.ke' },
  { id: 'jkuat', query: 'JKUAT main campus juja graduation square photo site:jkuat.ac.ke' },
  { id: 'strath', query: 'Strathmore university sbs building campus site:strathmore.edu' },
  { id: 'ku', query: 'Kenyatta university main campus administration gate photo site:ku.ac.ke' },
  { id: 'mku', query: 'Mount Kenya university thika main campus building site:mku.ac.ke' },
  { id: 'moi', query: 'Moi university administration block main campus site:mu.ac.ke' },
  { id: 'usiu', query: 'USIU africa library building campus photo site:usiu.ac.ke' },
  { id: 'pu', query: 'Pan Africa Christian university roysambu campus building site:pacuniversity.ac.ke' }
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  for (const uni of universities) {
    try {
      console.log(`Searching for: ${uni.query}`);
      await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(uni.query)}&iax=images&ia=images`, { waitUntil: 'networkidle2' });
      
      // Wait for image results
      await page.waitForSelector('.tile--img__img', { timeout: 10000 });
      
      // Get the top 5 image URLs
      const imageUrls = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('.tile--img__img'));
        return imgs.map(img => img.src).filter(src => src && src.startsWith('http')).slice(0, 5);
      });

      if (imageUrls.length > 0) {
        console.log(`Found ${imageUrls.length} images for ${uni.id}. Downloading the first one: ${imageUrls[0]}`);
        const dest = path.join(__dirname, 'public', 'images', 'universities', `${uni.id}.jpg`);
        await downloadImage(imageUrls[0], dest);
        console.log(`Successfully downloaded ${uni.id}.jpg`);
      } else {
        console.log(`No images found for ${uni.id}`);
      }
    } catch (err) {
      console.error(`Error for ${uni.id}:`, err.message);
    }
  }

  await browser.close();
})();
