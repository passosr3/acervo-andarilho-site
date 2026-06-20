'use client'

import Script from 'next/script'

export function UmamiScript() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  if (!websiteId) return null

  return (
    <Script
      defer
      src="https://analytics.acervoandarilho.com.br/script.js"
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  )
}
