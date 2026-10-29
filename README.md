# Appointment Booking System (CareSlot)

A web application that lets patients register, log in, see free time slots of clinic doctors and book or cancel appointments.

## Tech stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express.js (REST API)
- Database: SQLite (better-sqlite3)
- Auth: JWT + bcrypt password hashing
- Testing: Jest + Supertest
- Static analysis: ESLint

## Run locally
```bash
git clone https://github.com/<your-username>/appointment-booking-system.git
cd appointment-booking-system
npm install
npm start          # open http://localhost:3000
```

## Quality checks
```bash
npm run lint       # ESLint static code analysis
npm test           # Jest unit + API tests
npm audit --omit=dev
```

## API endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create an account |
| POST | /api/auth/login | Log in, returns a JWT |
| GET | /api/doctors | List doctors |
| GET | /api/doctors/:id/slots?date=YYYY-MM-DD | Free slots for a day |
| POST | /api/appointments | Book a slot (login required) |
| GET | /api/appointments | My appointments (login required) |
| PATCH | /api/appointments/:id/cancel | Cancel an appointment (login required) |
