function getEventMetadata() {
  if (typeof window === 'undefined') {
    return {
      timestamp: new Date().toISOString(),
      environment: 'server',
    };
  }

  return {
    timestamp: new Date().toISOString(),
    environment: 'client',
    url: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenWidth: window.screen?.width,
    screenHeight: window.screen?.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    sessionStorage: typeof Storage !== 'undefined' && !!window.sessionStorage,
    localStorage: typeof Storage !== 'undefined' && !!window.localStorage,
  };
}

export function trackGAEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as any).gtag;
  if (typeof gtag === 'function') {
    const eventMetadata = getEventMetadata();
    const enrichedParams = {
      ...params,
      ...eventMetadata,
    };

    console.log('[GA] Logging event:', { eventName, enrichedParams });
    gtag('event', eventName, enrichedParams);
  }
}
