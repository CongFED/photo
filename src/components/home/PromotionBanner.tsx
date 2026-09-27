'use client';

import { Card, Chip } from '@mui/material';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { promotions } from '@/data/promotions';

export default function PromotionBanner() {
  const activePromos = promotions.filter((p) => p.id !== 'promo-combo');

  return (
    <section className="py-16 md:py-24 bg-white border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LocalOfferOutlinedIcon sx={{ fontSize: 18, color: '#111111' }} />
              <span className="text-xs uppercase tracking-widest font-bold text-[#666666]">
                Chính sách chiết khấu
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111111]">
              Ưu đãi theo thời gian thuê
            </h2>
          </div>
          <p className="text-sm text-[#666666] max-w-sm">
            Tự động áp dụng chiết khấu trực tiếp trên tổng giá trị đơn thuê khi bạn chọn đủ số ngày.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {activePromos.map((promo, index) => {
            const isHighlighted = index === 2;
            return (
              <Card
                key={promo.id}
                sx={{
                  border: isHighlighted ? '1px solid #111111' : '1px solid #e5e5e5',
                  borderRadius: '8px',
                  backgroundColor: isHighlighted ? '#111111' : '#fbfbfa',
                  color: isHighlighted ? '#ffffff' : '#111111',
                  p: { xs: 3, md: 4 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '220px',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: isHighlighted
                      ? '0 16px 36px rgba(0,0,0,0.2)'
                      : '0 10px 25px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <div className="flex items-center justify-between">
                  <Chip
                    label={promo.label}
                    size="small"
                    sx={{
                      backgroundColor: isHighlighted ? '#2a2a2a' : '#ffffff',
                      color: isHighlighted ? '#ffffff' : '#333333',
                      border: isHighlighted ? '1px solid #444444' : '1px solid #e0e0e0',
                      fontWeight: 700,
                      fontSize: '0.6875rem',
                      borderRadius: '4px',
                    }}
                  />
                  {isHighlighted && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#4ade80]">
                      Tiết kiệm nhất
                    </span>
                  )}
                </div>

                <div className="mt-8">
                  <p className="text-4xl md:text-6xl font-black tracking-tight">
                    -{promo.discountPercent}%
                  </p>
                  <p
                    className="text-xs md:text-sm mt-2 font-medium"
                    style={{ color: isHighlighted ? '#cccccc' : '#666666' }}
                  >
                    {promo.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
