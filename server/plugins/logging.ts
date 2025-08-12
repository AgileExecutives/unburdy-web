export default defineNitroPlugin(async (nitroApp) => {
  console.log('🚀 Nitro server logging plugin initialized')
  
  // Add request logging
  nitroApp.hooks.hook('request', async (event) => {
    console.log(`📥 ${event.node.req.method} ${event.node.req.url}`)
  })

  // Add error logging
  nitroApp.hooks.hook('error', async (error, { event }) => {
    if (event) {
      console.error(`❌ Server error on ${event.node.req.method} ${event.node.req.url}:`, error)
    } else {
      console.error('❌ Server error:', error)
    }
  })
})