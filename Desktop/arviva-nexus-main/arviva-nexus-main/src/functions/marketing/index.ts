// Marketing Functions - Content Generation, Campaign Tracking
// Script paths map to Windmill flows: f/marketing/*

import { windmillClient } from '@/core/windmillClient';

export const marketing = {
  generateContent: (type: 'email' | 'landing' | 'social', brief: string) =>
    windmillClient.execute('f/marketing/generate_content', { type, brief }),

  trackCampaign: (campaignId: string) =>
    windmillClient.execute('f/marketing/track_campaign', { campaign_id: campaignId }),

  abTest: (variants: { id: string; content: string }[]) =>
    windmillClient.execute('f/marketing/ab_test', { variants }),

  getKeywordTrends: (keywords: string[]) =>
    windmillClient.execute('f/marketing/keyword_trends', { keywords }),

  optimizeLandingPage: (pageId: string) =>
    windmillClient.execute('f/marketing/optimize_landing', { page_id: pageId }),

  scheduleSocialPost: (platform: string, content: string, scheduledAt: string) =>
    windmillClient.execute('f/marketing/schedule_social', { platform, content, scheduled_at: scheduledAt }),
};
