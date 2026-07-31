const https = require('https');
const universities = ['University of Nairobi', 'Jomo Kenyatta University of Agriculture and Technology', 'Strathmore University', 'Kenyatta University', 'Mount Kenya University', 'Moi University', 'United States International University Africa', 'Pan Africa Christian University'];

async function searchWikipedia(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(query)}`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const pages = parsed.query.pages;
          const pageId = Object.keys(pages)[0];
          resolve(pages[pageId].original ? pages[pageId].original.source : null);
        } catch(e) { resolve(null); }
      });
    }).on('error', reject);
  });
}

(async () => {
  for (const u of universities) {
    const img = await searchWikipedia(u);
    console.log(`${u}: ${img}`);
  }
})();
