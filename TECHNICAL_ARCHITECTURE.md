# SoulSync - Technical Architecture

## System Overview

SoulSync is built on a modern MERN stack with real-time capabilities, AI integration, and scalable cloud infrastructure.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React Web  │  │  React Native │  │  Admin Panel │      │
│  │   (Desktop)  │  │   (Mobile)    │  │   (Future)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS / WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │   Socket.io  │  │   Rate Limit │      │
│  │   REST API   │  │  WebSocket   │  │   Middleware │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Auth       │  │   Business    │  │   Real-time  │
│   Service    │  │   Logic       │  │   Service    │
└──────────────┘  └──────────────┘  └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │     Redis     │  │   AWS S3     │      │
│  │   (Primary)  │  │   (Cache)     │  │   (Media)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   OpenAI     │  │    Twilio     │  │    Stripe    │      │
│  │   (AI/ML)    │  │   (SMS/OTP)   │  │  (Payments)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   SendGrid   │  │   CloudFront  │  │   Bull Queue │      │
│  │   (Email)    │  │     (CDN)     │  │  (Jobs)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit + React Query
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Framer Motion
- **Real-time**: Socket.io-client
- **Media**: React Webcam, React Audio Recorder
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Custom component library
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Real-time**: Socket.io
- **Authentication**: JWT + Passport.js
- **File Upload**: Multer + AWS SDK
- **Job Queue**: Bull (Redis-based)
- **Validation**: Joi/Zod
- **Logging**: Winston
- **Testing**: Jest + Supertest

### Infrastructure
- **Hosting**: AWS ECS/EC2 or Railway/Render
- **Database**: MongoDB Atlas
- **Storage**: AWS S3 + CloudFront CDN
- **CDN**: CloudFront
- **Monitoring**: Sentry, DataDog
- **CI/CD**: GitHub Actions

### AI/ML Services
- **Personality Analysis**: OpenAI GPT-4
- **Writing Analysis**: Custom NLP + OpenAI
- **Recommendations**: Collaborative filtering + Content-based
- **Audio Analysis**: TensorFlow.js (client-side)

## Database Schema

### Collections Overview

1. **users** - User accounts and profiles
2. **matches** - Match relationships
3. **chats** - Chat conversations
4. **messages** - Individual messages (embedded in chats)
5. **swipes** - Swipe actions for analytics
6. **connectionQuests** - Quest instances
7. **notifications** - User notifications
8. **personalityProfiles** - Cached personality data
9. **subscriptions** - Premium subscriptions
10. **reports** - User reports

### Indexes

**Users Collection:**
- `email`: unique index
- `phone`: unique, sparse index
- `location.coordinates`: 2dsphere index (geospatial)
- `lastActive`: descending index
- `profile.age`: index for filtering
- `subscription.tier`: index for premium features

**Matches Collection:**
- `users`: compound index [user1, user2]
- `matchedAt`: descending index
- `soulDensityScore`: descending index

**Swipes Collection:**
- `swiperId`: index
- `swipedId`: index
- `timestamp`: descending index
- Compound: `[swiperId, swipedId]` unique

**Chats Collection:**
- `matchId`: unique index
- `participants`: index
- `updatedAt`: descending index

## API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
POST   /api/auth/verify-phone
POST   /api/auth/google
POST   /api/auth/apple
```

### Users
```
GET    /api/users/me
PUT    /api/users/me
GET    /api/users/:id
POST   /api/users/upload-photo
DELETE /api/users/photos/:photoId
POST   /api/users/voice-intro
POST   /api/users/video-prompt
PUT    /api/users/preferences
PUT    /api/users/settings
GET    /api/users/stats
```

### Discovery
```
GET    /api/discovery/stack
POST   /api/discovery/swipe
GET    /api/discovery/likes
GET    /api/discovery/passed
```

### Matches
```
GET    /api/matches
GET    /api/matches/:id
GET    /api/matches/:id/compatibility
POST   /api/matches/:id/unmatch
```

### Chats
```
GET    /api/chats
GET    /api/chats/:matchId
POST   /api/chats/:matchId/messages
PUT    /api/chats/:matchId/messages/:messageId/read
POST   /api/chats/:matchId/messages/:messageId/reactions
GET    /api/chats/:matchId/starters
```

### Quests
```
GET    /api/quests/available
POST   /api/quests
GET    /api/quests/:id
POST   /api/quests/:id/response
PUT    /api/quests/:id/complete
GET    /api/quests/history
```

### Personality
```
POST   /api/personality/quiz
GET    /api/personality/profile
GET    /api/personality/insights
```

### Subscriptions
```
GET    /api/subscriptions/plans
POST   /api/subscriptions/checkout
POST   /api/subscriptions/webhook
GET    /api/subscriptions/status
PUT    /api/subscriptions/cancel
```

### Notifications
```
GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
DELETE /api/notifications/:id
```

### Safety
```
POST   /api/safety/report
POST   /api/safety/block
GET    /api/safety/blocked
```

## Real-Time Events (Socket.io)

### Client → Server
```javascript
// Swiping
socket.emit('swipe', { swipedId, action, compatibilityScore })

