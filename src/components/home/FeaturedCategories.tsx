'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const categoryItems = [
  {
    name: 'Máy Ảnh',
    slug: 'camera',
    count: '10+ thiết bị',
    description: 'Sony Full Frame, Canon EOS R, Fujifilm X-Series, Nikon Z',
    image: '/images/products/sony-a7iv.jpg',
  },
  {
    name: 'Ống Kính (Lens)',
    slug: 'lens',
    count: '8+ ống kính',
    description: 'Sony GM, Canon RF L-Series, Sigma Art, Tamron',
    image: '/images/products/sony-24-70-gm-ii.jpg',
  },
  {
    name: 'Action Camera',
    slug: 'action-camera',
    count: '5+ thiết bị',
    description: 'DJI Pocket 3, Insta360 X4, GoPro',
    image: '/images/products/dji-osmo-pocket-3.jpg',
  },
  {
    name: 'Gimbal & Phụ Kiện',
    slug: 'phu-kien',
    count: 'Đầy đủ combo',
    description: 'DJI RS 4 Pro, Godox Flash, Mic không dây Rode/DJI, Chân máy Carbon',
    image: '/images/products/dji-rs-4-pro.jpg',
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-20 md:py-28 bg-white border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#666666]">
              Phân loại thiết bị
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111111] mt-2">
              Thuê theo nhu cầu
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-sm text-[#666666] max-w-md">
            Mọi thiết bị đều được bảo quản trong tủ chống ẩm tiêu chuẩn, vệ sinh và khử trùng trước khi giao.
          </p>
        </div>

        {/* Asymmetrical Layout with MUI Grid */}
        <Grid container spacing={3}>
          {/* Main Large Item: Máy Ảnh */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Link href={`/products?category=${categoryItems[0].slug}`} className="block h-full">
              <Card
                sx={{
                  height: '100%',
                  minHeight: { xs: '380px', md: '460px' },
                  position: 'relative',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  backgroundColor: '#fbfbfa',
                  p: { xs: 3, md: 5 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#111111',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
                    '& .cat-arrow': {
                      transform: 'translate(4px, -4px)',
                      color: '#111111',
                    },
                    '& .cat-image': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                <div className="flex items-center justify-between z-10">
                  <Chip
                    label={categoryItems[0].count}
                    size="small"
                    sx={{
                      backgroundColor: '#111111',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.6875rem',
                      borderRadius: '4px',
                    }}
                  />
                  <div className="cat-arrow w-10 h-10 rounded-full border border-[#cccccc] flex items-center justify-center text-[#666666] transition-all">
                    <ArrowOutwardIcon sx={{ fontSize: 20 }} />
                  </div>
                </div>

                {/* Floating Image */}
                <div className="relative w-full h-56 md:h-64 my-auto">
                  <Image
                    src={categoryItems[0].image}
                    alt={categoryItems[0].name}
                    fill
                    className="cat-image object-contain transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 600px"
                  />
                </div>

                <div className="z-10 mt-auto pt-4 border-t border-[#e5e5e5]">
                  <h3 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
                    {categoryItems[0].name}
                  </h3>
                  <p className="text-sm text-[#666666] mt-1.5">{categoryItems[0].description}</p>
                </div>
              </Card>
            </Link>
          </Grid>

          {/* Right Column: 2 Stacked Items */}
          <Grid size={{ xs: 12, lg: 5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Lens */}
            <Link href={`/products?category=${categoryItems[1].slug}`} className="flex-1">
              <Card
                sx={{
                  height: '100%',
                  minHeight: '220px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  backgroundColor: '#fbfbfa',
                  p: 3.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#111111',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    '& .cat-arrow': { transform: 'translate(3px, -3px)', color: '#111111' },
                    '& .cat-img-sub': { transform: 'scale(1.05)' },
                  },
                }}
              >
                <div className="flex-1 pr-4">
                  <Chip
                    label={categoryItems[1].count}
                    size="small"
                    sx={{
                      backgroundColor: '#eef0ed',
                      color: '#444444',
                      fontWeight: 700,
                      fontSize: '0.6875rem',
                      borderRadius: '4px',
                      mb: 1.5,
                    }}
                  />
                  <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
                    {categoryItems[1].name}
                  </h3>
                  <p className="text-xs text-[#666666] mt-1 line-clamp-2">
                    {categoryItems[1].description}
                  </p>
                </div>

                <div className="relative w-28 h-28 shrink-0">
                  <Image
                    src={categoryItems[1].image}
                    alt={categoryItems[1].name}
                    fill
                    className="cat-img-sub object-contain transition-transform duration-500"
                    sizes="120px"
                  />
                </div>
              </Card>
            </Link>

            {/* Action Camera */}
            <Link href={`/products?category=${categoryItems[2].slug}`} className="flex-1">
              <Card
                sx={{
                  height: '100%',
                  minHeight: '220px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  backgroundColor: '#fbfbfa',
                  p: 3.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#111111',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    '& .cat-arrow': { transform: 'translate(3px, -3px)', color: '#111111' },
                    '& .cat-img-sub': { transform: 'scale(1.05)' },
                  },
                }}
              >
                <div className="flex-1 pr-4">
                  <Chip
                    label={categoryItems[2].count}
                    size="small"
                    sx={{
                      backgroundColor: '#eef0ed',
                      color: '#444444',
                      fontWeight: 700,
                      fontSize: '0.6875rem',
                      borderRadius: '4px',
                      mb: 1.5,
                    }}
                  />
                  <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
                    {categoryItems[2].name}
                  </h3>
                  <p className="text-xs text-[#666666] mt-1 line-clamp-2">
                    {categoryItems[2].description}
                  </p>
                </div>

                <div className="relative w-28 h-28 shrink-0">
                  <Image
                    src={categoryItems[2].image}
                    alt={categoryItems[2].name}
                    fill
                    className="cat-img-sub object-contain transition-transform duration-500"
                    sizes="120px"
                  />
                </div>
              </Card>
            </Link>
          </Grid>

          {/* Bottom Wide Item: Phụ kiện & Gimbal */}
          <Grid size={{ xs: 12 }}>
            <Link href={`/products?category=phu-kien`} className="block">
              <Card
                sx={{
                  border: '1px solid #111111',
                  borderRadius: '8px',
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  p: { xs: 3, md: 4 },
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  justifyContent: 'space-between',
                  gap: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#1c1c1c',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                    '& .wide-arrow': { transform: 'translate(4px, -4px)' },
                  },
                }}
              >
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 shrink-0 hidden sm:block">
                    <Image
                      src={categoryItems[3].image}
                      alt={categoryItems[3].name}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
                        {categoryItems[3].name}
                      </h3>
                      <Chip
                        label={categoryItems[3].count}
                        size="small"
                        sx={{
                          backgroundColor: '#333333',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.6875rem',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                    <p className="text-sm text-[#aaaaaa] mt-1">{categoryItems[3].description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold text-white">
                  <span>Khám phá trọn bộ</span>
                  <div className="wide-arrow w-8 h-8 rounded-full border border-[#555555] flex items-center justify-center transition-transform">
                    <ArrowOutwardIcon sx={{ fontSize: 16 }} />
                  </div>
                </div>
              </Card>
            </Link>
          </Grid>
        </Grid>
      </div>
    </section>
  );
}
