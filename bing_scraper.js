const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  for (const uni of universities) {
    try {
      console.log(`Searching for: ${uni.query}`);
      // Search Bing Images because it's easier to scrape than DDG or Google
      await page.goto(`https://www.bing.com/images/search?q=${encodeURIComponent(uni.query)}`, { waitUntil: 'networkidle2' });
      
      const imageUrl = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img.mimg'));
        for (const img of imgs) {
          const src = img.getAttribute('src') || img.getAttribute('data-src');
          if (src && src.startsWith('http')) {
            return src;
          }
        }
        return null;
      });

      if (imageUrl) {
        console.log(`Found image for ${uni.id}: ${imageUrl}`);
        
        // Open the image in a new tab to bypass Hotlinking/429
        const imgPage = await browser.newPage();
        const viewSource = await imgPage.goto(imageUrl);
        const buffer = await viewSource.buffer();
        
        const dest = path.join(__dirname, 'public', 'images', 'universities', `${uni.id}.jpg`);
        fs.writeFileSync(dest, buffer);
        console.log(`Saved ${uni.id}.jpg`);
        
        await imgPage.close();
      } else {
        console.log(`No images found for ${uni.id}`);
      }
    } catch (err) {
      console.error(`Error for ${uni.id}:`, err.message);
    }
  }

  await browser.close();
})();
