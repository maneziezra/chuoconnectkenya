const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const universities = [
  { id: 'uon', query: 'University of Nairobi main campus tower building' },
  { id: 'jkuat', query: 'Jomo Kenyatta University Juja main campus' },
  { id: 'strath', query: 'Strathmore University Student Centre building' },
  { id: 'ku', query: 'Kenyatta University Main Gate' },
  { id: 'mku', query: 'Mount Kenya University Main Campus Thika' },
  { id: 'moi', query: 'Moi University Administration Block' },
  { id: 'usiu', query: 'USIU Africa Library building' },
  { id: 'pu', query: 'Pan Africa Christian University Administration Block' }
];

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url} - Status ${res.statusCode}`));
      }
      res.pipe(fs.createWriteStream(dest))
         .on('finish', resolve)
         .on('error', reject);
    }).on('error', reject);
  });
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  for (const uni of universities) {
    try {
      console.log(`Searching for: ${uni.query}`);
      await page.goto(`https://www.bing.com/images/search?q=${encodeURIComponent(uni.query)}`, { waitUntil: 'networkidle2' });
      
      const imageUrl = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('a.iusc'));
        for (const item of items) {
          try {
            const m = JSON.parse(item.getAttribute('m'));
            if (m && m.murl && (m.murl.endsWith('.jpg') || m.murl.endsWith('.png') || m.murl.endsWith('.jpeg'))) {
              return m.murl;
            }
          } catch (e) {}
        }
        return null;
      });

      if (imageUrl) {
        console.log(`Found high-res image for ${uni.id}: ${imageUrl}`);
        const dest = path.join(__dirname, 'public', 'images', 'universities', `${uni.id}.jpg`);
        try {
          await downloadFile(imageUrl, dest);
          console.log(`Saved ${uni.id}.jpg`);
        } catch (downloadErr) {
          console.log(`Failed pure download, using puppeteer fallback for ${uni.id}: ${downloadErr.message}`);
          // Fallback to Puppeteer if the site blocks regular Node HTTP
          const imgPage = await browser.newPage();
          const viewSource = await imgPage.goto(imageUrl, { waitUntil: 'networkidle0' });
          const buffer = await viewSource.buffer();
          fs.writeFileSync(dest, buffer);
          await imgPage.close();
          console.log(`Saved ${uni.id}.jpg via Puppeteer`);
        }
      } else {
        console.log(`No high-res images found for ${uni.id}`);
      }
    } catch (err) {
      console.error(`Error for ${uni.id}:`, err.message);
    }
  }

  await browser.close();
})();
