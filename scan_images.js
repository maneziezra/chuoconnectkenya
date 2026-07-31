const puppeteer = require('puppeteer');

const universities = [
  { id: 'uon', url: 'https://uonbi.ac.ke' },
  { id: 'jkuat', url: 'https://www.jkuat.ac.ke' },
  { id: 'strath', url: 'https://strathmore.edu' },
  { id: 'ku', url: 'https://www.ku.ac.ke' },
  { id: 'mku', url: 'https://www.mku.ac.ke' },
  { id: 'moi', url: 'https://www.mu.ac.ke' },
  { id: 'usiu', url: 'https://www.usiu.ac.ke' },
  { id: 'pu', url: 'https://pacuniversity.ac.ke' }
];

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--ignore-certificate-errors'] 
  });
  const page = await browser.newPage();
  
  // Set window size large so images load
  await page.setViewport({ width: 1920, height: 1080 });

  for (const uni of universities) {
    console.log(`\n=== Scanning ${uni.id} (${uni.url}) ===`);
    try {
      await page.goto(uni.url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const images = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img, div[style*="background-image"]'));
        const results = [];
        
        for (const el of imgs) {
          let src = '';
          let alt = '';
          let width = 0;
          let height = 0;
          
          if (el.tagName.toLowerCase() === 'img') {
            src = el.src;
            alt = el.alt || '';
            width = el.naturalWidth || el.width || el.clientWidth;
            height = el.naturalHeight || el.height || el.clientHeight;
          } else {
            const style = window.getComputedStyle(el);
            const bg = style.backgroundImage;
            if (bg && bg !== 'none') {
              src = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
              width = el.clientWidth;
              height = el.clientHeight;
            }
          }
          
          if (src && width > 400 && height > 200 && !src.includes('data:image') && !src.includes('logo')) {
            results.push({ src, alt, width, height });
          }
        }
        
        // Remove duplicates based on src
        const unique = [];
        const seen = new Set();
        for (const item of results) {
          if (!seen.has(item.src)) {
            seen.add(item.src);
            unique.push(item);
          }
        }
        
        return unique.sort((a, b) => (b.width * b.height) - (a.width * a.height));
      });
      
      if (images.length === 0) {
        console.log(`  No large images found.`);
      } else {
        images.slice(0, 5).forEach((img, idx) => {
          console.log(`  ${idx + 1}. [${img.width}x${img.height}] ${img.src}`);
          if (img.alt) console.log(`     Alt: "${img.alt}"`);
        });
      }
    } catch (err) {
      console.log(`  Error: ${err.message}`);
    }
  }

  await browser.close();
})();
