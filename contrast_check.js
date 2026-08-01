const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const testMode = async (mode) => {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: mode }]);
    await page.goto('https://chuoconnectkenya.vercel.app/', { waitUntil: 'networkidle0' });
    
    // Switch to dark/light using the toggle if necessary, but prefers-color-scheme should work.
    
    const contrastErrors = await page.evaluate(() => {
      // Calculate relative luminance
      function getLuminance(r, g, b) {
        const a = [r, g, b].map(function (v) {
          v /= 255;
          return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }

      function getContrastRatio(color1, color2) {
        const lum1 = getLuminance(color1[0], color1[1], color1[2]);
        const lum2 = getLuminance(color2[0], color2[1], color2[2]);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
      }

      function parseRGB(rgbString) {
        const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [255,255,255];
      }

      // Check all elements with text
      const elements = Array.from(document.querySelectorAll('*'));
      const errors = [];
      
      for (const el of elements) {
        // Skip invisible elements
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
        
        // Only check elements with direct text nodes
        const hasText = Array.from(el.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
        if (!hasText) continue;
        
        // Get effective background color by walking up the tree if current is transparent
        let bgStyle = style;
        let bgEl = el;
        let bgColor = bgStyle.backgroundColor;
        
        while ((bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') && bgEl.parentElement) {
          bgEl = bgEl.parentElement;
          bgStyle = window.getComputedStyle(bgEl);
          bgColor = bgStyle.backgroundColor;
        }
        
        const textColor = style.color;
        
        const rgbBg = parseRGB(bgColor === 'rgba(0, 0, 0, 0)' ? 'rgb(255,255,255)' : bgColor);
        const rgbText = parseRGB(textColor);
        
        const ratio = getContrastRatio(rgbText, rgbBg);
        
        if (ratio < 3.0) {
          errors.push({
            element: el.tagName + (el.className ? '.' + el.className.split(' ').join('.') : ''),
            text: el.textContent.trim().substring(0, 30),
            bg: bgColor,
            color: textColor,
            ratio: ratio.toFixed(2)
          });
        }
      }
      return errors;
    });
    
    console.log('--- ' + mode.toUpperCase() + ' MODE ---');
    if (contrastErrors.length === 0) {
      console.log('No contrast errors found!');
    } else {
      console.log('Found ' + contrastErrors.length + ' elements with poor contrast:');
      // Group by issue
      const unique = {};
      for (const err of contrastErrors) {
        const key = err.bg + '-' + err.color;
        if (!unique[key]) unique[key] = err;
      }
      Object.values(unique).forEach(err => {
        console.log('- ' + err.element + ': "' + err.text + '"');
        console.log('  Bg: ' + err.bg + ' | Text: ' + err.color + ' | Ratio: ' + err.ratio);
      });
    }
  };
  
  await testMode('light');
  await testMode('dark');
  await browser.close();
})();
