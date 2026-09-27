import { Suspense } from 'react';
import type { Metadata } from 'next';
import ProductListing from '@/components/product/ProductListing';

export const metadata: Metadata = {
  title: 'Danh mục sản phẩm — Thuê Camera',
  description: 'Khám phá đầy đủ máy ảnh, lens và phụ kiện cho thuê từ Sony, Canon, Fujifilm, Nikon.',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="section-spacing-sm">
        <div className="container">
          <div className="skeleton h-12 w-64 mb-4" />
          <div className="skeleton h-6 w-96 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-[4/3] mb-4" />
                <div className="skeleton h-4 w-24 mb-2" />
                <div className="skeleton h-5 w-48 mb-2" />
                <div className="skeleton h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductListing />
    </Suspense>
  );
}
