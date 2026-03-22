# Fashion Link — Frontend / Backend Alignment Plan

**Purpose:** Align the frontend with the backend by implementing missing endpoints, replacing mock data with real API calls, and introducing seed/cleanup scripts so the app works end-to-end with realistic data. **No implementation in this document — plan only.**

---

## MVP 1 vs MVP 2 scope

| Phase | Scope | Notes |
|-------|--------|--------|
| **MVP 1** | **Dashboard**, **Orders**, **Clients**, **Artisan Network**, **Settings** | Core artisan workflow: stats, orders (list/detail/create), clients (list/add/profile), browse artisan network, settings. |
| **MVP 2** | **Notifications**, **Forgot password** (and Check Email flow) | Deferred: in-app notifications, password reset and check-email UI. |

- **MVP 1** is the focus for backend endpoints, models, seed data, and frontend wiring.
- **MVP 2** (Notifications, Forgot password) stays as mock/TODO until MVP 1 is done; no backend for these in MVP 1.

---

## 1. Frontend overview

### 1.1 App structure (with MVP split)

- **Auth (MVP 1):** Login, Signup.
- **Auth (MVP 2):** Forgot Password, Check Email.
- **Roles:** `artisan` and `client` (used for route guards and redirects).
- **Artisan portal — MVP 1:** Dashboard, Orders (list, detail, New Order), Clients (list, Add Client, Client Profile), Artisan Network (browse, artisan profile), Settings.
- **Artisan portal — MVP 2:** Notifications.
- **Client portal:** Dashboard, My Orders, Order Details, Messages, Notifications, Profile (can be MVP 1 for client-facing order/client flows if needed).

### 1.2 Where mock / local data is used

| Location | Data source | What's mocked |
|----------|-------------|----------------|
| `AuthContext.jsx` | `MOCK_USERS` in memory | Login/signup; no API calls |
| `mockData.js` | Static exports | `currentUser`, `dashboardStats`, `upcomingOrders`, `aiAlerts`, `allOrders`, `navLinks`, `clients` |
| `artisanData.js` | Static exports | `artisans`, `NIGERIAN_STATES`, `NETWORK_CATEGORIES`, `EXPERIENCE_LEVELS`, `COLLAB_TYPES` |
| `MyOrders.jsx` (client) | In-component `orders` array | List and detail of client orders |
| `Dashboard.jsx` (client) | In-component `artisans`, `allOrders` | Top artisans, client orders |
| `Notifications.jsx` (client) | `useState` array | Notifications list |
| `Notifications.jsx` (artisan) | Likely similar | Notifications (to confirm) |
| `Profile.jsx` (client) | Local state + measurement labels | Profile/settings (measurement labels are static) |
| `ForgotPasswordPage.jsx` | TODO comment | Intended: `POST /api/auth/forgot-password` |

### 1.3 Frontend API usage (current / intended)

| Feature | Intended API | Current state |
|---------|--------------|----------------|
| Login | `POST /api/auth/login` | Mock in AuthContext |
| Signup | `POST /api/auth/register` | Mock in AuthContext (frontend may expect `/signup`) |
| Forgot password | `POST /api/auth/forgot-password` | TODO; not implemented |
| Artisan dashboard | e.g. `GET /api/orders`, stats | `mockData`: dashboardStats, upcomingOrders, aiAlerts |
| Artisan orders list | `GET /api/orders` | `mockData.allOrders` |
| Artisan order detail | `GET /api/orders/:id` | From mock list |
| Create order (AddOrderModal) | `POST /api/orders` | TODO; calls `onSubmit` with local payload only |
| Artisan clients list | `GET /api/clients` | `mockData.clients` |
| Artisan client profile | `GET /api/clients/:id` | From mock |
| Add client | `POST /api/clients` | Form only; no API call confirmed |
| Artisan network | List/search artisans | `artisanData.artisans` (+ filters) |
| Artisan profile (view) | `GET /api/artisans/:id` or search | `artisanData.artisans` |
| Client dashboard | Artisans + orders | In-component mock arrays |
| Client my orders | Orders for current client | In-component `orders` array |
| Client notifications | Notifications for user | Local state |
| Search (if used) | `GET /api/search/artisans`, `GET /api/search/products` | Backend exists; frontend usage TBD |

