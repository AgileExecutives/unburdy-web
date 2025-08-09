// Nuxt server API route: /api/umami-proxy
// Proxies requests to the Umami script endpoint, avoiding CORS issues

import { defineEventHandler, proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig().public
  const umamiHost = config.umamiHost || 'https://analytics.unburdy.de'
  const umamiSiteId = config.umamiSiteId || ''
  // Proxy the script.js file, adding the id as a query param if present
  let targetUrl = `${umamiHost}/script.js`
  if (umamiSiteId) {
    targetUrl += `?id=${encodeURIComponent(umamiSiteId)}`
  }
  return proxyRequest(event, targetUrl)
})
