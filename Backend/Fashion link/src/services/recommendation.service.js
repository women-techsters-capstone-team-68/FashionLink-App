/**
 * Recommendation service: style suggestions (stub) and AI-powered artisan recommendations via OpenRouter.
 */
const { ArtisanProfile } = require('../../models');
const openrouterService = require('./openrouter.service');

const BIO_TRUNCATE = 200;
const MAX_RECOMMENDATIONS = 10;

const SYSTEM_PROMPT = `You are a fashion and style advisor for FashionLink, a platform connecting clients with skilled fashion artisans (tailors, weavers, shoemakers, etc.). Given a client's profile and a list of artisans with their skills and specializations, recommend the most relevant artisans and explain why in 1-2 sentences per artisan. Respond only with valid JSON in this exact shape: { "recommendations": [ { "artisanId": <number>, "reason": "<string>", "styleHint": "<string or null>" } ] }. Order by relevance. Include up to 10 recommendations.`;

function truncate(str, maxLen) {
  if (typeof str !== 'string') return '';
  return str.length <= maxLen ? str : str.slice(0, maxLen) + '...';
}

function toSummary(artisan) {
  const a = artisan.get ? artisan.get({ plain: true }) : artisan;
  return {
    id: a.id,
    name: a.name,
    role: a.role,
    location: a.location,
    category: a.category,
    rating: a.rating != null ? Number(a.rating) : null,
    experience: a.experience,
    experienceLevel: a.experienceLevel,
    skills: Array.isArray(a.skills) ? a.skills : (a.skills ? [a.skills] : []),
    bio: truncate(a.bio || '', BIO_TRUNCATE),
    collabTypes: Array.isArray(a.collabTypes) ? a.collabTypes : (a.collabTypes ? [a.collabTypes] : [])
  };
}

/**
 * Get AI-powered artisan recommendations from OpenRouter using real DB data.
 * @param {Object} clientProfile - Optional: bodyShape, skinTone, stylePreferences, location, occasion, budgetHint, notes.
 * @returns {Promise<{ recommendations: Array<{ artisanId, reason, styleHint?, artisan? }> }>}
 */
async function getArtisanRecommendations(clientProfile = {}) {
  const artisans = await ArtisanProfile.findAll({
    attributes: ['id', 'name', 'role', 'location', 'category', 'rating', 'experience', 'experienceLevel', 'skills', 'bio', 'collabTypes']
  });

  if (artisans.length === 0) {
    return { recommendations: [], message: 'No artisans available.' };
  }

  const artisanSummaries = artisans.map(toSummary);
  const userContent = `Client profile: ${JSON.stringify(clientProfile)}\n\nArtisans:\n${JSON.stringify(artisanSummaries)}`;
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userContent }
  ];

  let content;
  try {
    const response = await openrouterService.chat(messages, {
      response_format: { type: 'json_object' },
      max_tokens: 1024
    });
    content = response.content;
  } catch (err) {
    throw err;
  }

  // Extract JSON from response (free models may wrap in markdown or add text)
  function extractJson(str) {
    if (typeof str !== 'string' || !str.trim()) return null;
    let s = str.trim();
    const jsonBlock = s.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonBlock) s = jsonBlock[1].trim();
    const start = s.indexOf('{');
    const end = s.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) s = s.slice(start, end + 1);
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  }

  let parsed = extractJson(content);
  if (!parsed) {
    console.error('[recommendation] AI response was not valid JSON. First 500 chars:', String(content).slice(0, 500));
    return { recommendations: [], message: 'Recommendations could not be generated. Please try again.' };
  }

  let list = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
  const idSet = new Set(artisans.map((a) => a.id));

  list = list
    .filter((r) => {
      if (!r || typeof r.reason !== 'string') return false;
      const id = typeof r.artisanId === 'number' ? r.artisanId : parseInt(r.artisanId, 10);
      return Number.isInteger(id) && idSet.has(id);
    })
    .slice(0, MAX_RECOMMENDATIONS);

  const recommendations = list.map((r) => {
    const id = typeof r.artisanId === 'number' ? r.artisanId : parseInt(r.artisanId, 10);
    const artisan = artisans.find((a) => a.id === id);
    const rec = {
      artisanId: id,
      reason: r.reason,
      styleHint: r.styleHint ?? null
    };
    if (artisan) {
      rec.artisan = artisan.get ? artisan.get({ plain: true }) : artisan;
    }
    return rec;
  });

  return { recommendations };
}

/**
 * Legacy: style/color recommendations (stub).
 * clientProfile = { bodyShape?, skinTone? }
 */
async function getStyleRecommendations(clientProfile) {
  return [
    { style: 'A-line dress', color: 'Pastel Pink' },
    { style: 'High-waist trousers', color: 'Navy Blue' }
  ];
}

module.exports = {
  getStyleRecommendations,
  getArtisanRecommendations
};
