/**
 * Catalog Service
 */

import apiClient from './apiClient';
import type { Article, Category, Supplier, CreateArticleRequest } from '@/types/catalog';
import type { PaginatedResponse } from '@/types/common';

export const catalogService = {
  // Articles
  getArticles: async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Article>> => {
    const response = await apiClient.get<PaginatedResponse<Article>>('/articles', {
      params: { page, limit, search },
    });
    return response.data;
  },

  getArticleById: async (id: string): Promise<Article> => {
    const response = await apiClient.get<Article>(`/articles/${id}`);
    return response.data;
  },

  createArticle: async (data: CreateArticleRequest): Promise<Article> => {
    const response = await apiClient.post<Article>('/articles', data);
    return response.data;
  },

  updateArticle: async (id: string, data: Partial<CreateArticleRequest>): Promise<Article> => {
    const response = await apiClient.put<Article>(`/articles/${id}`, data);
    return response.data;
  },

  deleteArticle: async (id: string): Promise<void> => {
    await apiClient.delete(`/articles/${id}`);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', data);
    return response.data;
  },

  updateCategory: async (
    id: string,
    data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Category> => {
    const response = await apiClient.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },

  // Suppliers
  getSuppliers: async (page = 1, limit = 10): Promise<PaginatedResponse<Supplier>> => {
    const response = await apiClient.get<PaginatedResponse<Supplier>>('/suppliers', {
      params: { page, limit },
    });
    return response.data;
  },

  getSupplierById: async (id: string): Promise<Supplier> => {
    const response = await apiClient.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },

  createSupplier: async (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Promise<Supplier> => {
    const response = await apiClient.post<Supplier>('/suppliers', data);
    return response.data;
  },

  updateSupplier: async (
    id: string,
    data: Partial<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Supplier> => {
    const response = await apiClient.put<Supplier>(`/suppliers/${id}`, data);
    return response.data;
  },

  deleteSupplier: async (id: string): Promise<void> => {
    await apiClient.delete(`/suppliers/${id}`);
  },
};
