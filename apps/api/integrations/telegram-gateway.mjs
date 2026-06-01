const TELEGRAM_GATEWAY_BASE_URL = "https://gatewayapi.telegram.org/";

export class TelegramGatewayClient {
  constructor({ token, callbackUrl }) {
    this.token = token;
    this.callbackUrl = callbackUrl;
  }

  async sendVerificationMessage({ phoneNumber, payload }) {
    if (!this.token) {
      return {
        request_id: `dev-${Date.now()}`,
        phone_number: phoneNumber,
        payload,
        verification_status: { status: "dev_code_valid" }
      };
    }

    return this.#post("sendVerificationMessage", {
      phone_number: phoneNumber,
      code_length: 6,
      ttl: 300,
      payload,
      callback_url: this.callbackUrl || undefined
    });
  }

  async checkVerificationStatus({ requestId, code }) {
    if (!this.token) {
      return {
        request_id: requestId,
        verification_status: {
          status: code === "000000" ? "code_valid" : "code_invalid",
          code_entered: code,
          updated_at: Math.floor(Date.now() / 1000)
        }
      };
    }

    return this.#post("checkVerificationStatus", {
      request_id: requestId,
      code
    });
  }

  async #post(method, body) {
    const response = await fetch(`${TELEGRAM_GATEWAY_BASE_URL}${method}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      const message = payload.error || `Telegram Gateway HTTP ${response.status}`;
      throw new Error(message);
    }
    return payload.result;
  }
}
