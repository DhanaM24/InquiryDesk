# InquiryDesk

Customer Inquiry & Service Desk web application with role-based access control, optimistic concurrency control, and duplicate submission prevention.

---

## Architecture & Technology Stack

- **Backend**: Node.js, Express, PostgreSQL (`pg`), JWT (HttpOnly Cookie Auth), Zod, Bcrypt
- **Frontend**: React 18, Vite, Context API, CSS Variables design system
- **Testing**: Jest, Supertest

---

## Getting Started

### 1. Database Setup (PostgreSQL)

Create the PostgreSQL database `inquirydesk`:
```bash
createdb inquirydesk
```
*(Or via psql: `CREATE DATABASE inquirydesk;`)*

Ensure your PostgreSQL credentials in `backend/.env` match:
```env
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/inquirydesk
JWT_SECRET=change_me_to_a_long_random_string
FRONTEND_ORIGIN=http://localhost:3000
PORT=4000
```

Run database migrations and seed default demo data:
```bash
cd backend
npm run migrate
npm run seed
```

**Seed Credentials:**
- **Admin**: `admin@demo.com` / `Password123!`
- **Staff 1**: `staff1@demo.com` / `Password123!`
- **Staff 2**: `staff2@demo.com` / `Password123!`

### 2. Run Backend Server

```bash
cd backend
npm run dev
```
API runs on `http://localhost:4000`.

### 3. Run Frontend App

```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`.

### 4. Running Backend Tests

```bash
cd backend
npm test
```

---

## Core Interview Decisions & Concepts

1. **Centralized Access Rule in Service Layer**:
   All tenant and role boundary checks are enforced directly in SQL (`WHERE (role = 'admin' OR created_by = user.id)`) within `inquiryService.js`. Individual route controllers cannot accidentally bypass authorization.
2. **Optimistic Concurrency Control (OCC)**:
   Concurrent edits and multi-tab workflows are handled using integer versioning:
   `UPDATE inquiries SET status = $1, version = version + 1 WHERE id = $2 AND version = $3`.
   If another user/tab modified the status first, 0 rows are affected and a `409 Conflict` (`stale: true`) is returned without holding database locks.
3. **Information Leakage Prevention**:
   Unauthorized inquiries return `404 Not Found` rather than `403 Forbidden`, preventing malicious users from enumerating whether specific inquiry IDs exist.
4. **Duplicate Prevention**:
   Submissions matching the same creator, customer contact, and subject within a 10-minute sliding window are rejected with `409 Conflict` alongside a reference to the existing inquiry.
