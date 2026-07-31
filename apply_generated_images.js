require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const artifactDir = 'C:\\Users\\Archlord\\.gemini\\antigravity\\brain\\8fca3a8f-e23e-48b4-a30b-5661c1306c54';
const targetDir = path.join(__dirname, 'public', 'images', 'universities');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const universities = ['uon', 'jkuat', 'strath', 'ku', 'mku', 'moi', 'usiu', 'pu'];

async function run() {
  console.log('Copying generated images and updating database...');
  
  // Find all generated images
  const files = fs.readdirSync(artifactDir);
  
  for (const uni of universities) {
    // Find the latest file that starts with the uni prefix (e.g. uon_12345.jpg)
    const matchingFiles = files.filter(f => f.startsWith(`${uni}_`) && f.endsWith('.jpg'));
    if (matchingFiles.length === 0) {
      console.log(`❌ No generated image found for ${uni}`);
      continue;
    }
    
    // Sort to get the latest if there are multiples
    matchingFiles.sort();
    const sourceFile = matchingFiles[matchingFiles.length - 1];
    const sourcePath = path.join(artifactDir, sourceFile);
    const destPath = path.join(targetDir, `${uni}.jpg`);
    
    // Copy the file
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${sourceFile} to ${destPath}`);
    
    // Update Supabase
    const publicUrl = `/images/universities/${uni}.jpg`;
    const { error } = await supabase.from('universities').update({ image: publicUrl }).eq('id', uni);
    if (error) {
      console.error(`❌ DB Update Failed for ${uni}:`, error);
    } else {
      console.log(`✅ DB Updated for ${uni}`);
    }
  }
  
  console.log('\nAll done! Extreme research and high-quality generation complete.');
}

run();
