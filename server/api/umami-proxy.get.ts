// Nuxt server API route: /api/umami-proxy
// Proxies requests to the Umami script endpoint, avoiding CORS issues

import { defineEventHandler, proxyRequest } from 'h3'
import { createLogger } from '../utils/logger'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig().public
  const logger = createLogger('UMAMI_PROXY')
  
  logger.info('Umami proxy request received')
  logger.debug('Request details', {
    method: event.method,
    url: event.path,
    userAgent: getHeader(event, 'user-agent')
  })

  const umamiHost = config.umamiHost as string || 'https://analytics.unburdy.de'
  const umamiSiteId = config.umamiSiteId as string || ''
  
  let targetUrl = `${umamiHost}/script.js`
  if (umamiSiteId) {
    targetUrl += `?id=${encodeURIComponent(umamiSiteId)}`
  }

  logger.debug('Proxying to target URL', { targetUrl })
  
  try {
    return proxyRequest(event, targetUrl)
  } catch (error: any) {
    logger.error('Umami proxy error', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to proxy analytics script'
    })
  }
})
