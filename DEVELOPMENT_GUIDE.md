# SoulSync - Development Mode Setup Guide

## Quick Start (Step-by-Step)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Set Up Environment Variables

**Backend Environment (.env file in `backend/` folder):**

Create `backend/.env` with these minimum required variables:

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database (MongoDB)
MONGODB_URI=mongodb://localhost:27017/soulsync
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/soulsync

# Redis (Optional for basic features)
REDIS_URL=redis://localhost:6379
# OR leave empty if not using Redis

# JWT Secrets (Generate random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this
JWT_REFRESH_EXPIRE=30d

# AWS S3 (Optional - can skip for development)
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=soulsync-dev

# Other services (Optional - can skip for development)
# OPENAI_API_KEY=your-key
# STRIPE_SECRET_KEY=your-key
# TWILIO_ACCOUNT_SID=your-sid
```

**Frontend Environment (.env file in `frontend/` folder):**

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Step 3: Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally, OR
- Use Docker: `docker run -d -p 27017:27017 mongo`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in `backend/.env`

### Step 4: Set Up Redis (Optional)

**Option A: Local Redis**
- Install Redis locally, OR
- Use Docker: `docker run -d -p 6379:6379 redis`

**Option B: Redis Cloud**
1. Go to https://redis.com/try-free/
2. Create free account
3. Create database
4. Get connection URL
5. Update `REDIS_URL` in `backend/.env`

**Note:** Redis is optional for basic features. The app will work without it, but some features (caching, sessions) won't be available.

### Step 5: Run Development Servers

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: ...
✅ Redis Connected
🚀 Server running on port 5000
📡 Socket.io server ready
```

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 6: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

## Troubleshooting

### "Cannot find module" errors
**Solution:** Make sure you ran `npm install` in both `backend/` and `frontend/` directories.

### MongoDB connection error
**Solution:** 
- Check if MongoDB is running: `mongosh` or check Docker container
- Verify `MONGODB_URI` in `backend/.env` is correct
- For Atlas: Check IP whitelist and credentials

### Redis connection error
**Solution:**
- Redis is optional - the app will work without it
- If you want Redis: Check if it's running or update `REDIS_URL`

### Port already in use
**Solution:**
- Backend: Change `PORT=5000` to another port in `backend/.env`
- Frontend: Change port in `frontend/vite.config.ts` or use `npm run dev -- --port 3001`

### CORS errors
**Solution:**
- Make sure `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Default: `http://localhost:3000`

### "Module not found" TypeScript errors
**Solution:**
- Make sure all dependencies are installed
- Try deleting `node_modules` and `package-lock.json`, then `npm install` again

## Development Workflow

1. **Backend changes:** The server auto-reloads with `tsx watch`
2. **Frontend changes:** Vite hot-reloads automatically
3. **Database changes:** Restart backend server after model changes

## Testing the Setup

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Frontend:**
   - Open http://localhost:3000
   - You should see the login page

3. **Create Test User:**
   - Click "Sign up" on the frontend
   - Fill in the registration form
   - Should create user and redirect to onboarding

## Next Steps

Once everything is running:
1. Test user registration and login
2. Complete onboarding flow
3. Test swipe interface
4. Test chat functionality

## Need Help?

- Check `QUICK_START.md` for more details
- Review `TECHNICAL_ARCHITECTURE.md` for system design
- Check console logs for specific error messages

