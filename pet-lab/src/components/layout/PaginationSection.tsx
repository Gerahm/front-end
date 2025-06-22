'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Table } from '@tanstack/react-table';

interface PaginationSectionProps<TData> {
  table: Table<TData>;
}

export function PaginationSection<TData>({
  table,
}: PaginationSectionProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => table.previousPage()}
            className={
              !table.getCanPreviousPage()
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {pages.map(pageNumber => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              isActive={pageIndex === pageNumber - 1}
              onClick={() => table.setPageIndex(pageNumber - 1)}
              className="cursor-pointer"
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => table.nextPage()}
            className={
              !table.getCanNextPage()
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationSection;
