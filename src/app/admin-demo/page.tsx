'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  Tabs,
  Tab,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  Avatar,
  Divider,
  InputAdornment,
  Tooltip,
  Box,
  Grid,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

import { demoBookings } from '@/data/bookings';
import { products as initialProducts } from '@/data/products';
import { Booking, BookingStatus } from '@/types/booking';
import { Product } from '@/types/product';
import { User, UserRole, UserStatus, MembershipTier } from '@/types/user';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/lib/date';

const statusColorMap: Record<BookingStatus, { bg: string; text: string; border: string }> = {
  PENDING: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  CONFIRMED: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
  READY: { bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe' },
  PICKED_UP: { bg: '#fce7f3', text: '#be185d', border: '#fbcfe8' },
  RETURNED: { bg: '#fef08a', text: '#854d0e', border: '#fde047' },
  COMPLETED: { bg: '#e8f5e9', text: '#1a7a2e', border: '#c8e6c9' },
};

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  READY: 'Sẵn sàng giao',
  PICKED_UP: 'Đang thuê máy',
  RETURNED: 'Đã trả máy',
  COMPLETED: 'Hoàn thành',
};

const tierColorMap: Record<MembershipTier, { bg: string; text: string }> = {
  standard: { bg: '#f3f4f6', text: '#374151' },
  silver: { bg: '#e2e8f0', text: '#475569' },
  gold: { bg: '#fef3c7', text: '#b45309' },
  diamond: { bg: '#111111', text: '#ffffff' },
};

