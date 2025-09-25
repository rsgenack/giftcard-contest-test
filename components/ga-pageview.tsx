'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function GAPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const gtag = (window as any).gtag as undefined | ((...args: any[]) => void);
    if (typeof gtag !== 'function') return;

    const page_path = `${pathname || '/'}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`;
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path,
    });
  }, [pathname, searchParams]);

  return null;
}
