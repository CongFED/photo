'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  Alert,
  Divider,
  InputAdornment,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  onSuccess?: () => void;
}

export default function AuthModal({
  open,
  onClose,
  defaultTab = 'login',
  onSuccess,
}: AuthModalProps) {
  const { login, register, loginAsDemo } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login form
  const [loginEmail, setLoginEmail] = useState('user@camera.vn');
  const [loginPassword, setLoginPassword] = useState('123456');

  // Register form
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regIdNumber, setRegIdNumber] = useState('');

  const handleTabChange = (_: React.SyntheticEvent, newTab: 'login' | 'register') => {
    setTab(newTab);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!loginEmail.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email');
      return;
    }

    setLoading(true);
    const res = await login(loginEmail, loginPassword);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Đăng nhập thành công!');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 500);
    } else {
      setErrorMsg(res.message || 'Đăng nhập không thành công');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regFullName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email');
      return;
    }
    if (!regPhone.trim()) {
      setErrorMsg('Vui lòng nhập số điện thoại');
      return;
    }

    setLoading(true);
    const res = await register({
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
      idNumber: regIdNumber,
    });
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Đăng ký tài khoản thành công! Bạn đã được tự động đăng nhập.');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 700);
    } else {
      setErrorMsg(res.message || 'Đăng ký thất bại');
    }
  };

  const handleQuickLogin = (role: 'customer' | 'admin') => {
    loginAsDemo(role);
    setSuccessMsg(`Đã đăng nhập với vai trò: ${role === 'admin' ? 'Quản Trị Viên (Admin)' : 'Khách Hàng (VIP)'}`);
    setTimeout(() => {
      onClose();
      if (onSuccess) onSuccess();
    }, 400);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '12px',
            p: 1,
            overflow: 'hidden',
          },
        },
      }}
    >
      <div className="flex justify-between items-center px-4 pt-3 pb-1">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#888888]">
            Thuê Camera ID
          </span>
          <h3 className="text-lg font-black uppercase text-[#111111]">
            {tab === 'login' ? 'Đăng nhập hệ thống' : 'Đăng ký tài khoản'}
          </h3>
        </div>
        <IconButton size="small" onClick={onClose} sx={{ color: '#888888' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: '#eeeeee', px: 2 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{
            minHeight: 44,
            '& .MuiTabs-indicator': { backgroundColor: '#111111', height: 2 },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: '#777777',
              '&.Mui-selected': { color: '#111111' },
            },
          }}
        >
          <Tab label="Đăng nhập" value="login" />
          <Tab label="Tạo tài khoản mới" value="register" />
        </Tabs>
      </Box>

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, fontSize: '0.75rem', py: 0.5 }}>
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert
            severity="success"
            icon={<CheckCircleOutlinedIcon fontSize="small" />}
            sx={{ mb: 2, fontSize: '0.75rem', py: 0.5 }}
          >
            {successMsg}
          </Alert>
        )}

        {tab === 'login' ? (
          <Box component="form" onSubmit={handleLoginSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Địa chỉ Email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="user@camera.vn"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ fontSize: 18, color: '#888888' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' } }}
            />

            <TextField
              fullWidth
              size="small"
              label="Mật khẩu"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ fontSize: 18, color: '#888888' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' } }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: '#111111',
                color: '#ffffff !important',
                fontWeight: 700,
                py: 1.2,
                borderRadius: '6px',
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': { backgroundColor: '#333333' },
              }}
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
            </Button>

            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#e5e5e5]" />
                <span className="flex-shrink mx-2 text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
                  Hoặc trải nghiệm nhanh (1 Click)
                </span>
                <div className="flex-grow border-t border-[#e5e5e5]" />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuickLogin('customer')}
                  startIcon={<PersonOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderColor: '#d1d5db',
                    color: '#111111 !important',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    py: 0.8,
                    borderRadius: '6px',
                    '&:hover': { borderColor: '#111111', backgroundColor: '#f9f9f8' },
                  }}
                >
                  Khách Hàng (Demo)
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuickLogin('admin')}
                  startIcon={<AdminPanelSettingsOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderColor: '#111111',
                    color: '#ffffff !important',
                    backgroundColor: '#111111',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    py: 0.8,
                    borderRadius: '6px',
                    '&:hover': { backgroundColor: '#333333' },
                  }}
                >
                  Admin Master
                </Button>
              </div>
            </div>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleRegisterSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              fullWidth
              size="small"
              required
              label="Họ và tên"
              value={regFullName}
              onChange={(e) => setRegFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlinedIcon sx={{ fontSize: 18, color: '#888888' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' } }}
            />

            <TextField
              fullWidth
              size="small"
              required
              label="Địa chỉ Email"
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="email@example.com"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ fontSize: 18, color: '#888888' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' } }}
            />

            <TextField
              fullWidth
              size="small"
              required
              label="Số điện thoại"
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              placeholder="0909123456"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIphoneOutlinedIcon sx={{ fontSize: 18, color: '#888888' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' } }}
            />

            <TextField
              fullWidth
              size="small"
              label="Số CCCD / Hộ chiếu (Tùy chọn)"
              value={regIdNumber}
              onChange={(e) => setRegIdNumber(e.target.value)}
              placeholder="079..."
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon sx={{ fontSize: 18, color: '#888888' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fcfcfb', borderRadius: '6px' } }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 1,
                backgroundColor: '#111111',
                color: '#ffffff !important',
                fontWeight: 700,
                py: 1.2,
                borderRadius: '6px',
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': { backgroundColor: '#333333' },
              }}
            >
              {loading ? 'Đang đăng ký...' : 'Hoàn tất đăng ký'}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
