'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { TIME_SLOTS } from '@/lib/date';
import { checkMockAvailability } from '@/lib/mockAvailability';

export default function RentalSearch() {
  const router = useRouter();
  const [category, setCategory] = useState<string>('all');
  const [productSlug, setProductSlug] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [receiveTime, setReceiveTime] = useState('09:00');
  const [returnTime, setReturnTime] = useState('18:00');
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{
    checked: boolean;
    available: number;
    total: number;
    message: string;
  } | null>(null);

  const filteredProducts =
    category === 'all'
      ? products
      : products.filter((p) => p.category.toLowerCase() === category.toLowerCase() || p.slug.includes(category));

  const handleCheckAvailability = () => {
    if (!productSlug || !startDate || !endDate) return;
    setIsChecking(true);
    setTimeout(() => {
      const selected = products.find((p) => p.slug === productSlug);
      if (selected) {
        const res = checkMockAvailability(selected.id, startDate, endDate);
        setAvailabilityResult({
          checked: true,
          available: res.availableUnits,
          total: res.totalUnits,
          message:
            res.availableUnits > 0
              ? `Còn ${res.availableUnits}/${res.totalUnits} thiết bị có sẵn cho lịch này!`
              : `Rất tiếc, đã hết thiết bị trong khoảng thời gian đã chọn.`,
        });
      }
      setIsChecking(false);
    }, 400);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (productSlug) params.set('product', productSlug);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (receiveTime) params.set('receiveTime', receiveTime);
    if (returnTime) params.set('returnTime', returnTime);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <section id="search" className="py-16 md:py-24 bg-[#fbfbfa] border-b border-[#e5e5e5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-[#666666]">
            Đặt lịch nhanh chóng
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111111] mt-2">
            Tìm thiết bị
          </h2>
          <p className="mt-3 text-base text-[#666666] max-w-xl mx-auto">
            Tìm kiếm thiết bị và combo phù hợp với dự án chụp ảnh hoặc quay phim của bạn
          </p>
        </div>

        <Card
          sx={{
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            backgroundColor: '#ffffff',
            p: { xs: 2.5, sm: 4 },
          }}
        >
          <CardContent sx={{ p: '0 !important' }}>
            <Grid container spacing={3}>
              {/* Category */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="medium">
                  <InputLabel id="category-label">Loại thiết bị</InputLabel>
                  <Select
                    labelId="category-label"
                    value={category}
                    label="Loại thiết bị"
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setProductSlug('');
                      setAvailabilityResult(null);
                    }}
                    sx={{ borderRadius: '4px' }}
                  >
                    <MenuItem value="all">Tất cả danh mục thiết bị</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Specific Product */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="medium">
                  <InputLabel id="product-label">Thiết bị cụ thể</InputLabel>
                  <Select
                    labelId="product-label"
                    value={productSlug}
                    label="Thiết bị cụ thể"
                    onChange={(e) => {
                      setProductSlug(e.target.value);
                      setAvailabilityResult(null);
                    }}
                    sx={{ borderRadius: '4px' }}
                  >
                    <MenuItem value="">Chọn nhanh thiết bị...</MenuItem>
                    {filteredProducts.map((p) => (
                      <MenuItem key={p.id} value={p.slug}>
                        {p.name} — {p.pricePerDay.toLocaleString('vi-VN')}đ/ngày
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Start Date */}
              <Grid size={{ xs: 12, md: 6 }}>
                <DatePicker
                  label="Ngày nhận thiết bị"
                  value={startDate ? dayjs(startDate) : null}
                  onChange={(val) => {
                    setStartDate(val ? val.format('YYYY-MM-DD') : '');
                    setAvailabilityResult(null);
                  }}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'medium',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
                        },
                      },
                    },
                  }}
                />
              </Grid>

              {/* End Date */}
              <Grid size={{ xs: 12, md: 6 }}>
                <DatePicker
                  label="Ngày trả thiết bị"
                  value={endDate ? dayjs(endDate) : null}
                  onChange={(val) => {
                    setEndDate(val ? val.format('YYYY-MM-DD') : '');
                    setAvailabilityResult(null);
                  }}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'medium',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
                        },
                      },
                    },
                  }}
                />
              </Grid>

              {/* Receive Time */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="medium">
                  <InputLabel id="receive-time-label">Giờ nhận</InputLabel>
                  <Select
                    labelId="receive-time-label"
                    value={receiveTime}
                    label="Giờ nhận"
                    onChange={(e) => setReceiveTime(e.target.value)}
                    startAdornment={
                      <AccessTimeIcon sx={{ fontSize: 20, color: '#888888', mr: 1 }} />
                    }
                    sx={{ borderRadius: '4px' }}
                  >
                    {TIME_SLOTS.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Return Time */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="medium">
                  <InputLabel id="return-time-label">Giờ trả</InputLabel>
                  <Select
                    labelId="return-time-label"
                    value={returnTime}
                    label="Giờ trả"
                    onChange={(e) => setReturnTime(e.target.value)}
                    startAdornment={
                      <AccessTimeIcon sx={{ fontSize: 20, color: '#888888', mr: 1 }} />
                    }
                    sx={{ borderRadius: '4px' }}
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

            {/* Live Availability Notification */}
            {productSlug && startDate && endDate && (
              <div className="mt-5">
                {!availabilityResult ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCheckAvailability}
                    disabled={isChecking}
                    startIcon={
                      isChecking ? (
                        <CircularProgress size={14} color="inherit" />
                      ) : (
                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                      )
                    }
                    sx={{
                      color: '#111111',
                      borderColor: '#cccccc',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {isChecking ? 'Đang kiểm tra kho...' : 'Kiểm tra tồn kho thời gian này'}
                  </Button>
                ) : (
                  <Alert
                    severity={availabilityResult.available > 0 ? 'success' : 'warning'}
                    sx={{
                      borderRadius: '4px',
                      '& .MuiAlert-message': { fontWeight: 600, fontSize: '0.85rem' },
                    }}
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={handleCheckAvailability}
                        sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                      >
                        Kiểm tra lại
                      </Button>
                    }
                  >
                    {availabilityResult.message}
                  </Alert>
                )}
              </div>
            )}

            {/* Action Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#f0f0f0]">
              <p className="text-xs text-[#888888]">
                * Giờ làm việc: 08:30 – 21:00 hàng ngày (kể cả Thứ 7 & Chủ Nhật)
              </p>

              <Button
                variant="contained"
                size="large"
                fullWidth={false}
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  minWidth: { xs: '100%', sm: '240px' },
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: '#2a2a2a',
                  },
                }}
              >
                Tìm kiếm thiết bị
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
