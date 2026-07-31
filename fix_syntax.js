const fs = require('fs');
const files = [
  'src/app/courses/page.tsx', 
  'src/app/events/page.tsx', 
  'src/app/page.tsx', 
  'src/app/universities/[id]/page.tsx', 
  'src/components/layout/Footer.tsx', 
  'src/components/university/GallerySection.tsx'
];

files.forEach(f => {
  try {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/{\s*,/g, '{');
    c = c.replace(/,\s*,/g, ',');
    c = c.replace(/,\s*}/g, '}');
    c = c.replace(/import\s*{\s*}\s*from\s*['"]lucide-react['"];?/g, '');
    
    // In src/app/events/page.tsx, if we accidentally broke ExternalLink, let's fix it
    if (f.includes('events/page.tsx')) {
        c = c.replace(/<External\s+/g, '<ExternalLink ');
        c = c.replace(/<\/External>/g, '</ExternalLink>');
    }
    
    fs.writeFileSync(f, c);
    console.log('fixed', f);
  } catch(e) {
    console.log(e);
  }
});