// Messaging
socket.emit('send_message', { matchId, content, type, audioUrl })
socket.emit('typing', { matchId, isTyping })
socket.emit('read_message', { matchId, messageId })

// Quests
socket.emit('start_quest', { matchId, questType })
socket.emit('quest_response', { questId, response })

// Presence
socket.emit('join_match_room', { matchId })
socket.emit('leave_match_room', { matchId })
socket.emit('update_presence', { status })
```

### Server → Client
```javascript
// Matches
socket.on('new_match', { match, soulDensityScore })
socket.on('new_like', { userId, preview })

// Messages
socket.on('new_message', { message, matchId })
socket.on('typing_indicator', { matchId, userId, isTyping })
socket.on('message_read', { matchId, messageId })

// Quests
socket.on('quest_update', { quest })
socket.on('quest_completed', { quest, soulPoints })

// Insights
socket.on('compatibility_insight', { insight, scoreChange })

// Notifications
socket.on('notification', { notification })
```

## Recommendation Algorithm

### Implementation Details

```typescript
interface RecommendationParams {
  userId: string;
  limit: number;
  filters: UserFilters;
}

interface CompatibilityScore {
  personality: number;      // 0-100
  communication: number;    // 0-100
  values: number;           // 0-100
  interests: number;        // 0-100
  lifestyle: number;       // 0-100
  overall: number;          // Weighted average
}

async function generateRecommendations(
  params: RecommendationParams
): Promise<User[]> {
  const { userId, limit, filters } = params;
  
  // 1. Get user profile
  const user = await User.findById(userId);
  
  // 2. Apply basic filters (age, distance, gender, deal-breakers)
  const candidatePool = await filterCandidates(user, filters);
  
  // 3. Calculate compatibility scores
  const scoredCandidates = await Promise.all(
    candidatePool.map(async (candidate) => {
      const score = await calculateCompatibility(user, candidate);
      return { candidate, score };
    })
  );
  
  // 4. Apply boosters
  const boostedCandidates = scoredCandidates.map(({ candidate, score }) => {
    let boostedScore = score.overall;
    
    // Premium boost
    if (candidate.subscription.tier !== 'free') {
      boostedScore *= 1.1;
    }
    
    // Recency boost
    const daysSinceActive = getDaysSince(candidate.lastActive);
    if (daysSinceActive < 1) boostedScore *= 1.15;
    else if (daysSinceActive < 7) boostedScore *= 1.1;
    
    // Profile completeness
    const completeness = calculateCompleteness(candidate);
    boostedScore *= (1 + completeness * 0.1);
    
    // Voice intro boost
    if (candidate.profile.voiceIntro) {
      boostedScore *= 1.05;
    }
    
    return { candidate, score: { ...score, overall: boostedScore } };
  });
  
  // 5. Sort by score
  boostedCandidates.sort((a, b) => b.score.overall - a.score.overall);
  
  // 6. Diversity injection (ensure mix of personality types)
  const diverseList = applyDiversityFilter(boostedCandidates, limit);
  
  // 7. Exclude already swiped users
  const swipedIds = await getSwipedUserIds(userId);
  const finalList = diverseList.filter(
    item => !swipedIds.includes(item.candidate._id.toString())
  );
  
  return finalList.slice(0, limit).map(item => item.candidate);
}

