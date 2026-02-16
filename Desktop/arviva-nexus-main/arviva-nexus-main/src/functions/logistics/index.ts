// Logistics Functions - External API connections (Pica, etc.)
// Script paths map to Windmill flows: f/logistics/*

import { windmillClient } from '@/core/windmillClient';

export const logistics = {
  syncPica: (action: string, params: Record<string, unknown>) =>
    windmillClient.execute('f/logistics/pica_sync', { action, ...params }),

  checkInventory: (productId: string) =>
    windmillClient.execute('f/logistics/check_inventory', { product_id: productId }),

  trackShipment: (trackingId: string) =>
    windmillClient.execute('f/logistics/track_shipment', { tracking_id: trackingId }),

  syncAffiliate: (network: string, dateRange: { from: string; to: string }) =>
    windmillClient.execute('f/logistics/sync_affiliate', { network, date_range: dateRange }),

  getExchangeRates: (currencies: string[]) =>
    windmillClient.execute('f/logistics/exchange_rates', { currencies }),
};
