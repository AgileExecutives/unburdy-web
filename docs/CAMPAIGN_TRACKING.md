# Campaign Tracking & Analytics

This document explains how to use the integrated campaign tracking system with Umami analytics.

## Overview

The campaign tracking system automatically captures UTM parameters from URLs and tracks conversions throughout the user journey. All data is sent to Umami for analysis and reporting.

## Setup

### 1. Umami Configuration

Add these environment variables to your `.env` file:

```bash
NUXT_PUBLIC_UMAMI_URL=https://analytics.eu.umami.is/script.js
NUXT_PUBLIC_UMAMI_SITE_ID=your-umami-site-id-here  
NUXT_PUBLIC_DOMAIN=unburdy.com
```

### 2. Campaign URL Parameters

The system supports these URL parameters:

- `utm_source` - Traffic source (google, facebook, newsletter)
- `utm_medium` - Marketing medium (cpc, email, social)  
- `utm_campaign` - Campaign identifier (summer_sale, free_trial)
- `utm_term` - Keywords for paid search
- `utm_content` - Content differentiation (button_a, hero_cta)
- `cid` - Custom campaign ID for internal tracking

## Campaign URL Examples

### Google Ads Campaign
```
https://unburdy.com?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale&utm_term=therapy+software&utm_content=hero_button
```

### Facebook Social Campaign  
```
https://unburdy.de/preise?utm_source=facebook&utm_medium=social&utm_campaign=back_to_school&utm_content=pricing_focus
```

### Email Newsletter
```
https://unburdy.com/lc/anmelden?utm_source=newsletter&utm_medium=email&utm_campaign=free_trial&cid=nl_2025_01
```

## Tracked Events

The system automatically tracks these conversion events:

### 1. Page Views
- All page visits with campaign attribution
- Referrer information
- Page-specific context

### 2. User Conversions
- **signup** - User registration (value: 1)
- **onboarding_complete** - Onboarding finished (value: steps completed)
- **trial_start** - Trial activation (value: 0)
- **campaign_cta_click** - Campaign CTA clicked (value: 1)

### 3. Marketing Events
- **price_page_view** - Pricing page visits with plan focus
- **contact_form_submit** - Contact form submissions

## Usage in Components

### Basic Analytics Tracking

```vue
<script setup>
const { trackConversion, getCampaignData, isFromCampaign } = useAnalytics()

// Track custom events
const trackButtonClick = () => {
  trackConversion('custom_button_click', 1, { 
    button_name: 'hero_cta',
    page: 'landing'
  })
}

// Check campaign attribution
const campaignData = getCampaignData()
const isFromGoogleAds = isFromSource('google')
</script>
```

### Campaign-Specific Content

```vue
<template>
  <div v-if="isFromCampaign('summer_sale')" class="campaign-banner">
    🌞 Sommer-Angebot: 3 Monate kostenlos!
  </div>
</template>

<script setup>
const { isFromCampaign } = useAnalytics()
</script>
```

### Campaign Wrapper Component

Use the `CampaignWrapper` component to automatically show campaign-specific content:

```vue
<template>
  <CampaignWrapper>
    <YourPageContent />
  </CampaignWrapper>
</template>
```

## Analytics Dashboard

### Key Metrics to Track

1. **Campaign Performance**
   - Traffic volume by source/medium
   - Conversion rates by campaign
   - Cost per conversion (if cost data available)

2. **User Journey**
   - Page flow from landing to conversion
   - Drop-off points in onboarding
   - Time to conversion

3. **Attribution Analysis**
   - First-touch attribution (campaign that brought user)
   - Multi-touch attribution (all campaigns user interacted with)
   - Campaign assist analysis

### Custom Events in Umami

All tracked events appear in Umami with these properties:
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- `campaign_id` (from cid parameter)
- `session_id` (for session-based analysis)
- Custom properties per event type

## Campaign Testing

### Local Testing

1. Start development server: `npm run dev`
2. Visit with campaign parameters: `http://localhost:3001?utm_source=test&utm_campaign=dev_test`
3. Check browser console for tracking logs
4. Complete signup/onboarding to test full funnel

### A/B Testing

Test different campaign variations:

```bash
# Version A - Focus on features
?utm_campaign=feature_focus&utm_content=features_hero

# Version B - Focus on pricing  
?utm_campaign=price_focus&utm_content=pricing_hero
```

## Best Practices

### 1. Campaign Naming Convention
```
utm_source: platform (google, facebook, newsletter)
utm_medium: type (cpc, email, social, referral)
utm_campaign: campaign_name (summer_sale, free_trial)
utm_content: variant (button_a, hero_cta, sidebar)
```

### 2. URL Management
- Use consistent naming across campaigns
- Keep URLs clean (tracking parameters are automatically removed)
- Include campaign ID (cid) for internal reporting

### 3. Conversion Tracking
- Track micro-conversions (page views, clicks)
- Track macro-conversions (signups, trial starts)
- Include value when possible for ROI calculation

### 4. Privacy Compliance
- Campaign data is stored locally (localStorage) for 24 hours
- No personal data in campaign parameters
- Respects user privacy settings

## Troubleshooting

### Campaign Data Not Tracked
1. Check environment variables are set
2. Verify Umami script loads (check Network tab)
3. Check browser console for errors
4. Ensure URL parameters are correctly formatted

### Conversions Not Appearing
1. Verify events are firing (check console logs)
2. Check Umami site ID is correct
3. Ensure domain matches Umami configuration
4. Check for ad blockers blocking analytics

### Attribution Issues
1. Check localStorage for campaign data
2. Verify session persistence across pages
3. Test full user journey from campaign URL to conversion
4. Check for SPA routing issues

## Reporting & Analysis

### Weekly Campaign Report
1. Traffic volume by campaign
2. Conversion rates by source/medium
3. Top performing campaigns
4. Cost per acquisition (if cost data available)

### Monthly Attribution Analysis
1. Multi-touch attribution paths
2. Campaign assist analysis
3. Time to conversion by campaign type
4. Seasonal campaign performance trends