### 1.4 Frontend reference (from screenshots) — MVP 1

Summary of what the UI shows, to align backend and seed data:

- **Artisan Dashboard**
  - **Order summary cards:** Active Orders, Due This Week, Completed, Urgent/Delayed (counts).
  - **Alerts:** “Deadline Risk” (e.g. orders due this week, delayed order callout); “Workload Summary” (e.g. active orders across clients, “moderate” workload).
  - **Upcoming Orders table:** ORDER (e.g. ORD-003), CLIENT, DESCRIPTION, DELIVERY (date), STATUS (Delayed, Assigned, In Progress), ACTION (View).
  - **Primary CTA:** “+ Add New Order”.

- **New Order (form)**
  - **Order info:** Client (dropdown “Select a Client”), Delivery Date (date picker).
  - **Style:** “Describe the style, fabric and details” (textarea), “Any additional notes” (textarea).
  - **Style Reference:** Image upload (click/drag), “PNG, JPG UP TO 5MB” — in MVP 1 treat as optional; store as URL only (no file upload). Seed/API can provide a URL.
  - **Measurement (inches):** Chest, Waist, Hip, Shoulder, Sleeve, Length; “Autofill from client” link (implies client has stored measurements).
  - **Actions:** Cancel, Create Order.

- **Add New Client**
  - **Fields:** Full Name, Email, Phone Number (with country code, e.g. +234).
  - **Actions:** Cancel, Add Client.

- **Artisan Network (profile view)**
  - **Profile card:** Name, Role (e.g. Shoemaker), Location, Rating, Experience (e.g. “12 years”); skill/category tags.
  - **About:** Bio text; “Areas of Expertise” (same or similar tags).
  - **Collaboration Preferences:** e.g. “Project Base”, “Long Term Partnership”.
  - **Portfolio:** Row of images (e.g. 3) with optional captions.
  - **Actions:** “Invite to Collaborate”, “Message Artisan” (can be MVP 2).

Backend and seed data for **MVP 1** should support these screens: dashboard stats/orders, order create (with client list, measurements, optional style image), client CRUD (name, email, phone), and artisan profiles (role, location, rating, experience, skills, about, collaboration preferences, portfolio images).

### 1.5 Images in MVP 1 — URLs only, no file upload

For **MVP 1** we do **not** implement image upload. All image fields in the API and seed data are **URLs (strings)** only.

**Canonical image URLs for seeding:** Use the **ImageKit** URLs below as the alternative to the frontend’s local assets (`frontend/src/assets/`). Seed scripts and API responses should reference these URLs so the UI can display the same visuals without bundling assets.

| Source | How images are used | For seed / API |
|--------|---------------------|----------------|
| **mockData.js (orders)** | Order `image` is a **local import** from `../assets/ordercardimages/` (fabric, suit, green, gown, kente, white shirt, wedding gown) | Seed orders with **order card ImageKit URLs** (§1.6) so each order’s `styleReferenceImageUrl` / `imageUrl` matches the intended style (fabric, suit, etc.). Frontend will use `<img src={order.imageUrl}>`. |
| **artisanData.js** | `avatar` and `portfolio[].img` are Unsplash URLs | Seed artisan profiles with **avatarUrl** and portfolio items using **ImageKit placeholder URLs** (§1.6) (or keep Unsplash if preferred). |
| **Settings / User profile** | Profile avatar | Optional **avatarUrl**; seed with an ImageKit placeholder URL or `null` (frontend can fall back to initials). |

**Conclusion:** Seed data and API responses use **URLs only**. Prefer the ImageKit URLs in §1.6 for consistency with the frontend asset set. No file upload in MVP 1; image upload can be MVP 2 if needed.

### 1.6 ImageKit URLs for seed data (alternative to `frontend/src/assets`)

Use these URLs when seeding so the app displays the same images as the frontend’s local assets, without file upload.

