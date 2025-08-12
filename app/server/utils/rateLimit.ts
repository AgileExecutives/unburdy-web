/**
 * Rate Limiting Service
 * Simple in-memory rate limiting for API endpoints
 * For production, consider using Redis or a database
 */

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitEntry {
  count: number
  resetTime: number
}

export class RateLimitService {
  private readonly rateLimitMap = new Map<string, RateLimitEntry>()
  private readonly config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  /**
   * Check if request is allowed for the given identifier (usually IP)
   */
  checkRate(identifier: string): { allowed: boolean; resetTime?: number } {
    const now = Date.now()
    
    if (!this.rateLimitMap.has(identifier)) {
      // First request from this identifier
      this.rateLimitMap.set(identifier, { 
        count: 1, 
        resetTime: now + this.config.windowMs 
      })
      return { allowed: true }
    }

    const rateLimit = this.rateLimitMap.get(identifier)!
    
    if (now > rateLimit.resetTime) {
      // Window has expired, reset
      this.rateLimitMap.set(identifier, { 
        count: 1, 
        resetTime: now + this.config.windowMs 
      })
      return { allowed: true }
    }

    if (rateLimit.count >= this.config.maxRequests) {
      // Rate limit exceeded
      return { 
        allowed: false, 
        resetTime: rateLimit.resetTime 
      }
    }

    // Increment count
    rateLimit.count++
    return { allowed: true }
  }

  /**
   * Get remaining requests for identifier
   */
  getRemainingRequests(identifier: string): number {
    const entry = this.rateLimitMap.get(identifier)
    if (!entry || Date.now() > entry.resetTime) {
      return this.config.maxRequests
    }
    return Math.max(0, this.config.maxRequests - entry.count)
  }

  /**
   * Clean up expired entries (call periodically)
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, value] of this.rateLimitMap.entries()) {
      if (now > value.resetTime) {
        this.rateLimitMap.delete(key)
      }
    }
  }

  /**
   * Get current map size (for monitoring)
   */
  getMapSize(): number {
    return this.rateLimitMap.size
  }
}

// Default rate limit for contact forms: 5 requests per 10 minutes
export const contactRateLimit = new RateLimitService({
  maxRequests: 5,
  windowMs: 10 * 60 * 1000 // 10 minutes
})

// Cleanup expired entries every hour
setInterval(() => {
  contactRateLimit.cleanup()
}, 60 * 60 * 1000)
