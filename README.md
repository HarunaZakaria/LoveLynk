# SoulSync - Authentic Personality-Based Dating Platform

SoulSync is a unique dating application that prioritizes personality-based connections over superficial swiping. Built with the MERN stack, it uses AI-powered matching, voice chemistry, and interactive quests to create meaningful relationships.

## 🚀 Features

- **Personality-First Matching**: AI analyzes communication style, emotional patterns, and micro-interests
- **Voice Chemistry**: 10-second "Vibe Checks" reveal authentic personality
- **Soul Density Score**: Quantified compatibility metric showing depth of connection
- **Connection Quests**: Interactive challenges that build real chemistry
- **Daily Compatibility Insights**: AI-powered relationship growth suggestions
- **Real-Time Chat**: Socket.io powered messaging with conversation starters
- **Safety Features**: Photo verification, reporting, blocking, and privacy controls

## 📁 Project Structure

```
soulsync/
├── backend/          # Node.js/Express API
├── frontend/         # React application
├── shared/           # Shared types and utilities
├── docs/             # Documentation
└── README.md
```

## 🛠️ Tech Stack

### Backend

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Redis (caching & sessions)
- Socket.io (real-time)
- AWS S3 (media storage)
- JWT authentication

### Frontend

- React 18 + TypeScript
- Redux Toolkit + React Query
- Tailwind CSS + Framer Motion
- Socket.io-client
- React Router

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or cloud)
- AWS account (for S3)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd LoveLynk
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

4. Set up environment variables

```bash
# Backend .env
cp backend/.env.example backend/.env

# Frontend .env
cp frontend/.env.example frontend/.env
```

5. Start development servers

```bash
# Backend (from backend/)
npm run dev

# Frontend (from frontend/)
npm run dev
```

## 📚 Documentation

- [Product Plan](./PRODUCT_PLAN.md) - Complete product strategy and features
- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md) - System design and implementation details
- [UI/UX Design](./docs/UI_UX_DESIGN.md) - Design system and mockups
- [Development Roadmap](./docs/ROADMAP.md) - Development phases and milestones

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 License

Proprietary - All rights reserved

## 👥 Team

Built with ❤️ for authentic connections
