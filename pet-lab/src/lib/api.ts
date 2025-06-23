export interface Product {
  id: number;
  image_src: string;
  title: string;
  price: number;
  tags: string[];
  subscription: boolean;
  vendor: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  links: {
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
  };
}

export interface ApiResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

function parseLinkHeader(linkHeader: string | null): PaginationMeta['links'] {
  if (!linkHeader) return {};

  const links: PaginationMeta['links'] = {};
  const linkParts = linkHeader.split(',');

  linkParts.forEach(part => {
    const [url, rel] = part.split(';');
    const cleanUrl = url.trim().replace(/[<>]/g, '');
    const cleanRel = rel.trim().replace(/rel="(.+)"/, '$1');
    links[cleanRel as keyof PaginationMeta['links']] = cleanUrl;
  });

  return links;
}

function extractPageFromUrl(url: string): number {
  const match = url.match(/_page=(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

function extractLimitFromUrl(url: string): number {
  const match = url.match(/_limit=(\d+)/);
  return match ? parseInt(match[1]) : 10;
}

async function fetchWithPagination(url: string): Promise<ApiResponse<Product>> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data from json-server');
  }

  const data = await res.json();
  const totalCount = res.headers.get('X-Total-Count');
  const linkHeader = res.headers.get('Link');

  const links = parseLinkHeader(linkHeader);
  const currentPage = extractPageFromUrl(url);
  const totalItems = totalCount ? parseInt(totalCount) : data.length;
  const itemsPerPage = extractLimitFromUrl(url);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    data,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      links,
    },
  };
}

export async function getProducts(
  page = 1,
  limit = 10,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): Promise<ApiResponse<Product>> {
  let url = `http://localhost:3001/products?_page=${page}&_limit=${limit}`;
  if (sortBy) {
    url += `&_sort=${sortBy}&_order=${sortOrder || 'asc'}`;
  }
  return fetchWithPagination(url);
}

export async function getAllProducts(): Promise<ApiResponse<Product>> {
  return fetchWithPagination(`http://localhost:3001/products`);
}

export async function getProductByTags(
  tag: string,
  page = 1,
  limit = 10,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): Promise<ApiResponse<Product>> {
  let url = `http://localhost:3001/products?tags_like=${tag}&_page=${page}&_limit=${limit}`;
  if (sortBy) {
    url += `&_sort=${sortBy}&_order=${sortOrder || 'asc'}`;
  }
  return fetchWithPagination(url);
}

export async function getProductBySubscription(
  subscription: boolean,
  page = 1,
  limit = 10,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): Promise<ApiResponse<Product>> {
  let url = `http://localhost:3001/products?subscription=${subscription}&_page=${page}&_limit=${limit}`;
  if (sortBy) {
    url += `&_sort=${sortBy}&_order=${sortOrder || 'asc'}`;
  }
  return fetchWithPagination(url);
}

export async function getProductByPrice(
  price: number,
  page = 1,
  limit = 10,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): Promise<ApiResponse<Product>> {
  let url = `http://localhost:3001/products?price_like=${price}&_page=${page}&_limit=${limit}`;
  if (sortBy) {
    url += `&_sort=${sortBy}&_order=${sortOrder || 'asc'}`;
  }
  return fetchWithPagination(url);
}

export async function fetchFromUrl(url: string): Promise<ApiResponse<Product>> {
  return fetchWithPagination(url);
}

export async function updateProduct(
  productId: number,
  productData: Partial<Product>
): Promise<Product> {
  const res = await fetch(`http://localhost:3001/products/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    throw new Error('Failed to update product');
  }

  return res.json();
}

export async function createProduct(
  productData: Omit<Product, 'id'>
): Promise<Product> {
  const res = await fetch(`http://localhost:3001/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    throw new Error('Failed to create product');
  }

  return res.json();
}
