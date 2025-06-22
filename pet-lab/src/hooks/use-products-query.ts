import { useQuery } from '@tanstack/react-query';
import {
  getProducts,
  getProductByTags,
  getProductBySubscription,
  getProductByPrice,
  ApiResponse,
} from '@/lib/api';
import { Product } from '@/lib/api';

interface UseProductsQueryParams {
  page: number;
  tags?: string;
  subscription?: boolean;
  price?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useProductsQuery({
  page,
  tags,
  subscription,
  price,
  sortBy,
  sortOrder,
}: UseProductsQueryParams) {
  return useQuery<ApiResponse<Product>>({
    queryKey: [
      'products',
      { page, tags, subscription, price, sortBy, sortOrder },
    ],
    queryFn: async () => {
      if (tags) {
        return getProductByTags(tags, page, 10, sortBy, sortOrder);
      } else if (subscription) {
        return getProductBySubscription(
          subscription,
          page,
          10,
          sortBy,
          sortOrder
        );
      } else if (price !== undefined) {
        return getProductByPrice(price, page, 10, sortBy, sortOrder);
      } else {
        return getProducts(page, 10, sortBy, sortOrder);
      }
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}
