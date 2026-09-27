'use client';

import Link from 'next/link';
import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="py-20 md:py-28 bg-[#fbfbfa] border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#666666]">
              Được thuê nhiều nhất
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111111] mt-2">
              Thiết bị nổi bật
            </h2>
          </div>

          <Button
            component={Link}
            href="/products"
            variant="outlined"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderColor: '#111111',
              color: '#111111',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '0.8125rem',
              px: 2.5,
              py: 1,
              '&:hover': {
                borderColor: '#000000',
                backgroundColor: '#111111',
                color: '#ffffff',
              },
            }}
          >
            Xem tất cả thiết bị
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
