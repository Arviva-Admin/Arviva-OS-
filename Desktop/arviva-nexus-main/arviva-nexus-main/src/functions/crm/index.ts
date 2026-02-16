// CRM Functions - Lead Management, Customer Sentiment
// Script paths map to Windmill flows: f/crm/*

import { windmillClient } from '@/core/windmillClient';

export const crm = {
  createLead: (data: { name: string; email: string; source: string }) =>
    windmillClient.execute('f/crm/create_lead', data),

  scoreLead: (leadId: string) =>
    windmillClient.execute('f/crm/score_lead', { lead_id: leadId }),

  getSentiment: (customerId: string) =>
    windmillClient.execute('f/crm/get_sentiment', { customer_id: customerId }),

  segmentAudience: (criteria: Record<string, unknown>) =>
    windmillClient.execute('f/crm/segment_audience', { criteria }),

  enrichContact: (email: string) =>
    windmillClient.execute('f/crm/enrich_contact', { email }),

  getLifecycleStage: (customerId: string) =>
    windmillClient.execute('f/crm/lifecycle_stage', { customer_id: customerId }),
};
