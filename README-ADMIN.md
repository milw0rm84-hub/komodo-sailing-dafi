# Komodo Sailing Adventure - Full Stack Setup

A complete full-stack application with frontend, admin panel, and backend.

## Project Structure

```
komodo-sailing/
├── src/                      # Frontend (React + Vite)
│   ├── pages/               # Page components
│   ├── components/           # Reusable components
│   ├── utils/api.js         # API utilities
│   └── data/tourData.js     # Static fallback data
│
├── server/                   # Backend API (Node.js + Express + MySQL)
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & upload middleware
│   ├── uploads/             # Uploaded images
│   ├── index.js             # Server entry point
│   ├── seed.js              # Sample data seeder
│   └── .env                 # Environment variables
│
├── admin/                    # Admin Panel (React)
│   └── ...
│
└── .env                      # Frontend environment
```

## Prerequisites

- Node.js 18+
- MySQL (XAMPP, WAMP, or standalone)
- npm or yarn

## Quick Start

### 1. Setup MySQL

**Using XAMPP (Recommended):**
1. Download XAMPP from https://www.apachefriends.org/
2. Install and start **Apache** & **MySQL**
3. Open phpMyAdmin: http://localhost/phpmyadmin

### 2. Start Backend

```bash
cd server
npm install
npm run seed    # Creates database, tables & sample data
npm run dev     # Runs on http://localhost:5000
```

### 3. Start Frontend

```bash
# In a new terminal
npm run dev     # Runs on http://localhost:5173
```

### 4. Start Admin Panel (Optional)

```bash
cd admin
npm install
npm run dev     # Runs on http://localhost:3001
```

## Login Credentials

**Admin Panel:** http://localhost:3001/admin
- Email: `admin@komodosailing.com`
- Password: `komodo123`

## Features

### Frontend
- Dynamic package listing from database
- Package detail pages with booking forms
- Contact form
- Review submission form
- WhatsApp integration

### Admin Panel
- Dashboard with statistics
- Package CRUD with image upload
- Booking management
- Review moderation
- JWT authentication

### Backend API
- RESTful API endpoints
- JWT authentication
- Image upload
- MySQL database

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Admin login |
| GET | /api/packages | List all packages |
| GET | /api/packages/:id | Get package by ID |
| POST | /api/packages | Create package (auth) |
| PUT | /api/packages/:id | Update package (auth) |
| DELETE | /api/packages/:id | Delete package (auth) |
| GET | /api/bookings | List bookings (auth) |
| POST | /api/bookings | Create booking (public) |
| PATCH | /api/bookings/:id | Update booking (auth) |
| GET | /api/reviews | List reviews |
| GET | /api/reviews/approved | Get approved reviews |
| POST | /api/reviews | Create review (public) |
| PATCH | /api/reviews/:id | Update review (auth) |
| POST | /api/upload/image | Upload image (auth) |
| GET | /api/stats | Dashboard stats (auth) |

## Environment Variables

### Server (server/.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=komodo_sailing
JWT_SECRET=komodo-sailing-secret-key-2024
ADMIN_EMAIL=admin@komodosailing.com
ADMIN_PASSWORD=komodo123
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, MySQL
- **Admin:** React 18, Tailwind CSS, Axios
- **Auth:** JWT (JSON Web Tokens)
- **Images:** Multer (local storage)
