/**
 * Article/Product Types
 */

export interface Article {
  id: string;
  code: string;
  name: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
  supplierId: string;
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
  id: string;
  name: string;
  description?: string;
  code?: string;
  itemCount?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
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
  categoryId: string;
  supplierId: string;
  unit: string;
  unitPrice: number;
  minStock: number;
  maxStock: number;
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {}
