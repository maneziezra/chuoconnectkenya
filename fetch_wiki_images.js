const https = require('https');
const fs = require('fs');
const path = require('path');

const files = {
  uon: 'File:University_of_Nairobi_Tower.jpg',
  jkuat: 'File:JKUAT-Main-Campus-Gate-A.jpg',
  ku: 'File:Kenyatta_University_Administration_Block.jpg',
  strath: 'File:Strathmore_University_Student_Centre.jpg',
  mku: 'File:Mount_Kenya_University.jpg',
  moi: 'File:Moi_University_Gate.jpg',
  usiu: 'File:USIU_Africa_Campus.jpg',
  pu: 'File:Pan_Africa_Christian_University.jpg'
};

const getImageUrl = (filename) => {
  return new Promise((resolve, reject) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&titles=${encodeURIComponent(filename)}&format=json`;
    const options = {
      headers: { 'User-Agent': 'ChuoConnectBot/1.0 (chuoconnect@example.com)' }
    };
    https.get(url, options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const pages = parsed.query.pages;
          const page = Object.values(pages)[0];
          if (page.imageinfo && page.imageinfo.length > 0) {
            resolve(page.imageinfo[0].url);
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

const downloadImage = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'ChuoConnectBot/1.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      res.pipe(fs.createWriteStream(dest))
         .on('error', reject)
         .once('close', () => resolve(dest));
    }).on('error', reject);
  });
};

(async () => {
  for (const [id, filename] of Object.entries(files)) {
    try {
      console.log(`Checking ${id}...`);
      const url = await getImageUrl(filename);
      if (url) {
        console.log(`Found URL for ${id}: ${url}`);
        const dest = path.join(__dirname, 'public', 'images', 'universities', `${id}.jpg`);
        await downloadImage(url, dest);
        console.log(`Downloaded ${id}.jpg`);
      } else {
        console.log(`Could not find image info for ${filename}`);
      }
    } catch (e) {
      console.error(`Error processing ${id}:`, e.message);
    }
  }
})();
