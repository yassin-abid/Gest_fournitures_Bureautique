/**
 * Stock Movements Page - Stock Module
 * Track stock in/out and adjustments
 */

import React, { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, Wrench } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Select } from '@components/FormInputs';
import type { StockMovement } from '@/types/stock';

export const StockMovementsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const mockMovements: StockMovement[] = [
    {
      id: 'mov-001',
      articleId: 'art-001',
      articleName: 'A4 Paper (500 sheets)',
      movementType: 'in',
      quantity: 100,
      reference: 'ORD-001',
      reason: 'Purchase Order',
      notes: 'Delivery received from Office Pro',
      userId: 'user-001',
      userName: 'John Smith',
      createdAt: '2024-06-10 14:30',
    },
    {
      id: 'mov-002',
      articleId: 'art-002',
      articleName: 'Ballpoint Pen (Blue)',
      movementType: 'out',
      quantity: 25,
      reference: 'REQ-001',
      reason: 'Supply Request',
      notes: 'Distributed to Sales Department',
      userId: 'user-002',
      userName: 'Jane Doe',
      createdAt: '2024-06-10 11:15',
    },
    {
      id: 'mov-003',
      articleId: 'art-003',
      articleName: 'File Folder (Yellow)',
      movementType: 'adjustment',
      quantity: -5,
      reference: 'INV-001',
      reason: 'Inventory Count',
      notes: 'Damaged during handling',
      userId: 'user-003',
      userName: 'Bob Johnson',
      createdAt: '2024-06-09 16:45',
    },
    {
      id: 'mov-004',
      articleId: 'art-004',
      articleName: 'Stapler (Desktop)',
      movementType: 'in',
      quantity: 10,
      reference: 'ORD-002',
      reason: 'Purchase Order',
      notes: 'Restock from supplier',
      userId: 'user-001',
      userName: 'John Smith',
      createdAt: '2024-06-09 10:20',
    },
    {
      id: 'mov-005',
      articleId: 'art-005',
      articleName: 'Notebook (Ruled)',
      movementType: 'out',
      quantity: 50,
      reference: 'REQ-002',
      reason: 'Supply Request',
      notes: 'Distributed to HR Department',
      userId: 'user-004',
      userName: 'Alice Wilson',
      createdAt: '2024-06-08 13:00',
    },
    {
      id: 'mov-006',
      articleId: 'art-001',
      articleName: 'A4 Paper (500 sheets)',
      movementType: 'adjustment',
      quantity: 3,
      reference: 'ADJ-001',
      reason: 'Count Correction',
      notes: 'Found additional stock during audit',
      userId: 'user-003',
      userName: 'Bob Johnson',
      createdAt: '2024-06-07 09:30',
    },
  ];

  const filteredMovements = useMemo(() => {
    return mockMovements.filter((movement) => {
      const matchesSearch =
        (movement.articleName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (movement.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesType = !selectedType || movement.movementType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <ArrowUp size={16} />;
      case 'out':
        return <ArrowDown size={16} />;
      case 'adjustment':
        return <Wrench size={16} />;
      default:
        return null;
    }
  };

  const getMovementVariant = (type: string) => {
    switch (type) {
      case 'in':
        return 'success';
      case 'out':
        return 'warning';
      case 'adjustment':
        return 'info';
      default:
        return 'primary';
    }
  };

  const getMovementLabel = (type: string) => {
    switch (type) {
      case 'in': return 'Entrée';
      case 'out': return 'Sortie';
      case 'adjustment': return 'Ajustement';
      default: return type;
    }
  };

  const columns = [
    {
      key: 'articleName' as const,
      label: 'Article',
      sortable: true,
    },
    {
      key: 'movementType' as const,
      label: 'Type',
      sortable: true,
      width: '120px',
      render: (value: string) => (
        <Badge variant={getMovementVariant(value)} size="md">
          {getMovementIcon(value)}
          <span className="ml-1">
            {getMovementLabel(value)}
          </span>
        </Badge>
      ),
    },
    {
      key: 'quantity' as const,
      label: 'Quantité',
      sortable: true,
      width: '100px',
      render: (value: number) => (
        <span className={value < 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
          {value > 0 ? '+' : ''}{value}
        </span>
      ),
    },
    {
      key: 'reference' as const,
      label: 'Référence',
      sortable: true,
    },
    {
      key: 'reason' as const,
      label: 'Raison',
      sortable: false,
    },
    {
      key: 'userName' as const,
      label: 'Utilisateur',
      sortable: true,
    },
    {
      key: 'createdAt' as const,
      label: 'Date & Heure',
      sortable: true,
    },
  ];

  const inCount = filteredMovements.filter((m) => m.movementType === 'in').length;
  const outCount = filteredMovements.filter((m) => m.movementType === 'out').length;
  const adjustmentCount = filteredMovements.filter((m) => m.movementType === 'adjustment').length;

  return (
    <MainLayout title="Mouvements de Stock">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Mouvements de Stock</h2>
          <p className="text-neutral-600 mt-2">Suivez tous les mouvements et ajustements de stock</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="text-center">
                <p className="text-sm text-neutral-600">Mouvements Totaux</p>
                <p className="text-3xl font-bold text-neutral-900 mt-2">
                  {filteredMovements.length}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mb-2">
                  <ArrowUp size={20} className="text-green-600" />
                </div>
                <p className="text-sm text-neutral-600">Entrées de Stock</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{inCount}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 mb-2">
                  <ArrowDown size={20} className="text-amber-600" />
                </div>
                <p className="text-sm text-neutral-600">Sorties de Stock</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{outCount}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-2">
                  <Wrench size={20} className="text-blue-600" />
                </div>
                <p className="text-sm text-neutral-600">Ajustements</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{adjustmentCount}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filters Card */}
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <SearchInput
                    placeholder="Rechercher par article ou référence..."
                    onSearch={setSearchTerm}
                  />
                </div>
                <Select
                  options={[
                    { value: '', label: 'Tous les types' },
                    { value: 'in', label: 'Entrée de Stock' },
                    { value: 'out', label: 'Sortie de Stock' },
                    { value: 'adjustment', label: 'Ajustement' },
                  ]}
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full md:w-48"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader title={`Mouvements (${filteredMovements.length})`} />
          <CardBody>
            <DataTable<StockMovement>
              columns={columns}
              data={filteredMovements}
              rowKey="id"
              pageSize={10}
            />
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
};
