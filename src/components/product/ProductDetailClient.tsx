'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import {
  Card,
  CardContent,
  Chip,
  Rating,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { products } from '@/data/products';
import { formatCurrency } from '@/lib/utils';
import { TIME_SLOTS } from '@/lib/date';
import { checkAvailability } from '@/services/mockAvailabilityService';
import { useBooking } from '@/context/BookingContext';
import { getRelatedProducts } from '@/services/mockProductService';
import ProductCard from '@/components/product/ProductCard';
import { AvailabilityResult } from '@/types/availability';

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const product = products.find((p) => p.slug === slug);
  const { addItem, updateDates, updateTimes, startDate, endDate, receiveTime, returnTime } =
    useBooking();

  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localReceiveTime, setLocalReceiveTime] = useState(receiveTime || '09:00');
  const [localReturnTime, setLocalReturnTime] = useState(returnTime || '18:00');
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isAddedToast, setIsAddedToast] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <div className="max-w-md mx-auto px-4">
          <CameraAltOutlinedIcon sx={{ fontSize: 56, color: '#aaaaaa', mb: 2 }} />
          <h1 className="text-2xl font-bold uppercase text-[#111111]">Không tìm thấy thiết bị</h1>
          <p className="mt-2 text-sm text-[#666666]">
            Thiết bị này không tồn tại hoặc đã ngừng cung cấp dịch vụ thuê.
          </p>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            sx={{ mt: 3, backgroundColor: '#111111', borderRadius: '4px', textTransform: 'none' }}
          >
            Quay lại danh mục sản phẩm
          </Button>
        </div>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product.id);
  const specs = Object.entries(product.specifications);
  const mainImage = product.images?.[activeImage] || product.images?.[0];

  const handleCheckAvailability = async () => {
    if (!localStartDate || !localEndDate) return;
    setIsChecking(true);
    setAvailability(null);
    const result = await checkAvailability(product.id, localStartDate, localEndDate);
    setAvailability(result);
    setIsChecking(false);
  };

  const handleAddToBooking = () => {
    updateDates(localStartDate, localEndDate);
    updateTimes(localReceiveTime, localReturnTime);
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: mainImage || '',
      pricePerDay: product.pricePerDay,
      deposit: product.deposit,
      quantity: 1,
    });
    setIsAddedToast(true);
  };

  return (
    <div className="py-8 md:py-16 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <span>Tất cả thiết bị</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT — Product Visual Gallery & Specs */}
          <div className="lg:col-span-7">
            {/* Main Stage */}
            <Card
              sx={{
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#fbfbfa',
                position: 'relative',
              }}
            >
              <div className="relative aspect-[4/3] w-full flex items-center justify-center p-6">
                {mainImage && !imageError ? (
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    priority
                    className="object-contain p-6"
                    sizes="(max-width: 1024px) 100vw, 700px"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="text-center p-8">
                    <CameraAltOutlinedIcon sx={{ fontSize: 64, color: '#bbbbbb', mb: 2 }} />
                    <p className="text-xs uppercase tracking-widest font-bold text-[#888888]">
                      {product.brand}
                    </p>
                    <p className="text-2xl font-black uppercase text-[#111111] mt-1">{product.name}</p>
                  </div>
                )}

                <div className="absolute top-4 left-4 flex gap-2">
                  <Chip
                    label={product.brand}
                    size="small"
                    sx={{
                      backgroundColor: '#111111',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.6875rem',
                      borderRadius: '4px',
                    }}
                  />
                  <Chip
                    label="CÓ SẴN"
                    size="small"
                    sx={{
                      backgroundColor: '#e8f5e9',
                      color: '#1a7a2e',
                      border: '1px solid #c8e6c9',
                      fontWeight: 700,
                      fontSize: '0.6875rem',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
                Giới thiệu thiết bị
              </h2>
              <p className="mt-3 text-sm text-[#555555] leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="mt-10 pt-8 border-t border-[#e5e5e5]">
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111] mb-4">
                Thông số kỹ thuật nổi bật
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specs.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-3 rounded bg-[#fbfbfa] border border-[#e5e5e5]"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
                      {label}
                    </span>
                    <span className="text-xs font-bold text-[#111111] text-right ml-2">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="mt-10 p-5 bg-[#fbfbfa] border border-[#e5e5e5] rounded-md grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <SecurityOutlinedIcon sx={{ color: '#111111', fontSize: 22 }} />
                <div>
                  <p className="text-xs font-bold uppercase text-[#111111]">Bảo hiểm thiết bị</p>
                  <p className="text-[11px] text-[#666666] mt-0.5">
                    Hỗ trợ kỹ thuật 24/7 và kiểm định cảm biến tiêu chuẩn trước mỗi chuyến đi.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <LocalShippingOutlinedIcon sx={{ color: '#111111', fontSize: 22 }} />
                <div>
                  <p className="text-xs font-bold uppercase text-[#111111]">Giao nhận linh hoạt</p>
                  <p className="text-[11px] text-[#666666] mt-0.5">
                    Nhận trực tiếp tại chi nhánh Quận 1 & Quận 7 hoặc ship hỏa tốc tận nhà.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Rental Card & Availability Selector */}
          <div className="lg:col-span-5">
            <Card
              sx={{
                border: '1.5px solid #111111',
                borderRadius: '8px',
                p: { xs: 3, sm: 4 },
                boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
                backgroundColor: '#ffffff',
                position: 'sticky',
                top: 90,
              }}
            >
              <CardContent sx={{ p: '0 !important' }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-[#888888]">
                      {product.brand} · {product.category}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#111111] mt-1">
                      {product.name}
                    </h1>
                  </div>
                </div>

                {/* Rating & Location */}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#666666]">
                  <div className="flex items-center gap-1">
                    <Rating value={product.rating} precision={0.1} readOnly size="small" sx={{ color: '#111111' }} />
                    <span className="font-bold text-[#111111]">{product.rating}</span>
                    <span>({product.reviewCount} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PlaceOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>TP. Hồ Chí Minh</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="mt-6 p-4 bg-[#fbfbfa] border border-[#e5e5e5] rounded flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-[#111111]">
                      {formatCurrency(product.pricePerDay)}
                    </span>
                    <span className="text-xs text-[#777777]"> / ngày</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#888888] block">Đặt cọc gốc:</span>
                    <span className="text-xs font-bold text-[#555555]">
                      {formatCurrency(product.deposit)}
                    </span>
                  </div>
                </div>

                <Divider sx={{ my: 3 }} />

                {/* Rental Date & Time Selector */}
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block">
                    Chọn thời gian thuê
                  </span>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <DatePicker
                        label="Ngày nhận"
                        value={localStartDate ? dayjs(localStartDate) : null}
                        onChange={(val) => {
                          setLocalStartDate(val ? val.format('YYYY-MM-DD') : '');
                          setAvailability(null);
                        }}
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            sx: {
                              '& .MuiOutlinedInput-root': { borderRadius: '4px' },
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                      <DatePicker
                        label="Ngày trả"
                        value={localEndDate ? dayjs(localEndDate) : null}
                        onChange={(val) => {
                          setLocalEndDate(val ? val.format('YYYY-MM-DD') : '');
                          setAvailability(null);
                        }}
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            sx: {
                              '& .MuiOutlinedInput-root': { borderRadius: '4px' },
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="local-receive-label">Giờ nhận</InputLabel>
                        <Select
                          labelId="local-receive-label"
                          value={localReceiveTime}
                          label="Giờ nhận"
                          onChange={(e) => setLocalReceiveTime(e.target.value)}
                          startAdornment={<AccessTimeIcon sx={{ fontSize: 16, color: '#888888', mr: 0.5 }} />}
                        >
                          {TIME_SLOTS.map((t) => (
                            <MenuItem key={t} value={t}>
                              {t}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="local-return-label">Giờ trả</InputLabel>
                        <Select
                          labelId="local-return-label"
                          value={localReturnTime}
                          label="Giờ trả"
                          onChange={(e) => setLocalReturnTime(e.target.value)}
                          startAdornment={<AccessTimeIcon sx={{ fontSize: 16, color: '#888888', mr: 0.5 }} />}
                        >
                          {TIME_SLOTS.map((t) => (
                            <MenuItem key={t} value={t}>
                              {t}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Availability Checker Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    onClick={handleCheckAvailability}
                    disabled={isChecking || !localStartDate || !localEndDate}
                    startIcon={isChecking ? <CircularProgress size={14} color="inherit" /> : <CheckCircleIcon />}
                    sx={{
                      borderColor: '#cccccc',
                      color: '#111111',
                      borderRadius: '4px',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1,
                    }}
                  >
                    {isChecking
                      ? 'Đang kiểm tra tồn kho...'
                      : !localStartDate || !localEndDate
                      ? 'Vui lòng chọn ngày nhận & trả'
                      : 'Kiểm tra tình trạng thiết bị'}
                  </Button>

                  {/* Availability Alert Result */}
                  {availability && (
                    <Alert
                      severity={availability.availableUnits > 0 ? 'success' : 'warning'}
                      sx={{
                        borderRadius: '4px',
                        '& .MuiAlert-message': { fontSize: '0.8rem', fontWeight: 600 },
                      }}
                    >
                      {availability.availableUnits > 0
                        ? `Còn ${availability.availableUnits}/${availability.totalUnits} máy có sẵn trong khoảng ngày này!`
                        : `Đã hết máy trong khoảng thời gian đã chọn.`}
                    </Alert>
                  )}
                </div>

                {/* Add to Booking CTA Button */}
                <div className="mt-6 pt-4 border-t border-[#f0f0f0]">
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleAddToBooking}
                    startIcon={<ShoppingBagOutlinedIcon />}
                    sx={{
                      backgroundColor: '#111111',
                      color: '#ffffff',
                      py: 1.5,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: '#2a2a2a',
                      },
                    }}
                  >
                    Thêm vào booking
                  </Button>

                  <Button
                    component={Link}
                    href="/booking"
                    variant="text"
                    fullWidth
                    sx={{
                      mt: 1.5,
                      color: '#666666',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      '&:hover': { color: '#111111', backgroundColor: 'transparent' },
                    }}
                  >
                    Đi đến trang giỏ thuê & thanh toán →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[#e5e5e5]">
            <span className="text-xs uppercase tracking-widest font-bold text-[#666666]">
              Gợi ý thiết bị cùng phân khúc
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#111111] mt-1 mb-8">
              Thiết bị tương tự
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Added to Booking Toast */}
      <Snackbar
        open={isAddedToast}
        autoHideDuration={3000}
        onClose={() => setIsAddedToast(false)}
        message={`Đã thêm "${product.name}" vào danh sách thuê!`}
        action={
          <Link href="/booking" className="text-xs font-bold text-[#4ade80] underline mr-2">
            Xem giỏ
          </Link>
        }
      />
    </div>
  );
}