**Order card images** (map to `frontend/src/assets/ordercardimages/` — use for order style reference / order list images):

| Asset | URL |
|-------|-----|
| fabric | `https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/fabric.png` |
| suit | `https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/suit.png` |
| green | `https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/green.png` |
| gown | `https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/gown.png` |
| kente | `https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/kente.png` |
| white shirt | `https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/white%20shirt.png` |
| wedding gown | `https://ik.imagekit.io/3tvelupiqx/assets/ordercardimages/wedding%20gown.png` |

**Placeholder / homepage images** (use for avatars, portfolio, or other generic images as needed):

- `https://ik.imagekit.io/3tvelupiqx/assets/homepageimages/Placeholder%20Image1.png`
- `https://ik.imagekit.io/3tvelupiqx/assets/homepageimages/Placeholder%20Image2-1.png`
- `https://ik.imagekit.io/3tvelupiqx/assets/homepageimages/Placeholder%20Image2-2.png`
- `https://ik.imagekit.io/3tvelupiqx/assets/homepageimages/Placeholder%20Image2-3.png`
- `https://ik.imagekit.io/3tvelupiqx/assets/homepageimages/Placeholder%20Image3.png`
- `https://ik.imagekit.io/3tvelupiqx/assets/homepageimages/Placeholder%20Image4.png`
- `https://ik.imagekit.io/3tvelupiqx/assets/homepageimages/Placeholder%20Image5.png`
- `https://ik.imagekit.io/3tvelupiqx/assets/homepageimages/Placeholder%20Image6.png`
- `https://ik.imagekit.io/3tvelupiqx/assets/homepageimages/Placeholder%20Image7.png`

**Artisan profile avatars (for seed — user/artisan profile data)**  
Use these URLs when seeding artisan users or artisan profiles so the Artisan Network cards match the frontend. Source: `frontend/src/data/artisanData.js`, `artisans[].avatar`.

| Artisan | Id / seed key | Avatar URL (use in seed for `avatarUrl` or equivalent) |
|---------|----------------|--------------------------------------------------------|
| Maria Adeife | art_001 | `https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&q=80` |
| Chima Ndukwe | art_002 | `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80` |
| Shirley Duru | art_003 | `https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&q=80` |
| Alice Andrew | art_004 | `https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=120&h=120&fit=crop&q=80` |

For a **5th artisan** (to reach 5 artisan users), use one of the ImageKit placeholder URLs above or another Unsplash URL. Seed scripts should set each artisan profile’s `avatarUrl` from this table (by name or id) so the UI displays the correct profile pictures.

---

## 2. Backend overview

### 2.1 Implemented routes (from `app.js` and route files)

| Route prefix | Endpoints | Notes |
|--------------|-----------|--------|
| `GET /` | Health | OK |
| `POST /api/auth/register` | Register | Returns full user (should exclude password) |
| `POST /api/auth/login` | Login | Returns `{ token }`; no user object |
| `GET/POST/PATCH/DELETE /api/users`, `GET /api/users/:id` | User CRUD | Implemented |
| `GET/POST/PATCH/DELETE /api/products`, `GET /api/products/:id` | Product CRUD | Implemented |
| `GET/POST/PATCH/DELETE /api/orders`, `GET /api/orders/:id`, `POST /api/orders/:id/tasks` | Order CRUD + tasks | Implemented |
| `GET/POST/PATCH/DELETE /api/clients`, `GET /api/clients/:id`, `POST /api/clients/:id/measurements` | Client CRUD + measurements | **Controllers expect `Client` and `Measurement` models — see §3** |
| `GET/POST/PATCH/DELETE /api/artisans`, `GET /api/artisans/:id` | Artisan profile CRUD | **Controllers expect `ArtisanProfile` model — see §3** |
| `GET /api/search/artisans`, `GET /api/search/products` | Search | Implemented |

### 2.2 Auth response shape vs frontend

