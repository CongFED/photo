'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { feedbackItems } from '@/data/feedback';

export default function FeedbackGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const selectedItem = feedbackItems.find((f) => f.id === selectedImage);

  return (
    <section id="feedback" className="py-20 md:py-28 bg-white border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-[#666666]">
            Kho ảnh cộng đồng
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111111] mt-2">
            Feedback Khách Hàng
          </h2>
          <p className="mt-3 text-sm text-[#666666] max-w-lg mx-auto">
            Những tác phẩm thực tế được chụp bởi khách hàng sử dụng thiết bị thuê từ cửa hàng.
          </p>
        </div>

        {/* Masonry Columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {feedbackItems.map((item) => {
            const height =
              item.aspectRatio === 'portrait'
                ? 'aspect-[3/4]'
                : item.aspectRatio === 'square'
                ? 'aspect-square'
                : 'aspect-[4/3]';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item.id)}
                className="group relative w-full overflow-hidden cursor-pointer break-inside-avoid rounded-lg border border-[#e5e5e5] bg-[#fbfbfa] transition-all hover:border-[#111111] hover:shadow-xl"
              >
                <div className={`relative ${height} w-full overflow-hidden`}>
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Gradient shadow for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5 text-white">
                    <div className="flex justify-start">
                      <Chip
                        label={item.camera}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.65)',
                          backdropFilter: 'blur(6px)',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.625rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold tracking-tight text-white drop-shadow">
                        {item.caption}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-[#cccccc]">
                        <span className="font-medium text-white/90">{item.customer}</span>
                        <span className="flex items-center gap-1 text-[#aaaaaa]">
                          <PlaceOutlinedIcon sx={{ fontSize: 13 }} />
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MUI Lightbox Dialog */}
      <Dialog
        open={Boolean(selectedImage && selectedItem)}
        onClose={() => setSelectedImage(null)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#111111',
              color: '#ffffff',
              borderRadius: '8px',
              overflow: 'hidden',
            },
          },
        }}
      >
        {selectedItem && (
          <div className="relative">
            <IconButton
              onClick={() => setSelectedImage(null)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: '#ffffff',
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' },
                zIndex: 20,
              }}
            >
              <CloseIcon />
            </IconButton>

            <DialogContent sx={{ p: 0 }}>
              <div className="relative aspect-[4/3] w-full max-h-[70vh]">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.caption}
                  fill
                  className="object-contain bg-black"
                  sizes="90vw"
                />
              </div>

              <div className="p-6 bg-[#161616] border-t border-[#262626]">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {selectedItem.caption}
                </h3>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Chip
                    icon={<CameraAltOutlinedIcon sx={{ color: '#ffffff !important', fontSize: 16 }} />}
                    label={selectedItem.camera}
                    size="small"
                    sx={{ backgroundColor: '#2a2a2a', color: '#ffffff', borderRadius: '4px' }}
                  />
                  <Chip
                    icon={<PersonOutlinedIcon sx={{ color: '#ffffff !important', fontSize: 16 }} />}
                    label={`Nhiếp ảnh: ${selectedItem.customer}`}
                    size="small"
                    sx={{ backgroundColor: '#2a2a2a', color: '#ffffff', borderRadius: '4px' }}
                  />
                  <Chip
                    icon={<PlaceOutlinedIcon sx={{ color: '#ffffff !important', fontSize: 16 }} />}
                    label={selectedItem.location}
                    size="small"
                    sx={{ backgroundColor: '#2a2a2a', color: '#ffffff', borderRadius: '4px' }}
                  />
                </div>
              </div>
            </DialogContent>
          </div>
        )}
      </Dialog>
    </section>
  );
}
