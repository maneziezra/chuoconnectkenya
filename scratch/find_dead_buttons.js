const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('href=\"#\"') || 
        line.includes('href=\"\"') || 
        line.includes('onClick={() => {}}') || 
        (line.includes('<button') && !line.includes('onClick') && !line.includes('type=\"submit\"'))) {
      console.log(f + ':' + (i+1) + ' ' + line.trim());
    }
  });
});
