const fs = require('fs');

function replaceInFile(filePath, regex, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(regex, replacement);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated ' + filePath);
  }
}

// 1. bg text-inverse -> bg-primary
replaceInFile('src/app/about/page.tsx', /background:\s*['"]var\(--text-inverse\)['"]/g, "background: 'var(--bg-primary)'");
replaceInFile('src/app/contact/page.tsx', /background:\s*['"]var\(--text-inverse\)['"]/g, "background: 'var(--bg-primary)'");

// 2. text-inverse on dark backgrounds -> #FFFFFF
let darkBgFiles = [
  'src/app/guidance/article/[slug]/page.tsx',
  'src/app/universities/[id]/page.tsx',
  'src/components/ClusterCalculator.tsx',
  'src/components/student/KuccpsCalculator.tsx',
  'src/components/university/GallerySection.tsx',
  'src/components/university/UniversityBrowser.tsx',
  'src/components/home/HeroSection.tsx'
];

darkBgFiles.forEach(f => {
  if (fs.existsSync(f)) {
    replaceInFile(f, /color:\s*['"]var\(--text-inverse\)['"]/g, "color: '#FFFFFF'");
  }
});
