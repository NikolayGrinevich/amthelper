'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => reset(), 500);
    return () => clearTimeout(timer);
  }, [reset]);

  return null;
}