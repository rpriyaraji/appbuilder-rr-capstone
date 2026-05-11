# Employee Directory App
### Adobe App Builder Capstone — 998VioletGalliform

A full-stack web application built on **Adobe App Builder** that manages an employee directory with AI-generated avatars powered by **Adobe Firefly**.

**Production URL:** https://916516-998violetgalliform.adobeio-static.net/index.html  
**Presentation & Demo:** [Google Slides / Video](https://docs.google.com/presentation/d/11LN7QQNZ8gNK_wC-aVk_2E30iUh_QXEZ/edit?usp=drive_link&ouid=115519167205929665564&rtpof=true&sd=true)

---

## Features

- **Add Employee** — form with Name, Role, and Department fields
- **Live Dashboard** — table showing all employees with role badges
- **AI Avatars** — click "Generate Avatar" to create a Firefly AI headshot per employee
- **Serverless Backend** — Adobe I/O Runtime actions (Node.js 22)
- **Adobe Red Branding** — clean professional UI (#e03000)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 16, inline styles, Adobe CDN |
| Backend | Adobe I/O Runtime (Node.js 22) |
| AI | Adobe Firefly Services API v3 (text-to-image) |
| Auth | Adobe IMS client credentials OAuth |
| CLI | @adobe/aio-cli v11 |

---

## Project Structure

```
actions/
├── generic/index.js          # GET/POST employees
├── firefly/index.js          # Firefly AI avatar generation
├── publish-events/index.js   # Adobe I/O Events
└── utils.js                  # Shared utilities

web-src/src/components/
└── App.js                    # Main React UI (form + table + avatars)

app.config.yaml               # Action definitions & runtime config
INSTRUCTIONS.md               # Full setup, deploy & testing guide
```

---

## Prerequisites

- Node.js 18+
- Adobe I/O CLI: `npm install -g @adobe/aio-cli`
- Adobe account with access to **ACS SANDBOX GDC 01** org

---

## Step-by-Step Setup & Deployment

### 1. Install dependencies

```bash
npm install
```

### 2. Install Adobe I/O CLI (if not already installed)

```bash
npm install -g @adobe/aio-cli
```

### 3. Login to Adobe I/O

```bash
aio login
```

Follow the browser prompt to authenticate with your Adobe ID.

### 4. Select Org, Project & Workspace

```bash
aio app use -w Production
```

Confirm you see:
```
1. Org: ACS SANDBOX GDC 01
2. Project: 998VioletGalliform
3. Workspace: Production
```

When prompted about existing `.env`:
- Type `x` to **keep** your current `.env` (recommended — preserves Firefly keys)
- Type `o` to **overwrite** with workspace credentials (then re-add Firefly keys manually)

### 5. Configure `.env`

Create a `.env` file in the project root (never commit this):

```env
AIO_runtime_auth=<your-production-runtime-auth>
AIO_runtime_namespace=916516-998violetgalliform
AIO_runtime_apihost=https://adobeioruntime.net
SERVICE_API_KEY=

# Firefly API credentials
FIREFLY_CLIENT_ID=<your-firefly-client-id>
FIREFLY_CLIENT_SECRET=<your-firefly-client-secret>
```

### 6. Run locally (dev mode)

```bash
aio app dev
```

- Open `https://localhost:9080` in your browser
- Accept the self-signed certificate when prompted (**Advanced → Proceed**)
- App hot-reloads on file changes
- Press `Ctrl+C` to stop

Local action URLs:
```
https://localhost:9080/api/v1/web/appbuilder-rr-capstone/generic
https://localhost:9080/api/v1/web/appbuilder-rr-capstone/firefly
https://localhost:9080/api/v1/web/appbuilder-rr-capstone/publish-events
```

### 7. Deploy to production

```bash
# Deploy all 4 actions + web assets to Adobe CDN
aio app deploy --force-deploy
```

Successful output looks like:
```
✓ Built 3 action(s) for 'application'
✓ Deployed 4 action(s) for 'application'
✓ All static assets deployed to CDN
Successful deployment
```

### 8. Verify production deployment

Open the production URL and check:
- No error banner — employees load from backend
- Add Employee form works
- Generate Avatar button calls Firefly and shows AI headshot

---

## All Commands Reference

| Command | What it does |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm install -g @adobe/aio-cli` | Install Adobe I/O CLI globally |
| `aio login` | Authenticate with Adobe ID |
| `aio app use -w Production` | Switch to Production workspace |
| `aio app use -w Stage` | Switch to Stage workspace |
| `aio app dev` | Run app locally with hot reload at localhost:9080 |
| `aio app deploy` | Deploy changed actions + web assets |
| `aio app deploy --force-deploy` | Force deploy all actions + web assets |
| `aio app undeploy` | Remove deployed app from Runtime + CDN |
| `aio app test` | Run unit tests |
| `aio app test --e2e` | Run end-to-end tests |

---

## Deployed URLs & What to Expect

### App
```
https://916516-998violetgalliform.adobeio-static.net/index.html
```
**Expected:** Adobe red header, Add Employee form, table with 3 pre-loaded employees (John Doe, Jane Smith, Alice Brown), Generate Avatar buttons.

### GET /generic
```
https://916516-998violetgalliform.adobeio-static.net/api/v1/web/appbuilder-rr-capstone/generic
```
**Expected:**
```json
{
  "employees": [
    { "id": 1, "name": "John Doe", "role": "Engineer", "department": "Technology" },
    { "id": 2, "name": "Jane Smith", "role": "Manager", "department": "Marketing" },
    { "id": 3, "name": "Alice Brown", "role": "Designer", "department": "Creative" }
  ]
}
```

### POST /generic
```
POST https://916516-998violetgalliform.adobeio-static.net/api/v1/web/appbuilder-rr-capstone/generic
Body: { "name": "...", "role": "...", "department": "..." }
```
**Expected:** `{ "employee": { "id": 4, "name": "...", "role": "...", "department": "..." } }`

### POST /firefly
```
POST https://916516-998violetgalliform.adobeio-static.net/api/v1/web/appbuilder-rr-capstone/firefly
Body: { "prompt": "professional headshot of an Engineer in Technology department" }
```
**Expected:** `{ "imageUrl": "https://...", "prompt": "..." }`

---

## API Reference

**GET /generic** — fetch all employees
```json
{ "employees": [{ "id": 1, "name": "John Doe", "role": "Engineer", "department": "Technology" }] }
```

**POST /generic** — add an employee
```json
// body:     { "name": "...", "role": "...", "department": "..." }
// response: { "employee": { "id": 4, "name": "...", ... } }
```

**POST /firefly** — generate AI avatar
```json
// body:     { "prompt": "professional headshot of an Engineer in Technology department" }
// response: { "imageUrl": "https://...", "prompt": "..." }
```

---

## Architecture

```
Browser
  ├── GET  /generic  ──► generic action  ──► employee list
  ├── POST /generic  ──► generic action  ──► add employee
  └── POST /firefly  ──► firefly action
                              ├── Adobe IMS  (OAuth client credentials → access token)
                              └── Firefly v3  (text-to-image → 1024x1024 image URL)
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `HTTP 404` on load | Run `aio app deploy --force-deploy` |
| `Missing FIREFLY_CLIENT_ID` | Add Firefly keys to `.env` and redeploy |
| `Unsupported aspect ratio` | Use size `1024x1024` (already set in code) |
| `missing authorization header` | Set `require-adobe-auth: false` in `app.config.yaml` |
| Certificate error in dev | Open `https://localhost:9080` and accept the self-signed cert |
| Only 1 action deployed | Always use `--force-deploy` flag |

---

*Built with Adobe App Builder · Adobe I/O Runtime · Adobe Firefly*
