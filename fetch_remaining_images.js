/**
 * Fetch USIU Africa and PAC University images using Puppeteer
 * by visiting their official websites and extracting real campus photos.
 */
require('dotenv').config({ path: '.env.local' });
const puppeteer = require('puppeteer');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const dir = path.join(__dirname, 'public', 'images', 'universities');

function downloadBinary(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadBinary(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const ct = res.headers['content-type'] || '';
      if (ct.includes('text/html')) return reject(new Error('Got HTML'));
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (buf.length < 20000) return reject(new Error(`Too small: ${buf.length}b`));
        fs.writeFileSync(dest, buf);
        resolve(buf.length);
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

const targets = [
  {
    id: 'usiu',
    name: 'USIU Africa',
    urls: [
      'https://www.usiu.ac.ke/',
      'https://www.usiu.ac.ke/about/',
      'https://www.usiu.ac.ke/campus-life/',
    ]
  },
  {
    id: 'pu',
    name: 'Pan Africa Christian University',
    urls: [
      'https://pacuniversity.ac.ke/',
      'https://www.pacuniversity.ac.ke/',
    ]
  }
];

async function findLargestCampusImage(page) {
  return await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const candidates = imgs
      .filter(img => {
        const src = img.src || '';
        const alt = (img.alt || '').toLowerCase();
        const width = img.naturalWidth || img.width || 0;
        const height = img.naturalHeight || img.height || 0;
        // Skip: logos, icons, tiny images, SVGs, avatars, social icons
        if (!src || src.includes('logo') || src.includes('Logo') || src.includes('icon')
          || src.includes('favicon') || src.includes('.svg') || src.includes('avatar')
          || src.includes('social') || src.includes('facebook') || src.includes('twitter')
          || src.endsWith('.gif') || src.includes('arrow') || src.includes('placeholder')
          || width < 400 || height < 200) return false;
        return true;
      })
      .map(img => ({ src: img.src, width: img.naturalWidth || img.width, height: img.naturalHeight || img.height }))
      .sort((a, b) => (b.width * b.height) - (a.width * a.height));
    return candidates.slice(0, 5).map(c => c.src);
  });
}

async function run() {
  console.log('🌐 Launching Puppeteer to find real campus photos...\n');
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const target of targets) {
    console.log(`\n========== ${target.id.toUpperCase()} - ${target.name} ==========`);
    const dest = path.join(dir, `${target.id}.jpg`);
    let downloaded = false;

    for (const siteUrl of target.urls) {
      if (downloaded) break;
      console.log(`\n🌍 Visiting: ${siteUrl}`);
      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.goto(siteUrl, { waitUntil: 'networkidle2', timeout: 20000 });
        await new Promise(r => setTimeout(r, 2000));

        const imgs = await findLargestCampusImage(page);
        console.log(`  Found ${imgs.length} candidate images`);

        for (const imgUrl of imgs) {
          console.log(`  📥 Trying: ${imgUrl}`);
          try {
            const size = await downloadBinary(imgUrl, dest);
            console.log(`  ✅ SUCCESS! ${(size/1024).toFixed(1)}KB`);
            const publicUrl = `/images/universities/${target.id}.jpg`;
            await supabase.from('universities').update({ image: publicUrl }).eq('id', target.id);
            console.log(`  ✅ DB updated → ${publicUrl}`);
            downloaded = true;
            break;
          } catch(e) {
            console.log(`  ❌ ${e.message}`);
          }
        }
        await page.close();
      } catch(e) {
        console.log(`  ⚠️  Page load error: ${e.message}`);
      }
    }

    if (!downloaded) {
      console.log(`❌ Failed to get image for ${target.id}`);
    }
  }

  await browser.close();

  console.log('\n\n📁 Final files:');
  fs.readdirSync(dir).forEach(f => {
    const stats = fs.statSync(path.join(dir, f));
    const isGood = stats.size > 50000;
    console.log(`   ${isGood ? '✅' : '⚠️ '} ${f}: ${(stats.size/1024).toFixed(1)}KB`);
  });
}

run().catch(console.error);
