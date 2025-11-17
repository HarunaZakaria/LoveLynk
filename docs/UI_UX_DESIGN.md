# SoulSync - UI/UX Design Documentation

## Design System

### Color Palette

**Primary Colors:**
- Cosmic Purple: `#6B46C1` - Main brand color, used for primary actions and highlights
- Electric Blue: `#3B82F6` - Secondary actions, links, and accents
- Sunset Orange: `#F97316` - Accent color for special features and CTAs

**Neutral Colors:**
- Deep Space: `#0F172A` - Background color
- Dark Slate: `#1E293B` - Card/surface color
- Slate Gray: `#94A3B8` - Secondary text
- White: `#FFFFFF` - Primary text

**Gradients:**
- Cosmic Gradient: `linear-gradient(135deg, #6B46C1 0%, #3B82F6 50%, #F97316 100%)`
- Soul Gradient: `radial-gradient(circle at top, #6B46C1, #0F172A)`

### Typography

**Headings:**
- Font: Playfair Display (serif)
- Weights: 400, 500, 600, 700
- Usage: Page titles, card headers, important announcements

**Body:**
- Font: Inter (sans-serif)
- Weights: 300, 400, 500, 600, 700
- Usage: All body text, buttons, form inputs

**Sizes:**
- 12px: Small labels, captions
- 14px: Secondary text, form labels
- 16px: Body text (default)
- 20px: Subheadings
- 24px: Section headers
- 32px: Page titles
- 48px: Hero text

### Components

#### Buttons

**Primary Button:**
```css
.btn-primary {
  background: cosmic-gradient;
  color: white;
  padding: 12px 24px;
  border-radius: 9999px;
  font-weight: 600;
  box-shadow: 0 10px 15px rgba(107, 70, 193, 0.3);
  transition: opacity 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
  box-shadow: 0 15px 25px rgba(107, 70, 193, 0.4);
}
```

**Secondary Button:**
```css
.btn-secondary {
  background: #1E293B;
  color: white;
  padding: 12px 24px;
  border-radius: 9999px;
  border: 1px solid rgba(107, 70, 193, 0.3);
  transition: background-color 0.2s;
}
```

#### Cards

**Profile Card:**
- Glassmorphism effect with backdrop blur
- Border: 1px solid rgba(107, 70, 193, 0.2)
- Shadow: 0 20px 25px rgba(0, 0, 0, 0.3)
- Border radius: 16px
- Padding: 24px

**Info Card:**
- Background: #1E293B
- Border: 1px solid rgba(107, 70, 193, 0.2)
- Border radius: 12px
- Padding: 20px

### Screen Designs

#### 1. Onboarding Flow

**Welcome Screen:**
- Full-screen cosmic gradient background
- Centered content card
- Large "SoulSync" logo with gradient text
- Tagline: "Find your soulmate through authentic connection"
- "Get Started" button

**Personality Quiz:**
- Progress bar at top (shows step X of Y)
- Question displayed prominently
- Multiple choice options with hover effects
- "Continue" button (disabled until selection)
- Skip option for optional questions

**Photo Upload:**
- Drag-and-drop area
- Preview grid
- AI guidance: "Good lighting detected" / "Face not clearly visible"
- Reorder photos by dragging
- Minimum 1 photo required

**Voice Intro:**
- Large record button with waveform visualization
- 10-second timer
- Playback controls
- Retry option
- Optional but encouraged

#### 2. Discovery/Swipe Interface

**Card Stack:**
- 3D tilt effect on drag
- Swipe gestures: left (pass), right (like), up (super swipe)
- Haptic feedback on swipe
- Particle effects on match

**Profile Card Layout:**
```
┌─────────────────────────┐
│  [Soul Density: 87%]   │
│                         │
│   [Photo Gallery]       │
│   (Swipeable)           │
│                         │
│  Name, Age              │
│  Bio text...            │
│                         │
│  [🎤 Play Voice Intro]  │
│                         │
│  [Interest Tags]        │
│                         │
│  [View Full Profile]    │
└─────────────────────────┘
```

**Action Buttons:**
- Bottom of screen, centered
- Pass (X): Red on hover
- Super Swipe (⭐): Gradient background
- Like (♥): Green on hover
- Large touch targets (64x64px minimum)

#### 3. Matches Screen

