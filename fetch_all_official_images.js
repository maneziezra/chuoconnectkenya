/**
 * Fetch ALL university images directly from their OFFICIAL WEBSITES using Puppeteer.
 * This ensures we only use real photos sourced directly from the institutions.
 */
require('dotenv').config({ path: '.env.local' });
// BYPASS SSL errors for these university sites
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
        if (!res.headers.location) return reject(new Error('Redirect with no location'));
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
            const urlObj = new URL(url);
            redirectUrl = urlObj.origin + redirectUrl;
        }
        downloadBinary(redirectUrl, dest).then(resolve).catch(reject);
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
    id: 'uon',
    name: 'University of Nairobi',
    urls: [
      'https://www.uonbi.ac.ke/',
      'https://www.uonbi.ac.ke/about-us'
    ]
  },
  {
    id: 'jkuat',
    name: 'JKUAT',
    urls: [
      'https://www.jkuat.ac.ke/',
      'https://www.jkuat.ac.ke/about-jkuat/'
    ]
  },
  {
    id: 'strath',
    name: 'Strathmore University',
    urls: [
      'https://strathmore.edu/',
      'https://strathmore.edu/campus-life/'
    ]
  },
  {
    id: 'ku',
    name: 'Kenyatta University',
    urls: [
      'https://www.ku.ac.ke/',
      'https://www.ku.ac.ke/about-ku/'
    ]
  },
  {
    id: 'mku',
    name: 'Mount Kenya University',
    urls: [
      'https://www.mku.ac.ke/',
      'https://www.mku.ac.ke/about-us/'
    ]
  },
  {
    id: 'moi',
    name: 'Moi University',
    urls: [
      'https://www.mu.ac.ke/',
      'https://www.mu.ac.ke/index.php/en/about-us/history-of-the-university'
    ]
  },
  {
    id: 'usiu',
    name: 'USIU Africa',
    urls: [
      'https://www.usiu.ac.ke/',
      'https://www.usiu.ac.ke/campus-life/'
    ]
  },
  {
    id: 'pu',
    name: 'Pan Africa Christian University',
    urls: [
      'https://www.pacuniversity.ac.ke/'
    ]
  }
];

async function findLargestCampusImage(page) {
  return await page.evaluate(() => {
    // Look at img tags and background images
    const candidates = [];
    
    // 1. Image tags
    const imgs = Array.from(document.querySelectorAll('img'));
    for (const img of imgs) {
      const src = img.src || '';
      const width = img.naturalWidth || img.width || 0;
      const height = img.naturalHeight || img.height || 0;
      
      if (!src || src.includes('logo') || src.toLowerCase().includes('logo') || src.includes('icon')
          || src.includes('favicon') || src.includes('.svg') || src.includes('avatar')
          || src.includes('social') || src.includes('facebook') || src.includes('twitter')
          || src.endsWith('.gif') || src.includes('arrow') || src.includes('placeholder')
          || width < 400 || height < 250) continue;
          
      candidates.push({ src, width, height, area: width * height, type: 'img' });
    }
    
    // 2. Background images (often used for hero sections)
    const elements = Array.from(document.querySelectorAll('div, section, header, figure'));
    for (const el of elements) {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
        let src = bgImage.slice(4, -1).replace(/["']/g, "");
        if (src.startsWith('http') && !src.toLowerCase().includes('logo') && !src.includes('.svg') && !src.includes('pattern')) {
          const rect = el.getBoundingClientRect();
          if (rect.width >= 400 && rect.height >= 250) {
            candidates.push({ src, width: rect.width, height: rect.height, area: rect.width * rect.height, type: 'bg' });
          }
        }
      }
    }
    
    // Sort by area (largest first)
    candidates.sort((a, b) => b.area - a.area);
    
    // Return top 5 unique URLs
    const uniqueUrls = [];
    for (const c of candidates) {
      if (!uniqueUrls.includes(c.src)) {
        uniqueUrls.push(c.src);
        if (uniqueUrls.length >= 5) break;
      }
    }
    
    return uniqueUrls;
  });
}

async function run() {
  console.log('🌐 Launching Puppeteer to fetch images from OFFICIAL WEBSITES...\n');
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--ignore-certificate-errors', '--no-sandbox'] 
  });

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
        
        // Wait until network is somewhat idle
        await page.goto(siteUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        
        // Let lazy loaded images trigger
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight/2));
        await new Promise(r => setTimeout(r, 2000));
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await new Promise(r => setTimeout(r, 2000));
        await page.evaluate(() => window.scrollTo(0, 0));
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
            break; // Stop after first successful download for this university
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
    const isGood = stats.size > 20000;
    console.log(`   ${isGood ? '✅' : '⚠️ '} ${f}: ${(stats.size/1024).toFixed(1)}KB`);
  });
}

run().catch(console.error);
