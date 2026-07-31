const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const files = {
  uon: 'University_of_Nairobi_Tower.jpg',
  jkuat: 'JKUAT-Main-Campus-Gate-A.jpg',
  ku: 'Kenyatta_University_Main_Gate.jpg',
  strath: 'Strathmore_University_Student_Centre.jpg',
  mku: 'Mount_Kenya_University_Main_Campus_Thika.jpg',
  moi: 'Moi_University_Administration_Block.jpg',
  usiu: 'USIU-Africa_Library.jpg',
  pu: 'Pan_Africa_Christian_University_Administration_Block.jpg'
};

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set a real user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

  for (const [id, filename] of Object.entries(files)) {
    try {
      console.log(`Processing ${id}...`);
      const url = `https://commons.wikimedia.org/wiki/File:${filename}`;
      
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      
      // Find the "Original file" link or the main image src
      const imageUrl = await page.evaluate(() => {
        const originalLink = document.querySelector('.fullMedia a');
        if (originalLink) return originalLink.href;
        const img = document.querySelector('#file img');
        if (img) return img.src;
        return null;
      });

      if (imageUrl) {
        console.log(`Found image URL for ${id}: ${imageUrl}`);
        
        // Open the image directly in Puppeteer to bypass 429
        const viewSource = await page.goto(imageUrl, { waitUntil: 'networkidle0' });
        const buffer = await viewSource.buffer();
        
        const dest = path.join(__dirname, 'public', 'images', 'universities', `${id}.jpg`);
        fs.writeFileSync(dest, buffer);
        console.log(`Success: ${id}.jpg saved.`);
      } else {
        console.log(`Failed to find image on page for ${filename}`);
      }
      
      // small delay
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error(`Error on ${id}: ${e.message}`);
    }
  }

  await browser.close();
})();
