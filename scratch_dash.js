const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/DashboardPage.tsx', 'utf8');

// Add import
if (!content.includes("import { adminService }")) {
  content = content.replace("import React,", "import { adminService } from '@services/adminService';\nimport React,");
}

// Find AdminDashboard
const adminDashStart = content.indexOf('const AdminDashboard: React.FC = () => {');
if (adminDashStart !== -1) {
  const recentLogsStr = `const recentLogs = [
    { id: 'LOG-001', user: 'Youssef Trabelsi', action: 'Connexion r\\u00E9ussie', time: 'Aujourd\\'hui, 08:30', type: 'info', icon: 'login' },
    { id: 'LOG-002', user: 'Sonia Ben Ali', action: 'Validation de demande REQ-042', time: 'Aujourd\\'hui, 09:15', type: 'success', icon: 'check_circle' },
    { id: 'LOG-003', user: 'Syst\\u00E8me', action: '\\u00C9chec sauvegarde auto', time: 'Hier, 23:00', type: 'error', icon: 'warning' },
    { id: 'LOG-004', user: 'Admin', action: 'Modification r\\u00F4le utilisateur', time: 'Hier, 15:40', type: 'warning', icon: 'manage_accounts' },
  ];`;

  // Actually, there could be different string contents due to encoding. Let's do a regex replace.
  const regex = /const recentLogs = \[\s*\{ id: 'LOG-001'[\s\S]*?\];/;
  
  const replacement = `const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    adminService.getAuditLogs(1, 4).then(res => {
      const formatted = res.data.map((log: any) => {
        let type = 'info';
        let icon = 'info';
        const a = log.action.toLowerCase();
        if (a.includes('delete') || a.includes('hard')) { type = 'error'; icon = 'warning'; }
        else if (a.includes('cancel') || a.includes('reject') || a.includes('deactivate') || a.includes('update')) { type = 'warning'; icon = 'edit'; }
        else if (a.includes('approve') || a.includes('create')) { type = 'success'; icon = 'check_circle'; }
        else if (a.includes('login')) { icon = 'login'; }

        const map: Record<string, string> = {
          'create': 'Création', 'update': 'Modification', 'delete': 'Suppression', 'login': 'Connexion', 'approve': 'Approbation', 'reject': 'Rejet'
        };
        const actionName = map[log.action] || log.action;

        return {
          id: log.id,
          user: log.userName || 'Inconnu',
          action: actionName + ' - ' + (log.entity || ''),
          time: new Date(log.timestamp).toLocaleString(),
          type,
          icon
        };
      });
      setRecentLogs(formatted);
    }).catch(console.error);
  }, []);`;

  content = content.replace(regex, replacement);
  fs.writeFileSync('frontend/src/pages/DashboardPage.tsx', content);
  console.log("DashboardPage updated!");
} else {
  console.log("Could not find AdminDashboard");
}
