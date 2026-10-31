import { uuid } from "@/lib/utils";
import type { EventDispatcher, IntegrationEvent, IntegrationEventType } from "./events";

const STORAGE_KEY = "bc_integration_events";
const MAX_EVENTS = 500;

function read(): IntegrationEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as IntegrationEvent[]) : [];
  } catch {
    return [];
  }
}

function write(events: IntegrationEvent[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, MAX_EVENTS)));
}

class DemoEventBus implements EventDispatcher {
  async dispatch(event: Omit<IntegrationEvent, "id">): Promise<IntegrationEvent> {
    const full: IntegrationEvent = {
      id: uuid(),
      ...event,
    };
    const events = read();
    events.unshift(full);
    write(events);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("bc:integration-events"));
    }
    return full;
  }

  async list(): Promise<IntegrationEvent[]> {
    return read();
  }
}

export const eventBus = new DemoEventBus();

export function logEvent(
  type: IntegrationEventType,
  payloadRef: string
): void {
  eventBus
    .dispatch({
      type,
      source: "website",
      payloadRef,
      status: "processed",
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    })
    .catch(() => undefined);
}
