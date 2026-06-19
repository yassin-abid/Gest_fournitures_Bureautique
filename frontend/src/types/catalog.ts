/**
 * Article/Product Types
 */

export interface Article {
  id: number;
  code: string;
  name: string;
  description?: string;
  categoryId: number;
  categoryName?: string;
  supplierId: number;
  supplierName?: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  minStock: number;
  maxStock: number;
  image?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  code?: string;
  itemCount?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: number;
  name: string;
  code: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  contactPerson?: string;
  paymentTerms?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleRequest {
  code: string;
  name: string;
  description?: string;
  categoryId: number;
  supplierId: number;
  unit: string;
  unitPrice: number;
  quantity: number;
  minStock: number;
  maxStock: number;
  status?: 'active' | 'inactive';
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {}
