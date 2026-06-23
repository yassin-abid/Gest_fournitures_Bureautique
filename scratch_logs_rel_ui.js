const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/SystemLogsPage.tsx', 'utf8');

const formatDetailsCode = `
  const formatDetails = (details: string | null) => {
    if (!details) return <span className="text-neutral-400 italic">Aucun détail</span>;
    try {
      const parsed = JSON.parse(details);
      if (typeof parsed === 'object' && parsed !== null) {
        
        if (parsed.oldValues && parsed.newValues) {
          let changes: any[] = [];
          const allKeys = new Set([...Object.keys(parsed.oldValues), ...Object.keys(parsed.newValues)]);
          
          allKeys.forEach(k => {
            if (k === 'password' || k === 'token' || k === 'refreshToken' || k === 'updatedAt' || k === 'createdAt') return;
            const oldVal = parsed.oldValues[k];
            const newVal = parsed.newValues[k];
            if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
               changes.push({ key: k, old: oldVal, new: newVal });
            }
          });

          // Filter out ID keys if the base object is also in changes (e.g., serviceId vs service)
          changes = changes.filter(c => {
             if (c.key.endsWith('Id')) {
                const baseKey = c.key.slice(0, -2);
                if (changes.some(ch => ch.key === baseKey)) return false;
             }
             return true;
          });

          if (changes.length > 0) {
            return (
              <div className="flex flex-col gap-1.5 text-xs">
                {changes.map((c, idx) => {
                  let oStr = c.old;
                  let nStr = c.new;
                  
                  if (oStr && typeof oStr === 'object') oStr = oStr.name || oStr.nom || oStr.code || oStr.title || oStr.label || JSON.stringify(oStr);
                  if (nStr && typeof nStr === 'object') nStr = nStr.name || nStr.nom || nStr.code || nStr.title || nStr.label || JSON.stringify(nStr);
                  
                  oStr = oStr === null || oStr === undefined ? 'vide' : String(oStr);
                  nStr = nStr === null || nStr === undefined ? 'vide' : String(nStr);

                  return (
                    <div key={idx} className="bg-blue-50 text-blue-800 p-2 rounded border border-blue-100 flex flex-wrap gap-1 items-center">
                      Modification de <span className="font-bold">"{c.key}"</span> : 
                      <span className="line-through opacity-70 bg-red-100 px-1 rounded">{oStr}</span> 
                      <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span> 
                      <span className="font-bold bg-emerald-100 px-1 rounded">{nStr}</span>
                    </div>
                  );
                })}
              </div>
            );
          } else {
            return <span className="text-neutral-500 italic">Aucun changement détecté (ou même valeur)</span>;
          }
        }

        const dataToRender = parsed.newValues || parsed.oldValues || parsed;
        
        if (Object.keys(dataToRender).length === 0 || (Object.keys(dataToRender).length === 2 && dataToRender.entity && dataToRender.entityId)) {
           return <span className="text-neutral-400 italic">Détails non spécifiés</span>;
        }

        return (
          <div className="flex flex-col gap-1 text-xs bg-surface-container-lowest p-2 rounded border border-outline-variant">
            {Object.entries(dataToRender).map(([k, v]) => {
              if (k === 'password' || k === 'token' || k === 'refreshToken' || k === 'entity' || k === 'entityId') return null;
              let valStr = v;
              if (valStr && typeof valStr === 'object') valStr = (valStr as any).name || (valStr as any).nom || (valStr as any).code || JSON.stringify(valStr);
              valStr = valStr === null || valStr === undefined ? 'vide' : String(valStr);
              return <div key={k}><span className="font-semibold text-neutral-700">{k}:</span> <span className="text-neutral-600">{valStr}</span></div>;
            })}
          </div>
        );
      }
      return details;
    } catch {
      return details;
    }
  };
`;

const startIndex = content.indexOf('const formatDetails = (details: string | null) => {');
const endIndex = content.indexOf('const formatAction = (action: string) => {');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + formatDetailsCode.trim() + '\n\n  ' + content.substring(endIndex);
  fs.writeFileSync('frontend/src/pages/SystemLogsPage.tsx', content);
  console.log("formatDetails updated with smart relations diff!");
} else {
  console.log("Could not find formatDetails");
}
