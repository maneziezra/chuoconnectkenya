const fs = require('fs');

const fixes = [
  { file: 'src/app/about/page.tsx', vars: ['Globe2', 'Shield', 'ArrowRight'] },
  { file: 'src/app/courses/page.tsx', vars: ['Search', 'ArrowRight'] },
  { file: 'src/app/dashboard/page.tsx', vars: ['MapPin'] },
  { file: 'src/app/events/page.tsx', vars: ['Link'] },
  { file: 'src/app/guidance/page.tsx', vars: ['Lightbulb', 'Award', 'TrendingUp'] },
  { file: 'src/app/housing/page.tsx', vars: ['Wifi', 'Shield'] },
  { file: 'src/app/page.tsx', vars: ['GraduationCap', 'TrendingUp', 'Users', 'BookOpen', 'Sparkles', 'CheckCircle'] },
  { file: 'src/app/universities/[id]/page.tsx', vars: ['Trophy', 'ImageIcon', 'MessageCircle', 'Award'] },
  { file: 'src/components/home/HeroSection.tsx', vars: ['useScroll', 'useTransform', 'badgeVariants'] },
  { file: 'src/components/layout/Footer.tsx', vars: ['GraduationCap'] },
  { file: 'src/components/student/KuccpsCalculator.tsx', vars: ['Star', 'ChevronRight', 'Sparkles'] },
  { file: 'src/components/university/AmbassadorSection.tsx', vars: ['ChevronDown', 'ChevronUp', 'universityId'] },
  { file: 'src/components/university/CompareButton.tsx', vars: ['Link'] },
  { file: 'src/components/university/ComparePageClient.tsx', vars: ['Users'] },
  { file: 'src/components/university/GallerySection.tsx', vars: ['ImageIcon'] },
  { file: 'src/components/university/ReviewSection.tsx', vars: ['ChevronDown', 'avgCriteria'] }
];

for (const fix of fixes) {
  const filePath = fix.file;
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filePath}, not found.`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  for (const v of fix.vars) {
    // Remove from named imports: `v,` or `, v` or `v` with spaces
    const re = new RegExp(`\\b${v}\\s*,?|,?\\s*${v}\\b`, 'g');
    // We'll just replace in the first 20 lines to be safe for imports
    const lines = content.split('\n');
    let inImport = false;
    for (let i = 0; i < Math.min(lines.length, 50); i++) {
      if (lines[i].includes('import')) inImport = true;
      if (inImport && lines[i].includes(v)) {
        lines[i] = lines[i].replace(re, '');
        // clean up empty imports like `import { } from`
        lines[i] = lines[i].replace(/{\s*}/g, '');
      }
      if (lines[i].includes(';')) inImport = false;
    }
    content = lines.join('\n');
  }
  // Remove lines that just became `import  from 'lucide-react';`
  content = content.replace(/import\s+(type\s+)?from\s+['"][^'"]+['"];\s*\n/g, '');
  content = content.replace(/import\s*['"][^'"]+['"];\s*\n/g, match => {
    // some imports might be just side-effects, we want to remove `import from 'lucide-react'` which is invalid.
    return match;
  });
  content = content.replace(/import\s+from\s+['"][^'"]+['"];\s*\n/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned imports in ${filePath}`);
}
