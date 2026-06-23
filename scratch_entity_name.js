const fs = require('fs');
let content = fs.readFileSync('backend/src/modules/admin/admin.service.ts', 'utf8');

const regex = /const formatted = data\.map\(\(l\) => \{[\s\S]*?return \{\s*\.\.\.l,[\s\S]*?timestamp: l\.timestamp\?\.toISOString\(\) \|\| new Date\(\)\.toISOString\(\),\s*\};\s*\}\);/g;

const replacement = `const formatted = data.map((l) => {
      let entity = undefined;
      let entityId = undefined;
      let entityName = undefined;
      try {
        if (l.details) {
          const parsed = JSON.parse(l.details);
          entity = parsed.entity;
          entityId = parsed.entityId;
          
          const entityData = parsed.newValues || parsed.oldValues;
          if (entityData) {
             if (entity === 'User' && entityData.firstName && entityData.lastName) {
                 entityName = \`\${entityData.firstName} \${entityData.lastName}\`;
             } else if (entityData.name) {
                 entityName = entityData.name;
             } else if (entityData.nom_service) {
                 entityName = entityData.nom_service;
             } else if (entityData.nom_role) {
                 entityName = entityData.nom_role;
             } else if (entityData.nom) {
                 entityName = entityData.nom;
             } else if (entityData.orderNumber) {
                 entityName = entityData.orderNumber;
             } else if (entityData.requestNumber) {
                 entityName = entityData.requestNumber;
             } else if (entityData.code) {
                 entityName = entityData.code;
             }
          }
        }
      } catch(e) {}
      return {
        ...l,
        userName: \`\${l.user.firstName} \${l.user.lastName}\`,
        entity,
        entityId,
        entityName,
        timestamp: l.timestamp?.toISOString() || new Date().toISOString(),
      };
    });`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('backend/src/modules/admin/admin.service.ts', content);
  console.log("admin.service.ts updated with entityName!");
} else {
  console.log("Regex not found in admin.service.ts");
}
