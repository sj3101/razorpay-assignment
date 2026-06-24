# Reimbursement Management System Backend

A backend system for managing employee reimbursement requests with a multi-level approval workflow. The application is built using Node.js, Express.js, PostgreSQL (Supabase), and Drizzle ORM following the MVC architecture.

---

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Supabase)
* **ORM:** Drizzle ORM
* **Authentication:** JWT + HTTP-only Cookies
* **Password Hashing:** bcrypt
* **Architecture:** MVC (Model-View-Controller)

---

## Project Structure

```text
src/
├── controllers/
├── services/
├── repositories/
├── routes/
├── middlewares/
├── config/
├── db/
│   ├── schema/
│   ├── migrations/
│   └── seed/
├── utils/
├── validators/
├── app.js
└── server.js
```

---

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Secure HTTP-only cookie sessions
* Password hashing using bcrypt

### Role-Based Access Control (RBAC)

Supported roles:

* EMP (Employee)
* RM (Relationship Manager)
* APE (Approval Executive)
* CFO (Chief Financial Officer)

### Reimbursement Workflow

1. Employee creates a reimbursement request.
2. RM reviews and approves/rejects the request.
3. APE performs second-level approval.
4. CFO provides the final decision.

---

## Database Schema

### users

Stores application users.

Fields:

* id
* name
* email
* password
* role
* createdAt
* updatedAt

---

### employee_manager

Stores employee-manager mappings.

Fields:

* id
* employeeId
* managerId
* createdAt

Business Rule:

* Every employee reports to exactly one Relationship Manager (RM).

---

### reimbursements

Stores reimbursement requests.

Fields:

* id
* employeeId
* title
* description
* amount
* rmApproval
* apeApproval
* finalStatus
* createdAt
* updatedAt

---

## Approval Workflow

```text
EMP
 ↓
RM Approval
 ↓
APE Approval
 ↓
CFO Final Decision
```

Status values:

* PENDING
* APPROVED
* REJECTED

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd <project-name>
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file:

```env
PORT=7002

DATABASE_URL=

JWT_SECRET=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

### 4. Generate Migrations

```bash
npm run db:migrate
```

---

### 5. Seed Initial CFO User

```bash
npm run db:seed-data
```

Default CFO credentials:

```text
Email: cfo@org.com
Password: CFO#ORG@April2026
Role: CFO
```

---

### 6. Start Development Server

```bash
npm run dev
```

Server runs on:

```text
http://localhost:7002
```

---

## API Endpoints

### Authentication

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | /auth/register | Register a new user |
| POST   | /auth/login    | Login user          |
| GET    | /auth/me       | Get logged-in user  |

---

### Employee

| Method | Endpoint                  | Description           |
| ------ | ------------------------- | --------------------- |
| GET    | /employees/:id            | Get employee details  |
| POST   | /employees/assign-manager | Assign RM to employee |

---

### Reimbursements

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| POST   | /reimbursements            | Create reimbursement        |
| GET    | /reimbursements/my         | Get employee reimbursements |
| PATCH  | /reimbursements/:id/status | Update approval status      |

---

## Testing

The APIs can be tested using:

* Postman
* Thunder Client
* cURL

---

## Architecture Flow

```text
Client
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
Drizzle ORM
   ↓
Supabase PostgreSQL
```

---

## Security Features

* Password hashing with bcrypt
* JWT-based authentication
* HTTP-only cookies
* Role-based authorization
* Environment-based configuration

---

## Author

Developed as a backend assignment demonstrating:

* REST API design
* PostgreSQL schema design
* Drizzle ORM integration
* Authentication and authorization
* Enterprise approval workflow implementation
