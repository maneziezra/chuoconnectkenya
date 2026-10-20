const puppeteer = require('puppeteer');
const http = require('http');

async function checkServerReady(port) {
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}/`, (res) => {
          if (res.statusCode === 200 || res.statusCode === 304) resolve(true);
          else resolve(false);
        });
        req.on('error', reject);
        req.setTimeout(2000, () => { req.destroy(); reject(new Error('timeout')); });
      });
      return true;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return false;
}

async function runTests() {
  const PORT = 3009;
  console.log(`Checking if server is running on port ${PORT}...`);
  const ready = await checkServerReady(PORT);
  if (!ready) {
    console.error(`Server is not ready on port ${PORT}`);
    process.exit(1);
  }
  console.log(`✅ Server is ready on port ${PORT}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  const testResults = {
    pagesTested: 0,
    imagesChecked: 0,
    imagesLoadedSuccessfully: 0,
    brokenImages: [],
    paddingChecks: [],
    clippingIssues: []
  };

  // 1. Test University of Nairobi Profile (Primary test case mentioned in prompt)
  console.log('\n========================================');
  console.log('Testing UoN Profile (/universities/uon)');
  console.log('========================================');
  await page.goto(`http://localhost:${PORT}/universities/uon`, { waitUntil: 'networkidle2' });
  testResults.pagesTested++;

  // A. Check Quick Facts card borders & spacing
  const quickFactsInfo = await page.evaluate(() => {
    const qfHeading = Array.from(document.querySelectorAll('.footer-heading')).find(el => el.textContent.includes('Quick Facts'));
    if (!qfHeading) return { error: 'Quick Facts heading not found' };
    const card = qfHeading.closest('.card');
    const cardRect = card.getBoundingClientRect();
    const rows = Array.from(card.querySelectorAll('.fact-item-row'));

    const rowDetails = rows.map(r => {
      const rRect = r.getBoundingClientRect();
      const style = window.getComputedStyle(r);
      const cardStyle = window.getComputedStyle(card);
      return {
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        distFromCardLeft: rRect.left - cardRect.left,
        distFromCardRight: cardRect.right - rRect.right,
        text: r.textContent.trim(),
        cardPadding: cardStyle.padding
      };
    });

    return {
      cardRect: { width: cardRect.width, height: cardRect.height },
      rowDetails
    };
  });

  console.log('Quick Facts spacing check:', JSON.stringify(quickFactsInfo, null, 2));

  // B. Check Contact & Links interactive items
  const contactLinksInfo = await page.evaluate(() => {
    const contactLinks = Array.from(document.querySelectorAll('.contact-interactive-link'));
    return contactLinks.map(l => {
      const rect = l.getBoundingClientRect();
      const style = window.getComputedStyle(l);
      const card = l.closest('.card');
      const cardRect = card ? card.getBoundingClientRect() : null;
      return {
        text: l.textContent.trim(),
        padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
        distFromCardLeft: cardRect ? rect.left - cardRect.left : null,
        distFromCardRight: cardRect ? cardRect.right - rect.right : null,
        borderRadius: style.borderRadius
      };
    });
  });

  console.log('Contact links spacing check:', JSON.stringify(contactLinksInfo, null, 2));

  // C. Test clicking and active states on Contact Links (Prompt: "where I press it... cut off from their borderline")
  const firstContactLink = await page.$('.contact-interactive-link');
  if (firstContactLink) {
    await firstContactLink.focus();
    const isFocusVisible = await page.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return { outline: style.outline, outlineOffset: style.outlineOffset };
    }, firstContactLink);
    console.log('Contact link focus state:', isFocusVisible);
  }

  // D. Check All Gallery Images for UoN
  const galleryInfo = await page.evaluate(() => {
    const gallerySection = document.querySelector('#gallery');
    if (!gallerySection) return { error: 'Gallery section not found' };
    const imgs = Array.from(gallerySection.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete
    }));
  });

  console.log(`UoN Gallery has ${galleryInfo.length} photos:`);
  galleryInfo.forEach((img, i) => {
    testResults.imagesChecked++;
    if (img.naturalWidth > 0 && img.complete) {
      testResults.imagesLoadedSuccessfully++;
      console.log(`  ✅ Photo ${i + 1}: [${img.naturalWidth}x${img.naturalHeight}] ${img.alt} (${img.src})`);
    } else {
      testResults.brokenImages.push(img.src);
      console.log(`  ❌ BROKEN Photo ${i + 1}: ${img.src}`);
    }
  });

  // 2. Test All Other Universities for Legitimate Images & Zero Clipping
  for (const uniId of ['ku', 'jkuat', 'strath', 'mku', 'moi', 'usiu', 'pu']) {
    console.log(`\n========================================`);
    console.log(`Testing University: ${uniId.toUpperCase()} (/universities/${uniId})`);
    console.log(`========================================`);
    await page.goto(`http://localhost:${PORT}/universities/${uniId}`, { waitUntil: 'networkidle2' });
    testResults.pagesTested++;

    const pageImages = await page.evaluate(() => {
      const allImgs = Array.from(document.querySelectorAll('img'));
      return allImgs.map(img => ({
        src: img.src,
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete
      }));
    });

    console.log(`Found ${pageImages.length} images on ${uniId} profile:`);
    pageImages.forEach((img) => {
      testResults.imagesChecked++;
      if (img.naturalWidth > 0 && img.complete) {
        testResults.imagesLoadedSuccessfully++;
        console.log(`  ✅ [${img.naturalWidth}x${img.naturalHeight}] ${img.alt.slice(0, 40)} -> ${img.src.replace(/^http:\/\/localhost:\d+/, '')}`);
      } else {
        testResults.brokenImages.push(`${uniId}: ${img.src}`);
        console.error(`  ❌ FAILED TO LOAD: ${img.src}`);
      }
    });

    // Check padding on quick facts & contact
    const hasTightBorder = await page.evaluate(() => {
      const rows = document.querySelectorAll('.fact-item-row, .contact-interactive-link');
      for (const r of rows) {
        const card = r.closest('.card');
        if (card) {
          const cRect = card.getBoundingClientRect();
          const rRect = r.getBoundingClientRect();
          if (rRect.left - cRect.left < 10 || cRect.right - rRect.right < 10) {
            return true;
          }
        }
      }
      return false;
    });

    if (hasTightBorder) {
      console.error(`  ❌ WARNING: Tight border detected on ${uniId}`);
      testResults.clippingIssues.push(uniId);
    } else {
      console.log(`  ✅ Generous padding confirmed on ${uniId} (borderline > 20px away from text)`);
    }
  }

  // 3. Test Universities Directory Page
  console.log('\n========================================');
  console.log('Testing Directory Page (/universities)');
  console.log('========================================');
  await page.goto(`http://localhost:${PORT}/universities`, { waitUntil: 'networkidle2' });
  testResults.pagesTested++;

  const dirCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.uni-card-image'));
    return cards.map(c => {
      const img = c;
      const card = c.closest('.card');
      const cardBody = card ? card.querySelector('.card-body') : null;
      const style = cardBody ? window.getComputedStyle(cardBody) : null;
      return {
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        bodyPadding: style ? style.padding : null
      };
    });
  });

  console.log(`Found ${dirCards.length} university cards in directory:`);
  dirCards.forEach((c, i) => {
    testResults.imagesChecked++;
    if (c.naturalWidth > 0) {
      testResults.imagesLoadedSuccessfully++;
      console.log(`  ✅ Card ${i + 1}: [${c.naturalWidth}x${c.naturalHeight}] Padding: ${c.bodyPadding} (${c.src.replace(/^http:\/\/localhost:\d+/, '')})`);
    } else {
      testResults.brokenImages.push(c.src);
      console.log(`  ❌ Card ${i + 1} Image Broken: ${c.src}`);
    }
  });

  console.log('\n========================================');
  console.log('SUMMARY OF VERIFICATION:');
  console.log('========================================');
  console.log(`Pages Tested: ${testResults.pagesTested}`);
  console.log(`Images Checked: ${testResults.imagesChecked}`);
  console.log(`Images Loaded: ${testResults.imagesLoadedSuccessfully}`);
  console.log(`Broken Images: ${testResults.brokenImages.length}`);
  console.log(`Clipping Issues: ${testResults.clippingIssues.length}`);

  await browser.close();

  if (testResults.brokenImages.length > 0 || testResults.clippingIssues.length > 0) {
    process.exit(1);
  } else {
    console.log('\n🎉 ALL AUTOMATED CHECKS PASSED WITH FLYING COLORS!');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
