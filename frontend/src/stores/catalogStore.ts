/**
 * Catalog Store
 */

import { create } from 'zustand';
import type { Article, Category, Supplier } from '@/types/catalog';

interface CatalogState {
  articles: Article[];
  categories: Category[];
  suppliers: Supplier[];
  selectedArticle: Article | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setArticles: (articles: Article[]) => void;
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: number) => void;
  setSelectedArticle: (article: Article | null) => void;

  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: number) => void;

  setSuppliers: (suppliers: Supplier[]) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: number) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  articles: [],
  categories: [],
  suppliers: [],
  selectedArticle: null,
  isLoading: false,
  error: null,

  setArticles: (articles) => set({ articles }),
  addArticle: (article) =>
    set((state) => ({
      articles: [...state.articles, article],
    })),
  updateArticle: (article) =>
    set((state) => ({
      articles: state.articles.map((a) => (a.id === article.id ? article : a)),
      selectedArticle: state.selectedArticle?.id === article.id ? article : state.selectedArticle,
    })),
  deleteArticle: (id) =>
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id),
      selectedArticle: state.selectedArticle?.id === id ? null : state.selectedArticle,
    })),
  setSelectedArticle: (article) => set({ selectedArticle: article }),

  setCategories: (categories) => set({ categories }),
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
  updateCategory: (category) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === category.id ? category : c)),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  setSuppliers: (suppliers) => set({ suppliers }),
  addSupplier: (supplier) =>
    set((state) => ({
      suppliers: [...state.suppliers, supplier],
    })),
  updateSupplier: (supplier) =>
    set((state) => ({
      suppliers: state.suppliers.map((s) => (s.id === supplier.id ? supplier : s)),
    })),
  deleteSupplier: (id) =>
    set((state) => ({
      suppliers: state.suppliers.filter((s) => s.id !== id),
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
