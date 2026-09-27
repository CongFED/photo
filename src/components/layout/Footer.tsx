import Link from 'next/link';
import Grid from '@mui/material/Grid';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white py-16 md:py-20 border-t border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Grid container spacing={{ xs: 4, md: 5 }}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Link href="/" className="text-xl font-black uppercase tracking-tight text-white block">
              Thuê Camera
            </Link>
            <p className="mt-4 text-xs sm:text-sm text-[#999999] leading-relaxed">
              Dịch vụ cho thuê máy ảnh mirrorless, ống kính và phụ kiện làm phim chuyên nghiệp tại TP. Hồ Chí Minh.
              Thiết bị chính hãng, kiểm định kỹ thuật nghiêm ngặt trước mỗi ca bàn giao.
            </p>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#cccccc] mb-4">
              Danh mục thiết bị
            </h4>
            <ul className="space-y-2 text-xs text-[#aaaaaa]">
              <li><Link href="/products?category=camera" className="hover:text-white transition-colors">Máy ảnh Mirrorless</Link></li>
              <li><Link href="/products?category=lens" className="hover:text-white transition-colors">Ống kính (Sony / Canon / Fuji)</Link></li>
              <li><Link href="/products?category=action-camera" className="hover:text-white transition-colors">Action Cam & 360°</Link></li>
              <li><Link href="/products?category=gimbal" className="hover:text-white transition-colors">Gimbal chống rung DJI</Link></li>
              <li><Link href="/products?category=phu-kien" className="hover:text-white transition-colors">Đèn Led, Mic thu âm & Chân máy</Link></li>
            </ul>
          </Grid>

          {/* Support */}
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#cccccc] mb-4">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-2 text-xs text-[#aaaaaa]">
              <li><Link href="/#process" className="hover:text-white transition-colors">Quy trình thuê 5 bước</Link></li>
              <li><Link href="/booking/lookup" className="hover:text-white transition-colors">Tra cứu đơn đặt lịch</Link></li>
              <li><Link href="/admin-demo" className="hover:text-white transition-colors">Trang quản trị (Admin Demo)</Link></li>
              <li><Link href="/#feedback" className="hover:text-white transition-colors">Ảnh Feedback thực tế</Link></li>
            </ul>
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#cccccc] mb-4">
              Thông tin liên hệ
            </h4>
            <div className="space-y-3 text-xs text-[#aaaaaa]">
              <div className="flex items-start gap-2.5">
                <PlaceOutlinedIcon sx={{ fontSize: 16, color: '#888888', mt: 0.25, shrink: 0 }} />
                <span>Chi nhánh 1: 123 Nguyễn Huệ, Quận 1, TP.HCM<br />Chi nhánh 2: 456 Nguyễn Thị Thập, Quận 7, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <PhoneIphoneOutlinedIcon sx={{ fontSize: 16, color: '#888888', shrink: 0 }} />
                <span className="font-bold text-white">0909 123 456 (Zalo / Hotline)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <EmailOutlinedIcon sx={{ fontSize: 16, color: '#888888', shrink: 0 }} />
                <span>support@thuecamera.demo</span>
              </div>
            </div>
          </Grid>
        </Grid>

        <div className="mt-12 pt-8 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
          <p>© 2026 Thuê Camera. Bản quyền demo giao diện Next.js + MUI.</p>
          <div className="flex gap-4">
            <span className="hover:text-[#aaaaaa] cursor-pointer">Điều khoản dịch vụ</span>
            <span className="hover:text-[#aaaaaa] cursor-pointer">Chính sách bảo mật</span>
            <span className="hover:text-[#aaaaaa] cursor-pointer">Chính sách đền bù</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
