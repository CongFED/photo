'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  TextField,
  Button,
  Avatar,
  Chip,
  Divider,
  Alert,
  InputAdornment,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import AuthModal from '@/components/auth/AuthModal';

export default function AccountPage() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    idNumber: '',
    birthDate: '',
    address: '',
    socialContact: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
        idNumber: user.idNumber || '',
        birthDate: user.birthDate || '',
        address: user.address || '',
        socialContact: user.socialContact || '',
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSuccessMsg('Đã lưu cập nhật thông tin tài khoản thành công!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#fafaf8] py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <PersonOutlinedIcon sx={{ fontSize: 64, color: '#cccccc', mb: 2 }} />
          <h1 className="text-xl font-bold uppercase text-[#111111]">Tài khoản cá nhân</h1>
          <p className="text-xs text-[#666666] mt-2 mb-6">
            Vui lòng đăng nhập để xem thông tin cá nhân, định danh CCCD và lịch sử đơn thuê thiết bị.
          </p>
          <Button
            variant="contained"
            onClick={() => setAuthModalOpen(true)}
            sx={{
              backgroundColor: '#111111',
              color: '#ffffff !important',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '4px',
              px: 4,
            }}
          >
            Đăng nhập ngay
          </Button>
          <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors"
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            Quay lại kho máy
          </Link>

          <Link
            href="/account/history"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline"
          >
            <HistoryOutlinedIcon sx={{ fontSize: 16 }} />
            Xem lịch sử thuê máy →
          </Link>
        </div>

        {/* User Profile Overview */}
        <Card
          sx={{
            p: 4,
            mb: 4,
            borderRadius: '10px',
            border: '1px solid #e8e8e4',
            backgroundColor: '#ffffff',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: user.role === 'admin' ? '#111111' : '#2563eb',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                }}
              >
                {user.fullName.charAt(0)}
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-[#111111]">{user.fullName}</h1>
                  <Chip
                    label={user.role === 'admin' ? 'Quản trị viên' : `Hạng ${user.membershipTier.toUpperCase()}`}
                    size="small"
                    sx={{
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      backgroundColor: '#111111',
                      color: '#ffffff',
                    }}
                  />
                </div>
                <p className="text-xs text-[#666666] mt-0.5">{user.email}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-[#1a7a2e] font-semibold">
                  <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
                  <span>Tài khoản đã xác minh định danh</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-3 sm:pt-0 sm:border-l border-[#e5e5e0] sm:pl-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888] block">
                  Tổng đơn thuê
                </span>
                <span className="text-lg font-black text-[#111111]">{user.totalRentals} đơn</span>
              </div>
              <div className="border-l border-[#e5e5e0] pl-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888] block">
                  Tổng chi tiêu
                </span>
                <span className="text-lg font-black text-[#1a7a2e]">
                  {formatCurrency(user.totalSpent)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Edit Form */}
        <Card
          sx={{
            p: 4,
            borderRadius: '10px',
            border: '1px solid #e8e8e4',
            backgroundColor: '#ffffff',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold uppercase tracking-tight text-[#111111]">
                Thông tin cá nhân & Định danh người thuê
              </h2>
              <p className="text-xs text-[#666666] mt-0.5">
                Thông tin được tự động áp dụng vào hợp đồng thuê máy khi bạn đặt lịch.
              </p>
            </div>
          </div>

          {successMsg && (
            <Alert severity="success" sx={{ mb: 3, fontSize: '0.8125rem' }}>
              {successMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Địa chỉ Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Số CCCD / Hộ chiếu"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
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
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="Ngày sinh"
                  value={formData.birthDate ? dayjs(formData.birthDate) : null}
                  onChange={(val) =>
                    setFormData({ ...formData, birthDate: val ? val.format('YYYY-MM-DD') : '' })
                  }
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      slotProps: { inputLabel: { shrink: true } },
                      sx: {
                        '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' },
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Link Facebook hoặc SĐT Zalo"
                  value={formData.socialContact}
                  onChange={(e) => setFormData({ ...formData, socialContact: e.target.value })}
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
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Địa chỉ thường trú / tạm trú"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' } }}
                />
              </Grid>
            </Grid>

            <div className="mt-6 p-3 rounded bg-[#f8f8f6] border border-[#e5e5e0] flex items-center gap-3">
              <ShieldOutlinedIcon sx={{ color: '#1a7a2e', fontSize: 20 }} />
              <p className="text-[11px] text-[#666666]">
                Dữ liệu được lưu trữ mã hóa và đối chiếu trong biên bản nhận thiết bị. Cửa hàng không giữ lại bản gốc giấy tờ của khách.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#f0f0ed]">
              <Button
                variant="text"
                onClick={logout}
                sx={{ color: '#dc2626', textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem' }}
              >
                Đăng xuất tài khoản
              </Button>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#111111',
                  color: '#ffffff !important',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '6px',
                  px: 4,
                  py: 1,
                  '&:hover': { backgroundColor: '#333333' },
                }}
              >
                Lưu thay đổi thông tin
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
