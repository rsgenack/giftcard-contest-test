export function trackGAEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as any).gtag;
  if (typeof gtag === 'function') {
    gtag('event', eventName, params || {});
  }
}


