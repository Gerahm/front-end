import { create } from 'zustand';
import { Product } from '@/lib/api';

interface UiState {
  isFetching: boolean;
  setIsFetching: (isFetching: boolean) => void;
  isEditModalOpen: boolean;
  editingProduct: Product | null;
  openEditModal: (product: Product) => void;
  closeEditModal: () => void;
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

export const useUiStore = create<UiState>(set => ({
  isFetching: false,
  setIsFetching: (isFetching: boolean) => set({ isFetching }),
  isEditModalOpen: false,
  editingProduct: null,
  openEditModal: (product: Product) =>
    set({ isEditModalOpen: true, editingProduct: product }),
  closeEditModal: () => set({ isEditModalOpen: false, editingProduct: null }),
  isCreateModalOpen: false,
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
}));
