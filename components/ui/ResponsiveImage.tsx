'use client'
import Image from 'next/image';
import { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className = ""
}: ResponsiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const placeholderSvg = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M2 2h28v20H2z' fill='%23eee'/%3E%3Cpath d='M2 2h28' stroke='%23eee' stroke-width='2'/%3E%3Cpath d='M2 22h28' stroke='%23eee' stroke-width='2'/%3E%3Cpath d='M2 2v20' stroke='%23eee' stroke-width='2'/%3E%3Cpath d='M30 2v20' stroke='%23eee' stroke-width='2'/%3E%3Cg fill='%23a3a3a3'%3E%3Cpath d='M10 8h12v8H10z'/%3E%3Ccircle cx='14' cy='12' r='1.5'/%3E%3Cpath d='M10 14l3-3 2 2 4-4 3 3'/%3E%3C/g%3E%3C/svg%3E`;

  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <svg 
          width="40%" 
          height="40%" 
          viewBox="0 0 32 24" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-400"
        >
          <rect x="2" y="2" width="28" height="20" fill="#eee"/>
          <g fill="currentColor">
            <rect x="10" y="8" width="12" height="8"/>
            <circle cx="14" cy="12" r="1.5"/>
            <path d="M10 14l3-3 2 2 4-4 3 3"/>
          </g>
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`transition-opacity duration-300 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      } ${className}`}
      onLoadingComplete={() => setIsLoading(false)}
      onError={() => setHasError(true)}
      placeholder="blur"
      blurDataURL={placeholderSvg}
    />
  );
}