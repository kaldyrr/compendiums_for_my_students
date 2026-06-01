export class PlategaClient {
  constructor({ baseUrl, merchantId, secret, returnUrl, failedUrl }) {
    this.baseUrl = baseUrl || "https://app.platega.io/";
    this.merchantId = merchantId;
    this.secret = secret;
    this.returnUrl = returnUrl;
    this.failedUrl = failedUrl;
  }

  isConfigured() {
    return Boolean(this.merchantId && this.secret);
  }

  async createPaymentLink({ amount, currency, description, payload }) {
    if (!this.isConfigured()) {
      return {
        transactionId: `dev-payment-${Date.now()}`,
        status: "PENDING",
        url: `http://localhost:3000/dev-payment?payload=${encodeURIComponent(payload)}`,
        expiresIn: "00:15:00",
        rate: null
      };
    }

    const response = await fetch(new URL("v2/transaction/process", this.baseUrl), {
      method: "POST",
      headers: {
        "X-MerchantId": this.merchantId,
        "X-Secret": this.secret,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        paymentDetails: { amount, currency },
        description,
        return: this.returnUrl,
        failedUrl: this.failedUrl,
        payload
      })
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body?.message || `Platega HTTP ${response.status}`);
    }
    return body;
  }

  validateWebhookHeaders(headers) {
    if (!this.isConfigured()) return true;
    return headers["x-merchantid"] === this.merchantId && headers["x-secret"] === this.secret;
  }
}
