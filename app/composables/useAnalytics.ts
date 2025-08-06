import { useCampaignTracker, type CampaignData, type ConversionEvent } from '~/utils/campaignTracker'

export function useAnalytics() {
  const tracker = useCampaignTracker()

  // Track page views automatically
  const trackPageView = (pageName?: string, properties?: Record<string, any>) => {
    const route = useRoute()
    const page = pageName || route.path
    tracker.trackPageView(page, properties)
  }

  // Track conversion events
  const trackConversion = (eventName: string, value?: number, properties?: Record<string, any>) => {
    const event: ConversionEvent = {
      name: eventName,
      value,
      properties
    }
    tracker.trackConversion(event)
  }

  // Specific conversion tracking methods
  const trackSignup = (method: 'email' | 'google' | 'facebook' = 'email', value?: number) => {
    trackConversion('signup', value, { method })
  }

  const trackOnboardingComplete = (stepsCompleted: number = 5) => {
    trackConversion('onboarding_complete', stepsCompleted, { steps: stepsCompleted })
  }

  const trackTrialStart = (planType: string = 'standard') => {
    trackConversion('trial_start', 0, { plan: planType })
  }

  const trackContactForm = (formType: string = 'contact') => {
    trackConversion('contact_form_submit', 1, { form_type: formType })
  }

  const trackPricePageView = (planFocus?: string) => {
    trackPageView('/preise', { plan_focus: planFocus })
  }

  // Get campaign data for display or conditional logic
  const getCampaignData = (): CampaignData | null => {
    return tracker.getCampaignData()
  }

  const getAttributionString = (): string => {
    return tracker.getAttributionString()
  }

  // Check if user came from specific campaign
  const isFromCampaign = (campaignName?: string): boolean => {
    const campaign = getCampaignData()
    if (!campaign) return false
    if (!campaignName) return true
    return campaign.campaign === campaignName
  }

  const isFromSource = (source: string): boolean => {
    const campaign = getCampaignData()
    return campaign?.source === source
  }

  const isFromMedium = (medium: string): boolean => {
    const campaign = getCampaignData()
    return campaign?.medium === medium
  }

  // Clean URL from campaign parameters
  const cleanUrl = () => {
    tracker.cleanUrl()
  }

  return {
    // Tracking methods
    trackPageView,
    trackConversion,
    trackSignup,
    trackOnboardingComplete,
    trackTrialStart,
    trackContactForm,
    trackPricePageView,
    
    // Campaign data access
    getCampaignData,
    getAttributionString,
    isFromCampaign,
    isFromSource,
    isFromMedium,
    
    // Utility
    cleanUrl
  }
}
