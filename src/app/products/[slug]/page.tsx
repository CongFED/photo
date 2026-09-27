import { Metadata } from 'next';
import { products } from '@/data/products';
import ProductDetailClient from '@/components/product/ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    return { title: 'Sản phẩm không tìm thấy — Thuê Camera' };
  }
  return {
    title: `${product.name} — Thuê Camera`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
