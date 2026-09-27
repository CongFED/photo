import { Product, CategoryType, Brand, SortOption } from '@/types/product';
import { products } from '@/data/products';
import { mockDelay } from '@/lib/delay';

/**
 * Mock Product Service
 * Simulates API calls with artificial delays.
 * Replace implementation with real API calls when backend is ready.
 */

export async function getProducts(): Promise<Product[]> {
  await mockDelay(300);
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await mockDelay(200);
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  await mockDelay(200);
  return products.find((p) => p.id === id) ?? null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await mockDelay(300);
  return products.filter((p) => p.featured);
}

export async function searchProducts(query: string): Promise<Product[]> {
  await mockDelay(400);
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.shortDescription.toLowerCase().includes(lowerQuery)
  );
}

export async function getProductsByCategory(category: CategoryType): Promise<Product[]> {
  await mockDelay(300);
  return products.filter((p) => p.category === category);
}

export async function getProductsByBrand(brand: Brand): Promise<Product[]> {
  await mockDelay(300);
  return products.filter((p) => p.brand === brand);
}

export function filterAndSortProducts(
  allProducts: Product[],
  filters: {
    category?: CategoryType | 'all';
    brand?: Brand | 'all';
    search?: string;
    priceRange?: [number, number];
    sort?: SortOption;
  }
): Product[] {
  let result = [...allProducts];

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category);
  }

  // Filter by brand
  if (filters.brand && filters.brand !== 'all') {
    result = result.filter((p) => p.brand === filters.brand);
  }

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }

  // Price range
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    result = result.filter((p) => p.pricePerDay >= min && p.pricePerDay <= max);
  }

  // Sort
  switch (filters.sort) {
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'price-asc':
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
      break;
    case 'price-desc':
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
      break;
    case 'popular':
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      // featured first, then by review count
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.reviewCount - a.reviewCount;
      });
  }

  return result;
}

export function getRelatedProducts(productId: string, limit: number = 4): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];

  return products
    .filter((p) => p.id !== productId && (p.category === product.category || p.brand === product.brand))
    .slice(0, limit);
}

export function getAllBrands(): Brand[] {
  const brands = new Set(products.map((p) => p.brand));
  return Array.from(brands) as Brand[];
}

export function getAllCategories(): CategoryType[] {
  const cats = new Set(products.map((p) => p.category));
  return Array.from(cats) as CategoryType[];
}
