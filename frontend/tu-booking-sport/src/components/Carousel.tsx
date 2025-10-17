'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CarouselItem {
  id: number;
  imageUrl: string;
  alt: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoSlideInterval?: number;
}

export default function CoverFlowCarousel({ items, autoSlideInterval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [items.length, autoSlideInterval]);

  return (
    <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
      <div 
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {items.map((item, index) => {
          const offset = (index - currentIndex + items.length) % items.length;
          const isCenter = offset === 0;
          const isLeft = offset === items.length - 1;
          const isRight = offset === 1;

          let positionTransform = '';
          let zIndex = 0;
          let opacity = 0.7;
          let scale = 'scale(0.8)';

          if (isCenter) {
            positionTransform = 'translateX(0)';
            scale = 'scale(1)';
            zIndex = 2;
            opacity = 1;
          } else if (isLeft) {
            positionTransform = 'translateX(-80%)'; 
            zIndex = 1;
          } else if (isRight) {
            positionTransform = 'translateX(80%)'; 
            zIndex = 1;
          } else {
            positionTransform = `translateX(${offset < items.length / 2 ? '200%' : '-200%'})`;
            opacity = 0;
          }
          
          return (
            <div
              key={item.id}
              className="absolute w-3/5 h-full top-0 left-1/2 transition-all duration-300 ease-out"
              style={{ 
                transform: `translateX(-50%) ${positionTransform} ${scale}`,
                zIndex, 
                opacity 
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg border border-gray-200">
                <Image
                  src={item.imageUrl}
                  alt={item.alt}
                  layout="fill"
                  objectFit="cover"
                  className="bg-gray-200"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

