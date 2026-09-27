'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button, Chip, Rating, Card, CardContent, Box } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white border-b border-[#e5e5e5]">
      {/* Subtle background grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column — Editorial Typography & CTA */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#1a7a2e] animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-semibold text-[#666666]">
                Dịch vụ cho thuê thiết bị tại TP.HCM & Toàn Quốc
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#111111] leading-[1.05] uppercase">
              <span className="block">Chọn Máy.</span>
              <span className="block mt-1">Chọn Ngày.</span>
              <span className="block mt-1 text-[#888888]">Bắt Đầu Chụp.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#555555] max-w-xl font-normal leading-relaxed">
              Hệ thống máy ảnh mirrorless, lens cine & phụ kiện chính hãng từ Sony, Canon, Fujifilm, Nikon và DJI.
              Kiểm tra tình trạng trống theo thời gian thực, thủ tục nhận — trả nhanh gọn.
            </p>

            {/* CTAs with MUI Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                component={Link}
                href="/products"
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowDownwardIcon />}
                sx={{
                  px: 3.5,
                  py: 1.5,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  backgroundColor: '#111111',
                  color: '#ffffff !important',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: '#2a2a2a',
                    color: '#ffffff !important',
                    transform: 'translateY(-1px)',
                  },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                Tìm thiết bị ngay
              </Button>

              <Button
                component={Link}
                href="/booking/lookup"
                variant="outlined"
                size="large"
                startIcon={<SearchIcon />}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderColor: '#d0d0d0',
                  color: '#111111 !important',
                  borderRadius: '4px',
                  '&:hover': {
                    borderColor: '#111111',
                    backgroundColor: '#f7f7f5',
                    color: '#111111 !important',
                  },
                }}
              >
                Tra cứu booking
              </Button>
            </div>

            {/* Micro guarantees */}
            <div className="mt-10 pt-6 border-t border-[#f0f0f0] flex flex-wrap items-center gap-6 text-xs text-[#666666]">
              <div className="flex items-center gap-1.5">
                <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#1a7a2e' }} />
                <span>Thiết bị đã kiểm định cảm biến</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#1a7a2e' }} />
                <span>Không giữ giấy tờ gốc bắt buộc</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircleOutlinedIcon sx={{ fontSize: 16, color: '#1a7a2e' }} />
                <span>Đổi máy nhanh nếu có sự cố</span>
              </div>
            </div>
          </div>

          {/* Right Column — Featured Camera Card with Real Photography */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card
              sx={{
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                backgroundColor: '#ffffff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                  borderColor: '#111111',
                },
              }}
            >
              {/* Product Visual */}
              <div className="relative aspect-[4/3] bg-[#fbfbfa] overflow-hidden group">
                <Image
                  src="/images/products/fujifilm-x100vi.jpg"
                  alt="Fujifilm X100VI"
                  fill
                  priority
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 500px"
                />

                <div className="absolute top-4 left-4 flex gap-2">
                  <Chip
                    label="NỔI BẬT"
                    size="small"
                    sx={{
                      backgroundColor: '#111111',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.6875rem',
                      letterSpacing: '0.08em',
                      borderRadius: '4px',
                    }}
                  />
                  <Chip
                    label="CÒN 2 MÁY"
                    size="small"
                    sx={{
                      backgroundColor: '#e8f5e9',
                      color: '#1a7a2e',
                      border: '1px solid #c8e6c9',
                      fontWeight: 700,
                      fontSize: '0.6875rem',
                      letterSpacing: '0.04em',
                      borderRadius: '4px',
                    }}
                  />
                </div>

                <div className="absolute top-4 right-4">
                  <Chip
                    label="FUJIFILM"
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: '#dddddd',
                      backgroundColor: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(4px)',
                      fontWeight: 700,
                      fontSize: '0.6875rem',
                    }}
                  />
                </div>
              </div>

              {/* Card Details */}
              <CardContent sx={{ p: 3 }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
                      Fujifilm X100VI
                    </h3>
                    <p className="text-xs text-[#666666] mt-1">
                      40.2MP · 23mm f/2 · 20 Film Simulation · 6.2K
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-extrabold text-[#111111]">500.000đ</p>
                    <p className="text-xs text-[#888888]">/ ngày</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#f0f0f0]">
                  <div className="flex items-center gap-1.5">
                    <Rating value={5} readOnly size="small" sx={{ color: '#111111' }} />
                    <span className="text-xs font-semibold text-[#111111]">5.0</span>
                    <span className="text-xs text-[#888888]">(312 đánh giá)</span>
                  </div>

                  <Button
                    component={Link}
                    href="/products/fujifilm-x100vi"
                    size="small"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      color: '#111111',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      p: 0,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats and Location Row */}
            <div className="grid grid-cols-2 gap-4">
              <Card
                sx={{
                  border: '1px solid #e5e5e5',
                  borderRadius: '6px',
                  p: 2.5,
                  backgroundColor: '#fbfbfa',
                }}
              >
                <div className="flex items-center gap-2 text-[#555555]">
                  <PlaceOutlinedIcon sx={{ fontSize: 18, color: '#111111' }} />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    TP. Hồ Chí Minh
                  </span>
                </div>
                <p className="text-xs text-[#666666] mt-1.5 font-medium">
                  Chi nhánh Quận 1 & Quận 7
                </p>
                <p className="text-[11px] text-[#888888] mt-0.5">Hỗ trợ giao tận nơi nội thành</p>
              </Card>

              <Card
                sx={{
                  border: '1px solid #111111',
                  borderRadius: '6px',
                  p: 2.5,
                  backgroundColor: '#111111',
                  color: '#ffffff',
                }}
              >
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#aaaaaa]">
                  Kho thiết bị
                </p>
                <p className="text-2xl font-black mt-1 tracking-tight text-white">150+ MÁY & LENS</p>
                <p className="text-[11px] text-[#888888] mt-0.5">Sẵn sàng booking ngay</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
