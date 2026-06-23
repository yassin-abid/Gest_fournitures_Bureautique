const fs = require('fs');
const path = require('path');

function replaceAliases(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      replaceAliases(filePath);
    } else if (filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Calculate depth relative to backend/src
      const relativeToSrc = path.relative('backend/src', dir);
      const depth = relativeToSrc ? relativeToSrc.split(path.sep).length : 0;
      const rel = depth === 0 ? './' : '../'.repeat(depth);
      
      // ONLY replace our custom aliases, ignore @prisma, @types, etc
      content = content.replace(/from '@(config|middleware|modules|utils)\/(.*)'/g, (match, p1, p2) => {
        return `from '${rel}${p1}/${p2}'`;
      });
      fs.writeFileSync(filePath, content);
    }
  }
}

replaceAliases('backend/src');
console.log("Done");
