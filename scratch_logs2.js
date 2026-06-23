const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/SystemLogsPage.tsx', 'utf8');

const formatDetailsCode = `
  const formatDetails = (details: string | null) => {
    if (!details) return <span className="text-neutral-400 italic">Aucun détail</span>;
    try {
      const parsed = JSON.parse(details);
      if (typeof parsed === 'object' && parsed !== null) {
        return (
          <div className="flex flex-col gap-1 text-xs">
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

  const formatAction = (action: string) => {
    const map: Record<string, string> = {
      'create': 'Création',
      'update': 'Modification',
      'delete': 'Suppression',
      'login': 'Connexion',
      'logout': 'Déconnexion',
      'approve': 'Approbation',
      'reject': 'Rejet',
      'cancel': 'Annulation',
      'submit': 'Soumission',
      'confirm': 'Confirmation',
      'ship': 'Expédition',
      'receive': 'Réception',
    };
    return map[action] || action;
  };
  
  const formatEntity = (entity: string) => {
    const map: Record<string, string> = {
      'User': 'Utilisateur',
      'SupplyRequest': 'Demande',
      'Order': 'Commande',
      'StockAdjustment': 'Stock',
      'Settings': 'Paramètres',
    };
    return map[entity] || entity;
  };
`;

content = content.replace('  const getSeverity =', formatDetailsCode + '\n  const getSeverity =');

content = content.replace(
  `  const getSeverity = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('delete') || a.includes('cancel') || a.includes('reject') || a.includes('hard')) return 'error';
    if (a.includes('update') || a.includes('deactivate')) return 'warning';
    return 'info';
  };`,
  `  const getSeverity = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('delete') || a.includes('hard')) return 'error';
    if (a.includes('cancel') || a.includes('reject') || a.includes('deactivate') || a.includes('update')) return 'warning';
    return 'info';
  };`
);

content = content.replace(
  `key: 'entity' as const,`,
  `key: 'entity' as const,\n      render: (val: string) => formatEntity(val),`
);
content = content.replace(
  `key: 'action' as const, // Uses action to determine severity`,
  `key: 'action' as const,\n      render: (val: string) => formatAction(val),`
);
content = content.replace(
  `key: 'details' as const,
      label: 'Détails',
      sortable: false,
    },`,
  `key: 'details' as const,
      label: 'Détails',
      sortable: false,
      render: (val: string) => formatDetails(val),
    },`
);

fs.writeFileSync('frontend/src/pages/SystemLogsPage.tsx', content);
console.log("Updated");
