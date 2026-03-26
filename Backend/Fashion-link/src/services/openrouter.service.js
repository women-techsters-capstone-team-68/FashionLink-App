/**
 * OpenRouter chat completions service.
 * Single place that calls OpenRouter API (OpenAI-compatible).
 */
const { openRouterBaseUrl, openRouterApiKey, aiModel, ensureApiKey } = require('../../config/ai');

const DEFAULT_MAX_TOKENS = 1024;
const REQUEST_TIMEOUT_MS = 30000;

/**
 * Call OpenRouter chat completions.
 * @param {Array<{ role: string, content: string }>} messages - Chat messages (system/user/assistant).
 * @param {Object} options - Optional: response_format, max_tokens, temperature.
 * @returns {Promise<{ content: string, usage?: Object }>}
 */
async function chat(messages, options = {}) {
  ensureApiKey();

  const body = {
    model: aiModel,
    messages,
    max_tokens: options.max_tokens ?? DEFAULT_MAX_TOKENS,
    temperature: options.temperature ?? 0.7
  };

  if (options.response_format) {
    body.response_format = options.response_format;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${openRouterBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openRouterApiKey}`
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const message = data.error?.message || data.message || res.statusText;
      const err = new Error(message);
      err.status = res.status;
      err.code = data.error?.code;
      throw err;
    }

    const content = data.choices?.[0]?.message?.content ?? '';
    const usage = data.usage || undefined;

    return { content, usage };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const e = new Error('AI request timed out');
      e.status = 504;
      throw e;
    }
    throw err;
  }
}

module.exports = {
  chat
};
