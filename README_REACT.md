# React Version - CitizenConnect

This is a **React.js version** of the CitizenConnect application (converted from Next.js).

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will automatically open at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

## Project Structure

```
src/
├── index.tsx              # React entry point
├── App.tsx               # Main router setup
├── index.css             # Global styles with Tailwind
├── context/
│   └── AuthContext.tsx   # Authentication context (user, login, logout)
├── pages/
│   ├── LoginPage.tsx     # Login page with password validation
│   ├── CitizenDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── PoliticianDashboard.tsx
│   └── ModeratorDashboard.tsx
└── components/
    └── ProtectedRoute.tsx # Route protection component
```

## Features

✅ User authentication with password validation
✅ Role-based access control (Citizen, Politician, Admin, Moderator)
✅ Password visibility toggle
✅ Protected routes
✅ Tailwind CSS styling
✅ React Router for navigation

## Test Credentials

Username: `John Doe` (must start with capital letter)
Email: `john@gmail.com` (must be Gmail)
Password: `Password@123` (8+ chars, uppercase, lowercase, number, special char)
Role: Select any role

## Different from Next.js Version

- ✨ Uses **React Router** instead of file-based routing
- ✨ Removed `"use client"` directives (React 18 only)
- ✨ Uses `useNavigate()` instead of `useRouter()`
- ✨ Standard React app structure with CRA
- ✨ Easy to deploy to any provider (Vercel, Netlify, etc.)

## Available Routes

- `/login` - Login page
- `/citizen/dashboard` - Citizen dashboard
- `/politician/dashboard` - Politician dashboard
- `/admin/dashboard` - Admin dashboard
- `/moderator/dashboard` - Moderator dashboard
