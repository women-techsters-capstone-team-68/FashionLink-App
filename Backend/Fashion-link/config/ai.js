/**
 * OpenRouter AI configuration.
 * Reads from process.env; used by openrouter.service and recommendation flow.
 */
const openRouterBaseUrl = 'https://openrouter.ai/api/v1';
const openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
// Default: free model (no credits). Override with AI_MODEL for paid models (e.g. openai/gpt-4o-mini).
const aiModel = process.env.AI_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';

function ensureApiKey() {
  if (!openRouterApiKey || openRouterApiKey.trim() === '') {
    throw new Error('OPENROUTER_API_KEY is not set. Add it to .env to use AI features.');
  }
}

module.exports = {
  openRouterBaseUrl,
  openRouterApiKey,
  aiModel,
  ensureApiKey
};
