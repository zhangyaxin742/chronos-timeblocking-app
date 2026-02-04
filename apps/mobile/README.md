# CHRONOS Mobile

React Native mobile app for CHRONOS timeblocking, built with Expo.

## Setup

1. **Install dependencies:**
```bash
cd apps/mobile
npm install
```

2. **Configure environment variables:**

Copy `.env.local` and add your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3. **Start development server:**
```bash
npx expo start
```

## Development

### Run on iOS Simulator (macOS only)
```bash
npm run ios
```

### Run on Android Emulator
```bash
npm run android
```

### Run on Web
```bash
npm run web
```

### Run on Physical Device
1. Install Expo Go app on your device
2. Scan QR code from `npx expo start`

## Project Structure

```
apps/mobile/
├── app/                    # Expo Router file-based routing
│   ├── (auth)/            # Auth screens (login, signup)
│   ├── (tabs)/            # Main app with bottom tabs
│   │   ├── index.tsx      # Today's timeline
│   │   ├── backlog.tsx    # Backlog tasks
│   │   └── settings.tsx   # Settings & actions
│   └── _layout.tsx        # Root layout with auth logic
├── components/            # Reusable components (to be built)
├── lib/                   # Utilities
│   ├── supabase.ts       # Mobile Supabase client
│   └── utils.ts          # Helper functions
├── store/                 # Zustand state management
│   └── index.ts          # Global store (adapted from web)
├── app.json              # Expo configuration
├── tailwind.config.js    # NativeWind/Tailwind config
└── global.css            # Global styles
```

## Tech Stack

- **Framework:** Expo (React Native)
- **Navigation:** Expo Router (file-based)
- **Styling:** NativeWind (Tailwind for React Native)
- **State:** Zustand
- **Backend:** Supabase (shared with web app)
- **Icons:** Expo Vector Icons (Ionicons)

## Features Implemented

### Phase 1 (Current)
- ✅ Authentication (login/signup)
- ✅ Bottom tab navigation
- ✅ Today's timeline view
- ✅ Backlog task management
- ✅ Settings screen
- ✅ Zustand store integration
- ✅ Supabase client setup
- ✅ Edge function support (rollover, duplicate, export)

### Phase 2 (Next Steps)
- [ ] Interactive time grid with gestures
- [ ] Drag-and-drop timeblock creation
- [ ] Timeblock detail modal
- [ ] Task creation/editing
- [ ] Category management
- [ ] Pull-to-refresh
- [ ] Swipe gestures for actions

### Phase 3 (Future)
- [ ] Push notifications
- [ ] Offline mode
- [ ] Haptic feedback
- [ ] Widgets
- [ ] Biometric auth

## Building for Production

### Build with EAS
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Submit to App Stores
```bash
# iOS
eas submit --platform ios

# Android
eas submit --platform android
```

## Shared Code

The mobile app shares:
- **Database schema** (`supabase/migrations`)
- **Edge functions** (`supabase/functions`)
- **Types & constants** (`packages/shared`)
- **Business logic** (Zustand store structure)

## Notes

- TypeScript errors about `className` are expected - NativeWind handles these at runtime
- `@expo/vector-icons` types may show errors but work correctly
- The app uses inline styles for now; NativeWind className support is configured but may need adjustment
- All backend functionality (auth, database, edge functions) is shared with the web app
