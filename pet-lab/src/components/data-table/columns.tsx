'use client';

import { ColumnDef, RowData } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import ProductImage from '../ProductImage';
import { Pencil, Plus, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useUiStore } from '@/store/ui-store';
import { Product } from '@/lib/api';

// Augment the ColumnMeta interface to add our custom property
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    isSortable?: boolean;
  }
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const product = row.original;
      return <ProductImage src={product.image_src} alt={product.title} />;
    },
  },
  {
    accessorKey: 'title',
    header: 'Product',
    meta: {
      isSortable: true,
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    meta: {
      isSortable: true,
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    meta: {
      isSortable: true,
    },
    cell: ({ row }) => {
      const tags = row.getValue('tags') as string[];
      return (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'subscription',
    header: 'Subscription',
    meta: {
      isSortable: true,
    },
    cell: ({ row }) => {
      return (
        <Badge variant={row.getValue('subscription') ? 'success' : 'secondary'}>
          {row.getValue('subscription') ? 'Available' : 'Not Available'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'vendor',
    header: 'Vendor',
    meta: {
      isSortable: true,
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('vendor')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;
      const { openEditModal } = useUiStore();

      return (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 cursor-pointer"
          onClick={() => openEditModal(product)}
        >
          <span className="sr-only">Open menu</span>
          <Image src="/assets/edit.svg" alt="Edit" width={20} height={20} />
        </Button>
      );
    },
  },
];
