# SoulSync - Quick Start Guide

## 🚀 Getting Started

This guide will help you set up and run SoulSync locally.

## Prerequisites

- Node.js 18+ installed
- MongoDB (local or MongoDB Atlas account)
- Redis (local or Redis Cloud account)
- AWS account (for S3 storage - optional for development)

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up Environment Variables

**Backend (.env):**

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

**Frontend (.env):**

```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
```

### 3. Set Up MongoDB

**Option A: Local MongoDB**

```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 mongo
```

**Option B: MongoDB Atlas**

- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in backend/.env

### 4. Set Up Redis

**Option A: Local Redis**

```bash
# Install Redis locally or use Docker
docker run -d -p 6379:6379 redis
```

**Option B: Redis Cloud**

- Create account at https://redis.com/try-free/
- Create database
- Get connection URL
- Update `REDIS_URL` in backend/.env

### 5. Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 Development Notes

### Project Structure

```
soulsync/
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── config/   # Database, Redis config
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── socket/
│   │   └── utils/
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   └── hooks/
│   └── package.json
├── docs/             # Documentation
└── README.md
```

### Key Features Implemented

✅ **Backend:**

- User authentication (JWT)
- User profiles and preferences
- Swipe system
- Match creation
- Chat system (Socket.io)
- Connection Quests
- Recommendation algorithm
- File upload (S3)

✅ **Frontend:**

- Authentication pages
- Onboarding flow
- Discovery/swipe interface
- Matches list
- Chat interface
- Profile management
- Dashboard

### Next Steps for Development

1. **Complete MVP Features:**

   - Email verification
   - Photo verification
   - Enhanced personality quiz
   - Voice intro recording
   - Quest completion logic

2. **Integrate External Services:**

   - AWS S3 for media storage
   - OpenAI API for personality analysis
   - Stripe for payments
   - Twilio for SMS/OTP

3. **Add Premium Features:**

   - Subscription management
   - Premium filters
   - See who liked you
   - Unlimited swipes

4. **Enhance User Experience:**
   - Animations and transitions
   - Loading states
   - Error handling
   - Toast notifications

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Check MongoDB is running
- Verify connection string in .env
- Check firewall settings

### Redis Connection Issues

- Check Redis is running
- Verify connection URL in .env
- Redis is optional for basic features

### Port Already in Use

- Change PORT in backend/.env
- Change port in frontend/vite.config.ts

### CORS Errors

- Verify FRONTEND_URL in backend/.env matches frontend URL
- Check CORS settings in backend/src/server.ts

## 📚 Documentation

- [Product Plan](./PRODUCT_PLAN.md) - Complete product strategy
- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md) - System design
- [UI/UX Design](./docs/UI_UX_DESIGN.md) - Design system
- [Development Roadmap](./docs/ROADMAP.md) - Development phases

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Proprietary - All rights reserved

---

**Happy Coding! 🚀**

For questions or issues, please refer to the documentation or create an issue.
