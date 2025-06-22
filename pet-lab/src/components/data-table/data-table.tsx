'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaginationSection } from '@/components/layout/PaginationSection';
import { Button } from '../ui/button';
import { useFilterStore } from '@/store/filters';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: PaginationProps;
  onSortChange?: (columnId: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isFetching?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onSortChange,
  sortBy,
  sortOrder,
  isFetching,
}: DataTableProps<TData, TValue>) {
  const setSortBy = useFilterStore(state => state.setSortBy);
  const setSortOrder = useFilterStore(state => state.setSortOrder);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: !!pagination,
    pageCount: pagination?.totalPages || 0,
  });

  const handleSort = (columnId: string, sortOrder: 'ASC' | 'DESC') => {
    console.log('columnId', columnId);
    console.log('sortOrder', sortOrder);
    setSortBy(columnId);
    setSortOrder(sortOrder);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'rounded-md border relative overflow-auto h-auto max-h-[450px]',
          isFetching && 'opacity-50 pointer-events-none'
        )}
      >
        <Table>
          <TableHeader className="sticky top-0 bg-white">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="bg-slate-100">
                {headerGroup.headers.map(header => {
                  const isSortable = header.column.columnDef.meta?.isSortable;
                  const isSorted = sortBy === header.column.id;
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        isSortable ? 'cursor-pointer select-none bg-' : ''
                      }
                      onClick={() =>
                        isSortable && onSortChange
                          ? onSortChange(header.column.id)
                          : null
                      }
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {isSortable && (
                          <div className="w-4 h-4">
                            {isSorted ? (
                              sortOrder === 'asc' ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              )
                            ) : (
                              <ChevronsUpDown className="w-4 h-4 opacity-30" />
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="even:bg-beige-100"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination ? (
        <CustomPagination {...pagination} />
      ) : (
        <PaginationSection table={table} />
      )}
    </div>
  );
}

// Custom pagination component that works with API pagination
function CustomPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing page {currentPage} of {totalPages} ({totalItems} total items)
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm border rounded ${
              currentPage === page
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
