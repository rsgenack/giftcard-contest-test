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

export function createStatsigLogger(statsigClient: any) {
  return {
    logEvent: (eventName: string, value?: number | string, metadata?: Record<string, any>) => {
      const eventMetadata = getEventMetadata();
      const enrichedMetadata = {
        ...metadata,
        ...eventMetadata,
      };

      console.log('[Statsig] Attempting to log event:', {
        eventName,
        value,
        originalMetadata: metadata,
        enrichedMetadata,
        statsigClientAvailable: !!statsigClient,
        statsigClientType: typeof statsigClient,
      });

      if (!statsigClient) {
        console.error('[Statsig] No client available for event:', eventName);
        return;
      }

      if (typeof statsigClient.logEvent !== 'function') {
        console.error('[Statsig] logEvent is not a function:', typeof statsigClient.logEvent);
        return;
      }

      try {
        const result = statsigClient.logEvent(eventName, value, enrichedMetadata);
        console.log('[Statsig] Event logged successfully:', {
          eventName,
          value,
          enrichedMetadata,
          result,
        });
        return result;
      } catch (error) {
        console.error('[Statsig] Error logging event:', {
          eventName,
          value,
          enrichedMetadata,
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
        });
        throw error;
      }
    },
  };
}
