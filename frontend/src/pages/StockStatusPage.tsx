/**
 * Stock Status Page - Stock Module
 * Monitor stock levels with status indicators
 */

import React, { useState, useMemo } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Package } from 'lucide-react';
import { MainLayout } from '@layouts/MainLayout';
import { Card, CardHeader, CardBody } from '@components/Card';
import { Button } from '@components/Button';
import { DataTable } from '@components/DataTable';
import { SearchInput } from '@components/SearchInput';
import { Badge } from '@components/Badge';
import { Select } from '@components/FormInputs';
import { Alert } from '@components/Alert';
import type { StockStatus } from '@/types/stock';

export const StockStatusPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const mockStockData: StockStatus[] = [
    {
      id: 'stock-001',
      articleId: 'art-001',
      code: 'OFF-001',
      name: 'A4 Paper (500 sheets)',
      currentStock: 450,
      minStock: 100,
      maxStock: 500,
      unit: 'Ream',
      status: 'normal',
      lastMovement: '2024-06-10 14:30',
      updatedAt: '2024-06-10',
    },
    {
      id: 'stock-002',
      articleId: 'art-002',
      code: 'PEN-001',
      name: 'Ballpoint Pen (Blue)',
      currentStock: 75,
      minStock: 50,
      maxStock: 200,
      unit: 'Box',
      status: 'normal',
      lastMovement: '2024-06-09 10:15',
      updatedAt: '2024-06-09',
    },
    {
      id: 'stock-003',
      articleId: 'art-003',
      code: 'FOLDER-001',
      name: 'File Folder (Yellow)',
      currentStock: 45,
      minStock: 80,
      maxStock: 300,
      unit: 'Pack',
      status: 'low',
      lastMovement: '2024-06-08 09:45',
      updatedAt: '2024-06-08',
    },
    {
      id: 'stock-004',
      articleId: 'art-004',
      code: 'STAPLER-001',
      name: 'Stapler (Desktop)',
      currentStock: 8,
      minStock: 5,
      maxStock: 30,
      unit: 'Piece',
      status: 'critical',
      lastMovement: '2024-06-07 16:20',
      updatedAt: '2024-06-07',
    },
    {
      id: 'stock-005',
      articleId: 'art-005',
      code: 'TAPE-001',
      name: 'Scotch Tape (12mm)',
      currentStock: 520,
      minStock: 100,
      maxStock: 500,
      unit: 'Roll',
      status: 'excess',
      lastMovement: '2024-06-06 11:00',
      updatedAt: '2024-06-06',
    },
    {
      id: 'stock-006',
      articleId: 'art-006',
      code: 'GLUE-001',
      name: 'Office Glue Stick',
      currentStock: 65,
      minStock: 80,
      maxStock: 250,
      unit: 'Box',
      status: 'low',
      lastMovement: '2024-06-05 13:30',
      updatedAt: '2024-06-05',
    },
  ];

  const filteredStock = useMemo(() => {
    return mockStockData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'normal':
        return 'success';
      case 'low':
        return 'warning';
      case 'critical':
        return 'danger';
      case 'excess':
        return 'info';
      default:
        return 'primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <Package size={16} />;
      case 'low':
        return <TrendingDown size={16} />;
      case 'critical':
        return <AlertTriangle size={16} />;
      case 'excess':
        return <TrendingUp size={16} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'low': return 'Stock Bas';
      case 'critical': return 'Critique';
      case 'excess': return 'Excédentaire';
      default: return status;
    }
  };

  const columns = [
    {
      key: 'code' as const,
      label: 'Code',
      sortable: true,
      width: '100px',
    },
    {
      key: 'name' as const,
      label: 'Article',
      sortable: true,
    },
    {
      key: 'currentStock' as const,
      label: 'Stock Actuel',
      sortable: true,
      render: (value: number, row: StockStatus) => (
        <div>
          <p className="font-medium text-neutral-900">
            {value} {row.unit}
          </p>
          <p className="text-sm text-neutral-600">
            Min: {row.minStock}, Max: {row.maxStock}
          </p>
        </div>
      ),
    },
    {
      key: 'status' as const,
      label: 'Statut',
      sortable: true,
      width: '150px',
      render: (value: string) => (
        <Badge variant={getStatusVariant(value)} size="md">
          {getStatusIcon(value)}
          <span className="ml-1">
            {getStatusLabel(value)}
          </span>
        </Badge>
      ),
    },
    {
      key: 'lastMovement' as const,
      label: 'Dernier Mouvement',
      sortable: true,
    },
    {
      key: 'id' as const,
      label: 'Actions',
      sortable: false,
      width: '150px',
      render: () => (
        <Button variant="ghost" size="sm">
          Ajuster le Stock
        </Button>
      ),
    },
  ];

  const criticalCount = filteredStock.filter((s) => s.status === 'critical').length;
  const lowCount = filteredStock.filter((s) => s.status === 'low').length;
  const excessCount = filteredStock.filter((s) => s.status === 'excess').length;

  return (
    <MainLayout title="État du Stock">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">État du Stock</h2>
          <p className="text-neutral-600 mt-2">Surveillez les niveaux et l'état actuel du stock</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardBody>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-2">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <p className="text-sm text-neutral-600">Critique</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{criticalCount}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-2">
                  <TrendingDown size={24} className="text-amber-600" />
                </div>
                <p className="text-sm text-neutral-600">Stock Bas</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{lowCount}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
                  <Package size={24} className="text-green-600" />
                </div>
                <p className="text-sm text-neutral-600">Stock Normal</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">
                  {filteredStock.filter((s) => s.status === 'normal').length}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
                  <TrendingUp size={24} className="text-blue-600" />
                </div>
                <p className="text-sm text-neutral-600">Stock Excédentaire</p>
                <p className="text-3xl font-bold text-neutral-900 mt-1">{excessCount}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Alerts */}
        {criticalCount > 0 && (
          <Alert type="error" closable>
            Vous avez {criticalCount} article(s) avec un niveau de stock critique. Action immédiate requise.
          </Alert>
        )}
        {lowCount > 0 && (
          <Alert type="warning" closable>
            Vous avez {lowCount} article(s) en dessous du stock minimum. Prévoyez un réapprovisionnement bientôt.
          </Alert>
        )}
        {excessCount > 0 && (
          <Alert type="info" closable>
            Vous avez {excessCount} article(s) en stock excédentaire. Pensez à ajuster vos commandes.
          </Alert>
        )}

        {/* Filters Card */}
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  placeholder="Rechercher par nom d'article ou code..."
                  onSearch={setSearchTerm}
                />
              </div>
              <Select
                options={[
                  { value: '', label: 'Tous les statuts' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'low', label: 'Stock Bas' },
                  { value: 'critical', label: 'Critique' },
                  { value: 'excess', label: 'Excédentaire' },
                ]}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full md:w-48"
              />
            </div>
          </CardBody>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader title={`Articles en Stock (${filteredStock.length})`} />
          <CardBody>
            <DataTable<StockStatus>
              columns={columns}
              data={filteredStock}
              rowKey="id"
              pageSize={10}
            />
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
};
