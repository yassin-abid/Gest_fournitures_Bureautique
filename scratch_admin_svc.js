const fs = require('fs');
let content = fs.readFileSync('backend/src/modules/admin/admin.service.ts', 'utf8');

const regex = /const formatted = data\.map\(\(l\) => \(\{\s*\.\.\.l,\s*userName: `\$\{l\.user\.firstName\} \$\{l\.user\.lastName\}`,\s*timestamp: l\.timestamp\?\.toISOString\(\) \|\| new Date\(\)\.toISOString\(\),\s*\}\)\);/g;

const replacement = `const formatted = data.map((l) => {
      let entity = undefined;
      let entityId = undefined;
      try {
        if (l.details) {
          const parsed = JSON.parse(l.details);
          entity = parsed.entity;
          entityId = parsed.entityId;
        }
      } catch(e) {}
      return {
        ...l,
        userName: \`\${l.user.firstName} \${l.user.lastName}\`,
        entity,
        entityId,
        timestamp: l.timestamp?.toISOString() || new Date().toISOString(),
      };
    });`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('backend/src/modules/admin/admin.service.ts', content);
  console.log("admin.service.ts updated!");
} else {
  console.log("Regex not found in admin.service.ts");
}
