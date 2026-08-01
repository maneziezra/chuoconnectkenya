const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace text color
    content = content.replace(/color:\s*['"]var\(--navy-deep\)['"]/g, "color: 'var(--text-primary)'");
    
    // Replace borders using navy-deep with accent-main or border-medium
    content = content.replace(/border:\s*['"]([^'"]*)var\(--navy-deep\)['"]/g, "border: '$1var(--border-medium)'");
    
    // Replace boxShadow using navy-deep with shadow-neo which handles it
    content = content.replace(/boxShadow:\s*['"][^'"]*var\(--navy-deep\)['"]/g, "boxShadow: 'var(--shadow-neo)'");
    
    // If background is hardcoded white
    content = content.replace(/background:\s*['"]white['"]/ig, "background: 'var(--bg-primary)'");
    content = content.replace(/backgroundColor:\s*['"]white['"]/ig, "backgroundColor: 'var(--bg-primary)'");
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
