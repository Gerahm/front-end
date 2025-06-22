'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Spinner } from './ui/spinner';
import { isValidImageUrl } from '@/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
}

const ProductImage = ({ src, alt }: ProductImageProps) => {
  const getInitialSrc = () => {
    return isValidImageUrl(src) ? src : '/assets/default-product.svg';
  };

  const [imgSrc, setImgSrc] = useState(getInitialSrc);
  const [error, setError] = useState(!isValidImageUrl(src));
  const [isLoading, setIsLoading] = useState(isValidImageUrl(src));

  useEffect(() => {
    if (isValidImageUrl(src)) {
      setImgSrc(src);
      setError(false);
      setIsLoading(true);
    } else {
      setImgSrc('/assets/default-product.svg');
      setError(true);
      setIsLoading(false);
    }
  }, [src]);

  const handleError = () => {
    if (!error) {
      setError(true);
      setImgSrc('/assets/default-product.svg');
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-16 h-16 relative rounded-md overflow-hidden">
      {isLoading && !error && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
        onError={handleError}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};

export default ProductImage;
