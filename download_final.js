const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const exactUrls = {
  uon: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/University_of_Nairobi_Tower.jpg',
  jkuat: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/JKUAT-Main-Campus-Gate-A.jpg',
  strath: 'https://strathmore.edu/wp-content/uploads/slider/cache/c3ce876e6523a820d5acbf42f6ccdd0b/run1.jpg',
  ku: 'https://www.ku.ac.ke/wp-content/uploads/2024/07/3.jpg', 
  mku: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Mount_Kenya_University%2C_Nakuru.jpg',
  moi: 'https://mu.ac.ke/wp-content/uploads/2024/06/student_life.jpg',
  usiu: 'https://www.usiu.ac.ke/wp-content/uploads/2021/01/Health-Sciences-Schools-slider.jpg',
  pu: 'https://demosite.pacuniversity.ac.ke/wp-content/uploads/2024/01/EOSR2505-scaled.jpg'
};

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');

  for (const [id, url] of Object.entries(exactUrls)) {
    try {
      console.log(`Downloading ${id} from ${url}...`);
      
      const viewSource = await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      const buffer = await viewSource.buffer();
      
      // Fallback check if it's an HTML page instead of raw image (like Wikimedia Commons)
      if (buffer.length > 0) {
        const dest = path.join(__dirname, 'public', 'images', 'universities', `${id}.jpg`);
        fs.writeFileSync(dest, buffer);
        console.log(`Success: ${id}.jpg saved.`);
      } else {
        console.log(`Failed: Buffer empty for ${id}`);
      }
      
    } catch (e) {
      console.error(`Error on ${id}: ${e.message}`);
    }
  }

  await browser.close();
})();
