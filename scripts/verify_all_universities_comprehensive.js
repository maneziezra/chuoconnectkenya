const puppeteer = require('puppeteer');
const http = require('http');

async function checkServerReady(port) {
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
          res.resume();
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

async function runComprehensiveTests() {
  const PORT = 3009;
  console.log(`Checking if server is running on port ${PORT}...`);
  const ready = await checkServerReady(PORT);
  if (!ready) {
    console.error(`Server is not ready on port ${PORT}`);
    process.exit(1);
  }
  console.log(`✅ Server is ready on port ${PORT}`);

  const allUnis = ['uon', 'ku', 'jkuat', 'strath', 'mku', 'moi', 'usiu', 'pu', 'egerton'];
  const viewports = [
    { name: 'Desktop (1440x900)', width: 1440, height: 900, isMobile: false },
    { name: 'Mobile (375x812)', width: 375, height: 812, isMobile: true }
  ];

  let totalImagesChecked = 0;
  let totalImagesLoaded = 0;
  let brokenImages = [];
  let clippingErrors = [];
  let overflowErrors = [];

  for (const vp of viewports) {
    console.log(`\n======================================================`);
    console.log(`RUNNING TESTS IN VIEWPORT: ${vp.name}`);
    console.log(`======================================================`);

    for (const uniId of allUnis) {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(30000);
      await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
      const url = `http://127.0.0.1:${PORT}/universities/${uniId}`;
      console.log(`\nTesting ${uniId.toUpperCase()} (${url})...`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 600));

      const evaluation = await page.evaluate(() => {
        const body = document.body;
        const docEl = document.documentElement;
        const scrollWidth = Math.max(body.scrollWidth, docEl.scrollWidth);
        const clientWidth = docEl.clientWidth;
        const hasHorizontalScroll = scrollWidth > clientWidth + 2;

        // Check images
        const imgs = Array.from(document.querySelectorAll('img')).map(i => ({
          src: i.src,
          alt: i.alt,
          naturalWidth: i.naturalWidth,
          naturalHeight: i.naturalHeight,
          complete: i.complete
        }));

        // Check quick facts spacing
        const qfHeading = Array.from(document.querySelectorAll('.footer-heading')).find(el => el.textContent.includes('Quick Facts'));
        const qfCard = qfHeading ? qfHeading.closest('.card') : null;
        let qfDist = null;
        if (qfCard) {
          const cardRect = qfCard.getBoundingClientRect();
          const firstRow = qfCard.querySelector('.fact-item-row');
          if (firstRow) {
            const rRect = firstRow.getBoundingClientRect();
            qfDist = {
              leftFromCard: rRect.left - cardRect.left,
              rightFromCard: cardRect.right - rRect.right
            };
          }
        }

        // Check contact links
        const contactLinks = Array.from(document.querySelectorAll('.contact-interactive-link')).map(l => {
          const card = l.closest('.card');
          const cardRect = card ? card.getBoundingClientRect() : null;
          const lRect = l.getBoundingClientRect();
          const style = window.getComputedStyle(l);
          return {
            text: l.textContent.trim(),
            padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
            distFromCardLeft: cardRect ? lRect.left - cardRect.left : null,
            distFromCardRight: cardRect ? cardRect.right - lRect.right : null
          };
        });

        // Check hero clipping
        const heroBanner = document.querySelector('.uni-hero-banner');
        const heroRect = heroBanner ? heroBanner.getBoundingClientRect() : null;
        const backBtn = heroBanner ? heroBanner.querySelector('a') : null;
        const backRect = backBtn ? backBtn.getBoundingClientRect() : null;
        const heroBackClipped = (heroRect && backRect) ? (backRect.top < heroRect.top || backRect.bottom > heroRect.bottom + 2) : false;

        return {
          hasHorizontalScroll,
          scrollWidth,
          clientWidth,
          imgs,
          qfDist,
          contactLinks,
          heroBackClipped
        };
      });

      // Images check
      evaluation.imgs.forEach(img => {
        totalImagesChecked++;
        if (img.naturalWidth > 0 && img.complete) {
          totalImagesLoaded++;
        } else {
          brokenImages.push(`${uniId} (${vp.name}): ${img.src}`);
          console.error(`  ❌ BROKEN IMAGE: ${img.src}`);
        }
      });

      // Horizontal overflow check
      if (evaluation.hasHorizontalScroll) {
        overflowErrors.push(`${uniId} (${vp.name}): scrollWidth=${evaluation.scrollWidth} > clientWidth=${evaluation.clientWidth}`);
        console.error(`  ❌ HORIZONTAL OVERFLOW DETECTED: ${evaluation.scrollWidth}px > ${evaluation.clientWidth}px`);
      } else {
        console.log(`  ✅ Clean responsive layout (no horizontal scroll: ${evaluation.clientWidth}px)`);
      }

      // Quick Facts border clearance check
      if (evaluation.qfDist) {
        if (evaluation.qfDist.leftFromCard < 16 || evaluation.qfDist.rightFromCard < 16) {
          clippingErrors.push(`${uniId} (${vp.name}): Quick facts tight border (left=${evaluation.qfDist.leftFromCard}, right=${evaluation.qfDist.rightFromCard})`);
          console.error(`  ❌ TIGHT QUICK FACTS BORDER: left=${evaluation.qfDist.leftFromCard}, right=${evaluation.qfDist.rightFromCard}`);
        } else {
          console.log(`  ✅ Quick Facts generous border clearance: left=${evaluation.qfDist.leftFromCard}px, right=${evaluation.qfDist.rightFromCard}px`);
        }
      }

      // Contact links clearance check
      evaluation.contactLinks.forEach(cl => {
        if (cl.distFromCardLeft !== null && (cl.distFromCardLeft < 16 || cl.distFromCardRight < 16)) {
          clippingErrors.push(`${uniId} (${vp.name}): Contact link tight border (${cl.text})`);
          console.error(`  ❌ TIGHT CONTACT LINK BORDER: ${cl.text}`);
        }
      });
      if (evaluation.contactLinks.length > 0) {
        console.log(`  ✅ Contact links confirmed with generous padding (${evaluation.contactLinks[0].padding})`);
      }

      // Hero clipping check
      if (evaluation.heroBackClipped) {
        clippingErrors.push(`${uniId} (${vp.name}): Hero back button clipped`);
        console.error(`  ❌ HERO CONTENT CLIPPED AT TOP`);
      } else {
        console.log(`  ✅ Hero banner perfectly contained`);
      }
      await browser.close();
    }

    // Directory Page Test
    console.log(`\nTesting Directory Page (/universities) in ${vp.name}...`);
    const dirBrowser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const dirPage = await dirBrowser.newPage();
    dirPage.setDefaultNavigationTimeout(30000);
    await dirPage.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
    await dirPage.goto(`http://127.0.0.1:${PORT}/universities`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1000));

    const dirCards = await dirPage.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.uni-card-image'));
      return cards.map(c => {
        const card = c.closest('.card');
        const cardBody = card ? card.querySelector('.card-body') : null;
        const style = cardBody ? window.getComputedStyle(cardBody) : null;
        return {
          src: c.src,
          naturalWidth: c.naturalWidth,
          naturalHeight: c.naturalHeight,
          padding: style ? style.padding : null
        };
      });
    });

    console.log(`Found ${dirCards.length} university cards in directory`);
    dirCards.forEach(c => {
      totalImagesChecked++;
      if (c.naturalWidth > 0) {
        totalImagesLoaded++;
      } else {
        brokenImages.push(`Directory (${vp.name}): ${c.src}`);
      }
    });
    await dirBrowser.close();
  }

  console.log(`\n======================================================`);
  console.log(`COMPREHENSIVE TEST SUMMARY:`);
  console.log(`======================================================`);
  console.log(`Total Image Assertions: ${totalImagesChecked}`);
  console.log(`Images Loaded Successfully: ${totalImagesLoaded}`);
  console.log(`Broken Images: ${brokenImages.length}`);
  console.log(`Clipping Errors: ${clippingErrors.length}`);
  console.log(`Overflow Errors: ${overflowErrors.length}`);

  if (brokenImages.length > 0 || clippingErrors.length > 0 || overflowErrors.length > 0) {
    console.error('FAILED ASSERTIONS:');
    brokenImages.forEach(b => console.error('  Broken Image:', b));
    clippingErrors.forEach(c => console.error('  Clipping Error:', c));
    overflowErrors.forEach(o => console.error('  Overflow Error:', o));
    process.exit(1);
  } else {
    console.log('\n🎉 ALL COMPREHENSIVE BROWSER TESTS PASSED (0 BROKEN IMAGES, 0 CLIPPING, 0 OVERFLOW)!');
    process.exit(0);
  }
}

runComprehensiveTests().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
