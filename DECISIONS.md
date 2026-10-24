# Architecture & Design Decisions

## 1. Centralized Access Rules in SQL (`inquiryService.js`)
- **Decision**: Rather than implementing role-checking middleware in routes or filtering in JavaScript application memory, access control is pushed directly into the SQL `WHERE` clause inside `getAccessible()` and `list()`.
- **Reason**:
  - Eliminates the risk of a new route or endpoint forgetting permission checks.
  - Efficient query execution at the database level avoiding over-fetching rows.
  - Enforces: Admins see all inquiries; staff see only their own created inquiries.

## 2. Optimistic Concurrency Control (OCC)
- **Decision**: Table `inquiries` includes an integer column `version INT NOT NULL DEFAULT 1`. Status updates execute `UPDATE inquiries SET status = $1, version = version + 1 WHERE id = $2 AND version = $3`.
- **Reason**:
  - Handles simultaneous multi-tab or multi-user state changes without database row locks (pessimistic locking) that could degrade throughput.
  - If a stale version is received, 0 rows are updated, throwing a `409 Conflict`. The client UI displays an alert and prompts a reload.

## 3. 404 vs 403 for Forbidden Resources
- **Decision**: When a staff member requests an inquiry created by someone else, the service throws `404 Inquiry not found` rather than `403 Forbidden`.
- **Reason**:
  - Returning `403` reveals that the resource exists (information disclosure / ID harvesting).
  - Returning `404` prevents enumeration and treats unauthorized IDs as non-existent.

## 4. HttpOnly Cookies for JWT Authentication
- **Decision**: JWT tokens are issued via `Set-Cookie: token=...; HttpOnly; SameSite=Lax`.
- **Reason**:
  - Protects tokens from theft via Cross-Site Scripting (XSS) attacks because JavaScript cannot read `HttpOnly` cookies.
  - Automatically sent with fetch calls using `credentials: 'include'`.
