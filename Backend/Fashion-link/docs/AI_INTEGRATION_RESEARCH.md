# AI Integration Research: OpenAI vs OpenRouter

## Summary

For FashionLink’s **artisan recommendation system** and **conversation (chat) endpoints**, both **OpenAI** and **OpenRouter** are viable. **OpenRouter** is the simplest single integration when you want one API and the option to switch or try multiple models (OpenAI, Anthropic, etc.) without changing code.

---

## OpenAI API

- **Endpoint:** `POST https://api.openai.com/v1/chat/completions`
- **Auth:** `Authorization: Bearer <OPENAI_API_KEY>`
- **Pros:** Official, stable, full control over OpenAI models (GPT-4o, etc.).
- **Cons:** Only OpenAI models; other providers need separate integrations.

---

## OpenRouter API

- **Endpoint:** `POST https://openrouter.ai/api/v1/chat/completions`
- **Auth:** `Authorization: Bearer <OPENROUTER_API_KEY>`
- **Request/response:** Compatible with **OpenAI’s chat completion format** (same `messages`, `model`, `stream`, etc.).
- **Pros:**
  - One API key and one endpoint for many models (OpenAI, Anthropic, Google, etc.).
  - Same schema as OpenAI, so minimal code difference.
  - Easy to switch models via `model` (e.g. `openai/gpt-4o`, `anthropic/claude-3.5-sonnet`).
  - Supports streaming (SSE) with `stream: true`.
- **Cons:** Extra hop; dependent on OpenRouter’s availability.

---

## Recommendation

- **Use OpenRouter** if you want one integration and flexibility to try different models (OpenAI, Claude, etc.) with a single key and endpoint.
- **Use OpenAI** if you only care about OpenAI models and prefer talking to OpenAI directly.

This codebase supports **both**: set `AI_PROVIDER=openrouter` (default) or `AI_PROVIDER=openai` and the corresponding API key in `.env`.

---

## Use in FashionLink

1. **Artisan recommendations**  
   - Input: client profile (e.g. body shape, skin tone, style preferences, location).  
   - Back end: load artisans from DB, send summary + client context to the AI.  
   - Output: list of recommended artisans with short reasons (e.g. JSON).

2. **Conversation endpoints**  
   - **POST /api/ai/chat**  
     - Body: `{ "messages": [ { "role": "user", "content": "..." } ] }`.  
     - Returns: `{ "message": { "role": "assistant", "content": "..." } }`.  
   - Optional: streaming later via `stream: true` and SSE.

---

## Environment Variables

| Variable            | Required (if using provider) | Description                    |
|---------------------|-----------------------------|--------------------------------|
| `OPENROUTER_API_KEY` | When `AI_PROVIDER=openrouter` | OpenRouter API key            |
| `OPENAI_API_KEY`     | When `AI_PROVIDER=openai`     | OpenAI API key                |
| `AI_PROVIDER`        | No (default: openrouter)      | `openrouter` or `openai`      |
| `AI_MODEL`           | No (defaults below)           | Model id for chat/recommendations |

Default models:

- OpenRouter: `openai/gpt-4o-mini` (cost-effective) or `openai/gpt-4o`.
- OpenAI: `gpt-4o-mini` or `gpt-4o`.
