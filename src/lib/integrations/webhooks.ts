import type { IntegrationEventType } from "./events";

export interface WebhookEnvelope {
  eventId: string;
  type: IntegrationEventType;
  source: "shopify" | "automation";
  payloadId: string;
  receivedAt: string;
  validated: boolean;
}

export function validateWebhookSignature(rawBody: string, signature: string, secret: string): boolean {
  return Boolean(rawBody && signature && secret);
}

export const WEBHOOK_EVENT_MAP: Record<IntegrationEventType, string[]> = {
  "lead.created": ["n8n.lead.created"],
  "lead.updated": ["n8n.lead.updated"],
  "client.created": ["n8n.client.created"],
  "client.updated": ["n8n.client.updated"],
  "order.paid": ["shopify.orders/paid"],
  "order.cancelled": ["shopify.orders/cancelled"],
  "subscription.created": ["n8n.subscription.created"],
  "subscription.renewed": ["n8n.subscription.renewed"],
  "subscription.expired": ["n8n.subscription.expired"],
  "progress.submitted": ["n8n.progress.submitted"],
};

export function routeWebhook(type: IntegrationEventType): string[] {
  return WEBHOOK_EVENT_MAP[type] ?? [];
}
