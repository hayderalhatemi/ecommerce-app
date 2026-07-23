# E-Commerce App

A full-stack e-commerce platform built with Node.js, Express, TypeScript, MongoDB, and React. Features JWT authentication with role-based access control, product management with image uploads, a shopping cart, and a complete order system.

**Live Demo:** Coming soon
**Repository:** https://github.com/hayderalhatemi/ecommerce-app

---

## Features

### Backend
- JWT authentication (register/login) with role-based access (`user` / `admin`)
- Product CRUD with image uploads via Multer
- Order creation, order history, and admin order management
- Request validation with Zod
- Centralized error handling
- Auth and role-restriction middleware
- Security: Helmet + rate limiting
- Versioned REST API (`/api/v1/...`)
- MongoDB Atlas integration via Mongoose

### Frontend
- Redux Toolkit state management (auth + cart, persisted to localStorage)
- Protected routes with role-based access control
- Product browsing with search and filtering
- Shopping cart with quantity updates
- Checkout flow with shipping details
- Order history for users
- Admin dashboard: manage products and update order statuses
- Form validation with React Hook Form
- Toast notifications with react-hot-toast

---

## Tech Stack

**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Zod, Multer, Helmet, express-rate-limit

**Frontend:** React, TypeScript, Vite, React Router, Redux Toolkit, Axios, React Hook Form, react-hot-toast

---

## Project Structure

```
ecommerce-app/
├── backend/          # Express API
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── app.ts
├── frontend/         # React app
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       ├── store/
│       └── App.tsx
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_API_BASE=http://localhost:5000
```

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## API Overview

| Method | Endpoint | Description | Access |
|--------|----------|--------------|--------|
| POST | `/api/v1/auth/register` | Register a new user | Public |
| POST | `/api/v1/auth/login` | Log in | Public |
| GET | `/api/v1/products` | Get all products | Public |
| GET | `/api/v1/products/:id` | Get single product | Public |
| POST | `/api/v1/products` | Create product | Admin |
| PUT | `/api/v1/products/:id` | Update product | Admin |
| DELETE | `/api/v1/products/:id` | Delete product | Admin |
| POST | `/api/v1/orders` | Create order | User |
| GET | `/api/v1/orders/my-orders` | Get user's orders | User |
| GET | `/api/v1/orders` | Get all orders | Admin |
| PATCH | `/api/v1/orders/:id/status` | Update order status | Admin |

Full API documentation coming soon (Swagger/OpenAPI).

---

## Roadmap

- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Swagger/OpenAPI documentation
- [ ] ERD diagram
- [ ] Backend testing (Jest + Supertest)
- [ ] Frontend testing (Vitest + React Testing Library)
- [ ] CI/CD with GitHub Actions

---

## Author

**Hayder Alhatemi**
ICT Student, Turku University of Applied Sciences (TUAS)
[GitHub](https://github.com/hayderalhatemi)

---

## License

This project is for educational and portfolio purposes.
