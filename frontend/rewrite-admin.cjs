const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'pages', 'UsersManagementPage.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace imports
content = content.replace(
  "import { Modal } from '@components/Modal';",
  "import { Modal } from '@components/Modal';\nimport { adminService } from '@services/adminService';\nimport type { User } from '@/types/auth';"
);

// Replace User interface
content = content.replace(
  /interface User \{[\s\S]*?\}/,
  ""
);

// Replace component definition
const componentStart = `export const UsersManagementPage: React.FC = () => {`;
const newComponentStart = `export const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
`;

content = content.replace(componentStart, newComponentStart);

// Replace mockUsers
const mockUsersRegex = /const mockUsers: User\[\] = \[[\s\S]*?\];/;
const fetchLogic = `
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getUsers(1, 100, selectedRole, searchTerm);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [selectedRole, searchTerm]);
`;
content = content.replace(mockUsersRegex, fetchLogic);

// Replace filteredUsers
const filteredUsersRegex = /const filteredUsers = useMemo\(\(\) => \{[\s\S]*?\}, \[searchTerm, selectedRole, selectedStatus\]\);/;
const newFilteredUsers = `
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesStatus = !selectedStatus || u.status === selectedStatus;
      return matchesStatus;
    });
  }, [users, selectedStatus]);
`;
content = content.replace(filteredUsersRegex, newFilteredUsers);

