export type CategoryType =
  | 'Camera'
  | 'Lens'
  | 'Action Camera'
  | 'Gimbal'
  | 'Flash'
  | 'Tripod'
  | 'Microphone'
  | 'Lighting'
  | 'Accessory';

export type Brand =
  | 'Sony'
  | 'Canon'
  | 'Fujifilm'
  | 'Nikon'
  | 'DJI'
  | 'Sigma'
  | 'Tamron'
  | 'Insta360'
  | 'Godox'
  | 'Rode'
  | 'Zhiyun'
  | 'Manfrotto'
  | 'Peak Design';

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  category: CategoryType;
  shortDescription: string;
  description: string;
  pricePerDay: number;
  deposit: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  totalUnits: number;
  images: string[];
  specifications: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  image: string;
}

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'popular';

export type ViewMode = 'grid' | 'list';

export interface ProductFilter {
  category: CategoryType | 'all';
  brand: Brand | 'all';
  search: string;
  priceRange: [number, number];
  availableOnly: boolean;
  sort: SortOption;
}
