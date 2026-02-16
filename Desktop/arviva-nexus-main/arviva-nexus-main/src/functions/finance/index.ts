// Finance Functions - Invoicing, Cashflow, Tax Management
// Script paths map to Windmill flows: f/finance/*

import { windmillClient } from '@/core/windmillClient';

export const finance = {
  generateInvoice: (customerId: string, items: { name: string; amount: number }[]) =>
    windmillClient.execute('f/finance/generate_invoice', { customer_id: customerId, items }),

  getCashflow: (period: 'daily' | 'weekly' | 'monthly') =>
    windmillClient.execute('f/finance/get_cashflow', { period }),

  calculateTax: (region: string, revenue: number) =>
    windmillClient.execute('f/finance/calculate_tax', { region, revenue }),

  getRevenueForecast: (days: number) =>
    windmillClient.execute('f/finance/revenue_forecast', { days }),

  reconcilePayments: (dateRange: { from: string; to: string }) =>
    windmillClient.execute('f/finance/reconcile_payments', { date_range: dateRange }),
};