// Replace columns
content = content.replace(
  /render: \(value: string, row: User\) => \(\s*<div>\s*<p className="font-medium text-neutral-900">\{value\}<\/p>/g,
  `render: (_value: string, row: User) => (
        <div>
          <p className="font-medium text-neutral-900">{row.firstName} {row.lastName}</p>`
);

// Replace Role Badge
content = content.replace(
  /'Administrateur':        'danger',[\s\S]*?'Employé':               'primary' as any,/,
  `'admin': 'danger',
          'responsable_service': 'warning',
          'gestionnaire_stock': 'info',
          'responsable_achats': 'success',
          'employe': 'primary' as any,
        };
        const labelMap: Record<string, string> = {
          'admin': 'Administrateur',
          'responsable_service': 'Responsable de Service',
          'gestionnaire_stock': 'Gestionnaire de Stock',
          'responsable_achats': 'Responsable Achats',
          'employe': 'Employé',`
);
content = content.replace(
  /return <Badge variant=\{variantMap\[value\] \?\? 'info'\}>\{value\}<\/Badge>;/,
  `return <Badge variant={variantMap[value] ?? 'info'}>{labelMap[value] || value}</Badge>;`
);

// Replace lastLogin render
content = content.replace(
  /key: 'lastLogin' as const,[\s\S]*?render: \(value: string\) => <span className="text-neutral-600">\{value \|\| 'Jamais'\}<\/span>,/,
  `key: 'lastLogin' as const,
      label: 'Dernière Connexion',
      sortable: true,
      render: (_value: string, row: User) => <span className="text-neutral-600">{row.updatedAt && row.updatedAt !== row.createdAt ? new Date(row.updatedAt).toLocaleDateString() : 'Jamais'}</span>,`
);

// Replace Edit/Delete button clicks
content = content.replace(
  /onClick=\{\(\) => \{\s*setSelectedUser\(row\);\s*setIsEditModalOpen\(true\);\s*\}\}/,
  `onClick={() => {
              setSelectedUser(row);
              setFormData({
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                department: row.department,
                role: row.role,
                status: row.status,
              });
              setIsEditModalOpen(true);
            }}`
);

content = content.replace(
  /icon=\{<Trash2 size=\{16\} \/>\}\s*\/>/,
  `icon={<Trash2 size={16} />}
            onClick={async () => {
              if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                await adminService.deleteUser(row.id.toString());
                fetchUsers();
              }
            }}
          />`
);

// Replace stats
content = content.replace(/u\.role === 'Administrateur'/g, "u.role === 'admin'");
content = content.replace(
  /u\.role === 'Responsable de Service' \|\| u\.role === 'Responsable Achats' \|\| u\.role === 'Gestionnaire de Stock'/g,
  "['responsable_service', 'responsable_achats', 'gestionnaire_stock'].includes(u.role)"
);

// Replace filters
content = content.replace(
  /options=\{\[\s*\{ value: '', label: 'Tous les Rôles' \},[\s\S]*?\]\}/,
  `options={[
                  { value: '', label: 'Tous les Rôles' },
                  { value: 'admin', label: 'Administrateur' },
                  { value: 'responsable_service', label: 'Responsable de Service' },
                  { value: 'gestionnaire_stock', label: 'Gestionnaire de Stock' },
                  { value: 'responsable_achats', label: 'Responsable Achats' },
                  { value: 'employe', label: 'Employé' },
                ]}`
);

// Replace forms inside Modals
// Create Modal
content = content.replace(
  /onConfirm=\{\(\) => \{\s*setIsCreateModalOpen\(false\);\s*alert\('Utilisateur créé avec succès'\);\s*\}\}/,
  `onConfirm={async () => {
          try {
            await adminService.createUser({
              email: formData.email,
              password: formData.password || 'Password123!',
              firstName: formData.firstName || '',
              lastName: formData.lastName || '',
              department: formData.department,
              role: formData.role || 'employe',
            } as any);
            setIsCreateModalOpen(false);
            setFormData({});
            fetchUsers();
          } catch (e) {
            alert('Erreur lors de la création');
          }
        }}`
);
content = content.replace(
  /<Input label="Nom Complet" placeholder="Prénom Nom" \/>/g,
  `<Input label="Prénom" placeholder="Prénom" value={formData.firstName || ''} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
   <Input label="Nom" placeholder="Nom" value={formData.lastName || ''} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />`
);
content = content.replace(
  /<Input label="Email" type="email" placeholder="prenom\.nom@hammemi\.com" \/>/,
  `<Input label="Email" type="email" placeholder="prenom.nom@hammemi.com" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />`
);
content = content.replace(
  /<Input label="Département" placeholder="ex: Logistique" \/>/,
  `<Input label="Département" placeholder="ex: Logistique" value={formData.department || ''} onChange={(e) => setFormData({...formData, department: e.target.value})} />`
);
content = content.replace(
  /<Input label="Mot de passe initial" type="password" placeholder="••••••••" \/>/,
  `<Input label="Mot de passe initial" type="password" placeholder="••••••••" value={formData.password || ''} onChange={(e) => setFormData({...formData, password: e.target.value})} />`
);
content = content.replace(
  /<Select\s*label="Rôle"\s*options=\{\[\s*\{ value: 'employe', label: 'Employé' \},[\s\S]*?\]\}\s*\/>/,
  `<Select
              label="Rôle"
              options={[
                { value: 'employe', label: 'Employé' },
                { value: 'gestionnaire_stock', label: 'Gestionnaire de Stock' },
                { value: 'responsable_service', label: 'Responsable de Service' },
                { value: 'responsable_achats', label: 'Responsable Achats' },
                { value: 'admin', label: 'Administrateur' },
              ]}
              value={formData.role || 'employe'}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />`
);

// Edit Modal
content = content.replace(
  /onConfirm=\{\(\) => \{\s*setIsEditModalOpen\(false\);\s*setSelectedUser\(null\);\s*alert\('Utilisateur mis à jour avec succès'\);\s*\}\}/,
  `onConfirm={async () => {
            if (!selectedUser) return;
            try {
              await adminService.updateUser(selectedUser.id.toString(), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                department: formData.department,
                role: formData.role,
                status: formData.status,
              });
              setIsEditModalOpen(false);
              setSelectedUser(null);
              fetchUsers();
            } catch (e) {
              alert('Erreur lors de la modification');
            }
          }}`
);
content = content.replace(
  /<Input label="Nom Complet" defaultValue=\{selectedUser\.name\} \/>/,
  `<Input label="Prénom" value={formData.firstName || ''} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
   <Input label="Nom" value={formData.lastName || ''} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />`
);
content = content.replace(
  /<Input label="Email" type="email" defaultValue=\{selectedUser\.email\} \/>/,
  `<Input label="Email" type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled />`
);
content = content.replace(
  /<Input label="Département" defaultValue=\{selectedUser\.department\} \/>/,
  `<Input label="Département" value={formData.department || ''} onChange={(e) => setFormData({...formData, department: e.target.value})} />`
);
content = content.replace(
  /<Select\s*label="Rôle"\s*options=\{\[\s*\{ value: 'employe', label: 'Employé' \},[\s\S]*?\]\}\s*defaultValue=\{selectedUser\.role\}\s*\/>/,
  `<Select
                label="Rôle"
                options={[
                  { value: 'employe', label: 'Employé' },
                  { value: 'gestionnaire_stock', label: 'Gestionnaire de Stock' },
                  { value: 'responsable_service', label: 'Responsable de Service' },
                  { value: 'responsable_achats', label: 'Responsable Achats' },
                  { value: 'admin', label: 'Administrateur' },
                ]}
                value={formData.role || ''}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />`
);
content = content.replace(
  /<Select\s*label="Statut"\s*options=\{\[\s*\{ value: 'active', label: 'Actif' \},[\s\S]*?\]\}\s*defaultValue=\{selectedUser\.status\}\s*\/>/,
  `<Select
              label="Statut"
              options={[
                { value: 'active', label: 'Actif' },
                { value: 'inactive', label: 'Inactif' },
              ]}
              value={formData.status || ''}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            />`
);

fs.writeFileSync(file, content);
console.log('UsersManagementPage updated.');
