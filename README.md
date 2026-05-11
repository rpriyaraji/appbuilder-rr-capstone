# Employee Directory App
### Adobe App Builder Capstone — 998VioletGalliform

A full-stack web application built on **Adobe App Builder** that manages an employee directory with AI-generated avatars powered by **Adobe Firefly**.

**Production URL:** https://916516-998violetgalliform.adobeio-static.net/index.html

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

## Quick Start

```bash
npm install
aio login
aio app use -w Production
aio app dev
```

Open https://localhost:9080 — accept the self-signed cert when prompted.

See [INSTRUCTIONS.md](INSTRUCTIONS.md) for full setup, .env config, and deployment steps.

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

## Deploy

```bash
aio app deploy --force-deploy
```

---

## Architecture

```
Browser
  ├── GET  /generic  ──► generic action  ──► employee list
  ├── POST /generic  ──► generic action  ──► add employee
  └── POST /firefly  ──► firefly action
                              ├── Adobe IMS  (get OAuth token)
                              └── Firefly v3 (generate 1024x1024 image)
```

---

*Built with Adobe App Builder · Adobe I/O Runtime · Adobe Firefly*
