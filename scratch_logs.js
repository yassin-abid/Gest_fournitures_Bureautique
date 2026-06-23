const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/SystemLogsPage.tsx', 'utf8');

content = content.replace(
  `import React, { useState, useMemo } from 'react';`,
  `import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '@services/adminService';
import type { AuditLog } from '@/types/admin';
import { Loader2 } from 'lucide-react';`
);

content = content.replace(
  `interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  details: string;
}`,
  ``
);

// Replace LogEntry with AuditLog
content = content.replace(/LogEntry/g, 'AuditLog');

// Replace mock logs and state
const hookStart = content.indexOf('  const [searchTerm, setSearchTerm] = useState(\'\');');
const filteredLogsEnd = content.indexOf('  const columns = [');

const newHookCode = `
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await adminService.getAuditLogs(1, 100);
        setLogs(res.data);
      } catch (err) {
        console.error("Erreur de chargement des logs", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getSeverity = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('delete') || a.includes('cancel') || a.includes('reject') || a.includes('hard')) return 'error';
    if (a.includes('update') || a.includes('deactivate')) return 'warning';
    return 'info';
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const logUser = log.userName || 'Inconnu';
      const logAction = log.action || '';
      const logDetails = log.details || '';
      
      const matchesSearch =
        logUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logAction.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logDetails.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesModule = !selectedModule || log.entity === selectedModule;
      
      const severity = getSeverity(logAction);
      const matchesSeverity = !selectedSeverity || severity === selectedSeverity;
      
      return matchesSearch && matchesModule && matchesSeverity;
    });
  }, [logs, searchTerm, selectedModule, selectedSeverity]);

`;

content = content.substring(0, hookStart) + newHookCode + content.substring(filteredLogsEnd);

// Fix columns
content = content.replace(
  `key: 'severity' as const,`,
  `key: 'action' as const, // Uses action to determine severity`
);
content = content.replace(
  `label: 'Niveau',
      sortable: true,
      width: '120px',
      render: (value: string) => {
        const variantMap: Record<string, any> = {
          info: 'primary',
          warning: 'warning',
          error: 'danger',
          critical: 'danger',
        };
        const labels: Record<string, string> = {
          info: 'Info',
          warning: 'Alerte',
          error: 'Erreur',
          critical: 'Critique',
        };
        return <Badge variant={variantMap[value]}>{labels[value]}</Badge>;
      },`,
  `label: 'Niveau',
      sortable: true,
      width: '120px',
      render: (value: string) => {
        const severity = getSeverity(value);
        const variantMap: Record<string, any> = {
          info: 'primary',
          warning: 'warning',
          error: 'danger',
        };
        const labels: Record<string, string> = {
          info: 'Info',
          warning: 'Alerte',
          error: 'Erreur',
        };
        return <Badge variant={variantMap[severity]}>{labels[severity]}</Badge>;
      },`
);

content = content.replace(`key: 'module' as const,`, `key: 'entity' as const,`);
content = content.replace(`key: 'user' as const,`, `key: 'userName' as const,`);
content = content.replace(`log.user.toLowerCase()`, `(log.userName || '').toLowerCase()`);

// Update the render part to show loading
content = content.replace(
  `<CardBody>
            <DataTable<AuditLog>`,
  `<CardBody>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-primary-500" size={32} />
              </div>
            ) : (
              <DataTable<AuditLog>`
);
content = content.replace(
  `pageSize={15}
            />
          </CardBody>`,
  `pageSize={15}
              />
            )}
          </CardBody>`
);

fs.writeFileSync('frontend/src/pages/SystemLogsPage.tsx', content);
console.log("Rewrite done");
