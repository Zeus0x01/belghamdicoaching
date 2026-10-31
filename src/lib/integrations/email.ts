export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface EmailAdapter {
  send(payload: EmailPayload): Promise<{ delivered: boolean; provider: string }>;
}

class DemoEmailAdapter implements EmailAdapter {
  async send(payload: EmailPayload): Promise<{ delivered: boolean; provider: string }> {
    console.info(
      `[demo-email] Suppressed outgoing email to ${payload.to}: "${payload.subject}"`
    );
    return { delivered: false, provider: "demo" };
  }
}

class LiveEmailAdapter implements EmailAdapter {
  async send(): Promise<{ delivered: boolean; provider: string }> {
    return { delivered: false, provider: "not-configured" };
  }
}

export const email: EmailAdapter = process.env.EMAIL_API_KEY
  ? new LiveEmailAdapter()
  : new DemoEmailAdapter();
