'use client';

import { Card } from '@mui/material';
import Grid from '@mui/material/Grid';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const steps = [
  {
    number: '01',
    title: 'Chọn thiết bị',
    description: 'Duyệt bộ sưu tập camera, lens & phụ kiện. Lọc theo thương hiệu và nhu cầu.',
    icon: CameraAltOutlinedIcon,
  },
  {
    number: '02',
    title: 'Chọn thời gian',
    description: 'Chọn ngày nhận & trả. Hệ thống kiểm tra số lượng trống ngay tức thì.',
    icon: DateRangeOutlinedIcon,
  },
  {
    number: '03',
    title: 'Đặt lịch online',
    description: 'Điền thông tin nhận máy, nhận mã đặt lịch độc quyền chỉ sau 1 cú click.',
    icon: AssignmentTurnedInOutlinedIcon,
  },
  {
    number: '04',
    title: 'Nhận máy tận tay',
    description: 'Nhận tại cửa hàng hoặc giao tận nơi, kiểm tra test máy trực tiếp cùng kỹ thuật viên.',
    icon: StorefrontOutlinedIcon,
  },
  {
    number: '05',
    title: 'Hoàn tất & Hoàn cọc',
    description: 'Bàn giao lại thiết bị đúng hẹn, nhận hoàn lại 100% tiền đặt cọc nhanh chóng.',
    icon: CheckCircleOutlinedIcon,
  },
];

export default function RentalProcess() {
  return (
    <section id="process" className="py-20 md:py-28 bg-[#fbfbfa] border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-[#666666]">
            Minh bạch & Đơn giản
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111111] mt-2">
            Quy trình thuê 5 bước
          </h2>
          <p className="mt-3 text-sm text-[#666666] max-w-md mx-auto">
            Không thủ tục rườm rà, sẵn sàng đồng hành cùng từng khung hình của bạn.
          </p>
        </div>

        {/* 5 Connected Step Cards */}
        <Grid container spacing={2.5} columns={{ xs: 1, sm: 2, md: 5 }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Grid key={step.number} size={1}>
                <Card
                  sx={{
                    height: '100%',
                    border: '1px solid #e5e5e5',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: '#111111',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 24px rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-black text-[#d0d0d0] tracking-tighter">
                        {step.number}
                      </span>
                      <div className="w-9 h-9 rounded-full bg-[#f4f4f2] flex items-center justify-center text-[#111111]">
                        <Icon sx={{ fontSize: 18 }} />
                      </div>
                    </div>

                    <h3 className="text-base font-bold uppercase tracking-tight text-[#111111]">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#666666] mt-2 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#f0f0f0]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
                      Bước {idx + 1} / 5
                    </span>
                  </div>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </section>
  );
}