- **Register:** Backend returns full Sequelize user (includes password hash). Frontend needs success + optional token/user for auto-login; should not receive password.
- **Login:** Backend returns `{ token }`. Frontend needs at least `token` and ideally `user` (e.g. `id`, `name`, `email`, `role`) for redirect and UI.
- **Missing:** `POST /api/auth/forgot-password` (frontend has a TODO for it).

---

## 3. Gaps: models and schema

### 3.1 Models that exist today
- **User** (`models/user.js`)
- **Product** (`models/Product.js`)
- **Order** (`models/Order.js`)
- **Task** (`models/Task.js`)

### 3.2 Models referenced by controllers but missing
- **Client** — `clients.controller.js` uses `Client` and `Measurement`. There is **no** `Client.js` or `Measurement.js` in `models/`. Schema has **Clients** table (no `designerId`); controller uses `designerId: req.user.id` (designer = logged-in user). Need to add Client model and align with schema (and optionally add designer/FK if desired).
- **Measurement** — Used in `addMeasurement` and `createClient` (recommendations). Schema has **no** Measurements table. Need to decide: add Measurements table + model, or drop measurement API and use a JSON field on Client.
- **ArtisanProfile** — `artisans.controller.js` and `search.service.js` use `ArtisanProfile` with `UserId`. Schema has **Artisans** table (standalone: name, email, bio, specialization, phone) with **no** UserId. Need either: ArtisanProfile model + table linked to User, or rename to Artisan and use existing Artisans table (and add UserId if artisans are users).

### 3.3 Schema vs backend today
- **Products:** Schema has no `userId`; Product model has `userId` and belongs to User. Resolve (schema vs model) for seeding.
- **Orders:** Schema has UserId, ClientId; Order model matches.
- **Tasks:** Schema has no Tasks table; Task model exists and is created via `sync`. OK.
- **Clients:** Schema has Clients (no designerId). Backend expects designer ownership — add column or new table as needed.
- **Artisans:** Schema has Artisans (no UserId). Backend expects ArtisanProfile with UserId — align model name and table (and add UserId if needed).

---

## 4. Missing or incomplete backend endpoints (for frontend)

| Need | Endpoint | MVP | Status | Notes |
|------|----------|-----|--------|--------|
| Forgot password | `POST /api/auth/forgot-password` | 2 | Missing | Deferred to MVP 2 |
| Login returns user | `POST /api/auth/login` | 1 | Incomplete | Add `user: { id, name, email, role }` (no password) |
| Register returns safe user / token | `POST /api/auth/register` | 1 | Incomplete | Return safe user; optionally return token for auto-login |
| Artisan dashboard stats | e.g. `GET /api/dashboard/stats` or derive from orders | 1 | Missing | Or frontend derives from `GET /api/orders` |
| Client “my orders” | `GET /api/orders?clientId=...` or `GET /api/clients/:id/orders` | Missing | Need way for client to see only their orders |
| Notifications | `GET /api/notifications`, PATCH read state | 2 | Missing | Deferred to MVP 2; stay mock |
| Messages | Message artisan / client | 2 | Not in scope | Placeholder for now |

---

## 5. Seed and cleanup strategy

### 5.1 Goals
- **Seed:** Insert deterministic data so that when the frontend calls real APIs, responses are non-empty and realistic.
- **Cleanup:** Script(s) to remove seeded (and optionally all) data so the DB can be reset (e.g. before re-seed or for a clean env).

### 5.2 Data to seed (high level)

**Target:** Enough data for realistic lists and filters, but not too much — generally in the **5–10** range per entity; **~2 per status** for status-based data.

1. **Users (multiple roles)**
   - **5 artisan users** (e.g. `artisan1@demo.com` … `artisan5@demo.com`) with known password (e.g. `password`). Where the seeded artisan represents one of the four in the frontend (Maria Adeife, Chima Ndukwe, Shirley Duru, Alice Andrew), set **avatarUrl** from the **Artisan profile avatars** table in §1.6 so Artisan Network cards show the correct profile pictures. For the 5th artisan, use an ImageKit placeholder URL from §1.6.
   - **5 client users** (e.g. `client1@demo.com` … `client5@demo.com`) with known password.
   - **2 admin users** (e.g. `admin1@demo.com`, `admin2@demo.com`) with known password, for future use.
   - Passwords hashed with same algorithm as auth (e.g. bcrypt).

