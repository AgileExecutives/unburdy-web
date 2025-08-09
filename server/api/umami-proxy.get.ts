// Nuxt server API route: /api/umami-proxy
// Proxies requests to the Umami script endpoint, avoiding CORS issues

import { defineEventHandler, proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig().public
  const logger = createLogger('umami-proxy') 
  logger.info('Umami Proxy Config:', config)
  logger.debug('Incoming request', {
    method: event.method,
    url: event.path,
    headers: event.headers
  })
  const umamiHost = config.umamiHost || 'https://analytics.unburdy.de'
  const umamiSiteId = config.umamiSiteId || ''
  let targetUrl = `${umamiHost}/script.js`
  if (umamiSiteId) {
    targetUrl += `?id=${encodeURIComponent(umamiSiteId)}`
  }
  logger.debug('Proxying to target URL', { targetUrl })
  return proxyRequest(event, targetUrl)
})
