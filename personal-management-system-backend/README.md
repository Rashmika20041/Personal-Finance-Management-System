# Personal Management System Backend

This is the backend for the Personal Management System, built with Node.js, Express.js, MongoDB, and Mongoose.

## Features

- User authentication with JWT
- User registration and login
- Protected routes

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Copy `.env` file and update the values:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secret key for JWT signing
     - `PORT`: Port for the server (default 5000)

3. Start MongoDB (if running locally)

4. Run the server:
   ```
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ "firstName": "string", "lastName": "string", "email": "string", "password": "string" }`
  - Response: `{ "token": "jwt_token", "user": { "id": "string", "firstName": "string", "lastName": "string", "email": "string", "username": "string" } }`

- `POST /api/auth/login` - Login user
  - Body: `{ "email": "string", "password": "string" }`
  - Response: `{ "token": "jwt_token" }`

- `GET /api/auth/user` - Get user info (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Response: User object without password

## Notes

- Passwords are hashed using bcryptjs
- JWT tokens expire in 1 hour
- Make sure to set a strong JWT_SECRET in production