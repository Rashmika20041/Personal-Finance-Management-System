# Personal Finance Management System

A full-stack application for managing personal finances with JWT authentication.

## Features

- 🔐 JWT-based authentication (register/login/logout)
- 🛡️ Protected routes with React Context API
- 💰 Financial dashboard with expense tracking
- 📊 Interactive charts and reports
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Recharts
- Heroicons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Authentication System

The app uses a robust authentication system with React Context API:

### AuthContext Features:
- Global authentication state management
- Automatic token validation on app load
- Login/Register functions with loading states
- Secure logout functionality
- Protected route components

### How Authentication Works:

1. **Registration**: User creates account → JWT token stored in localStorage
2. **Login**: User credentials verified → JWT token stored in localStorage
3. **Protected Routes**: AuthContext checks token validity before rendering
4. **Auto-logout**: Invalid/expired tokens automatically clear user session

### API Endpoints:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user (protected)
- `GET /api/auth/logout` - Logout (client-side token removal)

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-finance-management-system
   ```

2. **Backend Setup**
   ```bash
   cd personal-management-system-backend
   npm install
   # Update .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd personal-management-system-frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Project Structure

```
├── personal-management-system-backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Main server file
│
└── personal-management-system-frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── contexts/    # React contexts (AuthContext)
    │   ├── utils/       # Utilities (apiService)
    │   └── assets/      # Static assets
    └── public/          # Public files
```

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/personal-finance
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

## Available Scripts

### Backend
- `npm start` - Production server
- `npm run dev` - Development server (with nodemon)

### Frontend
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License.