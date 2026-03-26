# FashionLink AI Integration — Detailed Implementation Plan (OpenRouter)

This document is the **full implementation plan** for integrating OpenRouter into FashionLink: **artisan recommendation system** and **conversation (chat) endpoints**. All implementation steps, API contracts, and code touchpoints are specified here.

---

## Table of Contents

1. [Prerequisites & OpenRouter Setup](#1-prerequisites--openrouter-setup)
2. [Environment & Configuration](#2-environment--configuration)
3. [OpenRouter API Reference](#3-openrouter-api-reference)
4. [Architecture Overview](#4-architecture-overview)
5. [Artisan Recommendation System](#5-artisan-recommendation-system)
6. [Conversation (Chat) Endpoints](#6-conversation-chat-endpoints)
7. [Request/Response Schemas](#7-requestresponse-schemas)
8. [Error Handling & Fallbacks](#8-error-handling--fallbacks)
9. [Security & Best Practices](#9-security--best-practices)
10. [Step-by-Step Implementation Checklist](#10-step-by-step-implementation-checklist)
11. [Testing Plan](#11-testing-plan)
12. [Future Enhancements](#12-future-enhancements)

---

## 1. Prerequisites & OpenRouter Setup

### 1.1 OpenRouter Account

| Step | Action |
|------|--------|
| 1 | Go to [https://openrouter.ai](https://openrouter.ai) and sign up. |
| 2 | In **Keys** (or **Settings**), create an API key. Copy and store it securely. |
| 3 | (Optional) Add credits or link a payment method if you exceed free tier. |
| 4 | (Optional) Review [Models](https://openrouter.ai/docs/models) to choose a model (e.g. `openai/gpt-4o-mini`). |

### 1.2 Model Choice (OpenRouter)

| Model ID | Use case | Notes |
|----------|----------|--------|
| `openai/gpt-4o-mini` | Default for chat + recommendations | Cost-effective, good quality. |
| `openai/gpt-4o-mini-2024-07-18` | Pinned version | Same as above, version-locked. |
| `openai/gpt-4o` | Higher quality | More expensive, use for complex reasoning. |
| `anthropic/claude-3.5-sonnet` | Alternative | Use via same OpenRouter API by changing `model` only. |

**Recommendation:** Start with `openai/gpt-4o-mini`; switch to `openai/gpt-4o` or another model via `AI_MODEL` if needed.

### 1.3 Project Prerequisites

- Node.js 18+ (for native `fetch`).
- Existing FashionLink backend (Express, Sequelize, MySQL).
- No new npm packages required for basic flow (use `fetch`); optional: `openai` SDK if you prefer.

---

## 2. Environment & Configuration

### 2.1 Environment Variables

Add to `.env` (and ensure `.env` is in `.gitignore`):

```env
# --- OpenRouter AI ---
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AI_MODEL=openai/gpt-4o-mini
```

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | API key from OpenRouter dashboard. |
| `AI_MODEL` | No | Model ID. Default in code: `openai/gpt-4o-mini`. |

### 2.2 Config Module (Optional but Recommended)

**File:** `config/ai.js`

- Read `process.env.OPENROUTER_API_KEY` and `process.env.AI_MODEL`.
- Export:
  - `openRouterApiKey`: string (throw or log if missing when AI routes are used).
  - `aiModel`: string (default `openai/gpt-4o-mini`).
- Base URL: `https://openrouter.ai/api/v1` (constant in this plan).

This keeps env access in one place and makes tests and key validation easier.

---

## 3. OpenRouter API Reference

### 3.1 Chat Completions Endpoint

| Item | Value |
|------|--------|
| **URL** | `POST https://openrouter.ai/api/v1/chat/completions` |
| **Headers** | `Content-Type: application/json` |
| **Auth** | `Authorization: Bearer <OPENROUTER_API_KEY>` |
| **Optional** | `HTTP-Referer`, `X-OpenRouter-Title` for attribution |

### 3.2 Request Body (JSON)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | e.g. `openai/gpt-4o-mini` |
| `messages` | array | Yes | `[{ "role": "system" \| "user" \| "assistant", "content": "..." }]` |
| `max_tokens` | number | No | Default e.g. 1024; cap to control cost. |
| `temperature` | number | No | 0–2; lower = more deterministic. |
| `stream` | boolean | No | `true` for SSE streaming (Phase 2). |
| `response_format` | object | No | `{ "type": "json_object" }` for JSON output. |

### 3.3 Response (Non-Streaming)

- **200 OK:** Body is JSON:
  - `choices[0].message.role` → typically `"assistant"`.
  - `choices[0].message.content` → string (the reply or JSON string if `response_format` used).
  - `usage` → `{ prompt_tokens, completion_tokens, total_tokens }` (for logging/cost).
- **4xx/5xx:** OpenRouter error body; handle like any REST API error.

### 3.4 References

- [OpenRouter Chat Completion](https://openrouter.ai/docs/api-reference/chat-completion)
- [OpenRouter Models](https://openrouter.ai/docs/models)

---

## 4. Architecture Overview

### 4.1 New/Modified Files

| Layer | File | Purpose |
|-------|------|--------|
| Config | `config/ai.js` | API key, model, base URL. |
| Service | `src/services/openrouter.service.js` | Single module that calls OpenRouter (chat + structured prompts). |
| Service | `src/services/recommendation.service.js` | **Modify.** Fetch artisans from DB; build prompt; call OpenRouter; parse and return recommendations. |
| Controller | `src/controllers/ai.controller.js` | Handlers for `/api/ai/chat` and `/api/ai/recommendations/artisans`. |
| Routes | `routes/ai.routes.js` | POST `/chat`, POST `/recommendations/artisans`. |
| App | `src/app.js` | Mount `ai.routes.js` under `/api/ai`. |

### 4.2 Data Flow (High Level)

**Chat:**

- Client → `POST /api/ai/chat` with `{ messages }` → `ai.controller.chat` → `openrouter.service.chat(messages)` → OpenRouter → response parsed → `{ message }` returned.

**Artisan recommendations:**

- Client → `POST /api/ai/recommendations/artisans` with client profile → `ai.controller.getArtisanRecommendations` → `recommendation.service.getArtisanRecommendations(clientProfile)`:
  1. Load artisans from DB (e.g. `ArtisanProfile.findAll` with attributes needed for prompt).
  2. Build system + user prompt (client profile + artisan list).
  3. Call `openrouter.service.chat(messages, { response_format: { type: 'json_object' } })`.
  4. Parse JSON response → list of `{ artisanId, reason }` (and optionally style/color hints).
  5. Enrich with full artisan records and return.

---

## 5. Artisan Recommendation System

### 5.1 Goal

Given a **client profile** (body shape, skin tone, style preferences, location, etc.), return a **ranked list of recommended artisans** with short, personalized reasons, using OpenRouter and real data from `ArtisanProfiles`.

### 5.2 Client Profile Input (API)

Suggested shape (allow partial; only send what the client provides):

```json
{
  "bodyShape": "hourglass",
  "skinTone": "medium",
  "stylePreferences": ["traditional", "modern"],
  "location": "Lagos, Nigeria",
  "occasion": "wedding",
  "budgetHint": "mid-range",
  "notes": "Looking for Aso-oke and tailoring"
}
```

All fields optional; backend should not require every field.

### 5.3 Artisan Data Sent to OpenRouter

From `ArtisanProfile` (and optionally `User`), send a **summary per artisan** so the model can reason without huge payloads:

- `id`, `name`, `role`, `location`, `category`, `rating`, `experience`, `experienceLevel`
- `skills` (array, e.g. from JSON column)
- `bio` (truncate to e.g. 200 chars if long)
- `collabTypes` (array)

Do **not** send raw binary or huge portfolio arrays; at most a short text summary like “Portfolio: 3 items (Aso-oke, traditional wear).”

### 5.4 Prompt Design (Recommendations)

**System message (fixed):**

- Explain the app: FashionLink connects clients with fashion artisans (tailors, weavers, etc.).
- Task: Given a list of artisans (with id, name, role, category, skills, bio, location, rating, experience) and a client profile, return a **JSON array** of recommendations.
- Output format (strict):
  - Top 5–10 artisans, ordered by relevance.
  - Each item: `artisanId` (number), `reason` (short string, 1–2 sentences), optional `styleHint` or `colorHint` if relevant.

**User message:**

- JSON (or clear key-value) of client profile provided by the client.
- Then: “Artisans available:” followed by a plain-text or JSON list of artisan summaries (id, name, role, category, skills, bio snippet, location, rating, experience).

**Example system prompt (to be tuned):**

```text
You are a fashion and style advisor for FashionLink, a platform connecting clients with skilled fashion artisans (tailors, weavers, shoemakers, etc.). Given a client's profile and a list of artisans with their skills and specializations, recommend the most relevant artisans and explain why in 1-2 sentences per artisan. Respond only with valid JSON.
```

**Required JSON output shape:**

```json
{
  "recommendations": [
    { "artisanId": 1, "reason": "Matches your interest in Aso-oke and traditional wear; high rating and experience.", "styleHint": "A-line and traditional cuts" },
    { "artisanId": 2, "reason": "Strong in leather and accessories; good for complementary pieces.", "styleHint": null }
  ]
}
```

- In code: request `response_format: { type: "json_object" }` and parse `choices[0].message.content` as JSON.
- Validate that `recommendations` is an array and each element has `artisanId` and `reason`; discard or fix malformed entries.

### 5.5 Recommendation Service Logic (Pseudocode)

```text
getArtisanRecommendations(clientProfile):
  1. artisans = ArtisanProfile.findAll({ attributes: [id, name, role, location, category, rating, experience, experienceLevel, skills, bio, collabTypes] })
  2. If artisans.length === 0, return { recommendations: [], message: "No artisans available." }
  3. Build artisanSummaries = artisans.map(a => ({ id, name, role, location, category, rating, experience, skills, bio: truncate(bio, 200), collabTypes }))
  4. systemPrompt = "<fixed system prompt as above>"
  5. userContent = "Client profile: " + JSON.stringify(clientProfile) + "\n\nArtisans:\n" + JSON.stringify(artisanSummaries)
  6. messages = [{ role: "system", content: systemPrompt }, { role: "user", content: userContent }]
  7. response = await openrouter.service.chat(messages, { response_format: { type: "json_object" }, max_tokens: 1024 })
  8. parsed = JSON.parse(response.content)
  9. recommendations = parsed.recommendations || []
  10. Validate and sanitize (artisanId must exist in DB; limit to e.g. 10)
  11. For each rec, optionally attach full artisan: artisan = artisans.find(a => a.id === rec.artisanId)
  12. Return { recommendations: [...], artisans: [...] } or similar as per your API design
```

### 5.6 Recommendation API Endpoint

- **Method/URL:** `POST /api/ai/recommendations/artisans`
- **Auth:** Use existing auth middleware (e.g. client, artisan, admin).
- **Body:** JSON object matching client profile shape above (all fields optional).
- **Response:**  
  - 200: `{ recommendations: [{ artisanId, reason, styleHint?, artisan?: {...} }], ... }`  
  - 4xx/5xx: Standard error JSON.

---

## 6. Conversation (Chat) Endpoints

### 6.1 Non-Streaming Chat (Phase 1)

- **Method/URL:** `POST /api/ai/chat`
- **Auth:** Required (same as recommendations).
- **Body:** `{ "messages": [ { "role": "user", "content": "Hello, I need a tailor in Lagos." } ] }`
  - Allow `system`, `user`, `assistant` in history; validate role and presence of `content`.
- **Behavior:**  
  - Call OpenRouter with `model`, `messages`, `max_tokens` (e.g. 1024).  
  - Return `{ "message": { "role": "assistant", "content": "<content from OpenRouter>" } }`.
- **Limits:** Enforce `messages.length` (e.g. max 20) and total content length or token estimate to avoid abuse and cost.

### 6.2 Optional: System Prompt for FashionLink Chat

You can prepend a system message so the assistant stays on topic:

- e.g. “You are a helpful assistant for FashionLink, a platform connecting clients with fashion artisans. Help users find artisans, styles, or general fashion advice. Be concise and friendly.”
- Store this in config or a constant; prepend to `messages` in the controller or service when calling OpenRouter.

### 6.3 Streaming Chat (Phase 2 — Optional)

- **Method/URL:** `POST /api/ai/chat/stream` (or same `/api/ai/chat` with `?stream=true`).
- **Response:** `Content-Type: text/event-stream`; stream OpenRouter SSE events to the client.
- **Implementation:**  
  - Set `stream: true` in OpenRouter request.  
  - Pipe OpenRouter response stream to the response (or parse SSE and re-emit).  
  - Handle client disconnect (abort request to OpenRouter if supported).

---

## 7. Request/Response Schemas

### 7.1 POST /api/ai/chat

**Request:**

```json
{
  "messages": [
    { "role": "user", "content": "I'm looking for an Aso-oke weaver in Lagos." }
  ]
}
```

**Response (200):**

```json
{
  "message": {
    "role": "assistant",
    "content": "I can help you with that! FashionLink has artisans who specialize in Aso-oke. You can use the recommendations or search by specialty and location. Would you like tailored recommendations based on your preferences?"
  }
}
```

### 7.2 POST /api/ai/recommendations/artisans

**Request:**

```json
{
  "bodyShape": "hourglass",
  "skinTone": "medium",
  "stylePreferences": ["traditional", "modern"],
  "location": "Lagos, Nigeria",
  "occasion": "wedding",
  "notes": "Aso-oke and tailoring"
}
```

**Response (200):**

```json
{
  "recommendations": [
    {
      "artisanId": 1,
      "reason": "Specializes in hand-woven Aso-oke and ceremonial fabrics; high rating and 10+ years experience.",
      "styleHint": "Traditional wedding fabric sets",
      "artisan": {
        "id": 1,
        "name": "Maria Adeife",
        "role": "Aso-oke Weaver",
        "location": "Lagos, Nigeria",
        "category": "Textile & Fabric Creation",
        "rating": 4.9,
        "experience": 10
      }
    }
  ]
}
```

---

## 8. Error Handling & Fallbacks

### 8.1 OpenRouter Errors

- **401:** Invalid or missing API key → 500 or 503 with generic message; log the 401.
- **429:** Rate limit → 503 with `Retry-After` if provided; or return “Service busy, try again later.”
- **5xx:** OpenRouter or model error → 502/503; do not expose internal error details to client.
- **Timeout:** Set a timeout (e.g. 30s) on `fetch`; on timeout return 504.

### 8.2 Recommendation-Specific

- **No artisans in DB:** Return 200 with `recommendations: []` and optional message.
- **Invalid JSON from OpenRouter:** Log, return 200 with empty recommendations or a safe fallback (e.g. “Recommendations temporarily unavailable”).
- **Malformed or missing artisanId in response:** Filter out invalid entries; only return recommendations for existing artisan IDs.

### 8.3 Chat-Specific

- **Invalid `messages`:** 400 with clear validation error.
- **Content too long:** 400 or truncate and warn (decide policy).

---

## 9. Security & Best Practices

- **API key:** Never log or send to client; only in server env and `config/ai.js`.
- **Input validation:** Validate `messages` (array length, role enum, content string length); validate client profile keys/types if you enforce a schema.
- **Output:** Do not stream or echo raw OpenRouter errors to the client; sanitize.
- **Rate limiting:** Add rate limiting per user or IP for `/api/ai/*` to avoid abuse and cost (e.g. express-rate-limit).
- **Cost control:** Use `max_tokens` (e.g. 1024); optionally log `usage` per request for monitoring.

---

## 10. Step-by-Step Implementation Checklist

Use this as a linear checklist; each step is one concrete deliverable.

- [ ] **10.1** Create `config/ai.js`: read `OPENROUTER_API_KEY`, `AI_MODEL`; export `openRouterApiKey`, `aiModel`, `openRouterBaseUrl`.
- [ ] **10.2** Create `src/services/openrouter.service.js`:  
  - `chat(messages, options = {})` → `fetch` OpenRouter chat/completions; return `{ content, usage? }`; handle errors and timeouts.
- [ ] **10.3** Update `src/services/recommendation.service.js`:  
  - Add `getArtisanRecommendations(clientProfile)`: load artisans, build prompt, call `openrouter.service.chat` with `response_format: json_object`, parse, validate, enrich with artisan records, return.
- [ ] **10.4** Create `src/controllers/ai.controller.js`:  
  - `chat`: validate body.messages, call openrouter.service.chat, return `{ message: { role: 'assistant', content } }`.  
  - `getArtisanRecommendations`: validate body (client profile), call recommendation.service.getArtisanRecommendations, return JSON.
- [ ] **10.5** Create `routes/ai.routes.js`:  
  - POST `/chat` → auth middleware → ai.controller.chat.  
  - POST `/recommendations/artisans` → auth middleware → ai.controller.getArtisanRecommendations.
- [ ] **10.6** In `src/app.js`: `app.use('/api/ai', aiRoutes)` (require `routes/ai.routes.js`).
- [ ] **10.7** Add `.env` entries for `OPENROUTER_API_KEY` and optional `AI_MODEL`; document in README or env.example.
- [ ] **10.8** Add error handling and timeouts in OpenRouter service; sanitize errors in controller.
- [ ] **10.9** (Optional) Add rate limiting middleware for `/api/ai`.
- [ ] **10.10** Manual test: chat and recommendations with real OpenRouter key; then add tests (see Section 11).

---

## 11. Testing Plan

### 11.1 Unit / Integration (Backend)

- **openrouter.service:**  
  - Mock `fetch` to simulate 200 and error responses; assert request URL, headers, body shape; assert returned `content` and optional `usage`.
- **recommendation.service:**  
  - Mock ArtisanProfile.findAll and openrouter.service.chat; assert prompt contains client profile and artisan list; assert parsed recommendations and enrichment.
- **ai.controller:**  
  - Mock services; assert status codes and response shape for valid/invalid body and service errors.

### 11.2 E2E / Manual

- With real API key (or test key):  
  - POST `/api/ai/chat` with 1 user message → 200 and assistant content.  
  - POST `/api/ai/recommendations/artisans` with client profile → 200 and recommendations array with artisan ids and reasons.  
- Test with no artisans in DB → 200 and empty recommendations.  
- Test with invalid key → 500/503 and no key leak.

### 11.3 Postman/Newman

- Add to `postman_collection.json`:  
  - POST `/api/ai/chat` (with auth).  
  - POST `/api/ai/recommendations/artisans` (with auth and sample body).  
- Run collection with Newman in CI or before release.

---

## 12. Future Enhancements

- **Streaming:** Implement `POST /api/ai/chat/stream` and SSE (Section 6.3).  
- **Conversation memory:** Store chat history per user/session in DB and include last N turns in `messages`.  
- **Tool use:** Let OpenRouter call “tools” (e.g. search artisans, get recommendation) and implement tool handlers in your backend.  
- **Structured recommendations:** Extend recommendation prompt to return style/color suggestions plus artisan list.  
- **Logging and cost:** Log `usage` per request; aggregate by user or day for cost and usage dashboards.  
- **A/B model:** Use `AI_MODEL` or feature flags to compare models (e.g. gpt-4o-mini vs gpt-4o) for quality/cost.

---

## Document Control

- **Version:** 1.0  
- **Last updated:** 2025-02-27  
- **Scope:** OpenRouter-only implementation for FashionLink (recommendations + chat).
