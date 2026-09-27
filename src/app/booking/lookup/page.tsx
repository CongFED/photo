'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TagIcon from '@mui/icons-material/Tag';
import { lookupBooking } from '@/services/mockBookingService';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import { Booking, BookingStatus } from '@/types/booking';

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'Đã đặt lịch',
  CONFIRMED: 'Đã xác nhận',
  READY: 'Sẵn sàng nhận máy',
  PICKED_UP: 'Đang thuê',
  RETURNED: 'Đã trả máy',
  COMPLETED: 'Hoàn thành',
};

const statusOrder: BookingStatus[] = ['PENDING', 'CONFIRMED', 'READY', 'PICKED_UP', 'RETURNED', 'COMPLETED'];

export default function BookingLookupPage() {
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<Booking | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!code.trim() || !phone.trim()) {
      setError('Vui lòng nhập cả mã booking và số điện thoại đăng ký');
      return;
    }
    setError('');
    setIsSearching(true);
    setSearched(true);
    const booking = await lookupBooking(code.trim(), phone.trim());
    setResult(booking);
    setIsSearching(false);
  };

  const handleQuickFill = (demoCode: string, demoPhone: string) => {
    setCode(demoCode);
    setPhone(demoPhone);
    setError('');
  };

  const currentStatusIndex = result ? statusOrder.indexOf(result.status) : 0;

  return (
    <div className="py-12 md:py-20 bg-[#ffffff]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-[#666666]">
            Cổng tra cứu trực tuyến
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111111] mt-1.5">
            Tra cứu booking
          </h1>
          <p className="mt-2 text-sm text-[#666666] max-w-md mx-auto">
            Nhập mã đặt lịch và số điện thoại để theo dõi hành trình chuẩn bị thiết bị theo thời gian thực.
          </p>
        </div>

        {/* Search Card */}
        <Card sx={{ border: '1px solid #e5e5e5', borderRadius: '8px', p: { xs: 3, sm: 4 }, mb: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Mã đặt lịch (Booking Code)"
              placeholder="VD: THC-20261020-A82K"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: <TagIcon sx={{ fontSize: 20, color: '#888888', mr: 1 }} />,
                },
              }}
            />

            <TextField
              fullWidth
              label="Số điện thoại người thuê"
              placeholder="VD: 0909123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: <PhoneIphoneIcon sx={{ fontSize: 20, color: '#888888', mr: 1 }} />,
                },
              }}
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSearch}
              disabled={isSearching}
              startIcon={isSearching ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
              sx={{
                backgroundColor: '#111111',
                color: '#ffffff',
                fontWeight: 700,
                letterSpacing: '0.06em',
                py: 1.5,
                borderRadius: '4px',
                '&:hover': { backgroundColor: '#2a2a2a' },
              }}
            >
              {isSearching ? 'Đang tìm kiếm hồ sơ...' : 'Tra cứu lịch đặt'}
            </Button>
          </Box>

          <div className="mt-5 pt-4 border-t border-[#f0f0f0] flex flex-wrap items-center justify-between text-xs text-[#777777] gap-2">
            <span>Mẫu demo khả dụng:</span>
            <div className="flex gap-2">
              <Chip
                label="Mẫu 1: THC-20261020-A82K"
                size="small"
                clickable
                onClick={() => handleQuickFill('THC-20261020-A82K', '0909123456')}
                sx={{ borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}
              />
              <Chip
                label="Mẫu 2: THC-20261020-B34M"
                size="small"
                clickable
                onClick={() => handleQuickFill('THC-20261020-B34M', '0918234567')}
                sx={{ borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}
              />
            </div>
          </div>
        </Card>

        {/* Results Card */}
        {searched && !isSearching && (
          <div>
            {result ? (
              <Card sx={{ border: '1.5px solid #111111', borderRadius: '8px', p: { xs: 3, sm: 5 }, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                {/* Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#e5e5e5]">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#888888]">
                      Mã đặt lịch xác nhận
                    </span>
                    <h2 className="text-2xl font-black text-[#111111] mt-0.5 tracking-wider">
                      {result.code}
                    </h2>
                  </div>

                  <Chip
                    label={statusLabels[result.status]}
                    size="medium"
                    sx={{
                      backgroundColor:
                        result.status === 'COMPLETED'
                          ? '#e8f5e9'
                          : result.status === 'PENDING'
                          ? '#fef3c7'
                          : '#111111',
                      color:
                        result.status === 'COMPLETED'
                          ? '#1a7a2e'
                          : result.status === 'PENDING'
                          ? '#b45309'
                          : '#ffffff',
                      fontWeight: 700,
                      borderRadius: '4px',
                    }}
                  />
                </div>

                {/* Status Stepper Timeline */}
                <div className="my-8">
                  <Stepper activeStep={currentStatusIndex} alternativeLabel>
                    {statusOrder.map((st) => (
                      <Step key={st}>
                        <StepLabel
                          sx={{
                            '& .MuiStepLabel-label': {
                              fontSize: '0.7rem',
                              fontWeight: 700,
                            },
                            '& .Mui-active': { color: '#111111 !important' },
                            '& .Mui-completed': { color: '#1a7a2e !important' },
                          }}
                        >
                          {statusLabels[st]}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </div>

                {/* Details Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#fbfbfa] rounded border border-[#e5e5e5] text-xs">
                  <div>
                    <span className="text-[#888888] block">Người đặt:</span>
                    <span className="font-bold text-[#111111] text-sm">{result.customer.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#888888] block">Số điện thoại:</span>
                    <span className="font-bold text-[#111111] text-sm">{result.customer.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#888888] block">Thời gian thuê:</span>
                    <span className="font-semibold text-[#111111]">
                      {formatDate(result.startDate)} ({result.receiveTime}) → {formatDate(result.endDate)} ({result.returnTime})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#888888] block">Tổng tiền thuê:</span>
                    <span className="font-black text-[#111111] text-sm">
                      {formatCurrency(result.pricing.total)} (Đã cọc: {formatCurrency(result.pricing.deposit)})
                    </span>
                  </div>
                </div>

                {/* Items in Booking */}
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#888888] mb-3">
                    Danh sách thiết bị:
                  </h3>
                  <div className="space-y-2">
                    {result.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between p-3 rounded bg-white border border-[#e5e5e5] text-xs"
                      >
                        <span className="font-bold text-[#111111]">
                          {item.productName} (x{item.quantity})
                        </span>
                        <span className="text-[#666666]">
                          {formatCurrency(item.pricePerDay)}/ngày
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : (
              <Alert severity="warning" sx={{ borderRadius: '6px' }}>
                Không tìm thấy thông tin booking khớp với mã và số điện thoại trên. Vui lòng kiểm tra lại hoặc liên hệ hotline 0909 123 456.
              </Alert>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
