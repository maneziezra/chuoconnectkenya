const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({width: 1280, height: 800});
  
  console.log('Navigating to vercel home...');
  
  // Dark mode
  await page.emulateMediaFeatures([{name: 'prefers-color-scheme', value: 'dark'}]);
  await page.goto('https://chuoconnectkenya.vercel.app/', {waitUntil: 'networkidle0'});
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark');
    window.dispatchEvent(new Event('storage'));
    location.reload();
  });
  await page.goto('https://chuoconnectkenya.vercel.app/', {waitUntil: 'networkidle0'});
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({path: 'C:/Users/Archlord/.gemini/antigravity/brain/fb2ec890-ba54-47c1-851a-1919755a83ef/live_home_dark.png', fullPage: true});
  console.log('Saved live_home_dark.png');

  await browser.close();
})();
