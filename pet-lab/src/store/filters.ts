import { create } from 'zustand';

interface FilterState {
  tags: string;
  setTags: (tags: string) => void;
  subscription: boolean;
  setSubscription: (subscription: boolean) => void;
  price: number | undefined;
  setPrice: (price: number | undefined) => void;
  sortBy: string | undefined;
  sortOrder: 'ASC' | 'DESC';
  setSortBy: (sortBy: string | undefined) => void;
  setSortOrder: (sortOrder: 'ASC' | 'DESC') => void;
}

export const useFilterStore = create<FilterState>(set => ({
  tags: '',
  setTags: (tags: string) => set({ tags: tags }),
  subscription: false,
  setSubscription: (subscription: boolean) => set({ subscription }),
  price: undefined,
  setPrice: (price: number | undefined) => set({ price }),
  sortBy: undefined,
  sortOrder: 'ASC',
  setSortBy: (sortBy: string | undefined) => set({ sortBy }),
  setSortOrder: (sortOrder: 'ASC' | 'DESC') => set({ sortOrder }),
}));
