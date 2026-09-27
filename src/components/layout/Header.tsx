'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Drawer,
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import { products } from '@/data/products';
import AuthModal from '@/components/auth/AuthModal';

const navLinks = [
  { href: '/#search', label: 'Thuê thiết bị' },
  { href: '/products', label: 'Sản phẩm' },
  { href: '/#process', label: 'Quy trình' },
  { href: '/#feedback', label: 'Feedback' },
  { href: '/account/history', label: 'Lịch sử thuê' },
  { href: '/booking/lookup', label: 'Tra cứu' },
  { href: '/admin-demo', label: 'Quản trị Admin' },
];

export default function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const { totalItems } = useBooking();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e5e5e5',
          color: '#111111',
        }}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <Toolbar disableGutters sx={{ height: { xs: 64, md: 72 }, justifyContent: 'space-between' }}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl md:text-2xl font-black uppercase tracking-tighter text-[#111111]">
                THUÊ CAMERA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#111111] group-hover:scale-150 transition-transform" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase font-bold tracking-widest text-[#555555] hover:text-[#111111] transition-colors relative py-1 hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#111111] after:transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Action Icons with MUI */}
            <div className="flex items-center gap-1 sm:gap-2">
              <IconButton
                onClick={() => setSearchOpen(true)}
                size="medium"
                aria-label="Tìm kiếm"
                sx={{
                  color: '#111111',
                  '&:hover': { backgroundColor: '#f0f0ee' },
                }}
              >
                <SearchIcon sx={{ fontSize: 22 }} />
              </IconButton>

              <IconButton
                component={Link}
                href="/booking"
                size="medium"
                aria-label="Giỏ đồ thuê"
                sx={{
                  color: '#111111',
                  '&:hover': { backgroundColor: '#f0f0ee' },
                }}
              >
                <Badge
                  badgeContent={totalItems}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#111111',
                      color: '#ffffff',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      height: 18,
                      minWidth: 18,
                    },
                  }}
                >
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>

              {/* User Account / Auth Button */}
              {isAuthenticated && user ? (
                <>
                  <button
                    onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[#e5e5e5] hover:border-[#111111] hover:bg-[#fafaf8] transition-all ml-1"
                    aria-label="Tài khoản"
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: user.role === 'admin' ? '#111111' : '#2563eb',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {user.fullName.charAt(0)}
                    </Avatar>
                    <span className="hidden sm:inline-block text-xs font-bold text-[#111111] max-w-[110px] truncate">
                      {user.fullName}
                    </span>
                    {user.role === 'admin' && (
                      <span className="hidden md:inline-block text-[9px] bg-[#111111] text-white px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                        Admin
                      </span>
                    )}
                  </button>

                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={() => setUserMenuAnchor(null)}
                    slotProps={{
                      paper: {
                        sx: {
                          mt: 1,
                          width: 240,
                          borderRadius: '8px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          p: 1,
                        },
                      },
                    }}
                  >
                    <div className="px-3 py-2 border-b border-[#f0f0f0] mb-1">
                      <p className="text-xs font-bold text-[#111111] truncate">{user.fullName}</p>
                      <p className="text-[11px] text-[#777777] truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Chip
                          label={user.role === 'admin' ? 'Quản trị viên' : `Hạng ${user.membershipTier.toUpperCase()}`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            backgroundColor: user.role === 'admin' ? '#111111' : '#f0fdf4',
                            color: user.role === 'admin' ? '#ffffff' : '#166534',
                          }}
                        />
                      </div>
                    </div>

                    <MenuItem
                      component={Link}
                      href="/account/history"
                      onClick={() => setUserMenuAnchor(null)}
                      sx={{ fontSize: '0.8125rem', py: 1, gap: 1.5, borderRadius: '4px' }}
                    >
                      <HistoryOutlinedIcon sx={{ fontSize: 18, color: '#666666' }} />
                      Lịch sử thuê máy
                    </MenuItem>

                    <MenuItem
                      component={Link}
                      href="/account"
                      onClick={() => setUserMenuAnchor(null)}
                      sx={{ fontSize: '0.8125rem', py: 1, gap: 1.5, borderRadius: '4px' }}
                    >
                      <AccountCircleOutlinedIcon sx={{ fontSize: 18, color: '#666666' }} />
                      Hồ sơ cá nhân
                    </MenuItem>

                    {isAdmin && (
                      <MenuItem
                        component={Link}
                        href="/admin-demo"
                        onClick={() => setUserMenuAnchor(null)}
                        sx={{ fontSize: '0.8125rem', py: 1, gap: 1.5, borderRadius: '4px', color: '#b91c1c' }}
                      >
                        <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 18, color: '#b91c1c' }} />
                        Trung tâm Quản trị Admin
                      </MenuItem>
                    )}

                    <Divider sx={{ my: 1 }} />

                    <MenuItem
                      onClick={() => {
                        logout();
                        setUserMenuAnchor(null);
                      }}
                      sx={{ fontSize: '0.8125rem', py: 1, gap: 1.5, borderRadius: '4px', color: '#666666' }}
                    >
                      <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setAuthModalOpen(true)}
                  startIcon={<PersonOutlinedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    borderColor: '#111111',
                    color: '#111111 !important',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    borderRadius: '20px',
                    px: 1.8,
                    py: 0.6,
                    ml: 1,
                    '&:hover': {
                      backgroundColor: '#111111',
                      color: '#ffffff !important',
                    },
                  }}
                >
                  Đăng nhập
                </Button>
              )}

              {/* Mobile Menu Button */}
              <IconButton
                onClick={() => setMobileOpen(true)}
                size="medium"
                sx={{
                  display: { xs: 'flex', lg: 'none' },
                  color: '#111111',
                  '&:hover': { backgroundColor: '#f0f0ee' },
                }}
              >
                <MenuIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </div>
          </Toolbar>
        </div>
      </AppBar>

      {/* MUI Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: '85%',
              maxWidth: 360,
              p: 3,
              backgroundColor: '#ffffff',
            },
          },
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e5]">
          <span className="text-lg font-black uppercase tracking-tight text-[#111111]">
            Menu
          </span>
          <IconButton onClick={() => setMobileOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </div>

        {/* Mobile User Profile Section */}
        <div className="mt-4 p-3 rounded-lg bg-[#f8f8f7] border border-[#ebebe8]">
          {isAuthenticated && user ? (
            <div>
              <div className="flex items-center gap-3">
                <Avatar sx={{ width: 36, height: 36, bgcolor: user.role === 'admin' ? '#111111' : '#2563eb' }}>
                  {user.fullName.charAt(0)}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#111111] truncate">{user.fullName}</p>
                  <p className="text-[11px] text-[#666666] truncate">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  component={Link}
                  href="/account/history"
                  onClick={() => setMobileOpen(false)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ fontSize: '0.6875rem', textTransform: 'none', fontWeight: 700, borderRadius: '4px', borderColor: '#d1d5db' }}
                >
                  Lịch sử thuê
                </Button>
                <Button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  variant="text"
                  size="small"
                  sx={{ fontSize: '0.6875rem', textTransform: 'none', color: '#666666' }}
                >
                  Đăng xuất
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-1">
              <p className="text-xs text-[#666666] mb-2">Đăng nhập để đặt lịch thuê nhanh hơn</p>
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={() => {
                  setMobileOpen(false);
                  setAuthModalOpen(true);
                }}
                sx={{
                  backgroundColor: '#111111',
                  color: '#ffffff !important',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  borderRadius: '4px',
                }}
              >
                Đăng nhập / Đăng ký
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-bold uppercase tracking-wider text-[#111111] py-2 border-b border-[#f0f0f0] flex items-center justify-between"
            >
              <span>{link.label}</span>
              <ArrowForwardIcon sx={{ fontSize: 16, color: '#888888' }} />
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-[#e5e5e5]">
          <p className="text-xs text-[#888888]">Hotline tư vấn</p>
          <p className="text-lg font-black text-[#111111] mt-0.5">0909 123 456</p>
          <p className="text-xs text-[#888888] mt-1">08:30 - 21:00 hàng ngày</p>
        </div>
      </Drawer>

      {/* MUI Search Dialog */}
      <Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: '8px',
              p: 2,
              top: { xs: 40, md: 80 },
              position: 'absolute',
            },
          },
        }}
      >
        <DialogContent sx={{ p: '8px !important' }}>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              autoFocus
              fullWidth
              placeholder="Tìm theo tên máy ảnh, lens, Sony, Canon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#888888' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchOpen(false)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  backgroundColor: '#fbfbfa',
                },
              }}
            />
          </form>

          {/* Quick Search Suggestions */}
          {searchResults.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#888888]">
                Kết quả phù hợp
              </span>
              {searchResults.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center justify-between p-2 rounded hover:bg-[#f7f7f5] transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-[#111111]">{item.name}</p>
                    <p className="text-[11px] text-[#888888]">
                      {item.brand} · {item.category}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#111111]">
                    {item.pricePerDay.toLocaleString('vi-VN')}đ/ngày
                  </span>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex items-center justify-between">
            <div className="flex gap-2">
              {['Sony', 'Canon', 'Fujifilm', 'Lens'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="text-xs bg-[#f4f4f2] text-[#444444] px-2.5 py-1 rounded hover:bg-[#e8e8e5] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            <Button
              variant="contained"
              size="small"
              onClick={handleSearchSubmit}
              sx={{
                backgroundColor: '#111111',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '4px',
              }}
            >
              Tìm kiếm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Authentication Modal */}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
