/**
 * Umami event tracking
 *
 * Usage:
 *   trackEvent('universe_click', { universe: 'darkalien' })
 *   trackEvent('teaser_email_submit')
 *   trackEvent('auth_login')
 *   trackEvent('auth_signup')
 */

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void
    }
  }
}

export function trackEvent(name: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!window.umami) return
  window.umami.track(name, data)
}

// Typed helpers for the events defined in MKT-08
export const Analytics = {
  universeClick: (universe: string) =>
    trackEvent('universe_click', { universe }),

  teaserEmailSubmit: (email?: string) =>
    trackEvent('teaser_email_submit', email ? { email } : undefined),

  authLogin: () => trackEvent('auth_login'),

  authSignup: () => trackEvent('auth_signup'),
}