async function calculateCompatibility(
  user1: User,
  user2: User
): Promise<CompatibilityScore> {
  // Personality similarity (Big Five)
  const personality = calculatePersonalitySimilarity(
    user1.personalityProfile.bigFive,
    user2.personalityProfile.bigFive
  );
  
  // Communication style compatibility
  const communication = analyzeCommunicationCompatibility(
    user1.personalityProfile.communicationStyle,
    user2.personalityProfile.communicationStyle,
    user1.writingSamples,
    user2.writingSamples
  );
  
  // Shared values
  const values = calculateValuesOverlap(
    user1.personalityProfile.values,
    user2.personalityProfile.values
  );
  
  // Interest overlap (micro-interests)
  const interests = calculateInterestOverlap(
    user1.profile.interests,
    user2.profile.interests
  );
  
  // Lifestyle compatibility
  const lifestyle = calculateLifestyleMatch(
    user1.profile,
    user2.profile
  );
  
  // Weighted average
  const overall = (
    personality * 0.30 +
    communication * 0.25 +
    values * 0.20 +
    interests * 0.15 +
    lifestyle * 0.10
  );
  
  return { personality, communication, values, interests, lifestyle, overall };
}
```

## Security Measures

### Authentication & Authorization
- JWT tokens with 15-minute expiry
- Refresh tokens with 30-day expiry
- Password hashing with bcrypt (10 rounds)
- Rate limiting on auth endpoints
- Device fingerprinting
- Session management with Redis

### Data Protection
- HTTPS only
- End-to-end encryption for sensitive data
- Input validation and sanitization
- SQL injection prevention (NoSQL injection)
- XSS protection
- CSRF tokens
- Secure headers (Helmet.js)

### Privacy
- GDPR compliance
- Data anonymization for analytics
- Right to deletion
- Data export functionality
- Privacy controls (granular settings)

### Content Moderation
- AI-powered content filtering
- Image moderation (AWS Rekognition)
- Report system with human review
- Block/unmatch functionality
- Spam detection

## Performance Optimization

### Caching Strategy
- Redis cache for:
  - User profiles (5 min TTL)
  - Recommendation results (10 min TTL)
  - Match data (1 min TTL)
  - Soul Density scores (15 min TTL)

### Database Optimization
- Indexes on frequently queried fields
- Aggregation pipelines for complex queries
- Connection pooling
- Read replicas for scaling

### Frontend Optimization
- Code splitting
- Lazy loading
- Image optimization (WebP, lazy load)
- Service workers for offline support
- CDN for static assets

### API Optimization
- Pagination for all list endpoints
- Field selection (projection)
- Batch operations where possible
- Background jobs for heavy processing

## Deployment Architecture

### Development
- Local MongoDB
- Local Redis
- AWS S3 (dev bucket)
- Environment variables via .env

### Staging
- MongoDB Atlas (staging cluster)
- Redis Cloud (staging)
- AWS S3 (staging bucket)
- Railway/Render deployment

### Production
- MongoDB Atlas (production cluster, replica set)
- Redis Cloud (production, high availability)
- AWS S3 (production bucket, CloudFront CDN)
- AWS ECS/EC2 or Railway/Render
- Load balancer
- Auto-scaling
- Multi-region deployment (future)

## Monitoring & Logging

### Application Monitoring
- Error tracking: Sentry
- Performance: DataDog or New Relic
- Uptime: Pingdom or UptimeRobot
- Logs: Winston + CloudWatch/Logtail

### Metrics to Track
- API response times
- Error rates
- Database query performance
- Cache hit rates
- Real-time connection counts
- User activity metrics

### Alerts
- High error rates
- Slow API responses
- Database connection issues
- High memory/CPU usage
- Failed payment processing

## Testing Strategy

### Unit Tests
- Business logic functions
- Utility functions
- Model methods
- Service layer

### Integration Tests
- API endpoints
- Database operations
- External service integrations
- Authentication flows

### E2E Tests
- Critical user flows
- Swipe → Match → Chat flow
- Payment processing
- Quest completion

### Performance Tests
- Load testing (k6 or Artillery)
- Stress testing
- Database query optimization

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Load balancer
- Database sharding (future)
- Redis cluster

### Vertical Scaling
- Database optimization
- Caching strategies
- Background job processing
- CDN usage

### Future Enhancements
- Microservices architecture (if needed)
- GraphQL API (optional)
- Edge computing for recommendations
- Machine learning model serving

