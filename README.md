# InquiryDesk - Customer Inquiry Management System

> **Fullstack Technical Assessment** | Coffee Ninja (Pvt) Ltd  
> **Author:** Dhananji Pallegedara ([@DhanaM24](https://github.com/DhanaM24))  
> **Repository:** [https://github.com/DhanaM24/InquiryDesk](https://github.com/DhanaM24/InquiryDesk)

---

## 1. Project Overview

**InquiryDesk** is an intentional, production-ready web application designed for a growing service business transitioning away from disorganized spreadsheets and chat messages. It enables customer service representatives to record, track, search, and progress customer inquiries through a strict lifecycle while preventing data loss, unauthorized access, and duplicate ticket entry.

### Core Capabilities:
- **Secure Authentication:** Cookie-based session management using HttpOnly JWTs (protected against XSS).
- **Inquiry Capture & Validation:** Robust client and server-side schema validation via Zod with live UI character counters.
- **Role-Based Ownership & Isolation:** Strict tenant separation enforced directly in SQL (`WHERE created_by = user.id OR role = 'admin'`).
- **Finite Lifecycle State Machine:** Strict transitions (`New` ➔ `In Progress` ➔ `Resolved` and reopen `Resolved` ➔ `In Progress`).
- **Optimistic Concurrency Control (OCC):** Multi-tab conflict resolution without database table locks.
- **Duplicate Prevention Policy:** Sliding 10-minute duplicate check rejecting duplicate creator + contact + subject submissions.
- **Usability-First UI:** Polished states for loading (animated skeleton shimmers), empty states (with smart action buttons), and contextual error handling.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Context API, Vanilla CSS Design System (Stripe/Linear inspired) |
| **Backend** | Node.js, Express, PostgreSQL driver (`pg`), Zod, Bcrypt, JsonWebToken, Cookie-Parser, Cors, Dotenv |
| **Database** | PostgreSQL with `pgcrypto` (UUID generation, compound indexes, check constraints) |
| **Testing** | Jest & Supertest (Backend API & Security Integration), Node.js Native Test Runner (Frontend UI Validation & State Logic) |

---

## 3. Directory Structure

```text
InquiryDesk/
├── backend/
│   ├── migrations/
│   │   ├── 001_init.sql         # Database schema, tables, indexes, constraints
│   │   └── run.js               # SQL migration execution script
│   ├── seeds/
│   │   └── seed.js              # Pre-seeded users (admin, staff1, staff2) and sample inquiries
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification & cookie parser middleware
│   │   │   └── errorHandler.js  # Global centralized error handler
│   │   ├── routes/
│   │   │   ├── auth.js          # /api/auth/login, /api/auth/logout, /api/auth/me
│   │   │   └── inquiries.js     # /api/inquiries (CRUD, status transitions, search)
│   │   ├── services/
│   │   │   └── inquiryService.js# Core business rules, SQL access filter, OCC, duplicate logic
│   │   ├── validation/
│   │   │   └── inquirySchemas.js# Zod input validation schemas
│   │   ├── app.js               # Express application initialization & CORS config
│   │   ├── db.js                # PostgreSQL connection pool
│   │   ├── httpError.js         # HTTP status error helper
│   │   └── server.js            # Server entry point (port 4000)
│   ├── tests/
│   │   └── inquiries.test.js    # Integration tests (Access rules, OCC 409, Auth 401)
│   ├── .env                     # Local environment configuration
│   ├── .env.example             # Example environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateInquiryModal.jsx # Form with live character counters & duplicate alerts
│   │   │   ├── InquiryDetailPage.jsx  # Detail view, OCC versioning, allowed transition actions
│   │   │   ├── InquiryListPage.jsx    # Metric stats, filter pills, debounced search, skeleton loading
│   │   │   ├── LoginPage.jsx          # Interactive sign-in card with one-click demo logins
│   │   │   ├── Navbar.jsx             # User badge, role indicator, quick create button, logout
│   │   │   └── StatusBadge.jsx        # Semantic status badge component
│   │   ├── api.js                     # Fetch wrapper with credentials: 'include' & error parsing
│   │   ├── App.jsx                    # Root view orchestrator with URL hash routing (#inquiry/:id)
│   │   ├── AuthContext.jsx            # User state provider & session validator
│   │   ├── index.css                  # Modern CSS design system (variables, animations, responsive)
│   │   └── main.jsx                   # React DOM root
│   ├── tests/
│   │   └── ui_state.test.js           # Unit tests for form validation and lifecycle transitions
│   ├── index.html
│   ├── vite.config.js                 # Dev server port 3000 configuration
│   └── package.json
│
├── DECISIONS.md                       # Architectural reflection, trade-offs, and AI disclosure
└── README.md                          # Project documentation and run guide
```

---

## 4. Pre-Seeded Test Accounts

Instead of open registration, pre-seeded accounts are provided:

| Email | Password | Role | Access Scope |
|---|---|---|---|
| `admin@demo.com` | `Password123!` | `admin` | Organization-wide access to view all inquiries across all staff. |
| `staff1@demo.com` | `Password123!` | `staff` | Restricted to viewing and managing only inquiries created by Staff 1. |
| `staff2@demo.com` | `Password123!` | `staff` | Restricted to viewing and managing only inquiries created by Staff 2. |

> **Convenience Feature:** On the Login page, you can click on any demo account button to instantly auto-fill credentials.

---

## 5. Local Setup & Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **PostgreSQL** (v14.0 or higher)
- **npm** (v9.0.0 or higher)

---

### Step 1: Database Setup
1. Ensure your PostgreSQL service is running on `localhost:5432`.
2. Create the application database:
   ```bash
   createdb inquirydesk
   ```
   *(Or in `psql`: `CREATE DATABASE inquirydesk;`)*

3. Configure your database credentials in [`backend/.env`](file:///c:/Users/dhana/Desktop/InquiryDesk/backend/.env):
   ```env
   DATABASE_URL=postgres://postgres:your_password@localhost:5432/inquirydesk
   JWT_SECRET=inquirydesk_jwt_secret_key_change_in_production
   FRONTEND_ORIGIN=http://localhost:3000
   PORT=4000
   ```
   *(An unpopulated copy is available at [`backend/.env.example`](file:///c:/Users/dhana/Desktop/InquiryDesk/backend/.env.example))*.

4. Run migrations and seed data:
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```
   *Expected output: `Migration done` and `Seed done. All passwords: Password123!`.*

---

### Step 2: Start the Backend API Server
```bash
cd backend
npm run dev
```
- API server will start on: **`http://localhost:4000`**
- Verifiable health endpoint: **`http://localhost:4000/health`**

---

### Step 3: Start the Frontend Application
In a **new terminal window**:
```bash
cd frontend
npm run dev
```
- Frontend application will start on: **`http://localhost:3000`**
- Open your browser and navigate to: **`http://localhost:3000`**

---

## 6. Running Automated Tests

The project includes both **backend integration tests** and **frontend state/validation unit tests** as required by the technical brief.

### A. Run Frontend Tests
Tests client-side validation logic, short field rejections, and state transition integrity:
```bash
cd frontend
npm test
```
**Output:**
```text
✔ Form Validation: flags missing and short input fields (2.26ms)
✔ Form Validation: accepts compliant customer input (1.87ms)
✔ UI Lifecycle: permits valid transitions (new -> in_progress -> resolved and reopen) (0.30ms)
✔ UI Lifecycle: prevents illegal skip transition (new -> resolved directly) (3.96ms)
ℹ tests 4 | pass 4 | fail 0
```

### B. Run Backend Integration Tests
Tests database-level tenancy access boundaries (404), invalid state transition enforcement (409), and unauthenticated request rejection (401):
```bash
cd backend
npm test
```

---

## 7. REST API Documentation

### Authentication
- `POST /api/auth/login` - Authenticates user credentials and issues an `HttpOnly` JWT cookie (`token`).
- `POST /api/auth/logout` - Clears the session cookie (`204 No Content`).
- `GET /api/auth/me` - Returns active session user profile (`id`, `name`, `email`, `role`).

### Inquiries
- `GET /api/inquiries?status={status}&q={search}&page={page}` - Returns paginated inquiries list filtered by user role, status, and search query.
- `GET /api/inquiries/:id` - Returns single inquiry DTO. Returns `404` if forbidden to prevent ID harvesting.
- `POST /api/inquiries` - Creates a new inquiry. Checks for duplicates within a 10-minute window (`409`).
- `PATCH /api/inquiries/:id/status` - Updates inquiry lifecycle status. Requires `{ status, version }` for Optimistic Concurrency Control.

---

## 8. Demonstrating the Three Real-World Situations

The evaluation specifically tests 3 real-world scenarios. Here is how InquiryDesk handles and proves each one:

### Situation 1: Missing or Invalid Information
- **User Action:** Open the "Log New Inquiry" modal and enter a single letter for Name or a 5-letter description.
- **Client Behavior:** Form highlights invalid inputs with red borders, live minimum character countdowns (`5 / 10 chars minimum`), and prevents invalid submission.
- **Server Enforcement:** If bypassed, the Express backend independently validates payloads with Zod (`inquirySchemas.js`) and returns `422 Unprocessable Entity` with structured field errors:
  ```json
  { "error": "Invalid input", "details": { "description": ["Description must be at least 10 characters"] } }
  ```

---

### Situation 2: Stale Data in Two Browser Tabs (Optimistic Concurrency Control)
- **User Action:** Open the same inquiry in two browser tabs (Tab A and Tab B) while both display `v1` and status `New`.
- **In Tab A:** Click **"Start Progress →"**. Tab A succeeds; database updates status to `in_progress` and increments version to `v2`.
- **In Tab B:** Click **"Start Progress →"** without refreshing. Tab B sends `version: 1`.
- **Server Enforcement:**
  ```sql
  UPDATE inquiries SET status = $1, version = version + 1 WHERE id = $2 AND version = $3;
  ```
  Since `version` in the database is now `2`, 0 rows match. The API returns:
  ```json
  { "status": 409, "error": "This inquiry was updated elsewhere. Please reload.", "details": { "stale": true } }
  ```
- **UI Behavior:** Tab B displays an alert: **"⚠️ Concurrency Conflict (OCC): This inquiry was updated elsewhere"** alongside a **"Reload Latest Version"** button that synchronizes state without a full page refresh.

---

### Situation 3: Direct Link Access to Forbidden Inquiries
- **User Action:** Staff 1 creates an inquiry and copies its URL: `http://localhost:3000/#inquiry/<inquiry-id>`. Staff 1 signs out. Staff 2 logs in and pastes that direct link.
- **Server Enforcement:** In [`inquiryService.js`](file:///c:/Users/dhana/Desktop/InquiryDesk/backend/src/services/inquiryService.js):
  ```sql
  SELECT * FROM inquiries WHERE id = $1 AND created_by = $2;
  ```
  Returns 0 rows. The server returns **`404 Not Found`** (NOT `403 Forbidden`).
- **Security Justification:** Returning `403` informs an attacker that a valid ticket exists with that ID. Returning `404` denies its existence, mitigating ID enumeration and information disclosure.
- **UI Behavior:** Staff 2 is shown a clean **"Inquiry Not Available"** card with a button to return to their workspace.

---

## 9. Architectural Decisions & AI Disclosure

Please refer to [`DECISIONS.md`](file:///c:/Users/dhana/Desktop/InquiryDesk/DECISIONS.md) for:
1. Assumptions made during design.
2. 2–3 meaningful technical choices (Centralized SQL access rules, integer OCC versioning, sliding-window deduplication).
3. Trade-offs accepted (OCC reload vs WebSocket complexity).
4. Proposed next improvements (audit logs, attachments, assignments).
5. **AI and outside resources disclosure** (accepted and rejected AI recommendations).