**Match List:**
- Grid layout (1 column mobile, 2-3 desktop)
- Each match card shows:
  - Avatar (circular, 80px)
  - Name
  - Soul Density Score badge
  - Last message preview
  - Unread indicator (if applicable)
  - Quest completion badges

**Match Detail:**
- Full profile view
- Compatibility breakdown wheel
- Shared interests highlighted
- Conversation timeline
- Quest suggestions
- "Start Chat" button

#### 4. Chat Interface

**Message Bubbles:**
- Sent: Purple gradient, right-aligned
- Received: Dark slate, left-aligned
- Audio: Waveform visualization
- Quest: Special card design with interactive elements

**Input Bar:**
- Text input (multiline support)
- Audio record button (hold to record)
- Emoji picker
- Conversation starter suggestions (AI-powered, appears above input)

**Features:**
- Typing indicators (animated dots)
- Read receipts (checkmarks, premium)
- Message reactions (long-press to react)
- Timestamp grouping

#### 5. Profile/Dashboard

**Stats Overview:**
- Three metric cards:
  - Matches count
  - Messages sent
  - Quests completed
- Animated numbers on load

**Soul Density Trends:**
- Line chart showing score evolution
- Time range selector (7 days, 30 days, all time)
- Tooltips on hover

**Compatibility Insights:**
- Daily insights card
- Expandable sections
- Actionable suggestions

**Quest History:**
- Timeline view
- Quest cards with partner info
- Completion badges

### Microinteractions

#### Swipe Animations
- **Like**: Card rotates slightly right, green glow
- **Pass**: Card rotates left, fades out
- **Super Swipe**: Sparkle particles, purple pulse
- **Match**: Cosmic explosion animation, confetti, sound effect

#### Loading States
- Skeleton screens for content loading
- Animated gradient for buttons
- Spinner with cosmic colors

#### Hover Effects
- Cards: Scale up slightly (1.02x), shadow increase
- Buttons: Opacity change, shadow increase
- Links: Underline animation

#### Transitions
- Page transitions: Fade + slide
- Modal: Scale + fade
- Card stack: Smooth slide with physics

### Accessibility

#### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- High contrast mode support

#### Keyboard Navigation
- Tab order: Logical flow
- Focus indicators: Visible outline
- Skip links: Available on all pages

#### Screen Readers
- Semantic HTML
- ARIA labels for icons
- Alt text for images
- Live regions for dynamic content

#### Responsive Design
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch targets: Minimum 44x44px
- Swipe gestures work on all devices

### Animation Guidelines

#### Principles
- **Purposeful**: Every animation serves a function
- **Fast**: Most animations complete in 200-300ms
- **Smooth**: 60fps target, use transform/opacity
- **Delightful**: Subtle personality, not distracting

#### Timing Functions
- Ease-out: Most UI elements
- Ease-in-out: Page transitions
- Spring: Physics-based interactions (swipes)

#### Duration
- Micro: 100-200ms (hover, focus)
- Standard: 200-300ms (transitions)
- Macro: 300-500ms (page changes, modals)

### Dark Mode

SoulSync is designed with dark mode as the primary theme. The color palette is optimized for:
- Reduced eye strain
- Battery savings (OLED screens)
- Modern, premium feel
- Focus on content

### Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  /* Single column layouts */
  /* Stacked navigation */
  /* Full-width cards */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* 2-column grids */
  /* Side navigation */
}

/* Desktop */
@media (min-width: 1025px) {
  /* 3+ column grids */
  /* Full navigation bar */
  /* Larger card sizes */
}
```

### Component Library

Key reusable components:
1. **Button** - Primary, secondary, ghost variants
2. **Card** - Profile, info, quest cards
3. **Input** - Text, textarea, select, file upload
4. **Modal** - Confirmation, info, full-screen
5. **Toast** - Success, error, info notifications
6. **Avatar** - User profile pictures
7. **Badge** - Soul Density score, status indicators
8. **Progress** - Progress bars, loading states
9. **SwipeableCard** - Discovery stack cards
10. **MessageBubble** - Chat messages

### Design Tokens

```javascript
const tokens = {
  colors: {
    cosmic: {
      purple: '#6B46C1',
      blue: '#3B82F6',
      orange: '#F97316',
      dark: '#0F172A',
      slate: '#1E293B',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.3)',
  },
};
```

