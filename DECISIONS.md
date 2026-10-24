# Engineering Decisions & Technical Reflection

## 1. Assumptions Made
1. **Internal Service Workspace**: The application is an internal tool for customer service representatives (staff) and team managers (admin). Public customer self-registration is omitted in favor of seeded pre-authenticated employee profiles.
2. **Lifecycle Model**: Customer inquiries follow a linear progression (`new` ➔ `in_progress` ➔ `resolved`), with an intentional reopening path (`resolved` ➔ `in_progress`). Direct skips (e.g. `new` ➔ `resolved`) bypass active handling and are disallowed.
3. **Contact Channels**: Customer contact information may be either an email address or a telephone number, accommodated with a flexible string schema rather than strict email-only regex.

---

## 2. Meaningful Design Choices

### A. Centralized Access Rules in SQL (Security & Multi-Tenancy)
- **Choice**: Instead of enforcing staff ownership in Express middleware or JavaScript array filters, access boundaries are enforced directly in the SQL query:
  ```sql
  WHERE (user.role = 'admin' OR created_by = user.id)
  ```
- **Rationale**: 
  - Prevents authorization bypasses if new routes or queries are added.
  - Ensures unauthorized inquiry access attempts return **`404 Not Found`** instead of `403 Forbidden`, mitigating ID enumeration and resource existence disclosure.

### B. Optimistic Concurrency Control (OCC)
- **Choice**: The `inquiries` table maintains an integer `version INT NOT NULL DEFAULT 1`. Status transitions execute:
  ```sql
  UPDATE inquiries SET status = $1, version = version + 1, updated_at = now()
  WHERE id = $2 AND version = $3 RETURNING *;
  ```
- **Rationale**: Resolves the two-browser-tab conflict problem without locking database rows (pessimistic locking) that could bottleneck concurrent workers. When an edit collision occurs, 0 rows are updated and the server returns `409 Conflict` (`{ stale: true }`). The frontend detects this and provides a "Reload Latest Version" action.

### C. Lightweight Duplicate Protection Policy
- **Choice**: A submission matching the same `created_by`, `contact`, and `subject` within a 10-minute sliding window triggers a `409 Conflict` with the existing inquiry's UUID.
- **Rationale**: Prevents double-clicks and redundant tickets while keeping the implementation concise using standard PostgreSQL index lookups on `(created_by, contact, subject, created_at DESC)`.

---

## 3. Trade-offs Accepted

- **Polling / Manual Reload vs WebSockets**:
  - *Trade-off*: We chose Optimistic Concurrency Control with reload triggers over full real-time WebSockets / SSE.
  - *Justification*: In a service desk environment with modest update frequencies, WebSocket infrastructure introduces complexity (connection drops, state synchronizers, reconnection loops) for marginal benefit. OCC guarantees data integrity with zero distributed connection overhead.

---

## 4. What Would Be Improved Next

1. **Role-based Activity Log / Audit Trail**: Adding an `inquiry_events` table recording every state transition, timestamp, and notes from staff.
2. **File Attachments**: Enabling customer screenshot or invoice uploads using presigned S3 / Cloud Storage URLs.
3. **Assignment Delegation**: Allowing admins or staff to reassign inquiries across team members.

---

## 5. Use of AI and Outside Resources (Assessment Disclosure)

- **Where AI Assisted**: 
  - Rapid scaffolding of PostgreSQL DDL migrations and seed scripts.
  - Structuring the Jest backend integration test suite and frontend assertion runner.
  - Polishing modern CSS variable palettes and accessible UI layout patterns.
- **Accepted Suggestion**: 
  - Accepted the recommendation to implement OCC via integer `version` comparison in the `UPDATE` query rather than relying on timestamp equality (which can suffer from millisecond precision loss across platforms).
- **Modified / Rejected Suggestion**: 
  - Rejected an AI suggestion to add a full Redis caching tier or external message broker for duplicate detection; selected a direct PostgreSQL index query (`interval '10 minutes'`) instead to keep deployment and local setup straightforward and dependency-free.
