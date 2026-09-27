'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import { getBookingByCode } from '@/services/mockBookingService';
import { useBooking } from '@/context/BookingContext';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import { Booking } from '@/types/booking';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const { lastBookingCode } = useBooking();
  const code = searchParams.get('code') || lastBookingCode || 'THC-20261020-A82K';
  const [booking, setBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (code) {
      getBookingByCode(code).then((b) => setBooking(b || null));
    }
  }, [code]);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="py-16 md:py-24 bg-[#ffffff]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[#e8f5e9] flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon sx={{ fontSize: 40, color: '#1a7a2e' }} />
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-[#1a7a2e]">
          Đặt lịch thành công
        </span>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111111] mt-1.5">
          Cảm ơn bạn đã tin tưởng!
        </h1>
        <p className="mt-3 text-sm text-[#666666] max-w-lg mx-auto">
          Đơn đặt lịch thuê thiết bị của bạn đã được ghi nhận trên hệ thống. Kỹ thuật viên sẽ liên hệ xác nhận trong vòng 15 phút.
        </p>

        {/* Booking Code Highlight Card */}
        <Card
          sx={{
            my: 6,
            p: 3.5,
            border: '2px dashed #111111',
            borderRadius: '8px',
            backgroundColor: '#fbfbfa',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888] block text-left">
              Mã đặt lịch của bạn
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-wider text-[#111111]">
              {code}
            </span>
          </div>

          <Tooltip title={copied ? 'Đã sao chép!' : 'Sao chép mã'}>
            <IconButton
              onClick={handleCopy}
              sx={{
                border: '1px solid #d0d0d0',
                borderRadius: '6px',
                p: 1.25,
                backgroundColor: '#ffffff',
                color: copied ? '#1a7a2e' : '#111111',
                '&:hover': { backgroundColor: '#f0f0ee' },
              }}
            >
              {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Card>

        {/* Booking Details Card */}
        {booking && (
          <Card
            sx={{
              maxWidth: 520,
              mx: 'auto',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              p: 3.5,
              textAlign: 'left',
              mb: 6,
            }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#888888] mb-3">
              Thông tin chi tiết đơn thuê:
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#666666]">Khách hàng:</span>
                <span className="font-bold text-[#111111]">{booking.customer.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Số điện thoại:</span>
                <span className="font-bold text-[#111111]">{booking.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Ngày nhận máy:</span>
                <span className="font-bold text-[#111111]">
                  {formatDate(booking.startDate)} ({booking.receiveTime})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Ngày trả máy:</span>
                <span className="font-bold text-[#111111]">
                  {formatDate(booking.endDate)} ({booking.returnTime})
                </span>
              </div>

              <Divider sx={{ my: 1.5 }} />

              <div className="space-y-1">
                {booking.items.map((it) => (
                  <div key={it.productId} className="flex justify-between text-[#555555]">
                    <span>{it.productName} (x{it.quantity})</span>
                    <span>{formatCurrency(it.pricePerDay)}/ngày</span>
                  </div>
                ))}
              </div>

              <Divider sx={{ my: 1.5 }} />

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-bold text-[#111111]">Tổng tiền thuê:</span>
                <span className="text-lg font-black text-[#111111]">
                  {formatCurrency(booking.pricing.total)}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            component={Link}
            href="/booking/lookup"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: '#111111',
              borderRadius: '4px',
              fontWeight: 700,
              px: 3.5,
              py: 1.25,
              '&:hover': { backgroundColor: '#2a2a2a' },
            }}
          >
            Tra cứu đơn đặt lịch
          </Button>

          <Button
            component={Link}
            href="/"
            variant="outlined"
            size="large"
            startIcon={<HomeIcon />}
            sx={{
              borderColor: '#d0d0d0',
              color: '#111111',
              borderRadius: '4px',
              fontWeight: 600,
              px: 3,
              py: 1.25,
              '&:hover': { borderColor: '#111111', backgroundColor: '#fbfbfa' },
            }}
          >
            Trang chủ
          </Button>
        </div>
      </div>

      <Snackbar
        open={copied}
        message="Đã sao chép mã booking vào bộ nhớ tạm!"
        autoHideDuration={2000}
      />
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Đang tải thông tin xác nhận...</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
