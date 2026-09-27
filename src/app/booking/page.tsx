'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import {
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { formatCurrency } from '@/lib/utils';
import { calculateRentalPrice } from '@/lib/pricing';
import { formatDate } from '@/lib/date';
import { createBooking } from '@/services/mockBookingService';
import { RentalPurpose } from '@/types/booking';

const purposeOptions: { value: RentalPurpose; label: string }[] = [
  { value: 'personal', label: 'Chụp ảnh cá nhân / Street photography' },
  { value: 'wedding', label: 'Quay chụp Tiệc cưới / Pre-wedding' },
  { value: 'event', label: 'Sự kiện / Hội nghị / Teambuilding' },
  { value: 'travel', label: 'Du lịch / Phượt / Khám phá' },
  { value: 'commercial', label: 'Quảng cáo thương mại / Lookbook' },
  { value: 'studio', label: 'Studio chụp mẫu chuyên nghiệp' },
  { value: 'other', label: 'Mục đích khác' },
];

export default function BookingPage() {
  const router = useRouter();
  const {
    items,
    startDate,
    endDate,
    receiveTime,
    returnTime,
    removeItem,
    updateCustomerInfo,
    setLastBookingCode,
    clearBooking,
    customerInfo,
  } = useBooking();

  const { user, isAuthenticated, updateProfile } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: (customerInfo.fullName as string) || user?.fullName || '',
    phone: (customerInfo.phone as string) || user?.phone || '',
    email: (customerInfo.email as string) || user?.email || '',
    birthDate: (customerInfo.birthDate as string) || user?.birthDate || '',
    idNumber: (customerInfo.idNumber as string) || user?.idNumber || '',
    address: (customerInfo.address as string) || user?.address || '',
    socialContact: (customerInfo.socialContact as string) || user?.socialContact || '',
    purpose: (customerInfo.purpose as RentalPurpose) || 'personal',
    usageLocation: (customerInfo.usageLocation as string) || '',
    notes: (customerInfo.notes as string) || '',
    agreedToPolicy: false,
  });

  // Auto-populate when user logs in or switches account
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
        idNumber: prev.idNumber || user.idNumber || '',
        birthDate: prev.birthDate || user.birthDate || '',
        address: prev.address || user.address || '',
        socialContact: prev.socialContact || user.socialContact || '',
      }));
    }
  }, [user]);

  const totalPricePerDay = items.reduce((sum, item) => sum + item.pricePerDay * item.quantity, 0);
  const totalDeposit = items.reduce((sum, item) => sum + item.deposit * item.quantity, 0);
  const pricing =
    startDate && endDate ? calculateRentalPrice(totalPricePerDay, startDate, endDate, totalDeposit) : null;

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^0\d{9}$/.test(formData.phone.trim())) newErrors.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập địa chỉ email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = 'Email không hợp lệ';
    if (!formData.agreedToPolicy) newErrors.agreedToPolicy = 'Vui lòng xác nhận đồng ý với chính sách thuê thiết bị';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !pricing) return;
    setIsSubmitting(true);
    updateCustomerInfo({
      ...formData,
      agreedToPolicy: true,
    });
    const booking = await createBooking(
      items,
      startDate,
      endDate,
      receiveTime,
      returnTime,
      { ...formData, agreedToPolicy: true },
      pricing
    );
    if (user) {
      updateProfile({
        totalRentals: (user.totalRentals || 0) + 1,
        totalSpent: (user.totalSpent || 0) + pricing.total,
      });
    }
    setLastBookingCode(booking.code);
    clearBooking();
    router.push('/booking/success?code=' + booking.code);
  };

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="max-w-md mx-auto px-4">
          <ShoppingBagOutlinedIcon sx={{ fontSize: 64, color: '#cccccc', mb: 2 }} />
          <h1 className="text-2xl font-bold uppercase text-[#111111]">Giỏ thuê đang trống</h1>
          <p className="mt-2 text-sm text-[#666666]">
            Bạn chưa chọn thiết bị nào. Hãy khám phá các dòng máy ảnh, lens và phụ kiện để bắt đầu đặt lịch.
          </p>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            size="large"
            sx={{
              mt: 4,
              backgroundColor: '#111111',
              color: '#ffffff !important',
              borderRadius: '4px',
              fontWeight: 700,
              textTransform: 'none',
            }}
          >
            Khám phá thiết bị ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16 bg-[#fbfbfa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <span>Tiếp tục chọn thiết bị</span>
          </Link>
        </div>

        {/* Stepper Progress */}
        <div className="mb-10 max-w-2xl mx-auto">
          <Stepper activeStep={1} alternativeLabel>
            {['Chọn thiết bị', 'Thông tin đặt lịch', 'Xác nhận & Nhận mã'].map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    },
                    '& .Mui-active': { color: '#111111 !important' },
                    '& .Mui-completed': { color: '#1a7a2e !important' },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT — Customer Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Selected Items List */}
            <Card sx={{ border: '1px solid #e5e5e5', borderRadius: '8px', p: 3, backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div className="flex items-center justify-between pb-3 border-b border-[#e5e5e5]">
                <div className="flex items-center gap-2">
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: '#111111' }} />
                  <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
                    Thiết bị đã chọn ({items.length})
                  </h2>
                </div>
                <Link href="/products" className="text-xs font-bold text-[#111111] hover:underline">
                  + Thêm thiết bị khác
                </Link>
              </div>

              <div className="divide-y divide-[#f0f0f0]">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between py-3.5 gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-14 h-14 bg-[#fbfbfa] rounded-md border border-[#e5e5e5] flex items-center justify-center shrink-0 overflow-hidden">
                        {item.productImage ? (
                          <Image src={item.productImage} alt={item.productName} fill className="object-contain p-1.5" sizes="60px" />
                        ) : (
                          <ShoppingBagOutlinedIcon sx={{ fontSize: 20, color: '#999999' }} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#111111] truncate">{item.productName}</p>
                        <p className="text-xs text-[#666666] mt-0.5">
                          {formatCurrency(item.pricePerDay)} / ngày · Cọc: {formatCurrency(item.deposit)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Chip label={`x${item.quantity}`} size="small" sx={{ fontWeight: 700, borderRadius: '4px', backgroundColor: '#f0f0ed' }} />
                      <IconButton size="small" onClick={() => removeItem(item.productId)} sx={{ color: '#dc2626' }}>
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Account Status Banner */}
            {isAuthenticated && user ? (
              <div className="p-3.5 rounded-lg border border-[#dcfce7] bg-[#f0fdf4] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircleOutlinedIcon sx={{ fontSize: 20, color: '#16a34a' }} />
                  <div>
                    <p className="text-xs font-bold text-[#166534]">
                      Đang đặt thuê với tài khoản: {user.fullName} ({user.email})
                    </p>
                    <p className="text-[11px] text-[#15803d]">
                      Thông tin cá nhân & định danh CCCD đã được tự động điền từ hồ sơ của bạn.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#166534] text-white">
                  {user.role === 'admin' ? 'Admin' : `VIP ${user.membershipTier.toUpperCase()}`}
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg border border-[#e5e5e0] bg-[#fafaf8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <PersonOutlinedIcon sx={{ fontSize: 20, color: '#666666' }} />
                  <div>
                    <p className="text-xs font-bold text-[#111111]">Bạn đã có tài khoản Thuê Camera?</p>
                    <p className="text-[11px] text-[#666666]">
                      Đăng nhập để tự động điền thông tin và tích lũy chi tiêu nhận ưu đãi.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setAuthModalOpen(true)}
                  sx={{
                    borderColor: '#111111',
                    color: '#111111 !important',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Đăng nhập nhanh
                </Button>
              </div>
            )}

            {/* Section 1: Contact Information */}
            <Card sx={{ border: '1px solid #e5e5e5', borderRadius: '8px', p: { xs: 3, sm: 4 }, backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[11px] font-bold flex items-center justify-center">1</span>
                <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
                  Thông tin liên hệ & người nhận máy
                </h2>
              </div>
              <p className="text-xs text-[#666666] mb-5 ml-7">
                Cửa hàng sẽ liên hệ xác nhận và gửi thông tin hợp đồng điện tử qua số này.
              </p>

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Họ và tên người thuê"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    error={Boolean(errors.fullName)}
                    helperText={errors.fullName}
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlinedIcon sx={{ fontSize: 19, color: '#888888' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fcfcfb',
                        borderRadius: '6px',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="Số điện thoại di động"
                    placeholder="0909123456"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone}
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIphoneOutlinedIcon sx={{ fontSize: 19, color: '#888888' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fcfcfb',
                        borderRadius: '6px',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    required
                    label="Địa chỉ Email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon sx={{ fontSize: 19, color: '#888888' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fcfcfb',
                        borderRadius: '6px',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Section 2: Identification */}
            <Card sx={{ border: '1px solid #e5e5e5', borderRadius: '8px', p: { xs: 3, sm: 4 }, backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[11px] font-bold flex items-center justify-center">2</span>
                <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
                  Xác thực & Định danh người thuê
                </h2>
              </div>
              <p className="text-xs text-[#666666] mb-5 ml-7">
                Dùng đối chiếu nhanh khi giao nhận thiết bị. Không giữ lại bản gốc giấy tờ.
              </p>

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Số CCCD / Hộ chiếu"
                    placeholder="079..."
                    value={formData.idNumber}
                    onChange={(e) => handleChange('idNumber', e.target.value)}
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeOutlinedIcon sx={{ fontSize: 19, color: '#888888' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fcfcfb',
                        borderRadius: '6px',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label="Ngày sinh"
                    value={formData.birthDate ? dayjs(formData.birthDate) : null}
                    onChange={(val) => handleChange('birthDate', val ? val.format('YYYY-MM-DD') : '')}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'medium',
                        slotProps: { inputLabel: { shrink: true } },
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fcfcfb',
                            borderRadius: '6px',
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Link Facebook hoặc SĐT Zalo"
                    placeholder="fb.com/username hoặc số Zalo chính chủ"
                    value={formData.socialContact}
                    onChange={(e) => handleChange('socialContact', e.target.value)}
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <ShareOutlinedIcon sx={{ fontSize: 19, color: '#888888' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fcfcfb',
                        borderRadius: '6px',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Section 3: Usage details & Address */}
            <Card sx={{ border: '1px solid #e5e5e5', borderRadius: '8px', p: { xs: 3, sm: 4 }, backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[11px] font-bold flex items-center justify-center">3</span>
                <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
                  Nhu cầu thuê & Địa điểm sử dụng
                </h2>
              </div>
              <p className="text-xs text-[#666666] mb-5 ml-7">
                Giúp kỹ thuật viên chuẩn bị sẵn lens, thẻ nhớ và phụ kiện phù hợp nhất cho dự án của bạn.
              </p>

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Địa chỉ cư trú hiện tại"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeOutlinedIcon sx={{ fontSize: 19, color: '#888888' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fcfcfb',
                        borderRadius: '6px',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="medium">
                    <InputLabel id="purpose-label">Mục đích sử dụng thiết bị</InputLabel>
                    <Select
                      labelId="purpose-label"
                      value={formData.purpose}
                      label="Mục đích sử dụng thiết bị"
                      onChange={(e) => handleChange('purpose', e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <CameraAltOutlinedIcon sx={{ fontSize: 19, color: '#888888', mr: 1 }} />
                        </InputAdornment>
                      }
                      sx={{
                        backgroundColor: '#fcfcfb',
                        borderRadius: '6px',
                      }}
                    >
                      {purposeOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Địa điểm sử dụng dự kiến"
                    placeholder="TP.HCM, Đà Lạt, Phú Quốc, Studio..."
                    value={formData.usageLocation}
                    onChange={(e) => handleChange('usageLocation', e.target.value)}
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PlaceOutlinedIcon sx={{ fontSize: 19, color: '#888888' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fcfcfb',
                        borderRadius: '6px',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Ghi chú thêm cho cửa hàng (nếu có)"
                    placeholder="Ví dụ: Cần thêm pin phụ NP-FZ100, lấy thêm ngàm chuyển, xuất biên nhận cho công ty..."
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    slotProps={{
                      inputLabel: { shrink: true },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 19, color: '#888888' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fcfcfb',
                        borderRadius: '6px',
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Policy Callout & Checkbox */}
              <div className="mt-6 p-4 rounded-md border border-[#e5e5e0] bg-[#f9f9f7]">
                <div className="flex items-start gap-3 mb-3">
                  <ShieldOutlinedIcon sx={{ fontSize: 20, color: '#1a7a2e', mt: 0.25 }} />
                  <div>
                    <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                      Chính sách bảo mật & Cam kết thiết bị
                    </h4>
                    <p className="text-[11px] text-[#666666] mt-0.5 leading-relaxed">
                      Thông tin cá nhân chỉ dùng cho hợp đồng thuê và được bảo mật tuyệt đối. Thiết bị bàn giao có dán tem niêm phong và biên bản kiểm tra tình trạng cảm biến cùng khách hàng.
                    </p>
                  </div>
                </div>

                <Divider sx={{ my: 1.5, borderColor: '#ecece8' }} />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreedToPolicy}
                      onChange={(e) => handleChange('agreedToPolicy', e.target.checked)}
                      sx={{
                        color: '#666666',
                        '&.Mui-checked': { color: '#111111' },
                      }}
                    />
                  }
                  label={
                    <span className="text-xs font-semibold text-[#222222]">
                      Tôi đồng ý với chính sách thuê, cam kết bảo quản thiết bị đúng cách và chịu trách nhiệm sử dụng đúng quy định pháp luật.
                    </span>
                  }
                />
                {errors.agreedToPolicy && (
                  <p className="text-xs text-[#dc2626] font-semibold mt-1 ml-8">{errors.agreedToPolicy}</p>
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT — Booking Summary Card */}
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
              <h2 className="text-lg font-black uppercase tracking-tight text-[#111111]">
                Tóm tắt đơn đặt lịch
              </h2>

              {/* Rental Duration Details */}
              <div className="mt-4 p-3.5 bg-[#fbfbfa] border border-[#e5e5e5] rounded-md text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#666666]">Nhận thiết bị:</span>
                  <span className="font-bold text-[#111111]">
                    {startDate ? formatDate(startDate) : 'Chưa chọn'} ({receiveTime})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#666666]">Trả thiết bị:</span>
                  <span className="font-bold text-[#111111]">
                    {endDate ? formatDate(endDate) : 'Chưa chọn'} ({returnTime})
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#e5e5e5]">
                  <span className="text-[#666666]">Thời gian thuê:</span>
                  <Chip
                    label={`${pricing?.rentalDays || 1} ngày`}
                    size="small"
                    sx={{ backgroundColor: '#111111', color: '#ffffff', fontWeight: 700, borderRadius: '4px', height: 22 }}
                  />
                </div>
              </div>

              {/* Price Calculations */}
              {pricing && (
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-[#666666]">
                    <span>Tạm tính giá thuê:</span>
                    <span className="font-semibold text-[#111111]">{formatCurrency(pricing.subtotal)}</span>
                  </div>

                  {pricing.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-[#1a7a2e]">
                      <div className="flex items-center gap-1.5">
                        <span>Chiết khấu ({pricing.discountPercent}%):</span>
                        <Chip
                          label={`-${pricing.discountPercent}%`}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            backgroundColor: '#e8f5e9',
                            color: '#1a7a2e',
                          }}
                        />
                      </div>
                      <span className="font-bold">-{formatCurrency(pricing.discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#666666]">
                    <span>Tiền cọc thiết bị:</span>
                    <span className="font-semibold text-[#111111]">{formatCurrency(pricing.deposit)}</span>
                  </div>

                  <Divider sx={{ my: 1.5 }} />

                  <div className="flex justify-between items-baseline pt-1">
                    <div>
                      <span className="text-base font-bold text-[#111111] block">Tổng tiền thuê:</span>
                      <span className="text-[11px] text-[#888888]">* Tiền cọc hoàn trả 100% khi trả máy</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#111111]">
                        {formatCurrency(pricing.total)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Booking Button */}
              <div className="mt-8">
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !pricing}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <CheckCircleOutlinedIcon />
                    )
                  }
                  sx={{
                    backgroundColor: '#111111',
                    color: '#ffffff !important',
                    py: 1.5,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: '#2a2a2a',
                      color: '#ffffff !important',
                    },
                  }}
                >
                  {isSubmitting ? 'Đang tạo mã đặt lịch...' : 'Xác nhận đặt lịch'}
                </Button>

                <div className="mt-4 pt-4 border-t border-[#f0f0f0] space-y-2 text-xs text-[#666666]">
                  <div className="flex items-center gap-2">
                    <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#1a7a2e' }} />
                    <span>Miễn phí hủy lịch trước 12 giờ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#1a7a2e' }} />
                    <span>Hỗ trợ kỹ thuật test máy 1:1 tại chỗ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LockOutlinedIcon sx={{ fontSize: 16, color: '#111111' }} />
                    <span>Tạo mã tức thì · Không cần thẻ tín dụng</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