2. **Clients (if using Client model)**
   - **~5–10 client records** (business clients, not login users) linked to artisan(s) via `designerId` or equivalent.
   - Reuse names/emails from mock where helpful (e.g. Amara Okonkwo, David Mensah, Fatimah Audu, Chioma Eze, Kwame Asante, Ngozi Adichie).
   - Optional: measurements per client if Measurements table/model exist.

3. **Artisan profiles (if using ArtisanProfile / Artisans)**
   - **5 profiles** — one per seeded artisan user — with specialty, location, bio, etc., aligned with `artisanData.js` where possible. Set **avatarUrl** for each profile from the **Artisan profile avatars** table in §1.6 (Maria, Chima, Shirley, Alice + one placeholder for the 5th).

4. **Orders (multiple statuses)**
   - **~2 orders per status** so each status has enough to test filters/lists:
     - e.g. `pending` (2), `Assigned` (2), `In Progress` (2), `Delayed` (2), `Completed` (2) → **~10 orders** total.
   - Linked to clients and to artisan (UserId); include order_number, notes, delivery dates where useful.

5. **Optional (keep in 5–10 range)**
   - **Products:** 5–10 items (extend existing product seeder if needed).
   - **Tasks:** 5–10 tasks total, spread across some of the orders (for artisan workflow).

### 5.3 Cleanup rules (to define in plan)
- **Order of delete:** Respect FKs: e.g. Tasks → Orders → OrderItems; then Clients; then ArtisanProfiles/Artisans; then Users (or in an order that respects all FKs in schema).
- **Scope:** Either “delete only seeded rows” (e.g. by a `seedSource: 'script'` flag or by fixed IDs/emails) or “truncate tables” for a full reset. Decision: document which approach (e.g. truncate + re-seed for dev).
- **Idempotency:** Seed script should be runnable multiple times (e.g. truncate then insert, or “upsert” by unique email/id).

### 5.4 Tooling
- **Sequelize seeders:** Use existing `seeders/` and add new seed files (e.g. users, clients, artisan-profiles, orders, tasks). One “master” seeder or ordered list that runs in dependency order.
- **Cleanup:** Either a separate npm script that runs raw SQL or Sequelize that deletes in correct order, or a “down” migration / seeder that reverses seed order.
- **npm scripts:** `npm run db:seed` (run all seeders), `npm run db:seed:undo` (undo all seeders). See §5.5.

### 5.5 Running seed from the terminal (load data into the DB)

**Prerequisites**
- Database exists (create it manually or via migration if applicable).
- `.env` has DB connection variables: `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST` (optional), `DB_PORT` (optional). The app uses `config/config.js`, which reads these; Sequelize CLI uses the same config when running seeders.

**Run all seeders (load seed data into the DB)**

From the project root:

```bash
# Option 1: via npm script (recommended)
npm run db:seed

# Option 2: via Sequelize CLI directly
npx sequelize-cli db:seed:all
```

Seed files in `seeders/` run in timestamp order. Set `NODE_ENV` if needed (e.g. `NODE_ENV=development npm run db:seed`); default is development when not set.

**Undo all seeders (remove seeded data)**

```bash
npm run db:seed:undo
# or
npx sequelize-cli db:seed:undo:all
```

Each seeder’s `down` method (if implemented) runs in reverse order.

**Summary**

| Command | Effect |
|---------|--------|
| `npm run db:seed` | Run all seed files → load seed data into the DB |
| `npm run db:seed:undo` | Undo all seeders → remove seeded data (via each seeder’s `down`) |

---

## 6. Frontend changes (to plan, not implement here)

1. **Auth**
   - Replace AuthContext mock login with `POST /api/auth/login`; store token (e.g. in memory or sessionStorage); use response `user` (or a subsequent `GET /api/users/me` if added) for `name`, `role`, redirect.
   - Replace signup with `POST /api/auth/register`; handle validation errors; optionally auto-login with token from backend if provided.
   - Add API base URL (env or config) and attach `Authorization: Bearer <token>` to requests when logged in.
   - Forgot password: call `POST /api/auth/forgot-password` when backend exists; until then keep current behavior (e.g. navigate to check-email).

