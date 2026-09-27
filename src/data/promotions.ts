import { Promotion } from '@/types/availability';

export const promotions: Promotion[] = [
  {
    id: 'promo-3day',
    minDays: 3,
    discountPercent: 10,
    label: '≥ 3 ngày',
    description: 'Giảm 10% khi thuê từ 3 ngày',
  },
  {
    id: 'promo-5day',
    minDays: 5,
    discountPercent: 15,
    label: '≥ 5 ngày',
    description: 'Giảm 15% khi thuê từ 5 ngày',
  },
  {
    id: 'promo-7day',
    minDays: 7,
    discountPercent: 20,
    label: '≥ 7 ngày',
    description: 'Giảm 20% khi thuê từ 7 ngày',
  },
  {
    id: 'promo-combo',
    minDays: 1,
    discountPercent: 5,
    label: 'Combo',
    description: 'Giảm thêm 5% khi thuê combo body + lens',
  },
];
