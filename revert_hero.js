const fs = require('fs');
let code = fs.readFileSync('src/components/home/HeroSection.tsx', 'utf8');
code = code.replace(/color:\s*['"]#FFFFFF['"]/g, "color: 'var(--text-inverse)'");
fs.writeFileSync('src/components/home/HeroSection.tsx', code);
console.log('Reverted HeroSection text colors');
