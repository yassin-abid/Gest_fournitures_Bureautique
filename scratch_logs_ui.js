const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/SystemLogsPage.tsx', 'utf8');

const formatDetailsCode = `
  const formatDetails = (details: string | null) => {
    if (!details) return <span className="text-neutral-400 italic">Aucun détail</span>;
    try {
      const parsed = JSON.parse(details);
      if (typeof parsed === 'object' && parsed !== null) {
        
        if (parsed.oldValues || parsed.newValues) {
          return (
            <div className="flex flex-col gap-2 text-xs">
              {parsed.oldValues && Object.keys(parsed.oldValues).length > 0 && (
                <div className="bg-red-50 text-red-800 p-2 rounded border border-red-100">
                  <div className="font-bold mb-1 border-b border-red-200 pb-1">Avant modification :</div>
                  {Object.entries(parsed.oldValues).map(([k, v]) => {
                    if (k === 'password' || k === 'token' || k === 'refreshToken') return null;
                    const valStr = typeof v === 'object' ? JSON.stringify(v) : String(v);
                    return <div key={k}><span className="font-semibold">{k}:</span> <span>{valStr}</span></div>;
                  })}
                </div>
              )}
              {parsed.newValues && Object.keys(parsed.newValues).length > 0 && (
                <div className="bg-emerald-50 text-emerald-800 p-2 rounded border border-emerald-100">
                  <div className="font-bold mb-1 border-b border-emerald-200 pb-1">Après modification :</div>
                  {Object.entries(parsed.newValues).map(([k, v]) => {
                    if (k === 'password' || k === 'token' || k === 'refreshToken') return null;
                    const valStr = typeof v === 'object' ? JSON.stringify(v) : String(v);
                    return <div key={k}><span className="font-semibold">{k}:</span> <span>{valStr}</span></div>;
                  })}
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-1 text-xs bg-surface-container-lowest p-2 rounded border border-outline-variant">
            {Object.entries(parsed).map(([k, v]) => {
              if (k === 'password' || k === 'token' || k === 'refreshToken') return null;
              const valStr = typeof v === 'object' ? JSON.stringify(v) : String(v);
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
  console.log("formatDetails updated");
} else {
  console.log("Could not find formatDetails");
}