export default function AdminDemoPage() {
  const {
    usersList,
    updateUserStatus,
    updateUserRole,
    updateUser,
    addUser,
    deleteUser,
    user: currentLoggedInUser,
  } = useAuth();

  const [activeTab, setActiveTab] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('demo-bookings');
        if (stored) {
          const parsed = JSON.parse(stored);
          const map = new Map<string, Booking>();
          [...demoBookings, ...parsed].forEach((b) => map.set(b.id, b));
          return Array.from(map.values());
        }
      } catch {
        // ignore
      }
    }
    return demoBookings;
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<BookingStatus>('CONFIRMED');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('ALL');

  // Products state
  const [productsList, setProductsList] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('admin-custom-products');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return initialProducts;
  });
  const [productSearch, setProductSearch] = useState('');
  const [productBrandFilter, setProductBrandFilter] = useState('ALL');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');

  // Add / Edit Product dialogs
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductConfirmOpen, setDeleteProductConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // New product form
  const [prodForm, setProdForm] = useState({
    name: '',
    brand: 'Sony',
    category: 'Camera',
    pricePerDay: '350000',
    deposit: '5000000',
    totalUnits: '3',
    specs: 'Cảm biến Full-frame, Quay 4K',
    shortDescription: 'Thiết bị mới nhập kho chính hãng',
    image: '/images/products/sony-a7iv.jpg',
  });

  // Users state
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('ALL');
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);
  const [detailUserOpen, setDetailUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    role: 'customer' as UserRole,
    status: 'active' as UserStatus,
    membershipTier: 'standard' as MembershipTier,
    address: '',
  });

  // Persist products list
  const saveProducts = (updated: Product[]) => {
    setProductsList(updated);
    try {
      localStorage.setItem('admin-custom-products', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // KPIs
  const activeRentals = bookings.filter((b) => b.status === 'PICKED_UP').length;
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
  const totalUnits = productsList.reduce((acc, p) => acc + p.totalUnits, 0);
  const totalRevenue = bookings.reduce((acc, b) => acc + b.pricing.total, 0);
  const totalCustomers = usersList.filter((u) => u.role === 'customer').length;

  // Booking handlers
  const handleUpdateStatus = () => {
    if (!selectedBooking) return;
    const updated = bookings.map((b) => (b.id === selectedBooking.id ? { ...b, status: newStatus } : b));
    setBookings(updated);
    try {
      localStorage.setItem('demo-bookings', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setStatusDialogOpen(false);
    setToastMessage(`Đã cập nhật trạng thái đơn ${selectedBooking.code} thành: ${statusLabels[newStatus]}`);
  };

  // Product handlers
  const handleAddProduct = () => {
    if (!prodForm.name.trim()) {
      alert('Vui lòng nhập tên thiết bị');
      return;
    }
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug: `custom-${Date.now()}`,
      name: prodForm.name.trim(),
      brand: prodForm.brand as any,
      category: prodForm.category as any,
      pricePerDay: Number(prodForm.pricePerDay) || 300000,
      deposit: Number(prodForm.deposit) || 5000000,
      totalUnits: Number(prodForm.totalUnits) || 1,
      rating: 5.0,
      reviewCount: 1,
      featured: true,
      images: [prodForm.image],
      shortDescription: prodForm.shortDescription,
      description: prodForm.shortDescription,
      specifications: { 'Tính năng nổi bật': prodForm.specs },
    };
    saveProducts([newProd, ...productsList]);
    setAddProductOpen(false);
    setProdForm({
      name: '',
      brand: 'Sony',
      category: 'Camera',
      pricePerDay: '350000',
      deposit: '5000000',
      totalUnits: '3',
      specs: 'Cảm biến Full-frame, Quay 4K',
      shortDescription: 'Thiết bị mới nhập kho chính hãng',
      image: '/images/products/sony-a7iv.jpg',
    });
    setToastMessage(`Đã thêm thiết bị "${newProd.name}" vào kho máy!`);
  };

  const handleEditProductSave = () => {
    if (!editingProduct) return;
    const updated = productsList.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    saveProducts(updated);
    setEditProductOpen(false);
    setToastMessage(`Đã cập nhật thông tin thiết bị "${editingProduct.name}"!`);
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;
    const updated = productsList.filter((p) => p.id !== productToDelete.id);
    saveProducts(updated);
    setDeleteProductConfirmOpen(false);
    setToastMessage(`Đã xóa thiết bị "${productToDelete.name}" khỏi danh sách.`);
    setProductToDelete(null);
  };

  const handleAdjustStock = (productId: string, delta: number) => {
    const updated = productsList.map((p) => {
      if (p.id === productId) {
        const nextUnits = Math.max(0, p.totalUnits + delta);
        return { ...p, totalUnits: nextUnits };
      }
      return p;
    });
    saveProducts(updated);
    setToastMessage(`Đã cập nhật số lượng tồn kho.`);
  };

  // User handlers
  const handleToggleUserStatus = (u: User) => {
    const nextStatus: UserStatus = u.status === 'active' ? 'blocked' : 'active';
    updateUserStatus(u.id, nextStatus);
    setToastMessage(`Đã ${nextStatus === 'active' ? 'mở khóa' : 'tạm khóa'} tài khoản của ${u.fullName}`);
  };

  const handleEditUserSave = () => {
    if (!editingUser) return;
    updateUser(editingUser);
    setEditUserOpen(false);
    setToastMessage(`Đã cập nhật thông tin của người dùng ${editingUser.fullName}`);
  };

  const handleAddUserSave = () => {
    if (!newUserForm.fullName.trim() || !newUserForm.email.trim() || !newUserForm.phone.trim()) {
      alert('Vui lòng điền họ tên, email và số điện thoại');
      return;
    }
    addUser({
      fullName: newUserForm.fullName.trim(),
      email: newUserForm.email.trim(),
      phone: newUserForm.phone.trim(),
      idNumber: newUserForm.idNumber.trim(),
      role: newUserForm.role,
      status: newUserForm.status,
      membershipTier: newUserForm.membershipTier,
      address: newUserForm.address.trim(),
    });
    setAddUserOpen(false);
    setNewUserForm({
      fullName: '',
      email: '',
      phone: '',
      idNumber: '',
      role: 'customer',
      status: 'active',
      membershipTier: 'standard',
      address: '',
    });
    setToastMessage(`Đã thêm tài khoản mới thành công!`);
  };

  // Filtering
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterStatus !== 'ALL' && b.status !== bookingFilterStatus) return false;
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase().trim();
      return b.code.toLowerCase().includes(q) || b.customer.fullName.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredProducts = productsList.filter((p) => {
    if (productBrandFilter !== 'ALL' && p.brand !== productBrandFilter) return false;
    if (productCategoryFilter !== 'ALL' && p.category !== productCategoryFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredUsers = usersList.filter((u) => {
    if (userRoleFilter !== 'ALL' && u.role !== userRoleFilter) return false;
    if (userStatusFilter !== 'ALL' && u.status !== userStatusFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase().trim();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        (u.idNumber && u.idNumber.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="py-10 md:py-14 bg-[#fafaf8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/"
                className="text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#111111] flex items-center gap-1"
              >
                <ArrowBackIcon sx={{ fontSize: 14 }} /> Về trang chủ
              </Link>
              <span className="text-[#cccccc]">·</span>
              <Chip
                label="BẢN DEMO FRONTEND TÍCH HỢP"
                size="small"
                sx={{
                  backgroundColor: '#111111',
                  color: '#ffffff',
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  height: 20,
                }}
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#111111]">
              Trung tâm quản trị cửa hàng
            </h1>
            <p className="text-xs text-[#666666] mt-0.5">
              Quản lý danh mục thiết bị, duyệt đơn đặt thuê và kiểm soát tài khoản người dùng / phân quyền.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 2 && (
              <Button
                variant="contained"
                size="small"
                onClick={() => setAddProductOpen(true)}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#111111',
                  color: '#ffffff !important',
                  borderRadius: '6px',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 2,
                  py: 0.8,
                }}
              >
                Thêm thiết bị mới
              </Button>
            )}

            {activeTab === 3 && (
              <Button
                variant="contained"
                size="small"
                onClick={() => setAddUserOpen(true)}
                startIcon={<PersonAddOutlinedIcon />}
                sx={{
                  backgroundColor: '#111111',
                  color: '#ffffff !important',
                  borderRadius: '6px',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 2,
                  py: 0.8,
                }}
              >
                Thêm người dùng mới
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <Card sx={{ border: '1px solid #e5e5e0', borderRadius: '8px', mb: 6, backgroundColor: '#ffffff' }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              '& .MuiTabs-indicator': { backgroundColor: '#111111', height: 2 },
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.8125rem',
                minHeight: 54,
                textTransform: 'none',
                color: '#666666',
                '&.Mui-selected': { color: '#111111' },
              },
            }}
          >
            <Tab icon={<DashboardOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Tổng quan (Dashboard)" />
            <Tab
              icon={<BookOnlineOutlinedIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={`Đơn đặt lịch (${bookings.length})`}
            />
            <Tab
              icon={<CameraAltOutlinedIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={`Quản trị sản phẩm (${productsList.length})`}
            />
            <Tab
              icon={<PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={`Quản trị người dùng (${usersList.length})`}
            />
          </Tabs>
        </Card>

        {/* ==================== TAB 0: DASHBOARD ==================== */}
        {activeTab === 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <Card sx={{ border: '1px solid #e5e5e0', borderRadius: '8px', p: 3, backgroundColor: '#ffffff' }}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#888888] block">
                  Đang cho thuê
                </span>
                <p className="text-3xl font-black text-[#111111] mt-2">{activeRentals} đơn</p>
                <p className="text-xs text-[#1a7a2e] font-semibold mt-1 flex items-center gap-1">
                  <TrendingUpIcon sx={{ fontSize: 16 }} /> Thiết bị đang tác nghiệp
                </p>
              </Card>

              <Card sx={{ border: '1px solid #e5e5e0', borderRadius: '8px', p: 3, backgroundColor: '#ffffff' }}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#888888] block">
                  Chờ duyệt nhận máy
                </span>
                <p className="text-3xl font-black text-[#111111] mt-2">{pendingBookings} đơn</p>
                <p className="text-xs text-[#b45309] font-semibold mt-1">Cần liên hệ khách hàng</p>
              </Card>

              <Card sx={{ border: '1px solid #e5e5e0', borderRadius: '8px', p: 3, backgroundColor: '#ffffff' }}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#888888] block">
                  Tổng máy trong kho
                </span>
                <p className="text-3xl font-black text-[#111111] mt-2">{totalUnits} máy</p>
                <p className="text-xs text-[#666666] font-semibold mt-1">{productsList.length} mã thiết bị</p>
              </Card>

              <Card sx={{ border: '1px solid #111111', borderRadius: '8px', p: 3, backgroundColor: '#111111', color: '#ffffff' }}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#aaaaaa] block">
                  Doanh số ước tính
                </span>
                <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                  {formatCurrency(totalRevenue)}
                </p>
                <p className="text-xs text-[#4ade80] font-semibold mt-1">{totalCustomers} khách hàng thành viên</p>
              </Card>
            </div>

            {/* Quick Actions & Recent Bookings Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card sx={{ border: '1px solid #e5e5e0', borderRadius: '8px', p: 3, backgroundColor: '#ffffff' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-tight text-[#111111]">
                      Đơn đặt lịch cần xử lý gấp
                    </h2>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => setActiveTab(1)}
                      sx={{ textTransform: 'none', fontSize: '0.75rem', color: '#111111', fontWeight: 700 }}
                    >
                      Xem tất cả →
                    </Button>
                  </div>

                  <div className="divide-y divide-[#f0f0ec]">
                    {bookings.slice(0, 4).map((b) => (
                      <div key={b.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#111111]">{b.code}</span>
                            <span className="text-[#666666]">• {b.customer.fullName}</span>
                          </div>
                          <p className="text-[11px] text-[#888888] mt-0.5">
                            {b.items[0]?.productName} {b.items.length > 1 && `+ ${b.items.length - 1} món`}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Chip
                            label={statusLabels[b.status]}
                            size="small"
                            sx={{
                              backgroundColor: statusColorMap[b.status].bg,
                              color: statusColorMap[b.status].text,
                              fontWeight: 700,
                              fontSize: '0.625rem',
                              height: 22,
                            }}
                          />
                          <span className="font-bold text-[#111111]">{formatCurrency(b.pricing.total)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div>
                <Card sx={{ border: '1px solid #e5e5e0', borderRadius: '8px', p: 3, backgroundColor: '#ffffff' }}>
                  <h2 className="text-sm font-bold uppercase tracking-tight text-[#111111] mb-3">
                    Phím tắt quản trị
                  </h2>
                  <div className="space-y-2.5">
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        setActiveTab(2);
                        setAddProductOpen(true);
                      }}
                      startIcon={<AddIcon />}
                      sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700, borderColor: '#d1d5db', color: '#111111' }}
                    >
                      Nhập thêm thiết bị mới
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        setActiveTab(3);
                        setAddUserOpen(true);
                      }}
                      startIcon={<PersonAddOutlinedIcon />}
                      sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700, borderColor: '#d1d5db', color: '#111111' }}
                    >
                      Tạo tài khoản khách hàng mới
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      component={Link}
                      href="/account/history"
                      sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700, borderColor: '#d1d5db', color: '#111111' }}
                    >
                      Kiểm tra lịch sử thuê cá nhân
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 1: BOOKINGS ==================== */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="w-full sm:w-72">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Tìm mã đơn hoặc tên khách..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: 18, color: '#888888' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', borderRadius: '6px' } }}
                />
              </div>

              <div className="flex items-center gap-2">
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="filter-booking-status-label">Trạng thái đơn</InputLabel>
                  <Select
                    labelId="filter-booking-status-label"
                    value={bookingFilterStatus}
                    label="Trạng thái đơn"
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    sx={{ backgroundColor: '#ffffff', borderRadius: '6px' }}
                  >
                    <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
                    <MenuItem value="PENDING">Chờ xác nhận</MenuItem>
                    <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
                    <MenuItem value="READY">Sẵn sàng giao</MenuItem>
                    <MenuItem value="PICKED_UP">Đang thuê</MenuItem>
                    <MenuItem value="RETURNED">Đã trả máy</MenuItem>
                    <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <Card sx={{ border: '1px solid #e5e5e0', borderRadius: '8px', overflow: 'hidden' }}>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f8f8f6' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Mã đơn</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Khách hàng</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Thời gian thuê</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Thiết bị</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Tổng tiền</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Trạng thái</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', textAlign: 'right' }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBookings.map((b) => (
                      <TableRow key={b.id} hover>
                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.8125rem' }}>
                          {b.code}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8125rem' }}>
                          <p className="font-bold text-[#111111]">{b.customer.fullName}</p>
                          <p className="text-xs text-[#777777]">{b.customer.phone}</p>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8125rem' }}>
                          <p className="font-semibold text-[#111111]">
                            {formatDate(b.startDate)} → {formatDate(b.endDate)}
                          </p>
                          <p className="text-xs text-[#777777]">({b.pricing.rentalDays} ngày)</p>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.8125rem' }}>
                          {b.items.map((i) => (
                            <div key={i.productId} className="text-xs">
                              {i.productName} <strong>(x{i.quantity})</strong>
                            </div>
                          ))}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                          {formatCurrency(b.pricing.total)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={statusLabels[b.status]}
                            size="small"
                            sx={{
                              backgroundColor: statusColorMap[b.status].bg,
                              color: statusColorMap[b.status].text,
                              fontWeight: 700,
                              fontSize: '0.6875rem',
                              borderRadius: '4px',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setSelectedBooking(b);
                              setNewStatus(b.status);
                              setStatusDialogOpen(true);
                            }}
                            sx={{
                              borderColor: '#d1d5db',
                              color: '#111111 !important',
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              textTransform: 'none',
                              borderRadius: '4px',
                              py: 0.4,
                            }}
                          >
                            Đổi trạng thái
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </div>
        )}

        {/* ==================== TAB 2: PRODUCT MANAGEMENT ==================== */}
        {activeTab === 2 && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="w-full md:w-80">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Tìm theo tên máy ảnh, lens, hãng..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: 18, color: '#888888' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', borderRadius: '6px' } }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="filter-brand-label">Thương hiệu</InputLabel>
                  <Select
                    labelId="filter-brand-label"
                    value={productBrandFilter}
                    label="Thương hiệu"
                    onChange={(e) => setProductBrandFilter(e.target.value)}
                    sx={{ backgroundColor: '#ffffff', borderRadius: '6px' }}
                  >
                    <MenuItem value="ALL">Tất cả hãng</MenuItem>
                    <MenuItem value="Sony">Sony</MenuItem>
                    <MenuItem value="Canon">Canon</MenuItem>
                    <MenuItem value="Fujifilm">Fujifilm</MenuItem>
                    <MenuItem value="Nikon">Nikon</MenuItem>
                    <MenuItem value="DJI">DJI</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel id="filter-cat-label">Danh mục</InputLabel>
                  <Select
                    labelId="filter-cat-label"
                    value={productCategoryFilter}
                    label="Danh mục"
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    sx={{ backgroundColor: '#ffffff', borderRadius: '6px' }}
                  >
                    <MenuItem value="ALL">Tất cả danh mục</MenuItem>
                    <MenuItem value="Camera">Máy ảnh</MenuItem>
                    <MenuItem value="Lens">Ống kính (Lens)</MenuItem>
                    <MenuItem value="Gimbal">Gimbal & Chống rung</MenuItem>
                    <MenuItem value="Accessory">Phụ kiện & Pin</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Products Table */}
            <Card sx={{ border: '1px solid #e5e5e0', borderRadius: '8px', overflow: 'hidden' }}>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f8f8f6' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Thiết bị</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Hãng & Danh mục</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Giá thuê/ngày</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Tiền cọc gốc</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Tồn kho</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Trạng thái</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', textAlign: 'right' }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell sx={{ fontSize: '0.8125rem' }}>
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded bg-[#eeeeee] overflow-hidden flex-shrink-0">
                              {p.images[0] ? (
                                <Image src={p.images[0]} alt={p.name} fill sizes="40px" className="object-cover" />
                              ) : (
                                <span className="text-xs flex items-center justify-center h-full">📷</span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-[#111111]">{p.name}</p>
                              <p className="text-[11px] text-[#777777] line-clamp-1">{p.shortDescription}</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem' }}>
                          <span className="font-bold text-[#111111]">{p.brand}</span>
                          <span className="text-[#888888] block text-[11px]">{p.category}</span>
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                          {formatCurrency(p.pricePerDay)}
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem', color: '#555555' }}>
                          {formatCurrency(p.deposit)}
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem' }}>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleAdjustStock(p.id, -1)}
                              className="w-5 h-5 rounded border border-[#d1d5db] text-[#555555] hover:bg-[#eeeeee] flex items-center justify-center font-bold text-xs"
                              title="Giảm 1 máy"
                            >
                              -
                            </button>
                            <span className="font-bold text-[#111111] min-w-[20px] text-center">
                              {p.totalUnits}
                            </span>
                            <button
                              onClick={() => handleAdjustStock(p.id, 1)}
                              className="w-5 h-5 rounded border border-[#d1d5db] text-[#555555] hover:bg-[#eeeeee] flex items-center justify-center font-bold text-xs"
                              title="Thêm 1 máy"
                            >
                              +
                            </button>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={p.totalUnits > 0 ? `Còn hàng (${p.totalUnits})` : 'Tạm hết máy'}
                            size="small"
                            sx={{
                              backgroundColor: p.totalUnits > 0 ? '#e8f5e9' : '#fee2e2',
                              color: p.totalUnits > 0 ? '#1a7a2e' : '#dc2626',
                              fontWeight: 700,
                              fontSize: '0.6875rem',
                              borderRadius: '4px',
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip title="Chỉnh sửa thiết bị">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setEditProductOpen(true);
                                }}
                                sx={{ color: '#555555' }}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Xóa thiết bị">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setProductToDelete(p);
                                  setDeleteProductConfirmOpen(true);
                                }}
                                sx={{ color: '#dc2626' }}
                              >
                                <DeleteOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </div>
        )}

        {/* ==================== TAB 3: USER MANAGEMENT ==================== */}
        {activeTab === 3 && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="w-full md:w-80">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Tìm theo tên, email, SĐT, số CCCD..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: 18, color: '#888888' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', borderRadius: '6px' } }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel id="filter-user-role-label">Vai trò</InputLabel>
                  <Select
                    labelId="filter-user-role-label"
                    value={userRoleFilter}
                    label="Vai trò"
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    sx={{ backgroundColor: '#ffffff', borderRadius: '6px' }}
                  >
                    <MenuItem value="ALL">Tất cả vai trò</MenuItem>
                    <MenuItem value="customer">Khách hàng</MenuItem>
                    <MenuItem value="admin">Quản trị viên (Admin)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel id="filter-user-status-label">Trạng thái</InputLabel>
                  <Select
                    labelId="filter-user-status-label"
                    value={userStatusFilter}
                    label="Trạng thái"
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    sx={{ backgroundColor: '#ffffff', borderRadius: '6px' }}
                  >
                    <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
                    <MenuItem value="active">Đang hoạt động</MenuItem>
                    <MenuItem value="blocked">Tạm khóa</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Users Table */}
            <Card sx={{ border: '1px solid #e5e5e0', borderRadius: '8px', overflow: 'hidden' }}>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f8f8f6' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Khách hàng / Admin</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Liên hệ</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Số CCCD / Hộ chiếu</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Hạng mức & Quyền</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Đơn & Chi tiêu</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Trạng thái</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', textAlign: 'right' }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id} hover>
                        <TableCell sx={{ fontSize: '0.8125rem' }}>
                          <div className="flex items-center gap-3">
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: u.role === 'admin' ? '#111111' : '#2563eb',
                                fontSize: '0.875rem',
                                fontWeight: 800,
                              }}
                            >
                              {u.fullName.charAt(0)}
                            </Avatar>
                            <div>
                              <p className="font-bold text-[#111111]">{u.fullName}</p>
                              <span className="text-[11px] text-[#777777]">
                                Đăng ký: {formatDate(u.createdAt)}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem' }}>
                          <p className="font-semibold text-[#111111]">{u.phone}</p>
                          <p className="text-xs text-[#666666]">{u.email}</p>
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}>
                          {u.idNumber || <span className="text-[#999999] font-sans text-xs">Chưa cập nhật</span>}
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem' }}>
                          <div className="flex flex-col gap-1 items-start">
                            <Chip
                              label={u.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.625rem',
                                fontWeight: 800,
                                backgroundColor: u.role === 'admin' ? '#111111' : '#e0e7ff',
                                color: u.role === 'admin' ? '#ffffff' : '#3730a3',
                              }}
                            />
                            <span className="text-[10px] text-[#666666] font-bold uppercase tracking-wider">
                              Tier: {u.membershipTier}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell sx={{ fontSize: '0.8125rem' }}>
                          <p className="font-bold text-[#111111]">{u.totalRentals} đơn</p>
                          <p className="text-xs text-[#1a7a2e] font-semibold">{formatCurrency(u.totalSpent)}</p>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={u.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                            size="small"
                            sx={{
                              backgroundColor: u.status === 'active' ? '#e8f5e9' : '#fee2e2',
                              color: u.status === 'active' ? '#1a7a2e' : '#dc2626',
                              fontWeight: 700,
                              fontSize: '0.6875rem',
                              borderRadius: '4px',
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip title="Xem chi tiết & Lịch sử">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedUserDetail(u);
                                  setDetailUserOpen(true);
                                }}
                                sx={{ color: '#555555' }}
                              >
                                <VisibilityOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Chỉnh sửa quyền / thông tin">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingUser(u);
                                  setEditUserOpen(true);
                                }}
                                sx={{ color: '#555555' }}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}>
                              <IconButton
                                size="small"
                                onClick={() => handleToggleUserStatus(u)}
                                sx={{ color: u.status === 'active' ? '#b45309' : '#1a7a2e' }}
                              >
                                {u.status === 'active' ? (
                                  <LockOutlinedIcon fontSize="small" />
                                ) : (
                                  <LockOpenOutlinedIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Xóa tài khoản">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  if (confirm(`Xóa vĩnh viễn tài khoản của ${u.fullName}?`)) {
                                    deleteUser(u.id);
                                    setToastMessage(`Đã xóa tài khoản ${u.fullName}`);
                                  }
                                }}
                                sx={{ color: '#dc2626' }}
                              >
                                <DeleteOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </div>
        )}
      </div>

      {/* ==================== DIALOGS ==================== */}

      {/* 1. Update Booking Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '8px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase' }}>
          Cập nhật trạng thái đơn thuê
        </DialogTitle>
        <DialogContent>
          <p className="text-xs text-[#666666] mb-4">
            Đơn hàng: <strong className="text-[#111111]">{selectedBooking?.code}</strong> của{' '}
            {selectedBooking?.customer.fullName}
          </p>

          <FormControl fullWidth size="small">
            <InputLabel id="status-select-label">Trạng thái mới</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              label="Trạng thái mới"
              onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
              sx={{ borderRadius: '4px' }}
            >
              <MenuItem value="PENDING">Chờ xác nhận (PENDING)</MenuItem>
              <MenuItem value="CONFIRMED">Đã xác nhận (CONFIRMED)</MenuItem>
              <MenuItem value="READY">Sẵn sàng giao (READY)</MenuItem>
              <MenuItem value="PICKED_UP">Đang cho thuê (PICKED_UP)</MenuItem>
              <MenuItem value="RETURNED">Đã trả máy (RETURNED)</MenuItem>
              <MenuItem value="COMPLETED">Hoàn tất (COMPLETED)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setStatusDialogOpen(false)} sx={{ color: '#666666', textTransform: 'none' }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateStatus}
            sx={{ backgroundColor: '#111111', color: '#ffffff !important', textTransform: 'none', fontWeight: 700, borderRadius: '4px' }}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2. Add Product Dialog */}
      <Dialog
        open={addProductOpen}
        onClose={() => setAddProductOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '10px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.125rem', textTransform: 'uppercase', pb: 1 }}>
          Thêm thiết bị mới vào kho
        </DialogTitle>
        <DialogContent sx={{ pt: '20px !important', px: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              fullWidth
              size="small"
              required
              label="Tên máy ảnh / Ống kính"
              placeholder="VD: Sony FX3 Cinema Line hoặc Canon EOS R5 II"
              value={prodForm.name}
              onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="add-brand-label">Thương hiệu</InputLabel>
                <Select
                  labelId="add-brand-label"
                  value={prodForm.brand}
                  label="Thương hiệu"
                  onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                >
                  <MenuItem value="Sony">Sony</MenuItem>
                  <MenuItem value="Canon">Canon</MenuItem>
                  <MenuItem value="Fujifilm">Fujifilm</MenuItem>
                  <MenuItem value="Nikon">Nikon</MenuItem>
                  <MenuItem value="DJI">DJI</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="add-category-label">Danh mục</InputLabel>
                <Select
                  labelId="add-category-label"
                  value={prodForm.category}
                  label="Danh mục"
                  onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                >
                  <MenuItem value="Camera">Máy ảnh (Camera)</MenuItem>
                  <MenuItem value="Lens">Ống kính (Lens)</MenuItem>
                  <MenuItem value="Gimbal">Gimbal & Chống rung</MenuItem>
                  <MenuItem value="Accessory">Phụ kiện & Pin sạc</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Giá thuê/ngày (VNĐ)"
                value={prodForm.pricePerDay}
                onChange={(e) => setProdForm({ ...prodForm, pricePerDay: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                fullWidth
                size="small"
                label="Tiền cọc gốc (VNĐ)"
                value={prodForm.deposit}
                onChange={(e) => setProdForm({ ...prodForm, deposit: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                fullWidth
                size="small"
                label="Số lượng máy"
                value={prodForm.totalUnits}
                onChange={(e) => setProdForm({ ...prodForm, totalUnits: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>

            <TextField
              fullWidth
              size="small"
              label="Thông số nổi bật (Specs)"
              placeholder="VD: Cảm biến 33MP, Quay 4K60p 10-bit, Chống rung 5.5 stops"
              value={prodForm.specs}
              onChange={(e) => setProdForm({ ...prodForm, specs: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              size="small"
              multiline
              rows={2}
              label="Mô tả ngắn"
              value={prodForm.shortDescription}
              onChange={(e) => setProdForm({ ...prodForm, shortDescription: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <FormControl fullWidth size="small">
              <InputLabel id="add-image-label">Ảnh mẫu thiết bị</InputLabel>
              <Select
                labelId="add-image-label"
                value={prodForm.image}
                label="Ảnh mẫu thiết bị"
                onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
              >
                <MenuItem value="/images/products/sony-a7iv.jpg">Sony Alpha A7 IV (Studio)</MenuItem>
                <MenuItem value="/images/products/fujifilm-x100vi.jpg">Fujifilm X100VI (Bạc)</MenuItem>
                <MenuItem value="/images/products/fujifilm-xt5.jpg">Fujifilm X-T5 (Đen)</MenuItem>
                <MenuItem value="/images/products/canon-r6-mark-ii.jpg">Canon EOS R6 Mark II</MenuItem>
                <MenuItem value="/images/products/nikon-z6-iii.jpg">Nikon Z6 III Pro</MenuItem>
                <MenuItem value="/images/products/sony-24-70-gm-ii.jpg">Sony FE 24-70mm GM II</MenuItem>
                <MenuItem value="/images/products/dji-rs-4-pro.jpg">DJI RS 4 Pro Gimbal</MenuItem>
                <MenuItem value="/images/products/dji-osmo-pocket-3.jpg">DJI Osmo Pocket 3 Creator</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setAddProductOpen(false)} sx={{ color: '#666666', textTransform: 'none' }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleAddProduct}
            sx={{ backgroundColor: '#111111', color: '#ffffff !important', textTransform: 'none', fontWeight: 700, borderRadius: '6px', px: 3 }}
          >
            Lưu vào kho thiết bị
          </Button>
        </DialogActions>
      </Dialog>

      {/* 3. Edit Product Dialog */}
      <Dialog
        open={editProductOpen}
        onClose={() => setEditProductOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '10px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.125rem', textTransform: 'uppercase', pb: 1 }}>
          Chỉnh sửa thông tin thiết bị
        </DialogTitle>
        <DialogContent sx={{ pt: '20px !important', px: 3, pb: 2 }}>
          {editingProduct && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Tên thiết bị"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Giá thuê/ngày (VNĐ)"
                  value={editingProduct.pricePerDay}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, pricePerDay: Number(e.target.value) || 0 })
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Tiền cọc (VNĐ)"
                  value={editingProduct.deposit}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, deposit: Number(e.target.value) || 0 })
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Số lượng máy"
                  value={editingProduct.totalUnits}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, totalUnits: Number(e.target.value) || 0 })
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>

              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                label="Mô tả ngắn"
                value={editingProduct.shortDescription}
                onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setEditProductOpen(false)} sx={{ color: '#666666', textTransform: 'none' }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleEditProductSave}
            sx={{ backgroundColor: '#111111', color: '#ffffff !important', textTransform: 'none', fontWeight: 700, borderRadius: '6px' }}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* 4. Delete Product Confirmation */}
      <Dialog
        open={deleteProductConfirmOpen}
        onClose={() => setDeleteProductConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '8px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', color: '#dc2626' }}>
          Xác nhận xóa thiết bị
        </DialogTitle>
        <DialogContent>
          <p className="text-xs text-[#555555]">
            Bạn có chắc chắn muốn xóa thiết bị <strong>{productToDelete?.name}</strong> khỏi kho máy? Hành động này có thể hoàn tác bằng cách làm mới lại trang hoặc thêm lại.
          </p>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteProductConfirmOpen(false)} sx={{ color: '#666666', textTransform: 'none' }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteProduct}
            sx={{ backgroundColor: '#dc2626', color: '#ffffff !important', textTransform: 'none', fontWeight: 700, borderRadius: '4px' }}
          >
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* 5. View User Detail Dialog */}
      <Dialog
        open={detailUserOpen}
        onClose={() => setDetailUserOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '10px', p: 1 } } }}
      >
        {selectedUserDetail && (
          <>
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[#f0f0f0]">
              <div className="flex items-center gap-3">
                <Avatar sx={{ bgcolor: selectedUserDetail.role === 'admin' ? '#111111' : '#2563eb' }}>
                  {selectedUserDetail.fullName.charAt(0)}
                </Avatar>
                <div>
                  <h3 className="text-base font-black text-[#111111]">{selectedUserDetail.fullName}</h3>
                  <p className="text-xs text-[#666666]">{selectedUserDetail.email}</p>
                </div>
              </div>
              <IconButton size="small" onClick={() => setDetailUserOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>

            <DialogContent sx={{ px: 3, py: 2 }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#fcfcfb] rounded border border-[#f0f0ec] text-xs">
                  <div>
                    <span className="text-[#888888] block text-[11px]">Số điện thoại:</span>
                    <strong>{selectedUserDetail.phone}</strong>
                  </div>
                  <div>
                    <span className="text-[#888888] block text-[11px]">Số CCCD / Hộ chiếu:</span>
                    <strong>{selectedUserDetail.idNumber || 'Chưa cung cấp'}</strong>
                  </div>
                  <div>
                    <span className="text-[#888888] block text-[11px]">Ngày sinh:</span>
                    <span>{selectedUserDetail.birthDate ? formatDate(selectedUserDetail.birthDate) : 'Chưa cập nhật'}</span>
                  </div>
                  <div>
                    <span className="text-[#888888] block text-[11px]">Hạng thành viên:</span>
                    <strong className="uppercase">{selectedUserDetail.membershipTier}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#888888] block text-[11px]">Địa chỉ:</span>
                    <span>{selectedUserDetail.address || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#888888] block text-[11px]">Mạng xã hội / Zalo:</span>
                    <span>{selectedUserDetail.socialContact || 'Chưa cập nhật'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888] block mb-2">
                    Lịch sử thuê máy của khách hàng
                  </span>
                  <div className="divide-y divide-[#eeeeee] border border-[#f0f0ec] rounded p-2 text-xs">
                    {bookings
                      .filter((b) => b.customer.phone === selectedUserDetail.phone || b.customer.email === selectedUserDetail.email)
                      .slice(0, 3)
                      .map((b) => (
                        <div key={b.id} className="py-2 flex justify-between items-center">
                          <div>
                            <span className="font-mono font-bold">{b.code}</span> - {b.items[0]?.productName}
                            <span className="text-[11px] text-[#888888] block">
                              {formatDate(b.startDate)} → {formatDate(b.endDate)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">{formatCurrency(b.pricing.total)}</span>
                            <span className="block text-[10px] text-[#1a7a2e] font-semibold">{statusLabels[b.status]}</span>
                          </div>
                        </div>
                      ))}
                    {bookings.filter((b) => b.customer.phone === selectedUserDetail.phone || b.customer.email === selectedUserDetail.email).length === 0 && (
                      <p className="text-xs text-[#888888] py-2 text-center">Khách chưa phát sinh đơn thuê thực tế.</p>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setDetailUserOpen(false)} sx={{ color: '#666666', textTransform: 'none' }}>
                Đóng
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 6. Edit User Dialog */}
      <Dialog
        open={editUserOpen}
        onClose={() => setEditUserOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '10px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', pb: 1 }}>
          Chỉnh sửa tài khoản người dùng
        </DialogTitle>
        <DialogContent sx={{ pt: '20px !important', px: 3, pb: 2 }}>
          {editingUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Họ và tên"
                value={editingUser.fullName}
                onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                fullWidth
                size="small"
                label="Số điện thoại"
                value={editingUser.phone}
                onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                fullWidth
                size="small"
                label="Địa chỉ Email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                fullWidth
                size="small"
                label="Số CCCD / Hộ chiếu"
                value={editingUser.idNumber || ''}
                onChange={(e) => setEditingUser({ ...editingUser, idNumber: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-role-label">Vai trò</InputLabel>
                  <Select
                    labelId="edit-role-label"
                    value={editingUser.role}
                    label="Vai trò"
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  >
                    <MenuItem value="customer">Khách hàng</MenuItem>
                    <MenuItem value="admin">Quản trị viên (Admin)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel id="edit-tier-label">Hạng thành viên</InputLabel>
                  <Select
                    labelId="edit-tier-label"
                    value={editingUser.membershipTier}
                    label="Hạng thành viên"
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, membershipTier: e.target.value as MembershipTier })
                    }
                  >
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="silver">Silver</MenuItem>
                    <MenuItem value="gold">Gold</MenuItem>
                    <MenuItem value="diamond">VIP Diamond</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel id="edit-status-label">Trạng thái tài khoản</InputLabel>
                <Select
                  labelId="edit-status-label"
                  value={editingUser.status}
                  label="Trạng thái tài khoản"
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                >
                  <MenuItem value="active">Hoạt động (Active)</MenuItem>
                  <MenuItem value="blocked">Tạm khóa (Blocked)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditUserOpen(false)} sx={{ color: '#666666', textTransform: 'none' }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleEditUserSave}
            sx={{ backgroundColor: '#111111', color: '#ffffff !important', textTransform: 'none', fontWeight: 700, borderRadius: '4px' }}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* 7. Add User Dialog */}
      <Dialog
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '10px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', pb: 1 }}>
          Tạo tài khoản người dùng mới
        </DialogTitle>
        <DialogContent sx={{ pt: '20px !important', px: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              fullWidth
              size="small"
              required
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              value={newUserForm.fullName}
              onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              fullWidth
              size="small"
              required
              label="Số điện thoại"
              placeholder="0909123456"
              value={newUserForm.phone}
              onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              fullWidth
              size="small"
              required
              label="Địa chỉ Email"
              placeholder="user@example.com"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              fullWidth
              size="small"
              label="Số CCCD / Hộ chiếu"
              placeholder="079..."
              value={newUserForm.idNumber}
              onChange={(e) => setNewUserForm({ ...newUserForm, idNumber: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="add-user-role">Vai trò</InputLabel>
                <Select
                  labelId="add-user-role"
                  value={newUserForm.role}
                  label="Vai trò"
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                >
                  <MenuItem value="customer">Khách hàng</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="add-user-tier">Hạng mức</InputLabel>
                <Select
                  labelId="add-user-tier"
                  value={newUserForm.membershipTier}
                  label="Hạng mức"
                  onChange={(e) =>
                    setNewUserForm({ ...newUserForm, membershipTier: e.target.value as MembershipTier })
                  }
                >
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="silver">Silver</MenuItem>
                  <MenuItem value="gold">Gold</MenuItem>
                  <MenuItem value="diamond">VIP Diamond</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              size="small"
              label="Địa chỉ cư trú"
              placeholder="TP.HCM..."
              value={newUserForm.address}
              onChange={(e) => setNewUserForm({ ...newUserForm, address: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddUserOpen(false)} sx={{ color: '#666666', textTransform: 'none' }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleAddUserSave}
            sx={{ backgroundColor: '#111111', color: '#ffffff !important', textTransform: 'none', fontWeight: 700, borderRadius: '4px' }}
          >
            Tạo tài khoản
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3000}
        onClose={() => setToastMessage(null)}
        message={toastMessage}
      />
    </div>
  );
}
