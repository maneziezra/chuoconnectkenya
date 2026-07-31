const https = require('https');

const universities = [
  'University of Nairobi',
  'Jomo Kenyatta University of Agriculture and Technology',
  'Strathmore University',
  'Kenyatta University',
  'Mount Kenya University',
  'Moi University',
  'United States International University Africa',
  'Pan Africa Christian University'
];

async function searchCommons(query) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&format=json`;
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.query && parsed.query.pages) {
            const pages = parsed.query.pages;
            const pageId = Object.keys(pages)[0];
            const imageUrl = pages[pageId].imageinfo[0].url;
            resolve(imageUrl);
          } else {
            resolve(null);
          }
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

(async () => {
  for (const u of universities) {
    const img = await searchCommons(u);
    console.log(`${u}: ${img}`);
  }
})();
