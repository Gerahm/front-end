'use client';

import { useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { columns } from '@/components/data-table/columns';
import { DataTable } from '@/components/data-table/data-table';
import { Spinner } from '@/components/ui/spinner';
import { usePagination } from '@/hooks/use-pagination';
import { useProductsQuery } from '@/hooks/use-products-query';
import { useUiStore } from '@/store/ui-store';
import { Button } from '@/components/ui/button';
import { EditProductModal } from '@/components/EditProductModal';
import { CreateProductModal } from '@/components/CreateProductModal';

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pagination = usePagination();
  const setIsFetching = useUiStore(state => state.setIsFetching);
  const openCreateModal = useUiStore(state => state.openCreateModal);

  const tags = searchParams.get('tags') || undefined;
  const subscription = searchParams.get('subscription') === 'true';
  const price = searchParams.get('price')
    ? Number(searchParams.get('price'))
    : undefined;
  const sortBy = searchParams.get('sortBy') || 'title';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';

  const {
    data: queryResult,
    isLoading,
    isFetching,
    error,
  } = useProductsQuery({
    page: pagination.currentPage,
    tags,
    subscription,
    price,
    sortBy,
    sortOrder,
  });

  useEffect(() => {
    setIsFetching(isFetching);
  }, [isFetching, setIsFetching]);

  useEffect(() => {
    if (queryResult?.pagination) {
      pagination.setPagination(queryResult.pagination);
    }
  }, [queryResult?.pagination]);

  useEffect(() => {
    pagination.goToPage(1);
  }, [tags, subscription, price, sortBy, sortOrder]);

  const handleSortChange = (columnId: string) => {
    const params = new URLSearchParams(searchParams);
    if (sortBy === columnId) {
      params.set('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      params.set('sortBy', columnId);
      params.set('sortOrder', 'asc');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full top-1/2 translate-y-1/2">
        <Spinner size="lg" className="w-20 h-20 mt-20 bg-black dark:bg-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500">
          Error loading products: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="p-4 flex justify-end items-end w-full">
        <Button
          variant="success"
          className="cursor-pointer"
          onClick={openCreateModal}
        >
          Create New
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={queryResult?.data || []}
        isFetching={isFetching}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalItems,
          onPageChange: pagination.goToPage,
          onNext: pagination.goToNext,
          onPrev: pagination.goToPrev,
          canGoNext: pagination.canGoNext,
          canGoPrev: pagination.canGoPrev,
        }}
      />
      <EditProductModal />
      <CreateProductModal />
    </div>
  );
}
