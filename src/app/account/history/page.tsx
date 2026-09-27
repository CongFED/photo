'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Card,
  Tabs,
  Tab,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  InputAdornment,
  Avatar,
  Alert,
} from '@mui/material';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { getUserBookings, cancelBooking } from '@/services/mockBookingService';
import { Booking, BookingStatus } from '@/types/booking';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import AuthModal from '@/components/auth/AuthModal';

const statusConfig: Record<BookingStatus, { label: string; bg: string; color: string; border: string }> = {
  PENDING: { label: 'Chờ duyệt', bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
  CONFIRMED: { label: 'Đã xác nhận', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
  READY: { label: 'Sẵn sàng giao', bg: '#ede9fe', color: '#6d28d9', border: '#ddd6fe' },
  PICKED_UP: { label: 'Đang thuê máy', bg: '#fce7f3', color: '#be185d', border: '#fbcfe8' },
  RETURNED: { label: 'Đã trả máy', bg: '#fef9c3', color: '#854d0e', border: '#fef08a' },
  COMPLETED: { label: 'Đã hoàn tất', bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
};

export default function OrderHistoryPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addItem, updateDates } = useBooking();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    const data = await getUserBookings(user?.email, user?.phone);
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancel = async (id: string, code: string) => {
    if (confirm(`Bạn có chắc chắn muốn hủy yêu cầu đặt lịch thuê mã ${code}?`)) {
      await cancelBooking(id);
      setActionNotice(`Đã hủy thành công yêu cầu thuê mã ${code}`);
      fetchBookings();
      if (selectedBooking?.id === id) {
        setDetailModalOpen(false);
      }
    }
  };

  const handleRebook = (booking: Booking) => {
    booking.items.forEach((item) => {
      addItem(item);
    });
    if (booking.startDate && booking.endDate) {
      updateDates(booking.startDate, booking.endDate);
    }
    router.push('/booking');
  };

  const filteredBookings = bookings.filter((b) => {
    // Status filter
    if (statusFilter === 'PENDING' && b.status !== 'PENDING') return false;
    if (statusFilter === 'ACTIVE' && b.status !== 'CONFIRMED' && b.status !== 'READY' && b.status !== 'PICKED_UP')
      return false;
    if (statusFilter === 'COMPLETED' && b.status !== 'COMPLETED' && b.status !== 'RETURNED') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCode = b.code.toLowerCase().includes(q);
      const matchItem = b.items.some((i) => i.productName.toLowerCase().includes(q));
      return matchCode || matchItem;
    }
    return true;
  });

  return (
    <div className="bg-[#fafaf8] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            Quay lại kho thiết bị
          </Link>

          <Button
            variant="text"
            size="small"
            onClick={fetchBookings}
            startIcon={<RefreshOutlinedIcon sx={{ fontSize: 16 }} />}
            sx={{ textTransform: 'none', color: '#666666', fontSize: '0.75rem' }}
          >
            Làm mới danh sách
          </Button>
        </div>

        {/* User Summary Card */}
        {isAuthenticated && user ? (
          <Card
            sx={{
              p: { xs: 3, md: 4 },
              mb: 5,
              borderRadius: '10px',
              border: '1px solid #e8e8e4',
              backgroundColor: '#ffffff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: user.role === 'admin' ? '#111111' : '#2563eb',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                  }}
                >
                  {user.fullName.charAt(0)}
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-[#111111]">{user.fullName}</h1>
                    <Chip
                      label={user.role === 'admin' ? 'Quản trị viên' : `VIP ${user.membershipTier.toUpperCase()}`}
                      size="small"
                      sx={{
                        fontSize: '0.625rem',
                        fontWeight: 800,
                        backgroundColor: '#111111',
                        color: '#ffffff',
                        height: 22,
                      }}
                    />
                  </div>
                  <p className="text-xs text-[#666666] mt-0.5">
                    {user.email} • {user.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-[#e5e5e0] pt-3 sm:pt-0 sm:pl-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#888888] block">
                    Đơn đã đặt
                  </span>
                  <span className="text-xl font-black text-[#111111]">{bookings.length} đơn</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#888888] block">
                    Chi tiêu tích lũy
                  </span>
                  <span className="text-xl font-black text-[#1a7a2e]">
                    {formatCurrency(bookings.reduce((sum, b) => sum + b.pricing.total, 0))}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card
            sx={{
              p: 3,
              mb: 5,
              borderRadius: '8px',
              border: '1px solid #e5e5e0',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h2 className="text-sm font-bold text-[#111111]">Bạn đang xem lịch sử ở chế độ Khách (Demo)</h2>
              <p className="text-xs text-[#666666] mt-0.5">
                Đăng nhập tài khoản để quản lý đơn cá nhân, lưu hồ sơ CCCD và nhận ưu đãi giảm 10% cho khách quen.
              </p>
            </div>
            <Button
              variant="contained"
              size="small"
              onClick={() => setAuthModalOpen(true)}
              sx={{
                backgroundColor: '#111111',
                color: '#ffffff !important',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.75rem',
                borderRadius: '4px',
              }}
            >
              Đăng nhập ngay
            </Button>
          </Card>
        )}

        {actionNotice && (
          <Alert
            severity="info"
            onClose={() => setActionNotice(null)}
            sx={{ mb: 3, fontSize: '0.8125rem' }}
          >
            {actionNotice}
          </Alert>
        )}

        {/* Page Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#111111]">
              Lịch sử thuê sản phẩm
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Theo dõi tình trạng đơn đặt lịch, thời gian nhận máy và biên bản bàn giao thiết bị.
            </p>
          </div>

          <div className="w-full md:w-80">
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo mã đơn hoặc tên máy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: '#888888' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                },
              }}
            />
          </div>
        </div>

        {/* Tabs Filter */}
        <Card sx={{ border: '1px solid #e5e5e0', borderRadius: '8px', mb: 4, backgroundColor: '#ffffff' }}>
          <Tabs
            value={statusFilter}
            onChange={(_, val) => setStatusFilter(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              '& .MuiTabs-indicator': { backgroundColor: '#111111', height: 2 },
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.8125rem',
                textTransform: 'none',
                minHeight: 48,
                color: '#666666',
                '&.Mui-selected': { color: '#111111' },
              },
            }}
          >
            <Tab label={`Tất cả (${bookings.length})`} value="ALL" />
            <Tab
              label={`Chờ duyệt (${bookings.filter((b) => b.status === 'PENDING').length})`}
              value="PENDING"
            />
            <Tab
              label={`Đang hoạt động (${
                bookings.filter((b) => ['CONFIRMED', 'READY', 'PICKED_UP'].includes(b.status)).length
              })`}
              value="ACTIVE"
            />
            <Tab
              label={`Đã hoàn tất (${
                bookings.filter((b) => ['COMPLETED', 'RETURNED'].includes(b.status)).length
              })`}
              value="COMPLETED"
            />
          </Tabs>
        </Card>

        {/* Bookings List */}
        {loading ? (
          <div className="py-20 text-center text-[#888888] text-sm">Đang tải lịch sử thuê...</div>
        ) : filteredBookings.length === 0 ? (
          <Card
            sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: '8px',
              border: '1px solid #e5e5e0',
              backgroundColor: '#ffffff',
            }}
          >
            <CameraAltOutlinedIcon sx={{ fontSize: 48, color: '#cccccc', mb: 1 }} />
            <h3 className="text-base font-bold text-[#111111] uppercase">Không có đơn thuê nào</h3>
            <p className="text-xs text-[#666666] mt-1 max-w-sm mx-auto">
              Chưa có đơn thuê máy ảnh nào khớp với bộ lọc hiện tại. Hãy đặt thuê ngay các dòng máy ảnh cao cấp để bắt đầu tác nghiệp.
            </p>
            <Button
              component={Link}
              href="/products"
              variant="contained"
              size="small"
              sx={{
                mt: 3,
                backgroundColor: '#111111',
                color: '#ffffff !important',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '4px',
              }}
            >
              Khám phá kho thiết bị
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.PENDING;
              return (
                <Card
                  key={booking.id}
                  sx={{
                    p: { xs: 2.5, sm: 3.5 },
                    borderRadius: '8px',
                    border: '1px solid #e5e5e0',
                    backgroundColor: '#ffffff',
                    transition: 'box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                      borderColor: '#d0d0cc',
                    },
                  }}
                >
                  {/* Card Header: Code, Date & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f0f0ed]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-[#111111] tracking-wider">
                        {booking.code}
                      </span>
                      <span className="text-[11px] text-[#888888]">
                        Đặt ngày {formatDate(booking.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{
                          backgroundColor: status.bg,
                          color: status.color,
                          border: `1px solid ${status.border}`,
                          fontWeight: 700,
                          fontSize: '0.6875rem',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Rental Timeline Bar */}
                  <div className="my-3 py-2 px-3 rounded bg-[#fcfcfb] border border-[#f0f0eb] flex flex-wrap items-center justify-between text-xs text-[#555555]">
                    <div className="flex items-center gap-2">
                      <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: '#888888' }} />
                      <span>
                        Nhận: <strong>{formatDate(booking.startDate)}</strong> ({booking.receiveTime})
                      </span>
                      <span className="text-[#cccccc]">→</span>
                      <span>
                        Trả: <strong>{formatDate(booking.endDate)}</strong> ({booking.returnTime})
                      </span>
                    </div>
                    <span className="font-bold text-[#111111]">
                      Thời gian: {booking.pricing.rentalDays} ngày tác nghiệp
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-[#f5f5f2] my-2">
                    {booking.items.map((item) => (
                      <div key={item.productId} className="py-2.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded bg-[#f0f0ee] overflow-hidden flex-shrink-0">
                            {item.productImage ? (
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-[#999999]">
                                📷
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#111111]">{item.productName}</p>
                            <p className="text-[11px] text-[#777777]">
                              Số lượng: {item.quantity} • {formatCurrency(item.pricePerDay)}/ngày
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-[#111111]">
                            {formatCurrency(item.pricePerDay * item.quantity * booking.pricing.rentalDays)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer: Financial Summary & Action Buttons */}
                  <div className="pt-3 border-t border-[#f0f0ed] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-[#888888] block text-[10px] uppercase font-bold">
                          Tổng tiền thuê
                        </span>
                        <span className="text-sm font-black text-[#111111]">
                          {formatCurrency(booking.pricing.total)}
                        </span>
                      </div>
                      <div className="border-l border-[#e5e5e0] pl-4">
                        <span className="text-[#888888] block text-[10px] uppercase font-bold">
                          Tiền cọc gốc
                        </span>
                        <span className="text-xs font-semibold text-[#555555]">
                          {formatCurrency(booking.pricing.deposit)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setDetailModalOpen(true);
                        }}
                        startIcon={<ReceiptLongOutlinedIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          borderColor: '#d1d5db',
                          color: '#111111 !important',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textTransform: 'none',
                          borderRadius: '4px',
                          '&:hover': { borderColor: '#111111', backgroundColor: '#f9f9f8' },
                        }}
                      >
                        Chi tiết biên bản
                      </Button>

                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleRebook(booking)}
                        startIcon={<CameraAltOutlinedIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          borderColor: '#111111',
                          color: '#111111 !important',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textTransform: 'none',
                          borderRadius: '4px',
                          '&:hover': { backgroundColor: '#111111', color: '#ffffff !important' },
                        }}
                      >
                        Thuê lại
                      </Button>

                      {booking.status === 'PENDING' && (
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleCancel(booking.id, booking.code)}
                          sx={{
                            color: '#dc2626',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'none',
                          }}
                        >
                          Hủy yêu cầu
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Detailed Contract & Handover Modal */}
        <Dialog
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          maxWidth="sm"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: '10px', p: 1 } } }}
        >
          {selectedBooking && (
            <>
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[#f0f0f0]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#888888]">
                    Hợp đồng bàn giao thiết bị
                  </span>
                  <h3 className="text-base font-black text-[#111111] uppercase">
                    Đơn hàng #{selectedBooking.code}
                  </h3>
                </div>
                <IconButton size="small" onClick={() => setDetailModalOpen(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>

              <DialogContent sx={{ px: 3, py: 2.5 }}>
                {/* Status Callout */}
                <div
                  className="p-3 rounded-md mb-4 flex items-center justify-between text-xs"
                  style={{
                    backgroundColor: statusConfig[selectedBooking.status].bg,
                    border: `1px solid ${statusConfig[selectedBooking.status].border}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <ShieldOutlinedIcon sx={{ fontSize: 18, color: statusConfig[selectedBooking.status].color }} />
                    <span style={{ color: statusConfig[selectedBooking.status].color, fontWeight: 700 }}>
                      Trạng thái: {statusConfig[selectedBooking.status].label}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#666666]">
                    Tạo ngày: {formatDate(selectedBooking.createdAt)}
                  </span>
                </div>

                {/* Customer Information */}
                <div className="mb-4 bg-[#fcfcfb] p-3 rounded border border-[#f0f0ec]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888] block mb-2">
                    Thông tin người nhận máy
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#888888] block text-[11px]">Họ tên:</span>
                      <strong className="text-[#111111]">{selectedBooking.customer.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-[#888888] block text-[11px]">Số điện thoại:</span>
                      <strong className="text-[#111111]">{selectedBooking.customer.phone}</strong>
                    </div>
                    <div>
                      <span className="text-[#888888] block text-[11px]">Email:</span>
                      <span className="text-[#333333]">{selectedBooking.customer.email}</span>
                    </div>
                    <div>
                      <span className="text-[#888888] block text-[11px]">Số CCCD:</span>
                      <span className="text-[#333333]">{selectedBooking.customer.idNumber || 'Đối chiếu khi nhận'}</span>
                    </div>
                    {selectedBooking.customer.address && (
                      <div className="col-span-2">
                        <span className="text-[#888888] block text-[11px]">Địa chỉ cư trú:</span>
                        <span className="text-[#333333]">{selectedBooking.customer.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rental Details */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888] block mb-2">
                    Thời gian & Địa điểm thuê
                  </span>
                  <div className="p-3 rounded border border-[#f0f0ec] text-xs space-y-1.5">
                    <p>
                      <strong>Nhận thiết bị:</strong> {formatDate(selectedBooking.startDate)} ({selectedBooking.receiveTime}) tại cửa hàng Thuê Camera
                    </p>
                    <p>
                      <strong>Trả thiết bị:</strong> {formatDate(selectedBooking.endDate)} ({selectedBooking.returnTime})
                    </p>
                    <p>
                      <strong>Thời gian tác nghiệp:</strong> {selectedBooking.pricing.rentalDays} ngày
                    </p>
                    {selectedBooking.customer.usageLocation && (
                      <p>
                        <strong>Địa điểm chụp dự kiến:</strong> {selectedBooking.customer.usageLocation}
                      </p>
                    )}
                    {selectedBooking.customer.notes && (
                      <p>
                        <strong>Ghi chú đơn hàng:</strong> {selectedBooking.customer.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Items & Pricing */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888] block mb-2">
                    Danh sách thiết bị & Niêm phong
                  </span>
                  <div className="divide-y divide-[#eeeeee] border border-[#f0f0ec] rounded p-2">
                    {selectedBooking.items.map((item) => (
                      <div key={item.productId} className="py-2 flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-[#111111]">{item.productName}</strong>
                          <span className="text-[#888888] block text-[11px]">
                            Tem niêm phong cảm biến: OK • Bao đựng + Sạc + 2 Pin
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#111111]">
                            {formatCurrency(item.pricePerDay * item.quantity * selectedBooking.pricing.rentalDays)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Totals */}
                <div className="p-3 bg-[#f8f8f6] rounded border border-[#e8e8e4] text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Tiền thuê thiết bị:</span>
                    <span className="font-semibold">{formatCurrency(selectedBooking.pricing.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666666]">Tiền cọc gốc giữ chỗ:</span>
                    <span className="font-semibold">{formatCurrency(selectedBooking.pricing.deposit)}</span>
                  </div>
                  <Divider sx={{ my: 1 }} />
                  <div className="flex justify-between text-sm">
                    <strong className="text-[#111111]">Tổng thanh toán:</strong>
                    <strong className="text-[#111111] text-base">{formatCurrency(selectedBooking.pricing.total)}</strong>
                  </div>
                </div>
              </DialogContent>

              <DialogActions sx={{ p: 2, borderTop: '1px solid #f0f0f0' }}>
                {selectedBooking.status === 'PENDING' && (
                  <Button
                    onClick={() => handleCancel(selectedBooking.id, selectedBooking.code)}
                    sx={{ color: '#dc2626', textTransform: 'none', fontWeight: 600, mr: 'auto' }}
                  >
                    Hủy yêu cầu này
                  </Button>
                )}
                <Button
                  onClick={() => setDetailModalOpen(false)}
                  sx={{ color: '#666666', textTransform: 'none' }}
                >
                  Đóng
                </Button>
                <Button
                  variant="contained"
                  onClick={() => alert(`Đã tải xuống file biên bản bàn giao điện tử cho đơn #${selectedBooking.code}`)}
                  sx={{
                    backgroundColor: '#111111',
                    color: '#ffffff !important',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Xuất biên nhận PDF
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Auth Modal for guest */}
        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={fetchBookings}
        />
      </div>
    </div>
  );
}
