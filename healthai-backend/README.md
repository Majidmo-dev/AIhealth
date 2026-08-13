# AfyaAI backend

Spring Boot 3.3 backend for the AfyaAI Angular frontend. Exposes the REST endpoints the frontend expects and stores data in PostgreSQL.

## Prerequisites

- Java 21
- Maven 3.9+
- PostgreSQL 14+

## Database setup

Create a database and user (defaults match `application.properties`):

```sh
createuser -P afyaai      # password: afyaai
createdb -O afyaai afyaai
```

Override with env vars if you prefer:

- `DB_URL` (default `jdbc:postgresql://localhost:5432/afyaai`)
- `DB_USER` (default `afyaai`)
- `DB_PASSWORD` (default `afyaai`)
- `SERVER_PORT` (default `3000`)

## Run

```sh
mvn spring-boot:run
```

On first start, tables are created and demo doctors/clinics are seeded. The server listens on port `3000` with base path `/api`, matching the frontend's `proxy.conf.json`.

## Endpoints

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| `GET` | `/api/doctors` | — | `Doctor[]` |
| `GET` | `/api/clinics` | — | `Clinic[]` |
| `GET` | `/api/appointments` | — | `Appointment[]` (newest first) |
| `POST` | `/api/appointments` | `{ doctorId, doctor?, specialty?, date, time }` | `Appointment` |
| `POST` | `/api/chat/messages` | `{ message }` | `ChatMessage` |

Quick smoke check:

```sh
curl http://localhost:3000/api/doctors
curl -X POST http://localhost:3000/api/chat/messages \
  -H 'content-type: application/json' \
  -d '{"message":"I have chest pain"}'
```

## Notes

- CORS allows `http://localhost:4200` for direct browser calls; the Angular dev proxy avoids CORS entirely by routing through `http://localhost:4200/api`.
- Chat replies are rule-based (mirrors the frontend's original demo behavior). Swap `ChatController` for a real LLM integration when ready.
- No authentication yet. Add Spring Security before exposing to real patient data.
- Schema is managed by Hibernate `ddl-auto=update` for developer convenience. Move to Flyway or Liquibase before production.
