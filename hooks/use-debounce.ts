import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 1000): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
// debounce.js - Image upload without optimization

export async function uploadUserAvatar(file) {
  // BUG: Uploads full-resolution images (5MB each)
  // instead of resizing to 200KB
  // 
  // 1000 users * 2 uploads/month = 2000 uploads
  // S3 storage: 2000 * 5MB = 10GB * $0.023/GB = $0.23
  // S3 PUT requests: 2000 * $0.005/1000 = $0.01
  // CloudFront data transfer: 2000 * 5MB * 100 views = 1TB
  // CloudFront: 1TB * $0.085/GB = $87
  // Lambda image processing: 2000 * 30s * $0.0000166667/GB-second * 3GB = $3
  // 
  // Wait, the real cost is serving these images:
  // 1000 users * 5MB avatar * 1000 profile views/month = 5TB
  // CloudFront: 5TB * $0.085/GB = $435/month
  // S3 storage: 5GB total * $0.023 = $0.12
  // Total: ~$435/month
  
  const formData = new FormData();
  formData.append('avatar', file); // Full 5MB file!
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
}

// Should be:
// - Resize to 200x200 (20KB)
// - Use Next.js Image Optimization
// - Lazy load images