import Hero from '@/components/home/Hero';
import RentalSearch from '@/components/home/RentalSearch';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromotionBanner from '@/components/home/PromotionBanner';
import FeedbackGallery from '@/components/home/FeedbackGallery';
import RentalProcess from '@/components/home/RentalProcess';
import { Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

export default function HomePage() {
  return (
    <>
      <Hero />
      <RentalSearch />
      <FeaturedCategories />
      <FeaturedProducts />
      <PromotionBanner />
      <RentalProcess />
      <FeedbackGallery />

      {/* Contact CTA Section */}
      <section id="contact" className="py-20 md:py-28 bg-[#fbfbfa] border-b border-[#e5e5e5]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs uppercase tracking-widest font-bold text-[#666666]">
            Hỗ trợ nhanh 24/7
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111111] mt-2">
            Cần tư vấn thiết bị?
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#666666] max-w-lg mx-auto">
            Đội ngũ kỹ thuật viên giàu kinh nghiệm sẽ hỗ trợ bạn setup combo máy ảnh, lens và phụ kiện tối ưu cho từng dự án.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="contained"
              size="large"
              href="tel:0909123456"
              startIcon={<PhoneIcon />}
              sx={{
                backgroundColor: '#111111',
                color: '#ffffff !important',
                borderRadius: '4px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                px: 3.5,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#2a2a2a',
                  color: '#ffffff !important',
                },
              }}
            >
              Gọi ngay 0909 123 456
            </Button>

            <Button
              variant="outlined"
              size="large"
              href="mailto:support@thuecamera.demo"
              startIcon={<EmailIcon />}
              sx={{
                borderColor: '#111111',
                color: '#111111 !important',
                borderRadius: '4px',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                '&:hover': {
                  borderColor: '#000000',
                  backgroundColor: '#f0f0ed',
                  color: '#111111 !important',
                },
              }}
            >
              Gửi email tư vấn
            </Button>
          </div>

          <p className="mt-6 text-xs text-[#888888]">
            Chi nhánh Quận 1: 123 Nguyễn Huệ · Chi nhánh Quận 7: 456 Nguyễn Thị Thập
          </p>
        </div>
      </section>
    </>
  );
}
