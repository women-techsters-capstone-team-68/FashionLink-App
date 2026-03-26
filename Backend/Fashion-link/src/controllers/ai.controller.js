/**
 * AI controller: chat and artisan recommendations (OpenRouter).
 */
const openrouterService = require('../services/openrouter.service');
const recommendationService = require('../services/recommendation.service');
const { ensureApiKey } = require('../../config/ai');

const MAX_MESSAGES = 20;
const VALID_ROLES = ['system', 'user', 'assistant'];
const CHAT_SYSTEM_PROMPT = 'You are a helpful assistant for FashionLink, a platform connecting clients with fashion artisans (tailors, weavers, shoemakers). Help users find artisans, styles, or general fashion advice. Be concise and friendly.';

/**
 * POST /api/ai/chat
 * Body: { messages: [ { role, content } ] }
 */
exports.chat = async (req, res) => {
  try {
    ensureApiKey();
  } catch (err) {
    return res.status(503).json({ message: 'AI service is not configured.' });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: 'Body must include a non-empty "messages" array.' });
  }
  if (messages.length > MAX_MESSAGES) {
    return res.status(400).json({ message: `Maximum ${MAX_MESSAGES} messages allowed.` });
  }

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (!m || typeof m.content !== 'string') {
      return res.status(400).json({ message: `messages[${i}] must have "content" (string).` });
    }
    if (m.role && !VALID_ROLES.includes(m.role)) {
      return res.status(400).json({ message: `messages[${i}].role must be one of: ${VALID_ROLES.join(', ')}.` });
    }
  }

  const withSystem = [{ role: 'system', content: CHAT_SYSTEM_PROMPT }, ...messages.map((m) => ({ role: m.role || 'user', content: m.content }))];

  try {
    const { content } = await openrouterService.chat(withSystem);
    return res.json({
      message: {
        role: 'assistant',
        content
      }
    });
  } catch (err) {
    const status = err.status || 502;
    const message = status === 504 ? 'Request timed out. Please try again.' : 'AI request failed. Please try again.';
    return res.status(status).json({ message });
  }
};

/**
 * POST /api/ai/recommendations/artisans
 * Body: client profile (all optional): bodyShape, skinTone, stylePreferences, location, occasion, budgetHint, notes
 */
exports.getArtisanRecommendations = async (req, res) => {
  try {
    ensureApiKey();
  } catch (err) {
    return res.status(503).json({ message: 'AI service is not configured.' });
  }

  const clientProfile = req.body && typeof req.body === 'object' ? req.body : {};

  try {
    const result = await recommendationService.getArtisanRecommendations(clientProfile);
    return res.json(result);
  } catch (err) {
    console.error('[AI] getArtisanRecommendations error:', err.message, err.status || '', err.code || '');
    const status = err.status || 502;
    const message = status === 504 ? 'Request timed out. Please try again.' : 'Recommendations could not be generated. Please try again.';
    return res.status(status).json({ message });
  }
};
