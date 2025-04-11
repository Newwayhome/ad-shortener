# Ad-Based URL Shortening Web Application

A full-stack web application that allows users to shorten URLs and monetize them through interstitial ad views.

## Features

- 🔐 User Authentication (JWT-based)
- 🔗 URL Shortening with Custom Aliases
- 📈 Detailed Click Analytics
- 💰 Interstitial Ad Page
- 🧮 User Dashboard with Analytics
- 💸 Wallet & Payout System

## Tech Stack

- Frontend: React.js with Tailwind CSS
- Backend: Node.js with Express
- Database: MongoDB with Mongoose ORM
- Authentication: JWT
- Deployment: Vercel (Frontend) & Render/AWS (Backend)

## Project Structure

```
url-shortener/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service functions
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utility functions
│   └── tests/            # Backend tests
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user profile

### URL Endpoints

- POST `/api/urls` - Create a new short URL
- GET `/api/urls` - Get all URLs for current user
- GET `/api/urls/:id` - Get URL details
- GET `/api/urls/:id/stats` - Get URL statistics

### Wallet Endpoints

- GET `/api/wallet` - Get wallet balance
- POST `/api/wallet/withdraw` - Request withdrawal
- GET `/api/wallet/transactions` - Get transaction history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 