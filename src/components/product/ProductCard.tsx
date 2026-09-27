'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, Chip, Rating, IconButton, Tooltip, Button } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

export default function ProductCard({ product, view = 'grid' }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const mainImage = product.images?.[0];
  const isAvailable = product.totalUnits > 0;
  const isLowStock = product.totalUnits === 1;

  const availabilityBadge = isLowStock ? (
    <Chip
      label="CÒN 1 MÁY"
      size="small"
      sx={{
        backgroundColor: '#fef3c7',
        color: '#b45309',
        border: '1px solid #fde68a',
        fontWeight: 700,
        fontSize: '0.625rem',
        borderRadius: '3px',
      }}
    />
  ) : isAvailable ? (
    <Chip
      label="CÓ SẴN"
      size="small"
      sx={{
        backgroundColor: '#e8f5e9',
        color: '#1a7a2e',
        border: '1px solid #c8e6c9',
        fontWeight: 700,
        fontSize: '0.625rem',
        borderRadius: '3px',
      }}
    />
  ) : (
    <Chip
      label="HẾT HÀNG"
      size="small"
      sx={{
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #fecaca',
        fontWeight: 700,
        fontSize: '0.625rem',
        borderRadius: '3px',
      }}
    />
  );

  // LIST VIEW
  if (view === 'list') {
    return (
      <Card
        sx={{
          mb: 3,
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          transition: 'all 0.25s ease',
          '&:hover': {
            borderColor: '#111111',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          },
        }}
      >
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Image */}
          <Link
            href={`/products/${product.slug}`}
            className="relative w-full sm:w-56 h-48 sm:h-auto bg-[#fbfbfa] flex items-center justify-center overflow-hidden shrink-0 group border-b sm:border-b-0 sm:border-r border-[#e5e5e5]"
          >
            {mainImage && !hasImageError ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                sizes="250px"
                onError={() => setHasImageError(true)}
              />
            ) : (
              <div className="text-center p-4">
                <CameraAltOutlinedIcon sx={{ fontSize: 32, color: '#aaaaaa', mb: 1 }} />
                <p className="text-xs uppercase tracking-widest font-bold text-[#888888]">{product.brand}</p>
                <p className="text-sm font-bold text-[#222222] mt-0.5">{product.name}</p>
              </div>
            )}
            <div className="absolute top-3 left-3">{availabilityBadge}</div>
          </Link>

          {/* Details */}
          <CardContent sx={{ flex: 1, p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <Chip
                    label={product.brand}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.625rem', fontWeight: 700, borderColor: '#cccccc' }}
                  />
                  <span className="text-xs text-[#888888] uppercase tracking-wider">{product.category}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Tooltip title="Lưu yêu thích">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsFavorite(!isFavorite);
                      }}
                      sx={{ color: isFavorite ? '#dc2626' : '#888888' }}
                    >
                      {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Chia sẻ">
                    <IconButton size="small" onClick={(e) => e.preventDefault()} sx={{ color: '#888888' }}>
                      <ShareOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>

              <Link href={`/products/${product.slug}`}>
                <h3 className="text-lg font-bold text-[#111111] hover:text-[#444444] transition-colors uppercase tracking-tight">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-[#666666] mt-1 line-clamp-2">{product.shortDescription}</p>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#f0f0f0]">
              <div className="flex items-center gap-2">
                <Rating value={product.rating} precision={0.1} readOnly size="small" sx={{ color: '#111111' }} />
                <span className="text-xs font-semibold text-[#111111]">{product.rating}</span>
                <span className="text-xs text-[#888888]">({product.reviewCount})</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-lg font-extrabold text-[#111111]">{formatCurrency(product.pricePerDay)}</span>
                  <span className="text-xs text-[#777777]"> / ngày</span>
                </div>

                <Button
                  component={Link}
                  href={`/products/${product.slug}`}
                  variant="contained"
                  size="small"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    backgroundColor: '#111111',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    px: 2,
                  }}
                >
                  Thuê ngay
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // GRID VIEW (Default)
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e5e5e5',
        borderRadius: '6px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: '#111111',
          boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
          '& .prod-img': {
            transform: 'scale(1.06)',
          },
        },
      }}
    >
      {/* Product Image Box */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/3] bg-[#fbfbfa] flex items-center justify-center overflow-hidden border-b border-[#e5e5e5] group"
      >
        {mainImage && !hasImageError ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="prod-img object-contain p-4 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className="text-center p-6">
            <CameraAltOutlinedIcon sx={{ fontSize: 40, color: '#bbbbbb', mb: 1 }} />
            <p className="text-xs uppercase tracking-widest font-bold text-[#888888]">{product.brand}</p>
            <p className="text-base font-bold text-[#222222] mt-1 line-clamp-1">{product.name}</p>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">{availabilityBadge}</div>

        {/* Brand Chip */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <Chip
            label={product.brand}
            size="small"
            variant="outlined"
            sx={{
              height: 22,
              fontSize: '0.625rem',
              fontWeight: 700,
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderColor: '#e0e0e0',
              backdropFilter: 'blur(4px)',
            }}
          />
        </div>
      </Link>

      {/* Product Info */}
      <CardContent sx={{ flex: 1, p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="flex items-center justify-between text-xs text-[#888888] mb-1.5 uppercase tracking-wider">
            <span>{product.category}</span>
            <div className="flex items-center gap-0.5">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  setIsFavorite(!isFavorite);
                }}
                sx={{ p: 0.5, color: isFavorite ? '#dc2626' : '#aaaaaa' }}
              >
                {isFavorite ? <FavoriteIcon sx={{ fontSize: 16 }} /> : <FavoriteBorderIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </div>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-[#111111] hover:text-[#555555] transition-colors line-clamp-2 uppercase tracking-tight text-base leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[#666666] mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1">
              <Rating value={product.rating} precision={0.1} readOnly size="small" sx={{ fontSize: '0.9rem', color: '#111111' }} />
              <span className="text-xs font-semibold text-[#111111] ml-0.5">{product.rating}</span>
            </div>
            <div className="mt-1.5">
              <span className="text-base font-black text-[#111111]">{formatCurrency(product.pricePerDay)}</span>
              <span className="text-xs text-[#777777]"> / ngày</span>
            </div>
          </div>

          <Button
            component={Link}
            href={`/products/${product.slug}`}
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#d0d0d0',
              color: '#111111',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '0.7rem',
              py: 0.75,
              px: 1.5,
              '&:hover': {
                borderColor: '#111111',
                backgroundColor: '#111111',
                color: '#ffffff',
              },
            }}
          >
            Chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
