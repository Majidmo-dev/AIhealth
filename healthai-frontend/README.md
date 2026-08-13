# AfyaAI frontend

Angular single-page application for health guidance, clinic discovery, appointment requests, patient activity, and an AI-assistant interface. It is a frontend only; clinical advice, authentication, data storage, and emergency handling belong in the backend.

## Run locally

1. Install Node.js 20.19+ (or Node 22.12+).
2. Run `npm install`.
3. Run `npm start` and open `http://localhost:4200`.
4. Run `npm run build` for a production build.

## Backend integration

The API boundary lives in `src/app/core/api.service.ts`. The app calls `/api`, which lets a reverse proxy send requests to your backend. The `npm start` command automatically uses `proxy.conf.json` (target: `http://localhost:3000`). Change `apiUrl` in `src/environments/environment.ts` for an absolute API URL at deployment.

The UI will display sample doctors and clinics, and save appointment requests in browser storage, only when the API is unavailable. Remove that fallback before a production healthcare deployment if it is not desired.

Expected REST endpoints:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/doctors` | `Doctor[]` list |
| `GET` | `/api/clinics` | `Clinic[]` list |
| `GET` | `/api/appointments` | Current user's `AppointmentRequest[]` |
| `POST` | `/api/appointments` | Create an appointment request |
| `POST` | `/api/chat/messages` | Accept `{ "message": string }`, return a `ChatMessage` |

Use authenticated, authorized endpoints; validate all inputs on the server; serve over HTTPS; protect sensitive health data; and log/audit access appropriately. The client must not make diagnostic or triage decisions. See `models.ts` for response shapes.

## Project layout

- `src/app/pages/pages.component.ts` — all routed UI pages
- `src/app/core/api.service.ts` — REST integration and local demo fallback
- `src/app/core/models.ts` — shared API types
- `src/environments/environment.ts` — backend base URL
