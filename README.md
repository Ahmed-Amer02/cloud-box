# CloudBox

A full-stack cloud storage app — think a stripped-down Google Drive/Dropbox clone. The backend focuses on real production-grade engineering: streaming file uploads with backpressure, race-safe concurrent state transitions, recursive SQL for tree structures, and a soft-delete/trash system with correct cascade semantics. The React frontend is a complete client for it: authenticated file browsing, nested folders, tagging, search, and trash/restore.

**Live App:** <https://cloud-box-rsst.onrender.com> *(hosted on Render's free tier — the first request after a period of inactivity may take 30-60s to wake up)*

[![Tests](https://github.com/neterosaan/cloud-box/actions/workflows/tests.yml/badge.svg)](https://github.com/neterosaan/cloud-box/actions/workflows/tests.yml)

---

## What this project demonstrates

- **True streaming uploads** — files are piped directly from the incoming HTTP request to S3 via multipart upload, with size limits and MIME-type validation (via magic-byte sniffing, not trusting the client's declared `Content-Type`) enforced *as data flows*, never buffering a whole file in memory.
- **Race-safe upload session claiming** — concurrent requests to the same upload session are resolved atomically at the database level (`updateMany` with a status guard), not with a read-then-write pattern that could double-process a session.
- **A trash/recycle-bin system with correct cascade behavior** — trashing a folder cascades to its contents, but an item trashed independently *before* its parent is protected from being swept up when the parent is later permanently deleted. This required moving away from relying on the database's own foreign-key cascade (which can't distinguish "safe to cascade" from "explicitly protected") toward an application-level design that tracks original locations separately, so restored items return to exactly where they were — matching how Google Drive and Dropbox behave.
- **A real automated test suite** — not just happy-path coverage. Includes concurrency tests (proving the race-safe claim actually holds under real concurrent requests against a real Postgres database), recursive CTE correctness tests, and several regression tests written *after* finding actual bugs during development (see [Notable bugs found & fixed](#notable-bugs-found--fixed-during-development) below).
- **A full authenticated client** built on top of it — protected routing, folder navigation with breadcrumbs, drag-free upload with live progress, tagging, search, and a trash view with restore-to-original-location, all backed by React Query for cache/state management.

---

## Architecture

```
flowchart TB
    subgraph Frontend["React Frontend (Vite)"]
        UI[Pages: Files / Search / Tags / Trash]
        RQ[TanStack Query cache]
    end

    Client([Browser])

    subgraph API["CloudBox API (Express)"]
        RateLimit[Rate Limiter]
        Auth[Auth Middleware<br/>verifies JWT via JWKS]
        Routes[Folders / Files / Tags /<br/>Uploads / Trash routes]
    end

    Supabase[(Supabase Auth<br/>issues JWTs)]
    Postgres[(Postgres<br/>via Prisma)]
    S3[(AWS S3<br/>file storage)]

    Client --> UI --> RQ
    RQ -- "Bearer JWT" --> RateLimit --> Auth
    Auth -- "verifies signature" --> Supabase
    Auth --> Routes
    Routes --> Postgres
    Routes --> S3
```

### The upload pipeline

The most involved piece of the system — a file is streamed through several transforms before it ever fully lands in S3:

```
sequenceDiagram
    participant C as Client
    participant API as API
    participant Guard as SizeGuard + MimeSniffer<br/>(streaming transforms)
    participant S3 as S3 (multipart upload)
    participant DB as Postgres

    C->>API: POST /api/uploads/init
    API->>DB: create UploadSession (status: PENDING)
    API-->>C: uploadId

    C->>API: POST /api/uploads/:uploadId (raw file stream)
    API->>DB: atomic claim (PENDING -> UPLOADING)
    Note over DB: updateMany guard prevents<br/>a double-claim race
    API->>Guard: pipe incoming stream
    Guard->>Guard: reject if size/MIME invalid
    Guard->>S3: stream chunks via multipart upload
    S3-->>API: upload complete
    API->>DB: create File row, mark session COMPLETED
    API-->>C: file metadata
```

---

## Tech stack

**Backend**
- **Runtime:** Node.js 22, Express 5
- **Database:** PostgreSQL via Prisma ORM (hosted on Supabase)
- **Auth:** Supabase Auth (JWT verification via JWKS — this API never handles passwords or issues tokens itself)
- **Storage:** AWS S3 (streaming multipart uploads)
- **Validation:** Zod
- **Testing:** Vitest — unit tests for pure logic, integration tests against a real disposable Postgres container
- **CI:** GitHub Actions (runs the full test suite, including integration tests against a real Postgres service, on every push)
- **Logging:** Pino (structured application logs) + Morgan (HTTP access logs)
- **Containerization:** Docker (multi-stage build; see `Dockerfile`)

**Frontend**
- **Framework:** React 19 + TypeScript, built with Vite
- **Routing:** React Router 7, with protected/public-only route guards
- **Server state:** TanStack Query (React Query) for caching, background refetching, and mutation state
- **Forms & validation:** React Hook Form + Zod
- **UI:** Tailwind CSS v4, Radix UI primitives (dialog, alert-dialog, dropdown menu, progress), lucide-react icons
- **Auth:** Supabase JS client, wired into an `AuthContext` provider
- **Other:** Axios for API calls, Sonner for toast notifications

---

## Features

| Feature       | Notes                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Folders       | Nested folders, breadcrumb trails (recursive CTE), move with cycle detection                                                        |
| Files         | Upload, download (presigned URLs), rename, tagging                                                                                  |
| Tags          | Create/attach/detach, scoped per-user                                                                                               |
| Trash         | Soft delete, restore-to-original-location, cascading trash/restore, permanent delete, scheduled auto-purge after a retention window |
| Storage quota | Per-user upload quota enforced *during* the stream, not after the fact                                                              |
| Pagination    | Cursor-independent page/limit pagination on listing endpoints                                                                       |
| Rate limiting | Global IP-based limit + a stricter per-user limit specifically on upload routes                                                     |
| Auth (frontend) | Login/signup, protected routing, session persistence via Supabase                                                                  |
| File browser (frontend) | Folder navigation, breadcrumbs, upload with progress, search, tag management, trash view with restore                    |

---

## API reference

A full **Postman collection** covering every endpoint (with a pre-request script to auto-fetch a test JWT from Supabase) is included: [`cloudbox.postman_collection.json`](https://github.com/Ahmed-Amer02/cloud-box/blob/main/cloudbox.postman_collection.json).

Import it, set the `baseUrl` variable, and run the "Get Test Token" request first to populate `authToken` for the rest of the collection.

**Interactive API docs (Swagger UI):** <https://cloud-box-rsst.onrender.com/api-docs>

Browse and try every endpoint directly in the browser — no tool install required. The Postman collection above is still the better choice for actually developing against the API (it includes the auto-token-fetch script and saved environments); Swagger is the fastest way for someone reviewing the project to see what it does.

---

## Running locally

**Requirements:** Node 22+, Docker (for the test database), a Supabase project, an AWS S3 bucket.

### Backend

```
git clone https://github.com/Ahmed-Amer02/cloud-box.git
cd cloud-box/backend
npm install
```

Create a `.env` file with:

```
DATABASE_URL=
DIRECT_URL=
SUPABASE_URL=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
FRONTEND_URL=       # optional -- CORS origin, defaults to http://localhost:5173 if unset
```

```
npx prisma migrate deploy
npm run dev
```

### Frontend

```
cd cloud-box/frontend
npm install
npm run dev
```

Create a `.env` file with your Supabase project URL/anon key and the backend API base URL (see `.env` in the frontend folder for the exact variable names).

### Running with Docker (backend)

```
docker build -t cloud-box .
docker run --env-file .env -p 3000:3000 cloud-box
```

### Running the tests

```
npm run test:unit          # pure logic, no external dependencies

npm run test:db:up         # starts a disposable Postgres container
npm run test:db:migrate
npm run test:integration   # race conditions, recursive CTEs, cascade behavior
```

---

## Notable bugs found & fixed during development

Kept here deliberately, rather than a spotless-looking commit history — these were caught by the test suite during development, not left as silent issues:

- A case-sensitive filename mismatch (`uploadCleanupJob.js` vs. `uploadCleanupjob.js`) that worked locally on Windows but crashed on Linux deployment — caught by the difference between a case-insensitive and case-sensitive filesystem.
- `createFolder` allowed nesting a new active folder under an already-trashed one, which combined with the database's own foreign-key cascade could have caused an active folder to be silently, permanently deleted when its trashed ancestor was purged. Fixed by redesigning the trash system to detach items from the live folder tree at the moment they're independently trashed, rather than relying on the database's cascade to sort out what's "safe."
- A pagination helper used `parsedLimit || DEFAULT` to fall back on invalid input — which incorrectly treated an explicit `limit=0` the same as "not provided," since `0` is falsy in JavaScript, silently ignoring a user's valid request to clamp their own page size.
- The trash feature's routes existed and were fully tested at the service layer, but were never actually mounted in `app.js` — invisible to every unit and service-level test, and only caught by a route-level smoke test hitting the real HTTP layer.

---

## Known limitations

- The in-memory rate limiter store means limits reset if the process restarts, and wouldn't hold correctly across multiple horizontally-scaled instances (not a concern at the current single-instance deployment scale).
- No automated end-to-end (browser) test suite yet — the API layer has thorough integration test coverage; the frontend is currently verified manually rather than with Playwright/Cypress.

## About

Full-stack cloud storage app with a React/TypeScript client and a Node.js/Express/PostgreSQL API — streaming S3 uploads, race-safe concurrency handling, and a cascading trash/restore system.
