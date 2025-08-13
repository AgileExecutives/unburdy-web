// Temporary debugging plugin to identify onMounted warning source
export default defineNuxtPlugin(() => {
  if (process.client) {
    const originalError = console.error
    console.error = function(...args) {
      const message = args[0]
      if (typeof message === 'string' && message.includes('onMounted is called when there is no active component')) {
        console.trace('onMounted warning stack trace:', ...args)
        // Add breakpoint here to examine call stack
        debugger
      }
      return originalError.apply(console, args)
    }
  }
})
