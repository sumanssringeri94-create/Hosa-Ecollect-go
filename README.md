# ♻️ eCollect-Go — Sustainable E-Waste & Circular Recycling Platform

[![CI Pipeline](https://github.com/sumanssringeri94-create/Hosa-Ecollect-go/actions/workflows/ci.yml/badge.svg)](https://github.com/sumanssringeri94-create/Hosa-Ecollect-go/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-forest.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v20%2B%20%7C%20v24%2B-2d5a3d.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%2018-D97746.svg)](https://vitejs.dev/)

eCollect-Go is an end-to-end digital e-waste reverse logistics and circular recycling platform. It bridges citizens, certified recycling facilities, zero-emission green logistics fleets, and municipal governance administrators under an automated, verifiable chain-of-custody protocol.

---

## 🏛️ Platform Personas & Capabilities (4 Distinct Roles)

eCollect-Go supports 4 dedicated user roles, each with its own tailored dashboard, permissions, and workflow:

### 1. 👤 Citizen / Enterprise User
- **E-Waste Inventory Logging**: Catalog discarded electronics across 10 statutory categories (Laptops, Mobiles, Batteries, Monitors, etc.) with condition, brand, and weight estimations.
- **On-Demand Doorstep Collection**: Schedule doorstep pickup with precise time slots, address geolocation, and special hazard handling instructions.
- **Eco-Gamification & Carbon Ledger**: Accrue eco-points and tier up from *Beginner* → *Eco Starter* → *Eco Warrior* → *Eco Guardian* → *Eco Champion*. Track cumulative avoided CO₂ emissions in kilograms.
- **Digital Certificates**: Generate verifiable recycling certificates detailing recovered precious metals (Gold, Silver, Copper, Rare Earths).

### 2. 🛡️ Central Governance Administrator
- **Control Tower & Dispatch**: Verify incoming collection manifests, review item hazard ratings, and assign orders to verified recycling facilities and green logistics fleets.
- **Auditing & Partner Accreditation**: Inspect licenses (e.g. SPCB/CPCB statutory authorizations), approve or deactivate recyclers, and monitor logistics capacity.
- **ESG & Statutory Analytics**: Live reporting on municipal throughput, material diversion rates, LCA carbon offsets, and compliance assay logs.

### 3. 🏭 Certified Recycler Facility
- **Facility Intake Manifests**: Accept incoming consignments handed over by logistics providers.
- **Assay & Processing Logs**: Record actual received weights, secondary materials recovered (e.g. 0.4kg Copper, 1.2kg Aluminum), and hazardous fraction neutralizations.
- **Batch Processing Throughput**: Track monthly tonnage processed against facility operational capacity.

### 4. 🚚 Zero-Emission Logistics Fleet
- **Route Dispatch & Pickups**: Review assigned pickups, accept manifests, and execute scheduled doorstep collections.
- **Chain of Custody Tracking**: Real-time status transitions (`assigned` → `pickup_scheduled` → `collected` → `in_transit` → `delivered`).
- **Fleet Availability**: Toggle operational status and vehicle specifications (EV Vans, Cargo E-Bikes).

---

## 🏗️ Architecture & Technology Stack

```
ecollect-go/
├── .github/workflows/
│   └── ci.yml               # GitHub Actions CI workflow (lint, test, client build)
├── client/                  # React 18 + Vite SPA frontend
│   ├── src/
│   │   ├── api/             # Axios API client (JWT interceptor, 401 redirect, typed endpoints)
│   │   ├── components/      # Common components, layout sidebars, modals, skeleton loaders
│   │   ├── context/         # AuthContext (real JWT auth state + optional demo switch)
│   │   ├── pages/           # Public pages & 4 distinct portal suites (User, Admin, Recycler, Logistics)
│   │   └── services/        # Client auth service
│   └── index.html           # HTML5 entry with Open Graph & Twitter Cards
└── server/                  # Node.js + Express 4 RESTful backend
    ├── config/db.js         # MongoDB connection + fallback local JSON embedded database
    ├── controllers/         # Business logic for auth, pickups, waste, admin, recyclers, logistics
    ├── middleware/          # Helmet, rate-limiters, JWT protect, role gates, express-validator
    ├── models/              # Dual Mongoose & LocalDb proxy data models
    ├── routes/              # Express API route declarations
    ├── tests/               # Native node:test security & integration test suite
    └── server.js            # Hardened server entry with strict startup assertions
```

---

## 🔒 Security & Hardening Architecture

1. **Mandatory Secret Enforcement**: The server asserts `process.env.JWT_SECRET` on initialization and immediately halts startup with exit code 1 if missing. No insecure hardcoded fallbacks exist.
2. **Strict Origin CORS Filtering**: Only approved origins (`localhost:5173`, `CLIENT_URL`, and production deployment domains) are permitted. Rejected cross-origin requests receive an explicit, clean HTTP 403 Forbidden JSON payload.
3. **Multi-Tier Rate Limiting**:
   - **Auth Gateways**: Strict rate limiting (`10 requests / 15 minutes / IP`) applied to `/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`, and `/api/auth/reset-password`.
   - **Global Rate Limiter**: 100 requests / 15 minutes / IP across all `/api` endpoints.
4. **Defensive Password Reset Protocol**:
   - `forgotPassword` generates a cryptographically secure 32-byte token (`crypto.randomBytes(32)`), stores only its SHA-256 hash with a 30-minute expiry, and returns an identical generic response regardless of whether the email exists.
   - `resetPassword` validates the raw token against the stored SHA-256 hash, enforces an 8-character minimum, and invalidates the token upon single use.
   - Rejects missing, invalid, or expired tokens with a generic HTTP 400 (never leaking user existence).
5. **Express Validator**: Strict parameter sanitization and validation on authentication, pickup scheduling, and waste item submission.
6. **Payload Size Guard**: `express.json({ limit: '1mb' })` defends against denial-of-service memory pressure.
7. **Production Crash Resilience**: Uncaught exceptions are cleanly logged and terminate the process (`process.exit(1)`) allowing process managers (e.g. systemd, Docker, Kubernetes) to restart healthy containers.

---

## 📡 Complete REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user, recycler, or logistics partner |
| `POST` | `/api/auth/login` | Public | Authenticate credentials & return signed JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update profile details (phone, city, company, vehicle) |
| `POST` | `/api/auth/forgot-password` | Public | Secure token generation with SHA-256 storage |
| `POST` | `/api/auth/reset-password` | Public | Single-use password reset verification |

### 📦 Pickups (`/api/pickups`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/pickups` | Private (User) | Schedule new e-waste doorstep pickup |
| `GET` | `/api/pickups/my` | Private (User) | List user's active and past pickups |
| `GET` | `/api/pickups/:id` | Private | Fetch detailed pickup manifest |
| `DELETE` | `/api/pickups/:id` | Private (User) | Cancel scheduled pickup |
| `GET` | `/api/pickups/admin/all` | Admin | Filter and inspect all platform pickups |
| `PUT` | `/api/pickups/admin/:id/verify` | Admin | Verify manifest and advance pickup |
| `PUT` | `/api/pickups/admin/:id/assign-recycler` | Admin | Assign manifest to certified recycling partner |
| `PUT` | `/api/pickups/admin/:id/assign-logistics` | Admin | Assign manifest to green logistics fleet |
| `PUT` | `/api/pickups/admin/:id/complete` | Admin | Finalize order and award eco-points |

### ♻️ Waste Inventory (`/api/waste`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/waste/categories` | Public | List standardized categories with CO₂ and hazard metadata |
| `POST` | `/api/waste` | Private (User) | Log item to user's recycling inventory |
| `GET` | `/api/waste/my` | Private (User) | Retrieve logged user items |
| `DELETE` | `/api/waste/:id` | Private (User) | Remove logged item |

### 🛡️ Admin Governance (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Admin | Control tower aggregated metrics and counts |
| `GET` | `/api/admin/users` | Admin | Search, filter, and paginate platform users |
| `PUT` | `/api/admin/users/:id/status` | Admin | Activate or suspend user accounts |
| `GET` | `/api/admin/recyclers` | Admin | List registered recycling facilities |
| `PUT` | `/api/admin/recyclers/:id/verify` | Admin | Verify statutory environmental licenses |
| `GET` | `/api/admin/logistics` | Admin | List registered green logistics partners |
| `GET` | `/api/admin/reports` | Admin | Statutory LCA carbon reports and monthly throughput |

### 🏭 Recycler Portal (`/api/recyclers`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/recyclers/dashboard` | Recycler | Intake metrics, throughput, and active batches |
| `GET` | `/api/recyclers/assigned` | Recycler | View assigned consignments |
| `PUT` | `/api/recyclers/pickups/:id/accept` | Recycler | Accept consignment assignment |
| `PUT` | `/api/recyclers/pickups/:id/reject` | Recycler | Reject assignment with statutory reason |
| `PUT` | `/api/recyclers/pickups/:id/operations` | Recycler | Log assay results, weights, and recovery notes |

### 🚚 Logistics Portal (`/api/logistics`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/logistics/dashboard` | Logistics | Route metrics and vehicle dispatch summary |
| `GET` | `/api/logistics/pickups` | Logistics | Assigned pickup routes |
| `PUT` | `/api/logistics/pickups/:id/accept` | Logistics | Accept route dispatch |
| `PUT` | `/api/logistics/pickups/:id/collected` | Logistics | Mark item collected from doorstep |
| `PUT` | `/api/logistics/pickups/:id/delivered` | Logistics | Confirm delivery to recycling center |
| `PUT` | `/api/logistics/availability` | Logistics | Update vehicle fleet status and capacity |

---

## ⚙️ Environment Configuration

### Backend (`server/.env`)
| Variable | Required | Description | Example |
|---|---|---|---|
| `NODE_ENV` | Yes | Runtime environment | `development` or `production` |
| `PORT` | No | HTTP listener port (defaults to 5000) | `5000` |
| `JWT_SECRET` | **YES** | Cryptographic key for signing JWTs (min 32 chars) | `your-32-character-secure-jwt-secret` |
| `JWT_EXPIRES_IN`| No | Token validity duration | `7d` |
| `CLIENT_URL` | Recommended | Whitelisted frontend URL for CORS | `https://hosa-ecollect-go.vercel.app` |
| `USE_LOCAL_DB` | Yes | `true` for zero-setup local dev file DB; `false` for MongoDB | `false` |
| `MONGO_URI` | If not local DB | MongoDB connection string | `mongodb+srv://...` |
| `SEED_DEMO` | No | Explicit override to enable demo seeding | `true` |

### Frontend (`client/.env`)
| Variable | Required | Description | Example |
|---|---|---|---|
| `VITE_API_URL` | No | Base API URL (defaults to `/api` proxy in dev) | `https://your-api.onrender.com/api` |
| `VITE_DEMO_MODE` | No | Set `true` to enable instant role switcher modal & demo credentials | `false` |

---

## 🚀 Local Development Setup

### 1. Clone & Setup
```bash
git clone https://github.com/sumanssringeri94-create/Hosa-Ecollect-go.git
cd Hosa-Ecollect-go
```

### 2. Configure & Start Backend
```bash
cd server
cp .env.example .env

# Edit server/.env and supply a secure JWT_SECRET
# For quick local testing without MongoDB, keep USE_LOCAL_DB=true
npm install
npm test            # Run integration test suite
npm run dev         # Starts server on http://localhost:5000
```

### 3. Configure & Start Frontend
```bash
cd ../client
cp .env.example .env
npm install
npm run build       # Verify production build
npm run dev         # Starts Vite dev server on http://localhost:5173
```

---

## 🧪 Testing

The platform includes automated security and API integration tests run via Node's native test runner (`node:test`):

```bash
cd server
npm test
```

Test coverage verifies:
- Password reset fails without token (HTTP 400)
- Password reset fails with invalid or unhashed token (HTTP 400)
- Password reset fails with expired token (HTTP 400)
- Single-use token succeeds upon valid submission and is invalidated immediately on subsequent reuse.

---

## 🚢 Continuous Integration

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request to `main`:
1. Checks out repository on Node.js v20.
2. Installs server dependencies and executes backend security test suite.
3. Installs client dependencies and compiles production Vite bundle.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
