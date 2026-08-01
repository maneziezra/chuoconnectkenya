const fs = require('fs');
let code = fs.readFileSync('src/components/home/HeroSection.tsx', 'utf8');
code = code.replace(/<span style=\{\{ fontSize: '0.7rem', fontWeight: 700, color: 'var\(--text-inverse\)', letterSpacing: '0.03em' \}\}>/g, "<span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.03em' }}>");
fs.writeFileSync('src/components/home/HeroSection.tsx', code);
console.log('Fixed Strathmore and UoN');
