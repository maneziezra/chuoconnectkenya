const https = require('https');
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

const getOriginalUrl = (filename) => {
  return new Promise((resolve, reject) => {
    const url = `https://commons.wikimedia.org/wiki/File:${filename}`;
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/href="([^"]+)">Original file/);
        if (match) {
          resolve(match[1]);
        } else {
          // fallback: try to find any upload.wikimedia.org link that looks like the image
          const fallback = data.match(/src="(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/[^"]+)"/);
          if (fallback) {
            resolve(fallback[1]);
          } else {
            resolve(null);
          }
        }
      });
    });
    req.on('error', reject);
  });
};

const downloadImage = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}`));
      res.pipe(fs.createWriteStream(dest)).on('finish', resolve).on('error', reject);
    }).on('error', reject);
  });
};

(async () => {
  for (const [id, filename] of Object.entries(files)) {
    try {
      console.log(`Processing ${id}...`);
      const url = await getOriginalUrl(filename);
      if (url) {
        const dest = path.join(__dirname, 'public', 'images', 'universities', `${id}.jpg`);
        await downloadImage(url, dest);
        console.log(`Success: ${id} -> ${url}`);
      } else {
        console.log(`Failed to find URL for ${filename}`);
      }
      // wait 2 seconds to avoid rate limits
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error(`Error on ${id}: ${e.message}`);
    }
  }
})();
