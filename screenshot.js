const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for desktop
  await page.setViewport({width: 1280, height: 800});
  
  console.log('Navigating to vercel...');
  await page.goto('https://chuoconnectkenya.vercel.app/dashboard', {waitUntil: 'networkidle0'});
  
  // Light mode
  await page.emulateMediaFeatures([{name: 'prefers-color-scheme', value: 'light'}]);
  // Wait a bit for transition
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({path: 'C:/Users/Archlord/.gemini/antigravity/brain/fb2ec890-ba54-47c1-851a-1919755a83ef/live_dashboard_light.png', fullPage: true});
  console.log('Saved live_dashboard_light.png');

  // Dark mode
  await page.emulateMediaFeatures([{name: 'prefers-color-scheme', value: 'dark'}]);
  // We can also click the theme toggle if media feature isn't picked up by next-themes
  // Let's force it via localStorage just in case
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark');
    window.dispatchEvent(new Event('storage'));
    location.reload();
  });
  await page.goto('https://chuoconnectkenya.vercel.app/dashboard', {waitUntil: 'networkidle0'});
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({path: 'C:/Users/Archlord/.gemini/antigravity/brain/fb2ec890-ba54-47c1-851a-1919755a83ef/live_dashboard_dark.png', fullPage: true});
  console.log('Saved live_dashboard_dark.png');

  // Also check cluster calculator
  await page.goto('https://chuoconnectkenya.vercel.app/calculator', {waitUntil: 'networkidle0'});
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({path: 'C:/Users/Archlord/.gemini/antigravity/brain/fb2ec890-ba54-47c1-851a-1919755a83ef/live_calc_dark.png', fullPage: true});
  console.log('Saved live_calc_dark.png');

  await browser.close();
})();