2. **Artisan**
   - Dashboard: replace `mockData` with `GET /api/orders` (and optional stats endpoint or client-side aggregation).
   - Orders list: `GET /api/orders` (and optional query for status).
   - Order detail: `GET /api/orders/:id`.
   - AddOrderModal: `POST /api/orders` with payload (clientId, description, deliveryDate, notes, status); then refresh orders list or navigate.
   - Clients list: `GET /api/clients`.
   - Client profile: `GET /api/clients/:id`.
   - Add client: `POST /api/clients`.
   - Artisan network: `GET /api/search/artisans` (and/or `GET /api/artisans`) with query params; replace `artisanData.artisans` with response.
   - Artisan profile view: `GET /api/artisans/:id` (or search result by id).

3. **Client**
   - Dashboard: “Top artisans” from `GET /api/search/artisans` or `GET /api/artisans`; “All orders” from an endpoint that returns orders for the current client (e.g. `GET /api/orders?mine=1` or `GET /api/clients/me/orders` once implemented).
   - My Orders: same “my orders” endpoint; replace in-component array.
   - Order detail: `GET /api/orders/:id` (with auth so client only sees own orders).
   - Notifications / Profile: keep mock/local for now or add endpoints later.

4. **Shared**
   - Remove or reduce reliance on `mockData.js` and `artisanData.js` for list/detail data; keep static config (e.g. nav links, measurement labels, Nigerian states, categories) as needed.
   - Centralize API client (base URL, auth header, error handling).

---

## 7. Implementation order (recommended)

1. **Backend: models and schema**
   - Add or align **Client** model with schema (and optional Measurements table/model).
   - Add or align **ArtisanProfile** (or Artisan) model with schema and UserId if artisans are users.
   - Ensure Products schema and model match (userId if needed); fix any FK conflicts.

2. **Backend: auth**
   - Login: return `{ token, user: { id, name, email, role } }`; exclude password from register response (and optionally return token).

3. **Backend: optional endpoints**
   - Forgot-password stub or implementation.
   - “My orders” for client (filter by current user or clientId).
   - Dashboard stats (or document “derive from GET /api/orders”).

4. **Seed and cleanup**
   - Define seed data (users, clients, artisans/profiles, orders, tasks).
   - Implement seeders in dependency order; implement cleanup (order of deletes); add npm scripts.

5. **Verification**
   - Run seed, then hit each used endpoint (Postman or frontend) and confirm 200/201 and expected shape; run cleanup and re-seed to confirm idempotency.

---

## 8. Summary tables

### Endpoints to add or adjust
- `POST /api/auth/forgot-password` — add (stub or full).
- `POST /api/auth/login` — add `user` in response.
- `POST /api/auth/register` — return safe user (and optionally token).
- “My orders” for client — new endpoint or query (e.g. `GET /api/orders?mine=1` or `GET /api/clients/me/orders`).
- Optional: `GET /api/dashboard/stats` or document derivation from orders.

### Models to add or align
- **Client** — add model; align table (e.g. add designerId if needed).
- **Measurement** — add table + model, or store on Client as JSON.
- **ArtisanProfile** (or Artisan) — add/align model and table; link to User if needed.

### Seed contents
- **Users:** 5 artisans, 5 clients, 2 admins; hashed passwords.
- **Clients:** 5–10 client records (with designerId if applicable).
- **Artisan profiles:** 5 (one per artisan user).
- **Orders:** ~2 per status (~10 total: pending, Assigned, In Progress, Delayed, Completed), linked to users and clients.
- **Optional:** 5–10 products; 5–10 tasks across orders.

### Cleanup
- Script that deletes in FK-safe order (or truncates) so DB can be reset and re-seeded.

This plan is intended as the single reference for “what to build” before any implementation. Once you’re ready to implement, we can do it step by step (e.g. models first, then auth, then seed, then frontend).
