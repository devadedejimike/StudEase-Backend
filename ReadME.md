
```markdown
# StudEase Backend

The **StudEase Backend** is the server-side API for the StudEase web application.  
It powers the **Digital Support System**, handling user authentication, ticket management, and comments between students and administrators.  

Built with **Node.js, Express, and MongoDB**.

---

## Features

### 🔑 Authentication & Authorization
- Student registration and login
- Admin login (pre-created accounts or seeded)
- Role-based access control (student vs. admin)
- JWT-based authentication

### 🎓 Students
- Register and login
- Create support tickets
- View their own tickets
- Add comments on tickets

### 🛠️ Admins
- Login as admin
- View all tickets
- Update ticket statuses (`New`, `In Progress`, `Solved`, `Closed`)
- Add comments on any ticket

### 💬 Comments
- Linked to tickets
- Can be added by both students and admins
- Displayed in chronological order

---

## Tech Stack

- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **MongoDB + Mongoose** – Database and ODM
- **JWT (jsonwebtoken)** – Authentication
- **Bcrypt** – Password hashing
- **Cors & dotenv** – Security and environment config

---

## Project Structure

```

backend/
├─ models/          # Mongoose models (User, Ticket, Comment)
├─ routes/          # API routes (auth, tickets, comments)
├─ middleware/      # Auth & role-based middlewares
├─ controllers/     # Controller logic for each route
├─ config/          # Database connection
├─ server.js        # App entry point
└─ .env             # Environment variables

````

---

## API Endpoints

### 🔐 Auth
- `POST /api/auth/register` → Register a new student
- `POST /api/auth/login` → Login (student/admin)

### 🎟️ Tickets
- `POST /api/tickets` → Create ticket (student only)
- `GET /api/tickets` → Get all tickets (admin only)
- `GET /api/tickets/:id` → Get ticket by ID
- `PUT /api/tickets/:id` → Update ticket status (admin only)

### 💬 Comments
- `POST /api/tickets/:id/comments` → Add comment to ticket
- `GET /api/tickets/:id/comments` → Get comments for ticket

---

## Example Ticket Workflow

1. A student registers and logs in → gets JWT token.
2. Student creates a ticket (`status: New`).
3. Admin logs in → views all tickets.
4. Admin updates status (e.g., `In Progress` → `Solved`).
5. Both student and admin can add comments under the ticket.

---

## Contact

Developed by **\[DevMichael]**
📧 Email: [devadedejimike@gmail.com](mailto:devadedejimike@gmail.com)
🌍 GitHub: [github.com/devadedejimike](https://github.com/devadedejimike)

```

---
