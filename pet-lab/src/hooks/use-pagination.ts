import { useState, useCallback } from 'react';
import { PaginationMeta } from '@/lib/api';

export interface UsePaginationReturn {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  pagination: PaginationMeta | null;
  setPagination: (pagination: PaginationMeta) => void;
  goToPage: (page: number) => void;
  goToNext: () => void;
  goToPrev: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export function usePagination(
  initialPage = 1,
  initialItemsPerPage = 10
): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const goToNext = useCallback(() => {
    if (pagination?.links.next) {
      const match = pagination.links.next.match(/_page=(\d+)/);
      if (match) {
        setCurrentPage(parseInt(match[1]));
      }
    }
  }, [pagination]);

  const goToPrev = useCallback(() => {
    if (pagination?.links.prev) {
      const match = pagination.links.prev.match(/_page=(\d+)/);
      if (match) {
        setCurrentPage(parseInt(match[1]));
      }
    }
  }, [pagination]);

  const goToFirst = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLast = useCallback(() => {
    if (pagination?.totalPages) {
      setCurrentPage(pagination.totalPages);
    }
  }, [pagination]);

  const canGoNext = Boolean(pagination?.links.next);
  const canGoPrev = Boolean(pagination?.links.prev);

  return {
    currentPage,
    itemsPerPage: pagination?.itemsPerPage || initialItemsPerPage,
    totalItems: pagination?.totalItems || 0,
    totalPages: pagination?.totalPages || 0,
    pagination,
    setPagination,
    goToPage,
    goToNext,
    goToPrev,
    goToFirst,
    goToLast,
    canGoNext,
    canGoPrev,
  };
}
