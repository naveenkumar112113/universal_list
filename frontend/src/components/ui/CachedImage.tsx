import { useState, useEffect } from 'react';

const BROKEN_IMAGES_KEY = 'universal_list_broken_images';

const getInitialBrokenImages = (): Record<string, boolean> => {
  try {
    const stored = localStorage.getItem(BROKEN_IMAGES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Global cache object so all instances of CachedImage share state instantly
const globalBrokenImages: Record<string, boolean> = getInitialBrokenImages();

const saveBrokenImage = (url: string) => {
  globalBrokenImages[url] = true;
  try {
    localStorage.setItem(BROKEN_IMAGES_KEY, JSON.stringify(globalBrokenImages));
  } catch (e) {
    console.error('Failed to save broken image cache', e);
  }
};

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback: React.ReactNode;
}

export function CachedImage({ src, fallback, alt, ...props }: CachedImageProps) {
  const [isBroken, setIsBroken] = useState(src ? !!globalBrokenImages[src] : true);

  useEffect(() => {
    if (src) {
      setIsBroken(!!globalBrokenImages[src]);
    } else {
      setIsBroken(true);
    }
  }, [src]);

  if (isBroken || !src) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => {
        saveBrokenImage(src);
        setIsBroken(true);
      }}
      {...props}
    />
  );
}
