export interface CampaignData {
  source?: string      // utm_source - where traffic came from (google, facebook, newsletter)
  medium?: string      // utm_medium - marketing medium (cpc, email, social)
  campaign?: string    // utm_campaign - campaign name (summer_sale, product_launch)
  term?: string        // utm_term - keyword for paid search 
  content?: string     // utm_content - to differentiate similar content/links
  id?: string          // Custom campaign ID
}

export interface ConversionEvent {
  name: string
  value?: number
  currency?: string
  campaign?: CampaignData
  properties?: Record<string, any>
}

export class CampaignTracker {
  private campaignData: CampaignData | null = null
  private sessionId: string = ''

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeTracking()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeTracking() {
    if (typeof window !== 'undefined') {
      this.extractCampaignFromUrl()
      this.storeCampaignData()
    }
  }

  private extractCampaignFromUrl() {
    const params = new URLSearchParams(window.location.search)
    
    const campaignData: CampaignData = {}
    
    // Standard UTM parameters
    if (params.get('utm_source')) campaignData.source = params.get('utm_source')!
    if (params.get('utm_medium')) campaignData.medium = params.get('utm_medium')!
    if (params.get('utm_campaign')) campaignData.campaign = params.get('utm_campaign')!
    if (params.get('utm_term')) campaignData.term = params.get('utm_term')!
    if (params.get('utm_content')) campaignData.content = params.get('utm_content')!
    
    // Custom campaign ID parameter
    if (params.get('cid')) campaignData.id = params.get('cid')!
    
    // Only store if we have campaign data
    if (Object.keys(campaignData).length > 0) {
      this.campaignData = campaignData
    }
  }

  private storeCampaignData() {
    if (this.campaignData && typeof window !== 'undefined') {
      // Store in localStorage for session persistence
      localStorage.setItem('unburdy_campaign', JSON.stringify({
        data: this.campaignData,
        timestamp: Date.now(),
        sessionId: this.sessionId
      }))
    }
  }

  private loadStoredCampaignData() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('unburdy_campaign')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          // Use stored data if within 24 hours and no new campaign data
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 && !this.campaignData) {
            this.campaignData = parsed.data
            this.sessionId = parsed.sessionId
          }
        } catch (e) {
          console.warn('Failed to parse stored campaign data:', e)
        }
      }
    }
  }

  public getCampaignData(): CampaignData | null {
    if (!this.campaignData) {
      this.loadStoredCampaignData()
    }
    return this.campaignData
  }

  public getSessionId(): string {
    return this.sessionId
  }

  // Track page views with campaign context
  public trackPageView(page: string, properties: Record<string, any> = {}) {
    const campaign = this.getCampaignData()
    
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track('page-view', {
        page,
        session_id: this.sessionId,
        ...properties,
        ...(campaign && {
          utm_source: campaign.source,
          utm_medium: campaign.medium,
          utm_campaign: campaign.campaign,
          utm_term: campaign.term,
          utm_content: campaign.content,
          campaign_id: campaign.id
        })
      })
    }
  }

  // Track conversion events (signups, purchases, etc.)
  public trackConversion(event: ConversionEvent) {
    const campaign = this.getCampaignData()
    
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track(event.name, {
        session_id: this.sessionId,
        value: event.value,
        currency: event.currency,
        ...event.properties,
        ...(campaign && {
          utm_source: campaign.source,
          utm_medium: campaign.medium,
          utm_campaign: campaign.campaign,
          utm_term: campaign.term,
          utm_content: campaign.content,
          campaign_id: campaign.id
        })
      })
    }

    // Also track internally for analysis
    this.logConversion(event, campaign)
  }

  private logConversion(event: ConversionEvent, campaign: CampaignData | null) {
    console.log('🎯 Conversion Tracked:', {
      event: event.name,
      value: event.value,
      campaign: campaign,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    })
  }

  // Get campaign attribution string for analytics
  public getAttributionString(): string {
    const campaign = this.getCampaignData()
    if (!campaign) return 'direct'
    
    const parts = []
    if (campaign.source) parts.push(`source:${campaign.source}`)
    if (campaign.medium) parts.push(`medium:${campaign.medium}`)
    if (campaign.campaign) parts.push(`campaign:${campaign.campaign}`)
    
    return parts.join('|') || 'direct'
  }

  // Clean URL from campaign parameters (optional, for cleaner URLs)
  public cleanUrl() {
    if (typeof window !== 'undefined' && this.campaignData) {
      const url = new URL(window.location.href)
      const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'cid']
      
      paramsToRemove.forEach(param => url.searchParams.delete(param))
      
      // Only update URL if parameters were removed
      if (url.href !== window.location.href) {
        window.history.replaceState({}, '', url.href)
      }
    }
  }
}

// Singleton instance
let campaignTracker: CampaignTracker | null = null

export function useCampaignTracker(): CampaignTracker {
  if (!campaignTracker) {
    campaignTracker = new CampaignTracker()
  }
  return campaignTracker
}
