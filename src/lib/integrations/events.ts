export type IntegrationEventType =
  | "lead.created"
  | "lead.updated"
  | "client.created"
  | "client.updated"
  | "order.paid"
  | "order.cancelled"
  | "subscription.created"
  | "subscription.renewed"
  | "subscription.expired"
  | "progress.submitted";

export interface IntegrationEvent {
  id: string;
  type: IntegrationEventType;
  source: "website" | "admin" | "shopify" | "automation";
  payloadRef: string;
  status: "pending" | "processed" | "failed";
  createdAt: string;
  processedAt?: string;
  errorMessage?: string;
}

export interface EventDispatcher {
  dispatch(event: Omit<IntegrationEvent, "id">): Promise<IntegrationEvent>;
  list(): Promise<IntegrationEvent[]>;
}

export const isEventType = (value: string): value is IntegrationEventType =>
  [
    "lead.created",
    "lead.updated",
    "client.created",
    "client.updated",
    "order.paid",
    "order.cancelled",
    "subscription.created",
    "subscription.renewed",
    "subscription.expired",
    "progress.submitted",
  ].includes(value);
