'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Button,
  Drawer,
  IconButton,
  Rating,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import { products } from '@/data/products';
import { filterAndSortProducts, getAllBrands } from '@/services/mockProductService';
import ProductCard from '@/components/product/ProductCard';
import { SortOption, ViewMode, CategoryType, Brand } from '@/types/product';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Phổ biến nhất' },
  { value: 'name-asc', label: 'Tên A - Z' },
  { value: 'name-desc', label: 'Tên Z - A' },
  { value: 'price-asc', label: 'Giá: Thấp đến Cao' },
  { value: 'price-desc', label: 'Giá: Cao đến Thấp' },
];

const categoryTabs: { value: CategoryType | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Camera', label: 'Máy ảnh' },
  { value: 'Lens', label: 'Ống kính' },
  { value: 'Action Camera', label: 'Action Cam' },
  { value: 'Gimbal', label: 'Gimbal' },
  { value: 'Flash', label: 'Flash' },
  { value: 'Tripod', label: 'Chân máy' },
  { value: 'Microphone', label: 'Microphone' },
  { value: 'Lighting', label: 'Đèn led' },
  { value: 'Accessory', label: 'Phụ kiện khác' },
];

export default function ProductListingPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = (searchParams.get('category') || 'all') as CategoryType | 'all';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<CategoryType | 'all'>(initialCategory);
  const [brand, setBrand] = useState<Brand | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('popular');
  const [view, setView] = useState<ViewMode>('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const brands = getAllBrands();

  useEffect(() => {
    const searchVal = searchParams.get('search');
    if (searchVal) setSearch(searchVal);
    const catVal = searchParams.get('category');
    if (catVal) {
      const matchedCat = categoryTabs.find(
        (c) =>
          c.value.toLowerCase().replace(/\s/g, '-') === catVal.toLowerCase() ||
          c.value === catVal
      );
      if (matchedCat) setCategory(matchedCat.value);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, { category, brand, search, sort });
  }, [category, brand, search, sort]);

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: CategoryType | 'all') => {
    setCategory(newValue);
  };

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, nextView: ViewMode | null) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const resetFilters = () => {
    setCategory('all');
    setBrand('all');
    setSearch('');
    setSort('popular');
  };

  return (
    <div className="py-12 md:py-16 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest font-bold text-[#666666]">
            Danh mục thiết bị ({filteredProducts.length} sản phẩm)
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111111] mt-1.5">
            Tất cả thiết bị cho thuê
          </h1>
          <p className="mt-2 text-sm text-[#666666] max-w-xl">
            Lựa chọn từ các dòng máy ảnh mirrorless, ống kính cao cấp và trọn bộ phụ kiện điện ảnh chuyên nghiệp.
          </p>
        </div>

        {/* MUI Category Tabs */}
        <div className="mb-8 border-b border-[#e5e5e5]">
          <Tabs
            value={category}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#111111', height: 2.5 },
              '& .MuiTab-root': {
                minWidth: 'auto',
                px: 2.5,
                py: 1.5,
                fontWeight: 700,
                fontSize: '0.8125rem',
                color: '#666666',
                '&.Mui-selected': { color: '#111111' },
              },
            }}
          >
            {categoryTabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="w-full md:max-w-md">
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm máy ảnh, lens, phụ kiện..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#888888', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearch('')}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  backgroundColor: '#fbfbfa',
                },
              }}
            />
          </div>

          {/* Right Controls: Brand Filter, Sort Dropdown, View Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Brand Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={brand}
                onChange={(e) => setBrand(e.target.value as Brand | 'all')}
                displayEmpty
                sx={{ borderRadius: '4px', fontSize: '0.8125rem', fontWeight: 600 }}
              >
                <MenuItem value="all">Tất cả hãng</MenuItem>
                {brands.map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sort Dropdown */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                displayEmpty
                sx={{ borderRadius: '4px', fontSize: '0.8125rem', fontWeight: 600 }}
              >
                {sortOptions.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Grid / List View Toggle */}
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  color: '#666666',
                  '&.Mui-selected': {
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#222222' },
                  },
                },
              }}
            >
              <ToggleButton value="grid" aria-label="Lưới">
                <ViewModuleIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list" aria-label="Danh sách">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Mobile Filter Button */}
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowMobileFilter(true)}
              startIcon={<TuneIcon />}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                borderColor: '#e0e0e0',
                color: '#111111',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Bộ lọc
            </Button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(category !== 'all' || brand !== 'all' || search) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-[#fbfbfa] rounded border border-[#e5e5e5]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#666666]">
              Đang lọc:
            </span>
            {category !== 'all' && (
              <Chip
                label={`Danh mục: ${category}`}
                size="small"
                onDelete={() => setCategory('all')}
                sx={{ borderRadius: '4px', fontWeight: 600 }}
              />
            )}
            {brand !== 'all' && (
              <Chip
                label={`Hãng: ${brand}`}
                size="small"
                onDelete={() => setBrand('all')}
                sx={{ borderRadius: '4px', fontWeight: 600 }}
              />
            )}
            {search && (
              <Chip
                label={`Tìm kiếm: "${search}"`}
                size="small"
                onDelete={() => setSearch('')}
                sx={{ borderRadius: '4px', fontWeight: 600 }}
              />
            )}
            <Button
              size="small"
              onClick={resetFilters}
              sx={{
                textTransform: 'none',
                color: '#dc2626',
                fontSize: '0.75rem',
                fontWeight: 600,
                ml: 'auto',
              }}
            >
              Xóa tất cả bộ lọc
            </Button>
          </div>
        )}

        {/* Product Grid / List */}
        {filteredProducts.length > 0 ? (
          view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} view="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} view="list" />
              ))}
            </div>
          )
        ) : (
          <div className="py-20 text-center border border-dashed border-[#d0d0d0] rounded-lg bg-[#fbfbfa]">
            <SearchIcon sx={{ fontSize: 48, color: '#aaaaaa', mb: 1 }} />
            <h3 className="text-lg font-bold text-[#111111]">
              Không tìm thấy thiết bị phù hợp
            </h3>
            <p className="text-xs text-[#666666] mt-1 max-w-sm mx-auto">
              Vui lòng thử điều chỉnh lại từ khóa tìm kiếm hoặc bỏ chọn bớt bộ lọc danh mục/thương hiệu.
            </p>
            <Button
              variant="contained"
              size="small"
              onClick={resetFilters}
              sx={{
                mt: 3,
                backgroundColor: '#111111',
                borderRadius: '4px',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Xem tất cả thiết bị
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Filter Bottom Sheet Drawer */}
      <Drawer
        anchor="bottom"
        open={showMobileFilter}
        onClose={() => setShowMobileFilter(false)}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              p: 3,
              maxHeight: '80vh',
            },
          },
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e5]">
          <span className="text-base font-bold uppercase tracking-tight text-[#111111]">
            Bộ lọc nâng cao
          </span>
          <IconButton size="small" onClick={() => setShowMobileFilter(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        <div className="py-4 space-y-5 overflow-y-auto">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#666666] block mb-2">
              Thương hiệu
            </label>
            <div className="flex flex-wrap gap-2">
              <Chip
                label="Tất cả"
                clickable
                color={brand === 'all' ? 'primary' : 'default'}
                onClick={() => setBrand('all')}
                sx={{ borderRadius: '4px', fontWeight: 600 }}
              />
              {brands.map((b) => (
                <Chip
                  key={b}
                  label={b}
                  clickable
                  color={brand === b ? 'primary' : 'default'}
                  onClick={() => setBrand(b)}
                  sx={{ borderRadius: '4px', fontWeight: 600 }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#666666] block mb-2">
              Sắp xếp
            </label>
            <FormControl fullWidth size="small">
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                sx={{ borderRadius: '4px' }}
              >
                {sortOptions.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="pt-4 border-t border-[#e5e5e5] flex gap-3">
          <Button
            variant="outlined"
            fullWidth
            onClick={resetFilters}
            sx={{ borderRadius: '4px', textTransform: 'none', color: '#111111', borderColor: '#ccc' }}
          >
            Đặt lại
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setShowMobileFilter(false)}
            sx={{ borderRadius: '4px', backgroundColor: '#111111', textTransform: 'none', fontWeight: 700 }}
          >
            Áp dụng ({filteredProducts.length})
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
